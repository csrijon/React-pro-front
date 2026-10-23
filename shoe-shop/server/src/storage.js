const fs = require('fs');
const path = require('path');
const config = require('./config');
const { HttpError } = require('./http');

const cloud = Boolean(config.supabaseUrl && config.supabaseServiceKey);
// Local disk is fine in development and on self-hosted servers with a persistent volume. On a
// managed host such as Render it is wiped on every deploy/restart, so by default we refuse to
// write there in production (a stored /uploads/... URL would 404 later and silently break a product).
const allowLocalUploads = process.env.ALLOW_LOCAL_UPLOADS === 'true';
const localUploadsEnabled = !config.isProd || allowLocalUploads;

if (!cloud && localUploadsEnabled) fs.mkdirSync(config.uploadDir, { recursive: true });
if (!cloud && !localUploadsEnabled) {
  console.error('[storage] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set. Image uploads will be rejected instead of being written to ephemeral local disk. Configure Supabase Storage on this host (or set ALLOW_LOCAL_UPLOADS=true if UPLOAD_DIR is on a persistent volume).');
}

const NOT_CONFIGURED = 'Image storage is not configured on this server. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or ALLOW_LOCAL_UPLOADS=true when UPLOAD_DIR is on a persistent volume).';

// Saves an image buffer and returns the URL to store in the database.
async function saveImage(buffer, filename, mimetype) {
  if (!cloud) {
    if (!localUploadsEnabled) throw new HttpError(503, NOT_CONFIGURED);
    await fs.promises.writeFile(path.join(config.uploadDir, filename), buffer);
    return `/uploads/${filename}`;
  }
  const objectPath = `${config.supabaseBucket}/${filename}`;
  let res;
  try {
    res = await fetch(`${config.supabaseUrl}/storage/v1/object/${objectPath}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.supabaseServiceKey}`, apikey: config.supabaseServiceKey, 'Content-Type': mimetype, 'Cache-Control': 'max-age=31536000' },
      body: buffer,
    });
  } catch (err) {
    console.error('[storage] upload failed', err.message);
    throw new HttpError(502, 'Image storage is unreachable. Please try again.');
  }
  if (!res.ok) {
    console.error('[storage] upload rejected', res.status, (await res.text()).slice(0, 200));
    throw new HttpError(502, res.status === 404 ? `Image storage bucket "${config.supabaseBucket}" was not found.` : 'Image storage rejected the upload. Check the Supabase settings.');
  }
  return `${config.supabaseUrl}/storage/v1/object/public/${objectPath}`;
}

// Build the public URL for an object without uploading it. Used by the repair tool.
function publicUrl(filename) {
  return `${config.supabaseUrl}/storage/v1/object/public/${config.supabaseBucket}/${filename}`;
}

module.exports = { saveImage, publicUrl, cloud, allowLocalUploads, localUploadsEnabled, NOT_CONFIGURED };

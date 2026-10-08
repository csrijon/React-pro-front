const fs = require('fs');
const path = require('path');
const config = require('./config');
const { HttpError } = require('./http');

const cloud = Boolean(config.supabaseUrl && config.supabaseServiceKey);
if (!cloud) fs.mkdirSync(config.uploadDir, { recursive: true });
if (!cloud && config.isProd) {
  console.warn('[storage] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set: uploads go to local disk, which is lost on most cloud hosts.');
}

// Saves an image buffer and returns the URL to store in the database.
async function saveImage(buffer, filename, mimetype) {
  if (!cloud) {
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

module.exports = { saveImage, cloud };

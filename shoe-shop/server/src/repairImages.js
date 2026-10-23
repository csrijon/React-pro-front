// Safe repair for legacy product_images rows that still point at local `/uploads/...` files.
//
// The local files are lost on hosts with ephemeral disks (Render and similar), so those URLs
// return 404. This tool never deletes anything and is a dry run unless --apply is passed.
//
// For each broken row it tries, in order:
//   1. the file is still in UPLOAD_DIR and cloud storage is configured -> upload it, update URL
//   2. the CSV has exactly one https image_url for the product's SKU -> use that URL
//   3. the same filename exists in the Supabase bucket -> use its public URL
// Anything it cannot resolve is reported so the photos can be re-uploaded in the admin.
//
//   npm run repair-images -- --csv ../Book-1.csv          (report only)
//   npm run repair-images -- --csv ../Book-1.csv --apply  (write changes)

const fs = require('fs');
const path = require('path');
const config = require('./config');
const { db, init, close } = require('./db');
const { saveImage, publicUrl, cloud } = require('./storage');
const { readCsv } = require('./importCsv');

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const arg = (name) => { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null; };

function csvImages(file) {
  const out = new Map();
  if (!file || !fs.existsSync(file)) return out;
  for (const row of readCsv(file)) {
    const sku = String(row.model_number || '').trim();
    const url = String(row.image_url || '').trim();
    if (!sku || !/^https:\/\//i.test(url)) continue;
    if (!out.has(sku)) out.set(sku, new Set());
    out.get(sku).add(url);
  }
  return out;
}

async function objectExists(filename) {
  if (!config.supabaseUrl) return false;
  const url = `${config.supabaseUrl}/storage/v1/object/public/${config.supabaseBucket}/${encodeURIComponent(filename)}`;
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(10000) });
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  const apply = process.argv.includes('--apply');
  const csvPath = arg('--csv') || path.join(__dirname, '..', '..', 'Book-1.csv');
  const fromCsv = csvImages(csvPath);
  await init();

  const rows = await db.all(`
    SELECT pi.id AS image_id, pi.url, pi.position, p.id AS product_id, p.sku, p.name
    FROM product_images pi JOIN products p ON p.id = pi.product_id
    WHERE pi.url LIKE '/uploads/%'
    ORDER BY pi.id`);

  const summary = { checked: rows.length, updated: 0, wouldUpdate: 0, unresolved: 0 };
  const unresolved = [];

  for (const r of rows) {
    const filename = path.basename(r.url);
    const localFile = path.join(config.uploadDir, filename);
    let next = null;
    let source = '';
    let reason = '';

    if (fs.existsSync(localFile)) {
      if (cloud) {
        source = 'upload existing local file';
        if (apply) next = await saveImage(fs.readFileSync(localFile), filename, MIME[path.extname(filename).toLowerCase()] || 'application/octet-stream');
        else next = '(dry-run)';
      } else {
        reason = 'local file exists but cloud storage is not configured; set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY';
      }
    }

    if (!next) {
      const urls = fromCsv.get(String(r.sku));
      if (urls && urls.size === 1) { next = [...urls][0]; source = 'CSV image_url for SKU'; }
    }

    if (!next && await objectExists(filename)) {
      next = publicUrl(filename);
      source = 'existing Supabase object with the same filename';
    }

    if (!next) {
      unresolved.push({ ...r, reason: reason || 'file is not on this server; re-upload the photo in the admin' });
      continue;
    }

    if (apply && next !== '(dry-run)') {
      await db.run('UPDATE product_images SET url = ? WHERE id = ?', next, r.image_id);
      summary.updated++;
      console.log(`updated #${r.image_id} ${r.sku}: ${r.url} -> ${next} (${source})`);
    } else {
      summary.wouldUpdate++;
      console.log(`would update #${r.image_id} ${r.sku}: ${r.url} -> ${next === '(dry-run)' ? 'new Supabase upload' : next} (${source})`);
    }
  }

  summary.unresolved = unresolved.length;
  console.log(`\n${rows.length} legacy /uploads references checked, ${apply ? `${summary.updated} updated` : `${summary.wouldUpdate} would be updated`}, ${summary.unresolved} unresolved.`);
  if (unresolved.length) {
    console.log('\nUnresolved (no data was changed):');
    for (const u of unresolved) console.log(`  #${u.image_id} ${u.sku} "${u.name}" ${u.url} — ${u.reason}`);
  }
  if (!apply && summary.wouldUpdate) console.log('\nThis was a dry run. Re-run with --apply to write the changes.');
}

main().then(() => close()).catch((err) => { console.error(err); close().finally(() => process.exit(1)); });

// Idempotent importers that load the shop's product catalogue into PostgreSQL.
//
//   npm run import-csv                  -> reads ../Book-1.csv            (default)
//   npm run import-csv path/to/file.csv
//   npm run import-csv -- --staging     -> reads public.products_import_staging
//
// Both paths reuse the same validation + save pipeline (productService.saveProduct) and a
// deterministic SKU scheme, so running them repeatedly updates the same products instead of
// creating duplicates. The staging path additionally keeps a source-id -> product-id map
// (product_import_map) so re-runs are safe even if a model number appears several times.
const fs = require('fs');
const path = require('path');
const { db, init, close, slugify } = require('./db');
const { saveProduct, productSchema, normGender } = require('./productService');

/* ------------------------------------------------------------------ helpers */

function parseCsvLine(line) {
  const out = [];
  let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

function readCsv(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (!lines.length) throw new Error(`${file} is empty`);
  const header = parseCsvLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((l) => {
    const cells = parseCsvLine(l);
    const row = {};
    header.forEach((h, i) => { row[h] = (cells[i] ?? '').trim(); });
    return row;
  });
}

// "Office chaple" -> "Office Chapple", "Keto (belt)" -> "Keto (Belt)", ... so we don't create near-identical rows.
const CATEGORY_ALIASES = { 'office chaple': 'Office Chapple' };
const SUBCATEGORY_ALIASES = {
  'keto ( belt )': 'Keto (Belt)', 'keto (belt)': 'Keto (Belt)', 'keto(belt)': 'Keto (Belt)',
  'eva( soft)': 'EVA (Soft)', 'eva': 'EVA', 'other': 'Other', 'soft': 'Soft',
};
const BRAND_ALIASES = { 'khadims': "Khadim's" };

const tidy = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const lookupAlias = (map, s) => map[tidy(s).toLowerCase()] || tidy(s);

const findOrCreate = async (selectSql, selectArgs, insertSql, insertArgs) => {
  const row = await db.get(selectSql, ...selectArgs);
  if (row) return row.id;
  const made = await db.get(`${insertSql} RETURNING id`, ...insertArgs);
  return (made || await db.get(selectSql, ...selectArgs)).id;
};

const ensureBrand = (name) => {
  const n = lookupAlias(BRAND_ALIASES, name);
  return findOrCreate('SELECT id FROM brands WHERE name = ?', [n],
    'INSERT INTO brands (name, slug) VALUES (?, ?) ON CONFLICT DO NOTHING', [n, slugify(n)]);
};
const ensureCategory = (gender, name) => {
  const n = lookupAlias(CATEGORY_ALIASES, name);
  return findOrCreate('SELECT id FROM categories WHERE gender = ? AND name = ?', [gender, n],
    'INSERT INTO categories (gender, name, slug) VALUES (?,?,?) ON CONFLICT DO NOTHING', [gender, n, slugify(n)]);
};
const ensureSubcategory = (categoryId, name) => {
  const n = lookupAlias(SUBCATEGORY_ALIASES, name);
  return findOrCreate('SELECT id FROM subcategories WHERE category_id = ? AND name = ?', [categoryId, n],
    'INSERT INTO subcategories (category_id, name, slug) VALUES (?,?,?) ON CONFLICT DO NOTHING', [categoryId, n, slugify(n)]);
};

/* -------------------------------------------------------------- size parsing */

const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : null; };
const toLabel = (n) => String(n);

// "11×1" means the size run 11,12,13,1 (Indian kids' sizing wraps after 13); "6×9" means 6,7,8,9.
function expandRange(token) {
  const m = token.match(/^(\d+(?:\.\d+)?)\s*[×xX*]\s*(\d+(?:\.\d+)?)$/);
  if (!m) return null;
  const start = num(m[1]), end = num(m[2]);
  if (start == null || end == null) return null;
  const out = [];
  if (start <= end) {
    for (let n = start; n <= end + 1e-9; n += 1) out.push(toLabel(Math.round(n * 10) / 10));
  } else {
    for (let n = start; n <= 13 + 1e-9; n += 1) out.push(toLabel(n));
    for (let n = 1; n <= end + 1e-9; n += 1) out.push(toLabel(n));
  }
  return out;
}

// available_sizes looks like ["5,6,7,8"] or ["11×1","2×5"] or [] — a JSON string (CSV) or an array (staging jsonb).
function parseSizes(raw) {
  let groups;
  if (Array.isArray(raw)) groups = raw;
  else { try { groups = JSON.parse(tidy(raw) || '[]'); } catch { groups = []; } }
  if (!Array.isArray(groups)) groups = [groups];
  const sizes = [];
  for (const g of groups) {
    for (const part of String(g).split(',')) {
      const token = part.replace(/\s*\(.*?\)\s*/g, ' ').trim(); // "11,12 ( Big)" -> 11, 12
      if (!token) continue;
      for (const label of expandRange(token) || [token]) {
        if (label && label.length <= 10 && !sizes.some((s) => s.toLowerCase() === label.toLowerCase())) sizes.push(label);
      }
    }
  }
  return sizes;
}

const stockOf = (raw) => {
  const n = parseInt(String(raw).replace(/[^0-9-]/g, ''), 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

// The source only carries a total stock figure, so spread it across the sizes (remainder first).
function distribute(sizes, total) {
  const base = Math.floor(total / sizes.length);
  const rem = total % sizes.length;
  return sizes.map((size, i) => ({ size, quantity: base + (i < rem ? 1 : 0) }));
}

/* ------------------------------------------------------------------- import */

// Expand each row into { row, sizes, stock }. When `merge` is true, exact repeats
// (same model + gender + category + subcategory + MRP) collapse into one product.
function prepare(rows, merge) {
  if (!merge) return rows.map((row) => ({ row, sizes: new Set(parseSizes(row.available_sizes)), stock: stockOf(row.stock_quantity) }));
  const merged = new Map();
  for (const r of rows) {
    const key = [r.model_number, r.gender, r.category, r.subcategory, r.mrp].join('|');
    if (!merged.has(key)) {
      merged.set(key, { row: r, sizes: new Set(parseSizes(r.available_sizes)), stock: stockOf(r.stock_quantity) });
    } else {
      const m = merged.get(key);
      for (const s of parseSizes(r.available_sizes)) m.sizes.add(s);
      m.stock = Math.max(m.stock, stockOf(r.stock_quantity));
    }
  }
  return [...merged.values()];
}

// Save one prepared row. ctx carries the deterministic SKU counters and optional hooks.
async function saveOne(r, { sizes, stock }, ctx) {
  const gender = normGender(String(r.gender).replace(/[^a-zA-Z]/g, '')); // "Men's" -> "Mens"
  if (!gender) throw new Error(`unknown gender "${r.gender}"`);

  const base = tidy(r.model_number) || 'ITEM';
  const n = (ctx.seenBase.get(base.toLowerCase()) || 0) + 1;
  ctx.seenBase.set(base.toLowerCase(), n);
  let sku = n === 1 ? base : `${base}-${n}`;
  while (ctx.usedSkus.has(sku.toLowerCase())) sku = `${base}-${++n}`;
  ctx.usedSkus.add(sku.toLowerCase());

  const brandId = await ensureBrand(r.brand);
  const categoryId = await ensureCategory(gender, r.category);
  const subcategoryId = tidy(r.subcategory) ? await ensureSubcategory(categoryId, r.subcategory) : null;

  const labels = sizes.size ? [...sizes] : ['Free'];
  const mrp = num(r.mrp) ?? 0;
  const data = productSchema.parse({
    name: `${lookupAlias(BRAND_ALIASES, r.brand)} ${base}`,
    sku,
    brandId,
    categoryId,
    subcategoryId,
    description: `${tidy(r.subcategory) || tidy(r.category)} from ${lookupAlias(BRAND_ALIASES, r.brand)}. Model no. ${base}.`,
    mrp,
    wholesalePrice: num(r.wholesale_price),
    featured: false,
    active: tidy(r.availability).toLowerCase() !== 'unavailable',
    images: /^https:\/\/\S+$/.test(tidy(r.image_url)) ? [tidy(r.image_url)] : [],
    variants: [{ color: 'Default', sizes: distribute(labels, stock) }],
  });

  const existing = ctx.resolveExisting
    ? await ctx.resolveExisting(sku, r)
    : (await db.get('SELECT id FROM products WHERE sku = ?', sku) || {}).id;
  const id = await saveProduct(data, existing || null);
  if (ctx.afterSave) await ctx.afterSave(r, id);
  return { action: existing ? 'updated' : 'created', id, sku, name: data.name };
}

async function importRows(rows, { merge = true, keepTimestamps = false, resolveExisting, afterSave, label = 'import' } = {}) {
  const prepared = prepare(rows, merge);
  const ctx = {
    seenBase: new Map(),
    usedSkus: new Set(),
    resolveExisting,
    afterSave: afterSave || (keepTimestamps
      ? (r, id) => (r.created_at ? db.run('UPDATE products SET created_at = ?, updated_at = ? WHERE id = ?', r.created_at, r.updated_at || r.created_at, id) : Promise.resolve())
      : undefined),
  };
  let created = 0, updated = 0, failed = 0;
  const log = [];
  for (const item of prepared) {
    try {
      const res = await saveOne(item.row, item, ctx);
      if (res.action === 'created') created++; else updated++;
      if (process.env.IMPORT_VERBOSE) log.push(`${res.action} #${res.id} ${res.sku} (${res.name})`);
    } catch (err) {
      failed++;
      log.push(`FAILED ${item.row.model_number}: ${err.message}`);
    }
  }
  if (log.length) console.log(log.join('\n'));
  console.log(`${label}: ${created} created, ${updated} updated, ${failed} failed (${prepared.length} products from ${rows.length} source rows).`);
  return { created, updated, failed, total: prepared.length };
}

async function importCsv(file) {
  return importRows(readCsv(file), { merge: true, keepTimestamps: true, label: `CSV ${path.basename(file)}` });
}

// Reads public.products_import_staging (id, model_number, brand, gender, category, subcategory,
// mrp, wholesale_price, available_sizes, availability, stock_quantity, image_url, created_at, updated_at)
// and upserts each row into the production tables. Safe to run repeatedly.
async function importStaging() {
  const exists = await db.get("SELECT to_regclass('public.products_import_staging') AS t");
  if (!exists || !exists.t) throw new Error('products_import_staging does not exist in this database');
  await db.run(`CREATE TABLE IF NOT EXISTS product_import_map (
    source_id  TEXT PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
  const rows = await db.all('SELECT * FROM products_import_staging ORDER BY created_at NULLS LAST, id');
  const resolveExisting = async (sku, r) => {
    const map = await db.get('SELECT product_id FROM product_import_map WHERE source_id = ?', String(r.id));
    if (map && await db.get('SELECT 1 FROM products WHERE id = ?', map.product_id)) return map.product_id;
    return (await db.get('SELECT id FROM products WHERE sku = ?', sku) || {}).id;
  };
  const afterSave = async (r, id) => {
    await db.run(`INSERT INTO product_import_map (source_id, product_id) VALUES (?, ?)
      ON CONFLICT (source_id) DO UPDATE SET product_id = excluded.product_id`, String(r.id), id);
    if (r.created_at) await db.run('UPDATE products SET created_at = ?, updated_at = ? WHERE id = ?', r.created_at, r.updated_at || r.created_at, id);
  };
  return importRows(rows, { merge: false, resolveExisting, afterSave, label: 'staging import' });
}

async function run() {
  await init();
  if (process.argv.includes('--staging')) {
    console.log('Importing from public.products_import_staging ...\n');
    if (process.argv.includes('--dry-run')) {
      let report;
      try {
        await db.transaction(async () => { report = await importStaging(); throw new Error('__DRY_RUN_ROLLBACK__'); });
      } catch (err) {
        if (err.message !== '__DRY_RUN_ROLLBACK__') throw err;
      }
      console.log('Dry run complete — every change was rolled back; nothing was written.');
      return report;
    }
    return importStaging();
  }
  const file = process.argv[2] || path.join(__dirname, '..', '..', 'Book-1.csv');
  if (!fs.existsSync(file)) throw new Error(`CSV not found: ${file}`);
  console.log(`Importing ${path.resolve(file)} ...\n`);
  return importCsv(file);
}

if (require.main === module) {
  run().then(() => close()).catch((err) => { console.error(err); process.exit(1); });
}

module.exports = { importCsv, importStaging, importRows, parseSizes, expandRange, readCsv };

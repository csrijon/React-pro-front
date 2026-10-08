const { db, lowStockThreshold, slugify } = require('./db');
const { HttpError, z } = require('./http');
const { logMovement } = require('./stockLog');

const GENDER_ALIASES = {
  men: 'men', mens: 'men', man: 'men', male: 'men', gents: 'men',
  women: 'women', womens: 'women', woman: 'women', ladies: 'women', female: 'women',
  kids: 'kids', kid: 'kids', boys: 'kids', girls: 'kids', children: 'kids', child: 'kids',
};
const normGender = (g) => (g ? GENDER_ALIASES[String(g).toLowerCase()] || null : null);

const stockStatus = (qty, th) => (qty <= 0 ? 'OUT' : qty <= th ? 'LOW' : 'IN');
const sizeSort = (label) => {
  const n = parseFloat(label);
  return Number.isFinite(n) ? n : 1000;
};
const csv = (v) => (v == null || v === '' ? [] : String(v).split(',').map((s) => s.trim()).filter(Boolean));
const placeholders = (arr) => arr.map(() => '?').join(',');

/* ------------------------------------------------------------------ listing */

async function listProducts(q, { wholesale = false, admin = false } = {}) {
  const th = await lowStockThreshold();
  const where = [];
  const args = [];

  if (!admin) where.push('p.active = 1 AND b.active = 1 AND c.active = 1');

  // Free-text search: every word must match name / SKU / brand / category / subcategory,
  // or be a gender word (men, women, kids...) which matches the gender column exactly.
  for (const tok of String(q.q || '').trim().split(/\s+/).filter(Boolean).slice(0, 8)) {
    const g = normGender(tok);
    if (g) {
      where.push('p.gender = ?');
      args.push(g);
    } else {
      const like = `%${tok.replace(/[%_\\]/g, '\\$&')}%`;
      where.push(`(p.name ILIKE ? ESCAPE '\\' OR p.sku ILIKE ? ESCAPE '\\' OR b.name ILIKE ? ESCAPE '\\' OR c.name ILIKE ? ESCAPE '\\' OR sc.name ILIKE ? ESCAPE '\\')`);
      args.push(like, like, like, like, like);
    }
  }

  const gender = normGender(q.gender);
  if (q.gender && !gender) where.push('FALSE');
  if (gender) { where.push('p.gender = ?'); args.push(gender); }

  const cats = csv(q.category);
  if (cats.length) { where.push(`c.slug IN (${placeholders(cats)})`); args.push(...cats); }
  const subs = csv(q.subcategory);
  if (subs.length) { where.push(`sc.slug IN (${placeholders(subs)})`); args.push(...subs); }
  const brands = csv(q.brand);
  if (brands.length) { where.push(`b.slug IN (${placeholders(brands)})`); args.push(...brands); }

  if (q.featured === '1' || q.featured === 'true') where.push('p.featured = 1');
  if (admin) {
    const tot = '(SELECT COALESCE(SUM(i.quantity),0) FROM inventory i WHERE i.product_id = p.id)';
    if (q.stock === 'OUT') where.push(`${tot} = 0`);
    if (q.stock === 'LOW') { where.push(`${tot} > 0 AND ${tot} <= ?`); args.push(th); }
    if (q.stock === 'IN') { where.push(`${tot} > ?`); args.push(th); }
    if (q.active === '1' || q.active === 'true') where.push('p.active = 1');
    if (q.active === '0' || q.active === 'false') where.push('p.active = 0');
  }

  // Variant-level filters (size, colour, MRP range, availability) must be satisfied
  // by the SAME inventory row, so they live in one EXISTS clause.
  const F = ['i.product_id = p.id'];
  const fArgs = [];
  const sizes = csv(q.size);
  if (sizes.length) {
    F.push(`i.size_id IN (SELECT id FROM sizes WHERE label IN (${placeholders(sizes)}))`);
    fArgs.push(...sizes);
  }
  const colors = csv(q.color);
  if (colors.length) {
    F.push(`i.color_id IN (SELECT id FROM colors WHERE name IN (${placeholders(colors)}))`);
    fArgs.push(...colors);
  }
  const minMrp = q.minMrp !== undefined && q.minMrp !== '' ? Number(q.minMrp) : null;
  const maxMrp = q.maxMrp !== undefined && q.maxMrp !== '' ? Number(q.maxMrp) : null;
  if (Number.isFinite(minMrp)) { F.push('COALESCE(i.mrp, p.mrp) >= ?'); fArgs.push(minMrp); }
  if (Number.isFinite(maxMrp)) { F.push('COALESCE(i.mrp, p.mrp) <= ?'); fArgs.push(maxMrp); }

  const avail = String(q.availability || '');
  const base = F.join(' AND ');
  if (avail === 'in_stock') {
    where.push(`EXISTS (SELECT 1 FROM inventory i WHERE ${base} AND i.quantity > 0)`);
    args.push(...fArgs);
  } else if (avail === 'low') {
    where.push(`EXISTS (SELECT 1 FROM inventory i WHERE ${base} AND i.quantity > 0 AND i.quantity <= ?)`);
    args.push(...fArgs, th);
  } else if (avail === 'out_of_stock') {
    where.push(`(EXISTS (SELECT 1 FROM inventory i WHERE ${base}) AND NOT EXISTS (SELECT 1 FROM inventory i WHERE ${base} AND i.quantity > 0))`);
    args.push(...fArgs, ...fArgs);
  } else if (F.length > 1) {
    where.push(`EXISTS (SELECT 1 FROM inventory i WHERE ${base})`);
    args.push(...fArgs);
  }

  const orderBy = {
    price_asc: 'min_mrp ASC, p.id DESC',
    price_desc: 'min_mrp DESC, p.id DESC',
    name: 'lower(p.name) ASC',
    newest: 'p.created_at DESC, p.id DESC',
  }[q.sort] || 'p.created_at DESC, p.id DESC';

  const page = Math.max(1, parseInt(q.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(q.limit, 10) || 12));

  const from = `FROM products p
    JOIN brands b ON b.id = p.brand_id
    JOIN categories c ON c.id = p.category_id
    LEFT JOIN subcategories sc ON sc.id = p.subcategory_id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}`;

  const total = (await db.get(`SELECT COUNT(*) n ${from}`, ...args)).n;
  const wholesaleCols = wholesale
    ? `, (SELECT MIN(COALESCE(i.wholesale_price, p.wholesale_price)) FROM inventory i WHERE i.product_id = p.id) AS min_ws,
         (SELECT MAX(COALESCE(i.wholesale_price, p.wholesale_price)) FROM inventory i WHERE i.product_id = p.id) AS max_ws`
    : '';
  const rows = await db.all(`
    SELECT p.id, p.name, p.slug, p.sku, p.gender, p.featured, p.active, p.created_at,
           ${admin ? 'p.cost_price, p.wholesale_price,' : ''}
           b.id brand_id, b.name brand_name, b.slug brand_slug,
           c.id category_id, c.name category_name, c.slug category_slug,
           sc.name subcategory_name,
           COALESCE((SELECT MIN(COALESCE(i.mrp, p.mrp)) FROM inventory i WHERE i.product_id = p.id), p.mrp) AS min_mrp,
           COALESCE((SELECT MAX(COALESCE(i.mrp, p.mrp)) FROM inventory i WHERE i.product_id = p.id), p.mrp) AS max_mrp,
           COALESCE((SELECT SUM(i.quantity) FROM inventory i WHERE i.product_id = p.id), 0) AS total_stock
           ${admin ? `, (SELECT COALESCE(SUM(i.quantity * COALESCE(i.wholesale_price, p.wholesale_price, 0)),0) FROM inventory i WHERE i.product_id = p.id) AS stock_value_ws,
                       (SELECT COALESCE(SUM(i.quantity * COALESCE(i.mrp, p.mrp)),0) FROM inventory i WHERE i.product_id = p.id) AS stock_value_mrp` : ''}
           ${wholesaleCols}
    ${from} ORDER BY ${orderBy} LIMIT ? OFFSET ?`, ...args, limit, (page - 1) * limit);

  return { items: await hydrate(rows, { wholesale, admin, th }), total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
}

async function hydrate(rows, { wholesale, admin, th }) {
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);
  const ph = placeholders(ids);
  const images = {}, colors = {}, sizes = {};
  for (const r of await db.all(`SELECT product_id, url FROM product_images WHERE product_id IN (${ph}) ORDER BY position, id`, ...ids)) {
    (images[r.product_id] ||= []).push(r.url);
  }
  for (const r of await db.all(`SELECT DISTINCT i.product_id, co.name FROM inventory i JOIN colors co ON co.id = i.color_id WHERE i.product_id IN (${ph}) ORDER BY co.name`, ...ids)) {
    (colors[r.product_id] ||= []).push(r.name);
  }
  for (const r of await db.all(`SELECT DISTINCT i.product_id, s.label, s.sort FROM inventory i JOIN sizes s ON s.id = i.size_id WHERE i.product_id IN (${ph}) ORDER BY s.sort`, ...ids)) {
    (sizes[r.product_id] ||= []).push(r.label);
  }
  return rows.map((r) => {
    const o = {
      id: r.id, name: r.name, slug: r.slug, sku: r.sku, gender: r.gender, featured: !!r.featured,
      brand: { id: r.brand_id, name: r.brand_name, slug: r.brand_slug },
      category: { id: r.category_id, name: r.category_name, slug: r.category_slug },
      subcategory: r.subcategory_name || null,
      image: (images[r.id] || [])[0] || null,
      images: images[r.id] || [],
      colors: colors[r.id] || [],
      sizes: sizes[r.id] || [],
      mrp: { min: r.min_mrp, max: r.max_mrp },
      stockStatus: stockStatus(r.total_stock, th),
      createdAt: r.created_at,
    };
    if (admin) { o.active = !!r.active; o.totalStock = r.total_stock; o.costPrice = r.cost_price; o.wholesalePrice = r.wholesale_price;
      o.marginPct = r.cost_price != null && r.wholesale_price > 0 ? Math.round(((r.wholesale_price - r.cost_price) / r.wholesale_price) * 1000) / 10 : null; o.stockValueWholesale = r.stock_value_ws; o.stockValueMrp = r.stock_value_mrp; }
    if (wholesale) o.wholesale = { min: r.min_ws ?? null, max: r.max_ws ?? null };
    return o;
  });
}

/* ------------------------------------------------------------------- detail */

async function getProduct(where, arg, { wholesale = false, admin = false } = {}) {
  const th = await lowStockThreshold();
  const p = await db.get(`
    SELECT p.*, b.name brand_name, b.slug brand_slug, b.logo_url brand_logo, b.active brand_active,
           c.name category_name, c.slug category_slug, c.active category_active, sc.name subcategory_name, sc.slug subcategory_slug
    FROM products p JOIN brands b ON b.id = p.brand_id JOIN categories c ON c.id = p.category_id
    LEFT JOIN subcategories sc ON sc.id = p.subcategory_id
    WHERE ${where}`, arg);
  if (!p) return null;
  if (!admin && !(p.active && p.brand_active && p.category_active)) return null;

  const images = (await db.all('SELECT url FROM product_images WHERE product_id = ? ORDER BY position, id', p.id)).map((r) => r.url);
  const inv = await db.all(`
    SELECT i.color_id, co.name color, i.size_id, s.label size, s.sort, i.quantity, i.mrp, i.wholesale_price
    FROM inventory i JOIN colors co ON co.id = i.color_id JOIN sizes s ON s.id = i.size_id
    WHERE i.product_id = ? ORDER BY co.name, s.sort`, p.id);

  const colorMap = new Map();
  let total = 0;
  for (const r of inv) {
    if (!colorMap.has(r.color_id)) colorMap.set(r.color_id, { colorId: r.color_id, color: r.color, total: 0, sizes: [] });
    const c = colorMap.get(r.color_id);
    c.total += r.quantity;
    total += r.quantity;
    const sz = {
      sizeId: r.size_id, size: r.size, status: stockStatus(r.quantity, th),
      mrp: r.mrp ?? p.mrp, mrpOverride: r.mrp,
    };
    if (admin) { sz.quantity = r.quantity; sz.wholesalePriceOverride = r.wholesale_price; }
    if (wholesale) sz.wholesalePrice = r.wholesale_price ?? p.wholesale_price;
    c.sizes.push(sz);
  }
  const variants = [...colorMap.values()].map((c) => {
    const v = { colorId: c.colorId, color: c.color, status: stockStatus(c.total, th), sizes: c.sizes };
    if (admin) v.total = c.total;
    return v;
  });

  const out = {
    id: p.id, name: p.name, slug: p.slug, sku: p.sku, gender: p.gender, description: p.description,
    featured: !!p.featured,
    brand: { id: p.brand_id, name: p.brand_name, slug: p.brand_slug, logo: p.brand_logo },
    category: { id: p.category_id, name: p.category_name, slug: p.category_slug },
    subcategory: p.subcategory_id ? { id: p.subcategory_id, name: p.subcategory_name, slug: p.subcategory_slug } : null,
    mrp: p.mrp, images, variants,
    stockStatus: stockStatus(total, th),
    createdAt: p.created_at,
  };
  if (admin) { out.active = !!p.active; out.totalStock = total; out.costPrice = p.cost_price; }
  if (wholesale) out.wholesalePrice = p.wholesale_price;
  return out;
}

async function related(product, { wholesale }) {
  const th = await lowStockThreshold();
  const rows = await db.all(`
    SELECT p.id, p.name, p.slug, p.sku, p.gender, p.featured, p.active, p.created_at,
           b.id brand_id, b.name brand_name, b.slug brand_slug, c.id category_id, c.name category_name, c.slug category_slug, sc.name subcategory_name,
           COALESCE((SELECT MIN(COALESCE(i.mrp, p.mrp)) FROM inventory i WHERE i.product_id = p.id), p.mrp) AS min_mrp,
           COALESCE((SELECT MAX(COALESCE(i.mrp, p.mrp)) FROM inventory i WHERE i.product_id = p.id), p.mrp) AS max_mrp,
           COALESCE((SELECT SUM(i.quantity) FROM inventory i WHERE i.product_id = p.id), 0) AS total_stock
           ${wholesale ? `, (SELECT MIN(COALESCE(i.wholesale_price, p.wholesale_price)) FROM inventory i WHERE i.product_id = p.id) AS min_ws,
                            (SELECT MAX(COALESCE(i.wholesale_price, p.wholesale_price)) FROM inventory i WHERE i.product_id = p.id) AS max_ws` : ''}
    FROM products p JOIN brands b ON b.id = p.brand_id JOIN categories c ON c.id = p.category_id
    LEFT JOIN subcategories sc ON sc.id = p.subcategory_id
    WHERE p.active = 1 AND b.active = 1 AND c.active = 1 AND p.id <> ? AND p.gender = ?
    ORDER BY (CASE WHEN p.category_id = ? THEN 4 ELSE 0 END) + (CASE WHEN p.brand_id = ? THEN 2 ELSE 0 END)
             + (CASE WHEN COALESCE((SELECT SUM(i.quantity) FROM inventory i WHERE i.product_id = p.id), 0) > 0 THEN 1 ELSE 0 END) DESC, p.created_at DESC
    LIMIT 8`, product.id, product.gender, product.category.id, product.brand.id);
  return hydrate(rows, { wholesale, admin: false, th });
}

/* -------------------------------------------------------------------- write */

const money = z.preprocess((v) => (v === '' || v === null || v === undefined ? null : v), z.coerce.number().min(0, 'Price cannot be negative').max(10000000).nullable());
const sizeEntry = z.object({
  size: z.string().trim().min(1, 'Size is required').max(10),
  quantity: z.coerce.number('Stock must be a number').int('Stock must be a whole number').min(0, 'Stock cannot be negative').max(1000000),
  mrp: money.optional().default(null),
  wholesalePrice: money.optional().default(null),
});
const colorEntry = z.object({
  color: z.string().trim().min(1, 'Colour name is required').max(40),
  sizes: z.array(sizeEntry).min(1, 'Add at least one size for every colour'),
});
const imageUrl = z.string().max(500).refine((u) => /^\/uploads\/[\w.-]+$/.test(u) || /^https:\/\/\S+$/.test(u), 'Invalid image URL');
const productSchema = z.object({
  name: z.string().trim().min(2, 'Product name is required').max(160),
  sku: z.string().trim().min(1, 'SKU is required').max(60).regex(/^[A-Za-z0-9._\-/ ]+$/, 'SKU may only contain letters, numbers and . _ - /'),
  brandId: z.coerce.number().int().positive('Select a brand'),
  categoryId: z.coerce.number().int().positive('Select a category'),
  subcategoryId: z.preprocess((v) => (v === '' || v === 0 || v === '0' ? null : v), z.coerce.number().int().positive().nullable()).optional().default(null),
  description: z.string().max(5000).optional().default(''),
  mrp: z.coerce.number('MRP is required').min(0).max(10000000),
  wholesalePrice: money.optional().default(null),
  costPrice: money.optional().default(null),
  featured: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
  images: z.array(imageUrl).max(10).optional().default([]),
  variants: z.array(colorEntry).min(1, 'Add at least one colour with sizes'),
});

function validateVariants(data) {
  const seenColors = new Set();
  for (const v of data.variants) {
    const ck = v.color.toLowerCase();
    if (seenColors.has(ck)) throw new HttpError(400, `Colour "${v.color}" is listed twice`);
    seenColors.add(ck);
    const seenSizes = new Set();
    for (const s of v.sizes) {
      const sk = s.size.toLowerCase();
      if (seenSizes.has(sk)) throw new HttpError(400, `Size ${s.size} is listed twice for ${v.color}`);
      seenSizes.add(sk);
      if (s.mrp != null && s.wholesalePrice != null && s.wholesalePrice > s.mrp) {
        throw new HttpError(400, `${v.color} size ${s.size}: wholesale price cannot exceed MRP`);
      }
    }
  }
  if (data.wholesalePrice != null && data.wholesalePrice > data.mrp) throw new HttpError(400, 'Wholesale price cannot exceed MRP');
}

async function uniqueSlug(base, ignoreId) {
  let slug = slugify(base), n = 1;
  while (await db.get('SELECT 1 FROM products WHERE slug = ? AND id <> ?', slug, ignoreId || 0)) slug = `${slugify(base)}-${++n}`;
  return slug;
}

const saveProduct = (data, existingId, actor = null) => db.transaction(async () => {
  validateVariants(data);
  const cat = await db.get('SELECT id, gender FROM categories WHERE id = ?', data.categoryId);
  if (!cat) throw new HttpError(400, 'Selected category does not exist');
  if (!(await db.get('SELECT 1 FROM brands WHERE id = ?', data.brandId))) throw new HttpError(400, 'Selected brand does not exist');
  if (data.subcategoryId) {
    const sc = await db.get('SELECT category_id FROM subcategories WHERE id = ?', data.subcategoryId);
    if (!sc || sc.category_id !== cat.id) throw new HttpError(400, 'Subcategory does not belong to the selected category');
  }
  const dupe = await db.get('SELECT id FROM products WHERE sku = ? AND id <> ?', data.sku, existingId || 0);
  if (dupe) throw new HttpError(409, `SKU "${data.sku}" is already used by another product`);

  let id = existingId;
  const before = new Map();   // "color|size" -> quantity, used to log what an edit changed
  if (existingId) {
    for (const r of await db.all(`SELECT co.name AS color, s.label AS size, i.quantity FROM inventory i
      JOIN colors co ON co.id = i.color_id JOIN sizes s ON s.id = i.size_id WHERE i.product_id = ?`, existingId)) {
      before.set(`${r.color.toLowerCase()}|${r.size.toLowerCase()}`, { color: r.color, size: r.size, quantity: r.quantity });
    }
  }
  if (existingId) {
    const cur = await db.get('SELECT name, slug FROM products WHERE id = ?', existingId);
    if (!cur) throw new HttpError(404, 'Product not found');
    await db.run(`UPDATE products SET name=?, sku=?, brand_id=?, category_id=?, subcategory_id=?, gender=?, description=?, mrp=?,
                wholesale_price=?, cost_price=?, featured=?, active=?, updated_at=now() WHERE id=?`,
      data.name, data.sku, data.brandId, data.categoryId, data.subcategoryId, cat.gender, data.description, data.mrp,
      data.wholesalePrice, data.costPrice, +data.featured, +data.active, existingId);
    await db.run('DELETE FROM inventory WHERE product_id = ?', existingId);
    await db.run('DELETE FROM product_colors WHERE product_id = ?', existingId);
    await db.run('DELETE FROM product_sizes WHERE product_id = ?', existingId);
    await db.run('DELETE FROM product_images WHERE product_id = ?', existingId);
  } else {
    id = await db.insert(`INSERT INTO products (name, slug, sku, brand_id, category_id, subcategory_id, gender, description, mrp, wholesale_price, cost_price, featured, active)
                     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      data.name, await uniqueSlug(data.name), data.sku, data.brandId, data.categoryId, data.subcategoryId, cat.gender,
      data.description, data.mrp, data.wholesalePrice, data.costPrice, +data.featured, +data.active);
  }

  // Find-or-create a colour/size row (case-insensitive; safe if another request creates it at the same moment).
  const lookup = async (table, col, value, extraCols = '', extraArgs = []) => {
    let row = await db.get(`SELECT id FROM ${table} WHERE ${col} = ?`, value);
    if (!row) {
      row = await db.get(`INSERT INTO ${table} (${col}${extraCols}) VALUES (?${extraArgs.map(() => ',?').join('')}) ON CONFLICT (${col}) DO NOTHING RETURNING id`, value, ...extraArgs)
        || await db.get(`SELECT id FROM ${table} WHERE ${col} = ?`, value);
    }
    return row.id;
  };
  for (const v of data.variants) {
    const cid = await lookup('colors', 'name', v.color);
    await db.run('INSERT INTO product_colors (product_id, color_id) VALUES (?,?) ON CONFLICT DO NOTHING', id, cid);
    for (const s of v.sizes) {
      const sid = await lookup('sizes', 'label', s.size, ', sort', [sizeSort(s.size)]);
      await db.run('INSERT INTO product_sizes (product_id, size_id) VALUES (?,?) ON CONFLICT DO NOTHING', id, sid);
      await db.run('INSERT INTO inventory (product_id, color_id, size_id, quantity, mrp, wholesale_price) VALUES (?,?,?,?,?,?)',
        id, cid, sid, s.quantity, s.mrp, s.wholesalePrice);
    }
  }
  // Audit trail: log every quantity that differs from what was there before this save.
  const type = existingId ? 'EDIT' : 'INITIAL';
  const reason = existingId ? 'Product edited' : 'Initial stock';
  const seen = new Set();
  for (const v of data.variants) {
    for (const s of v.sizes) {
      const key = `${v.color.toLowerCase()}|${s.size.toLowerCase()}`;
      seen.add(key);
      const was = before.get(key)?.quantity ?? 0;
      if (s.quantity !== was) {
        await logMovement({ productId: id, productName: data.name, sku: data.sku, color: v.color, size: s.size, change: s.quantity - was, quantityAfter: s.quantity, type, reason, actor });
      }
    }
  }
  for (const [key, old] of before) {
    if (!seen.has(key) && old.quantity > 0) {
      await logMovement({ productId: id, productName: data.name, sku: data.sku, color: old.color, size: old.size, change: -old.quantity, quantityAfter: 0, type: 'REMOVED', reason: 'Size/colour removed in edit', actor });
    }
  }
  for (const [i, u] of data.images.entries()) await db.run('INSERT INTO product_images (product_id, url, position) VALUES (?,?,?)', id, u, i);
  return id;
});

module.exports = { listProducts, getProduct, related, saveProduct, productSchema, stockStatus, normGender, csv, placeholders, sizeSort };

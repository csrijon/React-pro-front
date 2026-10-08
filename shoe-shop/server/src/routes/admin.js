const express = require('express');
const crypto = require('crypto');
const multer = require('multer');
const { db, getSettings, lowStockThreshold, slugify, DEFAULT_SETTINGS } = require('../db');
const config = require('../config');
const { HttpError, parse, z, id: idSchema } = require('../http');
const { requireAdmin } = require('../auth');
const svc = require('../productService');
const { saveImage } = require('../storage');

const router = express.Router();
router.use(requireAdmin);
router.use('/stock', require('./stock'));
const { logMovement } = require('../stockLog');
const actorOf = (req) => ({ id: req.user.id, name: req.user.username });

const pid = (req) => parse(idSchema, req.params.id);

/* ---------------------------------------------------------------- dashboard */
router.get('/dashboard', async (_req, res) => {
  const th = await lowStockThreshold();
  const one = async (sql, ...a) => (await db.get(sql, ...a)).n;
  const perProduct = `SELECT p.id, p.active, COALESCE(SUM(i.quantity),0) t FROM products p LEFT JOIN inventory i ON i.product_id = p.id GROUP BY p.id`;
  const [total, active, featured, lowStock, outOfStock, lowStockVariants, outOfStockVariants, totalUnits,
    cTotal, cPending, cApproved, cSuspended, categoryInventory, brandCounts, lowStockList, pendingCustomers, value, cost, profitByProduct] = await Promise.all([
    one('SELECT COUNT(*) n FROM products'),
    one('SELECT COUNT(*) n FROM products WHERE active = 1'),
    one('SELECT COUNT(*) n FROM products WHERE featured = 1 AND active = 1'),
    one(`SELECT COUNT(*) n FROM (${perProduct}) pp WHERE active = 1 AND t > 0 AND t <= ?`, th),
    one(`SELECT COUNT(*) n FROM (${perProduct}) pp WHERE active = 1 AND t = 0`),
    one('SELECT COUNT(*) n FROM inventory WHERE quantity > 0 AND quantity <= ?', th),
    one('SELECT COUNT(*) n FROM inventory WHERE quantity = 0'),
    one('SELECT COALESCE(SUM(quantity),0) n FROM inventory'),
    one('SELECT COUNT(*) n FROM customers'),
    one("SELECT COUNT(*) n FROM customers WHERE status = 'PENDING'"),
    one("SELECT COUNT(*) n FROM customers WHERE status = 'APPROVED'"),
    one("SELECT COUNT(*) n FROM customers WHERE status IN ('SUSPENDED','REJECTED')"),
    db.all(`
      SELECT c.gender, c.name, COUNT(DISTINCT p.id) AS products, COALESCE(SUM(i.quantity),0) AS units,
             COALESCE(SUM((i.quantity * COALESCE(i.wholesale_price, p.wholesale_price, 0))),0) AS "wholesaleValue", COALESCE(SUM((i.quantity * COALESCE(i.mrp, p.mrp))),0) AS "mrpValue"
      FROM categories c LEFT JOIN products p ON p.category_id = c.id LEFT JOIN inventory i ON i.product_id = p.id
      GROUP BY c.id HAVING COUNT(DISTINCT p.id) > 0 ORDER BY units DESC`),
    db.all(`
      SELECT b.name, COUNT(DISTINCT p.id) AS products, COALESCE(SUM(i.quantity),0) AS units,
             COALESCE(SUM((i.quantity * COALESCE(i.wholesale_price, p.wholesale_price, 0))),0) AS "wholesaleValue", COALESCE(SUM((i.quantity * COALESCE(i.mrp, p.mrp))),0) AS "mrpValue"
      FROM brands b LEFT JOIN products p ON p.brand_id = b.id LEFT JOIN inventory i ON i.product_id = p.id
      GROUP BY b.id HAVING COUNT(DISTINCT p.id) > 0 ORDER BY products DESC, b.name`),
    db.all(`
      SELECT p.id, p.name, p.sku, COALESCE(SUM(i.quantity),0) AS units
      FROM products p LEFT JOIN inventory i ON i.product_id = p.id WHERE p.active = 1
      GROUP BY p.id HAVING COALESCE(SUM(i.quantity),0) <= ? ORDER BY units, p.name LIMIT 8`, th),
    db.all(`SELECT id, shop_name AS "shopName", owner_name AS "ownerName", mobile, created_at AS "createdAt"
      FROM customers WHERE status = 'PENDING' ORDER BY created_at DESC LIMIT 5`),
    db.get(`SELECT COALESCE(SUM((i.quantity * COALESCE(i.wholesale_price, p.wholesale_price, 0))),0) AS "wholesaleValue", COALESCE(SUM((i.quantity * COALESCE(i.mrp, p.mrp))),0) AS "mrpValue",
        COUNT(*) FILTER (WHERE i.quantity > 0 AND COALESCE(i.wholesale_price, p.wholesale_price) IS NULL) AS "unpriced"
      FROM inventory i JOIN products p ON p.id = i.product_id`),
    db.get(`SELECT COALESCE(SUM(i.quantity * p.cost_price),0) AS "stockCost",
        COALESCE(SUM(i.quantity * COALESCE(i.wholesale_price, p.wholesale_price, 0)),0) AS "costedWholesaleValue",
        COALESCE(SUM(i.quantity),0) AS "costedUnits"
      FROM inventory i JOIN products p ON p.id = i.product_id WHERE p.cost_price IS NOT NULL`),
    db.all(`SELECT p.id, p.name, p.sku, SUM(i.quantity) AS units, p.cost_price AS "costPrice",
        SUM(i.quantity * COALESCE(i.wholesale_price, p.wholesale_price, 0)) AS "wholesaleValue",
        SUM(i.quantity * p.cost_price) AS "stockCost",
        SUM(i.quantity * (COALESCE(i.wholesale_price, p.wholesale_price, 0) - p.cost_price)) AS profit
      FROM products p JOIN inventory i ON i.product_id = p.id WHERE p.cost_price IS NOT NULL AND p.active = 1
      GROUP BY p.id HAVING SUM(i.quantity) > 0 ORDER BY profit DESC LIMIT 8`),
  ]);
  const [uncosted] = [await db.get(`SELECT COALESCE(SUM(i.quantity),0) AS units, COUNT(DISTINCT p.id) AS products
      FROM inventory i JOIN products p ON p.id = i.product_id WHERE p.cost_price IS NULL AND i.quantity > 0`)];
  res.json({
    threshold: th,
    products: { total, active, featured, lowStock, outOfStock, lowStockVariants, outOfStockVariants, totalUnits,
      stockValueWholesale: value.wholesaleValue, stockValueMrp: value.mrpValue, unpricedVariants: value.unpriced,
      stockCost: cost.stockCost, expectedProfit: cost.costedWholesaleValue - cost.stockCost,
      marginPct: cost.costedWholesaleValue > 0 ? Math.round(((cost.costedWholesaleValue - cost.stockCost) / cost.costedWholesaleValue) * 1000) / 10 : null,
      costedUnits: cost.costedUnits, uncostedUnits: uncosted.units, uncostedProducts: uncosted.products },
    customers: { total: cTotal, pending: cPending, approved: cApproved, suspended: cSuspended },
    categoryInventory, brandCounts, lowStockList, pendingCustomers,
    profitByProduct: profitByProduct.map((r) => ({ ...r, marginPct: r.wholesaleValue > 0 ? Math.round((r.profit / r.wholesaleValue) * 1000) / 10 : null })),
  });
});

/* ----------------------------------------------------------------- products */
router.get('/products', async (req, res) => {
  res.json(await svc.listProducts(req.query, { wholesale: true, admin: true }));
});

router.get('/products/:id', async (req, res) => {
  const p = await svc.getProduct('p.id = ?', pid(req), { wholesale: true, admin: true });
  if (!p) throw new HttpError(404, 'Product not found');
  res.json({ product: p });
});

router.post('/products', async (req, res) => {
  const data = parse(svc.productSchema, req.body);
  const newId = await svc.saveProduct(data, null, actorOf(req));
  res.status(201).json({ product: await svc.getProduct('p.id = ?', newId, { wholesale: true, admin: true }) });
});

router.put('/products/:id', async (req, res) => {
  const data = parse(svc.productSchema, req.body);
  const i = pid(req);
  await svc.saveProduct(data, i, actorOf(req));
  res.json({ product: await svc.getProduct('p.id = ?', i, { wholesale: true, admin: true }) });
});

const flagSchema = (k) => z.object({ [k]: z.boolean() });
function setFlag(col, key) {
  return async (req, res) => {
    const d = parse(flagSchema(key), req.body);
    const r = await db.run(`UPDATE products SET ${col} = ?, updated_at = now() WHERE id = ?`, +d[key], pid(req));
    if (!r.changes) throw new HttpError(404, 'Product not found');
    res.json({ ok: true });
  };
}
router.patch('/products/:id/featured', setFlag('featured', 'featured'));
router.patch('/products/:id/active', setFlag('active', 'active'));

router.delete('/products/:id', async (req, res) => {
  const i = pid(req);
  await db.transaction(async () => {
    const p = await db.get('SELECT name, sku FROM products WHERE id = ?', i);
    if (!p) throw new HttpError(404, 'Product not found');
    for (const r of await db.all(`SELECT co.name AS color, s.label AS size, i.quantity FROM inventory i
        JOIN colors co ON co.id = i.color_id JOIN sizes s ON s.id = i.size_id WHERE i.product_id = ? AND i.quantity > 0`, i)) {
      await logMovement({ productId: i, productName: p.name, sku: p.sku, color: r.color, size: r.size, change: -r.quantity, quantityAfter: 0, type: 'REMOVED', reason: 'Product deleted', actor: actorOf(req) });
    }
    await db.run('DELETE FROM products WHERE id = ?', i);
  });
  return res.json({ ok: true });
});

/* --------------------------------------------------------------- categories */
const categorySchema = z.object({
  gender: z.enum(['men', 'women', 'kids'], { error: 'Choose Men, Women or Kids' }),
  name: z.string().trim().min(2, 'Category name is required').max(60),
  imageUrl: z.string().max(500).regex(/^(\/uploads\/[\w.-]+|https:\/\/\S+)?$/, 'Invalid image URL').optional().default(''),
  active: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional().default(0),
});
const catSlug = async (gender, name, ignoreId = 0) => {
  let slug = slugify(name), n = 1;
  while (await db.get('SELECT 1 FROM categories WHERE gender = ? AND slug = ? AND id <> ?', gender, slug, ignoreId)) slug = `${slugify(name)}-${++n}`;
  return slug;
};

router.get('/categories', async (_req, res) => {
  const cats = await db.all(`
    SELECT c.id, c.gender, c.name, c.slug, c.image_url AS "imageUrl", c.active, c.sort_order AS "sortOrder",
           (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS "productCount"
    FROM categories c ORDER BY c.gender, c.sort_order, c.name`);
  const subs = await db.all(`SELECT s.id, s.category_id AS "categoryId", s.name, s.slug, s.active,
    (SELECT COUNT(*) FROM products p WHERE p.subcategory_id = s.id) AS "productCount" FROM subcategories s ORDER BY s.name`);
  for (const c of cats) {
    c.active = !!c.active;
    c.subcategories = subs.filter((s) => s.categoryId === c.id).map((s) => ({ ...s, active: !!s.active }));
  }
  res.json({ categories: cats });
});

router.post('/categories', async (req, res) => {
  const d = parse(categorySchema, req.body);
  const id = await db.insert('INSERT INTO categories (gender, name, slug, image_url, active, sort_order) VALUES (?,?,?,?,?,?)',
    d.gender, d.name, await catSlug(d.gender, d.name), d.imageUrl || null, +d.active, d.sortOrder);
  res.status(201).json({ id });
});

router.put('/categories/:id', async (req, res) => {
  const d = parse(categorySchema, req.body);
  const i = pid(req);
  const cur = await db.get('SELECT gender FROM categories WHERE id = ?', i);
  if (!cur) throw new HttpError(404, 'Category not found');
  if (cur.gender !== d.gender && await db.get('SELECT 1 FROM products WHERE category_id = ?', i)) {
    throw new HttpError(409, 'Cannot change the gender of a category that already has products');
  }
  await db.run('UPDATE categories SET gender=?, name=?, slug=?, image_url=?, active=?, sort_order=? WHERE id=?',
    d.gender, d.name, await catSlug(d.gender, d.name, i), d.imageUrl || null, +d.active, d.sortOrder, i);
  res.json({ ok: true });
});

router.delete('/categories/:id', async (req, res) => {
  const i = pid(req);
  const n = (await db.get('SELECT COUNT(*) n FROM products WHERE category_id = ?', i)).n;
  if (n) throw new HttpError(409, `This category has ${n} product${n > 1 ? 's' : ''}. Move or delete them first, or deactivate the category instead.`);
  const r = await db.run('DELETE FROM categories WHERE id = ?', i);
  if (!r.changes) throw new HttpError(404, 'Category not found');
  res.json({ ok: true });
});

const subSchema = z.object({ categoryId: z.coerce.number().int().positive(), name: z.string().trim().min(2, 'Name is required').max(60), active: z.boolean().optional().default(true) });
const subSlug = async (cid, name, ignoreId = 0) => {
  let slug = slugify(name), n = 1;
  while (await db.get('SELECT 1 FROM subcategories WHERE category_id = ? AND slug = ? AND id <> ?', cid, slug, ignoreId)) slug = `${slugify(name)}-${++n}`;
  return slug;
};
router.post('/subcategories', async (req, res) => {
  const d = parse(subSchema, req.body);
  if (!(await db.get('SELECT 1 FROM categories WHERE id = ?', d.categoryId))) throw new HttpError(400, 'Category not found');
  const id = await db.insert('INSERT INTO subcategories (category_id, name, slug, active) VALUES (?,?,?,?)', d.categoryId, d.name, await subSlug(d.categoryId, d.name), +d.active);
  res.status(201).json({ id });
});
router.put('/subcategories/:id', async (req, res) => {
  const d = parse(subSchema, req.body);
  const i = pid(req);
  const cur = await db.get('SELECT category_id FROM subcategories WHERE id = ?', i);
  if (!cur) throw new HttpError(404, 'Subcategory not found');
  if (cur.category_id !== d.categoryId) throw new HttpError(400, 'A subcategory cannot be moved to another category');
  await db.run('UPDATE subcategories SET name=?, slug=?, active=? WHERE id=?', d.name, await subSlug(d.categoryId, d.name, i), +d.active, i);
  res.json({ ok: true });
});
router.delete('/subcategories/:id', async (req, res) => {
  const r = await db.run('DELETE FROM subcategories WHERE id = ?', pid(req)); // products.subcategory_id -> SET NULL
  if (!r.changes) throw new HttpError(404, 'Subcategory not found');
  res.json({ ok: true });
});

/* ------------------------------------------------------------------- brands */
const brandSchema = z.object({
  name: z.string().trim().min(1, 'Brand name is required').max(60),
  logoUrl: z.string().max(500).regex(/^(\/uploads\/[\w.-]+|https:\/\/\S+)?$/, 'Invalid logo URL').optional().default(''),
  active: z.boolean().optional().default(true),
});
const brandSlug = async (name, ignoreId = 0) => {
  let slug = slugify(name), n = 1;
  while (await db.get('SELECT 1 FROM brands WHERE slug = ? AND id <> ?', slug, ignoreId)) slug = `${slugify(name)}-${++n}`;
  return slug;
};
router.get('/brands', async (_req, res) => {
  const rows = await db.all(`SELECT b.id, b.name, b.slug, b.logo_url AS "logoUrl", b.active,
    (SELECT COUNT(*) FROM products p WHERE p.brand_id = b.id) AS "productCount" FROM brands b ORDER BY b.name`);
  res.json({ brands: rows.map((b) => ({ ...b, active: !!b.active })) });
});
router.post('/brands', async (req, res) => {
  const d = parse(brandSchema, req.body);
  const id = await db.insert('INSERT INTO brands (name, slug, logo_url, active) VALUES (?,?,?,?)', d.name, await brandSlug(d.name), d.logoUrl || null, +d.active);
  res.status(201).json({ id });
});
router.put('/brands/:id', async (req, res) => {
  const d = parse(brandSchema, req.body);
  const i = pid(req);
  const r = await db.run('UPDATE brands SET name=?, slug=?, logo_url=?, active=? WHERE id=?', d.name, await brandSlug(d.name, i), d.logoUrl || null, +d.active, i);
  if (!r.changes) throw new HttpError(404, 'Brand not found');
  res.json({ ok: true });
});
router.delete('/brands/:id', async (req, res) => {
  const i = pid(req);
  const n = (await db.get('SELECT COUNT(*) n FROM products WHERE brand_id = ?', i)).n;
  if (n) throw new HttpError(409, `This brand has ${n} product${n > 1 ? 's' : ''}. Delete them first, or deactivate the brand instead.`);
  const r = await db.run('DELETE FROM brands WHERE id = ?', i);
  if (!r.changes) throw new HttpError(404, 'Brand not found');
  res.json({ ok: true });
});

/* ---------------------------------------------------------------- customers */
const CUSTOMER_COLS = `c.id, c.shop_name AS "shopName", c.owner_name AS "ownerName", c.mobile, c.email, c.address, c.status, c.created_at AS "createdAt"`;
const withAccess = (c) => ({ ...c, wholesaleAccess: c.status === 'APPROVED' });

router.get('/customers', async (req, res) => {
  const where = [], args = [];
  if (['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].includes(String(req.query.status))) { where.push('c.status = ?'); args.push(req.query.status); }
  const q = String(req.query.q || '').trim();
  if (q) {
    const like = `%${q.replace(/[%_\\]/g, '\\$&')}%`;
    where.push(`(c.shop_name ILIKE ? ESCAPE '\\' OR c.owner_name ILIKE ? ESCAPE '\\' OR c.mobile ILIKE ? ESCAPE '\\')`);
    args.push(like, like, like);
  }
  const rows = await db.all(`SELECT ${CUSTOMER_COLS} FROM customers c ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY (c.status = 'PENDING') DESC, c.created_at DESC LIMIT 500`, ...args);
  const counts = {};
  for (const r of await db.all('SELECT status, COUNT(*) n FROM customers GROUP BY status')) counts[r.status] = r.n;
  res.json({ customers: rows.map(withAccess), counts });
});

router.get('/customers/:id', async (req, res) => {
  const i = pid(req);
  const c = await db.get(`SELECT ${CUSTOMER_COLS} FROM customers c WHERE c.id = ?`, i);
  if (!c) throw new HttpError(404, 'Customer not found');
  const history = await db.all(`SELECT a.status, a.note, a.created_at AS "createdAt", u.username AS admin
    FROM customer_approvals a LEFT JOIN users u ON u.id = a.admin_id WHERE a.customer_id = ? ORDER BY a.id DESC`, i);
  res.json({ customer: withAccess(c), history });
});

const statusSchema = z.object({ status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED']), note: z.string().trim().max(300).optional() });
router.patch('/customers/:id/status', async (req, res) => {
  const d = parse(statusSchema, req.body);
  const i = pid(req);
  await db.transaction(async () => {
    const r = await db.run('UPDATE customers SET status = ? WHERE id = ?', d.status, i);
    if (!r.changes) throw new HttpError(404, 'Customer not found');
    await db.run('INSERT INTO customer_approvals (customer_id, status, admin_id, note) VALUES (?,?,?,?)', i, d.status, req.user.id, d.note || null);
  });
  res.json({ ok: true });
});

router.delete('/customers/:id', async (req, res) => {
  const i = pid(req);
  const c = await db.get('SELECT user_id FROM customers WHERE id = ?', i);
  if (!c) throw new HttpError(404, 'Customer not found');
  await db.run('DELETE FROM users WHERE id = ?', c.user_id); // cascades to customers + approvals
  res.json({ ok: true });
});

/* ---------------------------------------------------------------- inventory */
router.get('/inventory', async (req, res) => {
  const th = await lowStockThreshold();
  const where = [], args = [];
  const g = svc.normGender(req.query.gender);
  if (g) { where.push('p.gender = ?'); args.push(g); }
  for (const [param, col] of [['category', 'c.slug'], ['brand', 'b.slug'], ['color', 'co.name'], ['size', 's.label']]) {
    const vals = svc.csv(req.query[param]);
    if (vals.length) { where.push(`${col} IN (${svc.placeholders(vals)})`); args.push(...vals); }
  }
  const q = String(req.query.q || '').trim();
  if (q) {
    const like = `%${q.replace(/[%_\\]/g, '\\$&')}%`;
    where.push(`(p.name ILIKE ? ESCAPE '\\' OR p.sku ILIKE ? ESCAPE '\\')`);
    args.push(like, like);
  }
  const status = String(req.query.status || '');
  if (status === 'IN') { where.push('i.quantity > ?'); args.push(th); }
  else if (status === 'LOW') { where.push('i.quantity > 0 AND i.quantity <= ?'); args.push(th); }
  else if (status === 'OUT') where.push('i.quantity = 0');

  const from = `FROM inventory i JOIN products p ON p.id = i.product_id JOIN brands b ON b.id = p.brand_id
    JOIN categories c ON c.id = p.category_id JOIN colors co ON co.id = i.color_id JOIN sizes s ON s.id = i.size_id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}`;
  const agg = `COUNT(*) AS variants, COALESCE(SUM(i.quantity),0) AS units, COUNT(DISTINCT p.id) AS products,
    COUNT(*) FILTER (WHERE i.quantity > 0 AND i.quantity <= ${th}) AS low, COUNT(*) FILTER (WHERE i.quantity = 0) AS out,
    COUNT(*) FILTER (WHERE i.quantity > ${th}) AS "inStock",
    COALESCE(SUM((i.quantity * COALESCE(i.wholesale_price, p.wholesale_price, 0))),0) AS "wholesaleValue", COALESCE(SUM((i.quantity * COALESCE(i.mrp, p.mrp))),0) AS "mrpValue"`;

  const summary = await db.get(`SELECT ${agg} ${from}`, ...args);
  // "available" = units that can actually be sold, i.e. everything with quantity > 0 (equal to total units; zero rows add nothing)
  summary.available = summary.units;

  const groupBy = String(req.query.groupBy || 'none');
  // [label expression, ORDER BY expression] — the order expression is also grouped so Postgres accepts it.
  const groups = {
    gender: ['p.gender', 'p.gender'],
    category: ["c.gender || ' / ' || c.name", "c.gender || ' / ' || c.name"],
    brand: ['b.name', 'b.name'],
    product: ["p.name || ' (' || p.sku || ')'", "p.name || ' (' || p.sku || ')'"],
    color: ['co.name', 'co.name'],
    size: ['s.label', 's.sort'],
  };
  if (groups[groupBy]) {
    const [label, order] = groups[groupBy];
    const rows = await db.all(`SELECT ${label} AS label, ${agg} ${from} GROUP BY ${label}, ${order} ORDER BY ${order}`, ...args);
    return res.json({ summary, groupBy, rows, threshold: th });
  }
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));
  const rows = await db.all(`SELECT i.product_id AS "productId", i.color_id AS "colorId", i.size_id AS "sizeId", p.name AS product, p.sku, p.gender,
      c.name AS category, b.name AS brand, co.name AS color, s.label AS size, i.quantity,
      (i.quantity * COALESCE(i.wholesale_price, p.wholesale_price, 0)) AS "wholesaleValue", (i.quantity * COALESCE(i.mrp, p.mrp)) AS "mrpValue"
    ${from} ORDER BY p.gender, c.name, b.name, p.name, co.name, s.sort LIMIT ? OFFSET ?`, ...args, limit, (page - 1) * limit);
  res.json({
    summary, groupBy: 'none', threshold: th, page, limit, pages: Math.max(1, Math.ceil(summary.variants / limit)),
    rows: rows.map((r) => ({ ...r, status: svc.stockStatus(r.quantity, th) })),
  });
});

router.get('/inventory/options', async (_req, res) => {
  const [sizes, colors] = await Promise.all([db.all('SELECT label FROM sizes ORDER BY sort'), db.all('SELECT name FROM colors ORDER BY name')]);
  res.json({ sizes: sizes.map((r) => r.label), colors: colors.map((r) => r.name) });
});


/* ----------------------------------------------------------------- settings */
const httpsUrl = (host) => z.string().trim().max(300).refine((u) => u === '' || (/^https:\/\/\S+$/.test(u) && (!host || host.test(new URL(u).hostname))), 'Enter a valid https:// link');
const settingsSchema = z.object({
  shopName: z.string().trim().min(2, 'Shop name is required').max(80),
  logoUrl: z.string().max(500).regex(/^(\/uploads\/[\w.-]+|https:\/\/\S+)?$/, 'Invalid logo URL'),
  phone: z.string().trim().max(30).regex(/^[\d+\-\s()]*$/, 'Phone may only contain digits, spaces and + - ( )'),
  address: z.string().trim().max(400),
  whatsapp: z.string().trim().max(20).regex(/^\+?\d*$/, 'WhatsApp number: digits only (with country code)'),
  facebookUrl: httpsUrl(/(^|\.)facebook\.com$|(^|\.)fb\.com$/),
  instagramUrl: httpsUrl(/(^|\.)instagram\.com$/),
  youtubeUrl: httpsUrl(/(^|\.)youtube\.com$|(^|\.)youtu\.be$/),
  lowStockThreshold: z.coerce.number('Threshold must be a number').int().min(0).max(100000),
  reorderTarget: z.coerce.number('Reorder level must be a number').int().min(1, 'Must be at least 1').max(100000),
  wholesaleEnabled: z.boolean(),
  wholesaleNote: z.string().trim().max(300),
});
const SETTING_MAP = {
  shopName: 'shop_name', logoUrl: 'logo_url', phone: 'phone', address: 'address', whatsapp: 'whatsapp', facebookUrl: 'facebook_url',
  instagramUrl: 'instagram_url', youtubeUrl: 'youtube_url', lowStockThreshold: 'low_stock_threshold', reorderTarget: 'reorder_target', wholesaleEnabled: 'wholesale_enabled', wholesaleNote: 'wholesale_note',
};
const settingsOut = async () => {
  const s = await getSettings();
  const o = {};
  for (const [camel, key] of Object.entries(SETTING_MAP)) o[camel] = s[key] ?? DEFAULT_SETTINGS[key];
  o.lowStockThreshold = Number(o.lowStockThreshold);
  o.reorderTarget = Number(o.reorderTarget);
  o.wholesaleEnabled = o.wholesaleEnabled !== 'false';
  return o;
};
router.get('/settings', async (_req, res) => res.json({ settings: await settingsOut() }));
router.put('/settings', async (req, res) => {
  const d = parse(settingsSchema, req.body);
  await db.transaction(async () => {
    for (const [camel, key] of Object.entries(SETTING_MAP)) {
      await db.run('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value', key, String(d[camel]));
    }
  });
  res.json({ settings: await settingsOut() });
});

/* ------------------------------------------------------------------ profile */
router.put('/profile', async (req, res) => {
  const d = parse(z.object({ username: z.string().trim().min(3, 'Username must be at least 3 characters').max(40).regex(/^[\w.@-]+$/, 'Letters, numbers and . _ - @ only') }), req.body);
  if (await db.get('SELECT 1 FROM users WHERE username = ? AND id <> ?', d.username, req.user.id)) throw new HttpError(409, 'That username is taken');
  await db.run('UPDATE users SET username = ? WHERE id = ?', d.username, req.user.id);
  res.json({ ok: true });
});

/* ------------------------------------------------------------------- upload */
const MIME_EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => (MIME_EXT[file.mimetype] ? cb(null, true) : cb(new HttpError(400, 'Only JPG, PNG or WebP images are allowed'))),
});
// Checks the real file signature, not just the declared type.
function looksLikeImage(file) {
  const b = file.buffer;
  if (file.mimetype === 'image/jpeg') return b[0] === 0xff && b[1] === 0xd8;
  if (file.mimetype === 'image/png') return b.slice(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  return b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP';
}
router.post('/upload', upload.array('files', 10), async (req, res) => {
  const urls = [];
  for (const f of req.files || []) {
    if (!looksLikeImage(f)) continue;
    urls.push(await saveImage(f.buffer, crypto.randomBytes(12).toString('hex') + MIME_EXT[f.mimetype], f.mimetype));
  }
  if (!urls.length) throw new HttpError(400, 'No valid image was uploaded');
  res.status(201).json({ urls });
});

module.exports = router;

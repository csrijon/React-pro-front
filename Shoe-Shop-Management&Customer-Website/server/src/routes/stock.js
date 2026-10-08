const express = require('express');
const { db, lowStockThreshold, getSettings } = require('../db');
const { HttpError, parse, z } = require('../http');
const { logMovement } = require('../stockLog');
const { stockStatus } = require('../productService');

const router = express.Router();   // mounted under /api/admin/stock (admin-only)
const actorOf = (req) => ({ id: req.user.id, name: req.user.username });

const REASONS = {
  'Sold': 'DECREASE', 'Damaged': 'DECREASE', 'Lost / theft': 'DECREASE', 'Returned': 'INCREASE',
  'Count correction': null, 'Other': null,
};
const NOTE_REQUIRED = new Set(['Lost / theft', 'Other']);

const target = z.object({
  productId: z.coerce.number().int().positive(), colorId: z.coerce.number().int().positive(), sizeId: z.coerce.number().int().positive(),
});
const qty = z.coerce.number('Quantity must be a number').int('Quantity must be a whole number').min(0, 'Quantity cannot be negative').max(1000000);
const note = z.string().trim().max(200).optional().default('');

// Locks the inventory row, applies `compute(current)` and logs the movement — all in one transaction.
async function change(req, t, compute, meta) {
  return db.transaction(async () => {
    const row = await db.get(`
      SELECT i.quantity, p.name, p.sku, co.name AS color, s.label AS size
      FROM inventory i JOIN products p ON p.id = i.product_id JOIN colors co ON co.id = i.color_id JOIN sizes s ON s.id = i.size_id
      WHERE i.product_id = ? AND i.color_id = ? AND i.size_id = ? FOR UPDATE OF i`, t.productId, t.colorId, t.sizeId);
    if (!row) throw new HttpError(404, 'Inventory row not found');
    const next = compute(row.quantity);
    const delta = next - row.quantity;
    if (delta === 0) throw new HttpError(400, 'That would not change the stock');
    await db.run('UPDATE inventory SET quantity = ? WHERE product_id = ? AND color_id = ? AND size_id = ?', next, t.productId, t.colorId, t.sizeId);
    await logMovement({ productId: t.productId, productName: row.name, sku: row.sku, color: row.color, size: row.size, change: delta, quantityAfter: next, actor: actorOf(req), ...meta });
    return { quantity: next, change: delta, status: stockStatus(next, await lowStockThreshold()) };
  });
}

router.post('/receive', async (req, res) => {
  const d = parse(target.extend({ quantity: qty.refine((n) => n > 0, 'Enter how many pairs you received'), note }), req.body);
  res.status(201).json(await change(req, d, (cur) => cur + d.quantity, { type: 'RECEIVE', reason: 'Stock received', note: d.note }));
});

const adjustSchema = target.extend({
  mode: z.enum(['DECREASE', 'INCREASE', 'SET'], { error: 'Choose how to adjust' }),
  quantity: qty,
  reason: z.enum(Object.keys(REASONS), { error: 'Choose a reason' }),
  note,
});
router.post('/adjust', async (req, res) => {
  const d = parse(adjustSchema, req.body);
  if (REASONS[d.reason] && REASONS[d.reason] !== d.mode) {
    throw new HttpError(400, `“${d.reason}” must ${REASONS[d.reason] === 'DECREASE' ? 'reduce' : 'increase'} stock`);
  }
  if (NOTE_REQUIRED.has(d.reason) && !d.note) throw new HttpError(400, `Add a note explaining “${d.reason}”`);
  const compute = (cur) => {
    const next = d.mode === 'SET' ? d.quantity : d.mode === 'INCREASE' ? cur + d.quantity : cur - d.quantity;
    if (next < 0) throw new HttpError(400, `You cannot remove ${d.quantity} — only ${cur} in stock`);
    return next;
  };
  res.status(201).json(await change(req, d, compute, { type: 'ADJUST', reason: d.reason, note: d.note }));
});

router.get('/reasons', (_req, res) => res.json({ reasons: Object.entries(REASONS).map(([name, mode]) => ({ name, mode, noteRequired: NOTE_REQUIRED.has(name) })) }));

/* ------------------------------------------------------------------ history */
router.get('/history', async (req, res) => {
  const where = [], args = [];
  const q = String(req.query.q || '').trim();
  if (q) {
    const like = `%${q.replace(/[%_\\]/g, '\\$&')}%`;
    where.push(`(product_name ILIKE ? ESCAPE '\\' OR sku ILIKE ? ESCAPE '\\' OR admin_name ILIKE ? ESCAPE '\\' OR note ILIKE ? ESCAPE '\\')`);
    args.push(like, like, like, like);
  }
  if (['INITIAL', 'RECEIVE', 'ADJUST', 'EDIT', 'REMOVED'].includes(String(req.query.type))) { where.push('type = ?'); args.push(req.query.type); }
  if (req.query.reason) { where.push('reason = ?'); args.push(String(req.query.reason)); }
  if (req.query.productId && /^\d+$/.test(String(req.query.productId))) { where.push('product_id = ?'); args.push(Number(req.query.productId)); }
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(req.query.from))) { where.push('created_at >= ?::date'); args.push(req.query.from); }
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(req.query.to))) { where.push("created_at < (?::date + 1)"); args.push(req.query.to); }
  const w = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));
  const total = (await db.get(`SELECT COUNT(*) n FROM stock_movements ${w}`, ...args)).n;
  const rows = await db.all(`SELECT id, product_id AS "productId", product_name AS product, sku, color, size, change, quantity_after AS "quantityAfter",
      type, reason, note, admin_name AS admin, created_at AS "createdAt"
    FROM stock_movements ${w} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`, ...args, limit, (page - 1) * limit);
  res.json({ rows, total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) });
});

// Fast movers: units recorded as “Sold” over the last N days, by size and by product.
router.get('/movers', async (req, res) => {
  const days = Math.min(365, Math.max(1, parseInt(req.query.days, 10) || 30));
  const base = `FROM stock_movements WHERE type = 'ADJUST' AND reason = 'Sold' AND change < 0 AND created_at >= now() - (?::int * interval '1 day')`;
  const [bySize, byProduct] = await Promise.all([
    db.all(`SELECT size AS label, SUM(-change) AS units ${base} GROUP BY size ORDER BY units DESC, size LIMIT 10`, days),
    db.all(`SELECT product_name AS label, sku, SUM(-change) AS units ${base} GROUP BY product_name, sku ORDER BY units DESC LIMIT 10`, days),
  ]);
  res.json({ days, bySize, byProduct });
});

/* ------------------------------------------------------------------ reorder */
router.get('/reorder', async (req, res) => {
  const th = await lowStockThreshold();
  const settings = await getSettings();
  const targetQty = Math.max(1, parseInt(settings.reorder_target, 10) || 20);
  const where = ['p.active = 1', 'i.quantity <= ?'], args = [th];
  const status = String(req.query.status || '');
  if (status === 'OUT') where.push('i.quantity = 0');
  if (status === 'LOW') where.push('i.quantity > 0');
  if (req.query.brand) { where.push('b.slug = ?'); args.push(String(req.query.brand)); }
  const gender = { men: 'men', women: 'women', kids: 'kids' }[String(req.query.gender)];
  if (gender) { where.push('p.gender = ?'); args.push(gender); }
  const rows = await db.all(`
    SELECT b.name AS brand, p.id AS "productId", p.name AS product, p.sku, p.gender, c.name AS category, co.name AS color, s.label AS size,
           i.quantity, p.cost_price AS "costPrice",
           COALESCE((SELECT SUM(-m.change) FROM stock_movements m WHERE m.product_id = p.id AND m.color = co.name AND m.size = s.label
             AND m.type = 'ADJUST' AND m.reason = 'Sold' AND m.change < 0 AND m.created_at >= now() - interval '30 days'), 0) AS "sold30"
    FROM inventory i JOIN products p ON p.id = i.product_id JOIN brands b ON b.id = p.brand_id JOIN categories c ON c.id = p.category_id
    JOIN colors co ON co.id = i.color_id JOIN sizes s ON s.id = i.size_id
    WHERE ${where.join(' AND ')}
    ORDER BY b.name, p.name, co.name, s.sort`, ...args);
  res.json({
    threshold: th, target: targetQty,
    rows: rows.map((r) => ({ ...r, status: stockStatus(r.quantity, th), suggested: Math.max(targetQty - r.quantity, 0) })),
  });
});

module.exports = router;

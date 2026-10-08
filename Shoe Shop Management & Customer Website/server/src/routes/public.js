const express = require('express');
const { db, getSettings, lowStockThreshold } = require('../db');
const { HttpError } = require('../http');
const { canSeeWholesale } = require('../auth');
const svc = require('../productService');

const router = express.Router();

// Only fields the storefront needs. Never expose the low-stock threshold etc.
router.get('/settings', async (_req, res) => {
  const s = await getSettings();
  res.json({
    shopName: s.shop_name, logoUrl: s.logo_url, phone: s.phone, address: s.address, whatsapp: s.whatsapp,
    facebookUrl: s.facebook_url, instagramUrl: s.instagram_url, youtubeUrl: s.youtube_url,
    wholesaleEnabled: s.wholesale_enabled !== 'false', wholesaleNote: s.wholesale_note,
  });
});

router.get('/brands', async (_req, res) => {
  res.json({
    brands: await db.all(`
      SELECT b.id, b.name, b.slug, b.logo_url AS "logoUrl",
             (SELECT COUNT(*) FROM products p WHERE p.brand_id = b.id AND p.active = 1) AS "productCount"
      FROM brands b WHERE b.active = 1 ORDER BY b.name`),
  });
});

router.get('/categories', async (_req, res) => {
  const cats = await db.all(`
    SELECT c.id, c.gender, c.name, c.slug, c.image_url AS "imageUrl",
           (SELECT COUNT(*) FROM products p JOIN brands b ON b.id = p.brand_id WHERE p.category_id = c.id AND p.active = 1 AND b.active = 1) AS "productCount"
    FROM categories c WHERE c.active = 1 ORDER BY c.sort_order, c.name`);
  const subs = await db.all('SELECT id, category_id AS "categoryId", name, slug FROM subcategories WHERE active = 1 ORDER BY name');
  for (const c of cats) c.subcategories = subs.filter((s) => s.categoryId === c.id);
  res.json({ categories: cats });
});

// Facets for the filter UI (only from products visible to the public).
router.get('/filters', async (_req, res) => {
  const vis = `p.active = 1 AND b.active = 1 AND c.active = 1`;
  const join = `FROM inventory i JOIN products p ON p.id = i.product_id JOIN brands b ON b.id = p.brand_id JOIN categories c ON c.id = p.category_id`;
  const [sizes, colors, mrp] = await Promise.all([
    db.all(`SELECT DISTINCT s.label, s.sort FROM sizes s JOIN inventory i ON i.size_id = s.id JOIN products p ON p.id = i.product_id JOIN brands b ON b.id = p.brand_id JOIN categories c ON c.id = p.category_id WHERE ${vis} ORDER BY s.sort`),
    db.all(`SELECT DISTINCT co.name FROM colors co JOIN inventory i ON i.color_id = co.id JOIN products p ON p.id = i.product_id JOIN brands b ON b.id = p.brand_id JOIN categories c ON c.id = p.category_id WHERE ${vis} ORDER BY co.name`),
    db.get(`SELECT MIN(COALESCE(i.mrp, p.mrp)) AS min, MAX(COALESCE(i.mrp, p.mrp)) AS max ${join} WHERE ${vis}`),
  ]);
  res.json({ sizes: sizes.map((r) => r.label), colors: colors.map((r) => r.name), mrp });
});

router.get('/home', async (req, res) => {
  const wholesale = await canSeeWholesale(req);
  const featured = (await svc.listProducts({ featured: '1', sort: 'newest', limit: 8 }, { wholesale })).items;
  const newArrivals = (await svc.listProducts({ sort: 'newest', limit: 8 }, { wholesale })).items;
  const popular = await db.all(`
    SELECT c.id, c.gender, c.name, c.slug, c.image_url AS "imageUrl", COUNT(p.id) AS "productCount"
    FROM categories c JOIN products p ON p.category_id = c.id AND p.active = 1
    JOIN brands b ON b.id = p.brand_id AND b.active = 1
    WHERE c.active = 1 GROUP BY c.id ORDER BY COUNT(p.id) DESC, c.name LIMIT 6`);
  const brands = await db.all('SELECT id, name, slug, logo_url AS "logoUrl" FROM brands WHERE active = 1 ORDER BY name');
  res.json({ featured, newArrivals, popularCategories: popular, brands });
});

router.get('/products', async (req, res) => {
  res.json(await svc.listProducts(req.query, { wholesale: await canSeeWholesale(req) }));
});

router.get('/products/:slug', async (req, res) => {
  const wholesale = await canSeeWholesale(req);
  const p = await svc.getProduct('p.slug = ?', String(req.params.slug), { wholesale });
  if (!p) throw new HttpError(404, 'Product not found');
  res.json({ product: p, related: await svc.related(p, { wholesale }) });
});

module.exports = router;

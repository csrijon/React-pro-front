const express = require('express');
const { db, getSettings, lowStockThreshold } = require('../db');
const { HttpError } = require('../http');
const { canSeeWholesale } = require('../auth');
const svc = require('../productService');

const router = express.Router();

// Public catalogue metadata (shop settings, categories, brands, filter facets) is identical for
// every visitor, so let the browser reuse it for a short window instead of re-requesting it on
// every page navigation. Product/stock data is never cached this way. Admin edits appear within
// this window (and the in-process settings cache is invalidated immediately on save).
const PUBLIC_META_MAX_AGE = 30;
const cacheMeta = (res) => res.set('Cache-Control', `public, max-age=${PUBLIC_META_MAX_AGE}`);

// Only fields the storefront needs. Never expose the low-stock threshold etc.
router.get('/settings', async (_req, res) => {
  const s = await getSettings();
  cacheMeta(res);
  res.json({
    shopName: s.shop_name, logoUrl: svc.usableImageUrl(s.logo_url), phone: s.phone, address: s.address, whatsapp: s.whatsapp,
    facebookUrl: s.facebook_url, instagramUrl: s.instagram_url, youtubeUrl: s.youtube_url,
    wholesaleEnabled: s.wholesale_enabled !== 'false', wholesaleNote: s.wholesale_note,
    globalDiscountEnabled: s.global_discount_enabled === 'true', globalDiscountPercent: Number(s.global_discount_percent) || 0,
  });
});

router.get('/brands', async (_req, res) => {
  const brands = await db.all(`
      SELECT b.id, b.name, b.slug, b.logo_url AS "logoUrl",
             (SELECT COUNT(*) FROM products p WHERE p.brand_id = b.id AND p.active = 1) AS "productCount"
      FROM brands b WHERE b.active = 1 ORDER BY b.name`);
  cacheMeta(res);
  res.json({ brands: brands.map((b) => ({ ...b, logoUrl: svc.usableImageUrl(b.logoUrl) })) });
});

router.get('/categories', async (_req, res) => {
  // Fall back to a real product photo from the category when no category image is set, so the
  // tiles always show actual catalogue photography rather than a placeholder.
  const [cats, subs] = await Promise.all([
    db.all(`
    SELECT c.id, c.gender, c.name, c.slug,
           c.image_url AS "categoryImage",
           (SELECT pi.url FROM product_images pi JOIN products p2 ON p2.id = pi.product_id
             JOIN brands b2 ON b2.id = p2.brand_id WHERE p2.category_id = c.id AND p2.active = 1 AND b2.active = 1
             ORDER BY (pi.url LIKE 'https://%') DESC, p2.created_at DESC, pi.position LIMIT 1) AS "fallbackImage",
           (SELECT COUNT(*) FROM products p JOIN brands b ON b.id = p.brand_id WHERE p.category_id = c.id AND p.active = 1 AND b.active = 1) AS "productCount"
    FROM categories c WHERE c.active = 1 ORDER BY c.sort_order, c.name`),
    db.all('SELECT id, category_id AS "categoryId", name, slug FROM subcategories WHERE active = 1 ORDER BY name'),
  ]);
  for (const c of cats) {
    c.imageUrl = svc.usableImageUrl(c.categoryImage) || svc.usableImageUrl(c.fallbackImage);
    delete c.categoryImage;
    delete c.fallbackImage;
    c.subcategories = subs.filter((s) => s.categoryId === c.id);
  }
  cacheMeta(res);
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
  cacheMeta(res);
  res.json({ sizes: sizes.map((r) => r.label), colors: colors.map((r) => r.name), mrp });
});

router.get('/home', async (req, res) => {
  try {
  const wholesale = await canSeeWholesale(req);
  // Four independent sections; run them together so the homepage costs one wait, not four
  // sequential waits, against the remote database.
  const [featuredRes, newArrivalsRes, popular, brands] = await Promise.all([
    svc.listProducts({ featured: '1', sort: 'newest', limit: 8 }, { wholesale }),
    svc.listProducts({ sort: 'newest', limit: 8 }, { wholesale }),
    db.all(`
    SELECT c.id, c.gender, c.name, c.slug,
           c.image_url AS "categoryImage",
           (SELECT pi.url FROM product_images pi JOIN products p2 ON p2.id = pi.product_id
             JOIN brands b2 ON b2.id = p2.brand_id WHERE p2.category_id = c.id AND p2.active = 1 AND b2.active = 1
             ORDER BY (pi.url LIKE 'https://%') DESC, p2.created_at DESC, pi.position LIMIT 1) AS "fallbackImage",
           COUNT(p.id) AS "productCount"
    FROM categories c JOIN products p ON p.category_id = c.id AND p.active = 1
    JOIN brands b ON b.id = p.brand_id AND b.active = 1
    WHERE c.active = 1 GROUP BY c.id ORDER BY COUNT(p.id) DESC, c.name LIMIT 6`),
    db.all('SELECT id, name, slug, logo_url AS "logoUrl" FROM brands WHERE active = 1 ORDER BY name'),
  ]);
  const popularCategories = popular.map((c) => ({
    id: c.id, gender: c.gender, name: c.name, slug: c.slug, productCount: c.productCount,
    imageUrl: svc.usableImageUrl(c.categoryImage) || svc.usableImageUrl(c.fallbackImage),
  }));
  res.json({
    featured: featuredRes.items, newArrivals: newArrivalsRes.items, popularCategories,
    brands: brands.map((b) => ({ ...b, logoUrl: svc.usableImageUrl(b.logoUrl) })),
  });
  } catch (err) {
    console.error('[home error]', err.message || err);
    res.status(500).json({ error: 'Something went wrong on the server' });
  }
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

// Idempotent bootstrap: creates the admin account (always) and demo catalogue data (only when the DB has no products).
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const config = require('./config');
const { db, init, slugify } = require('./db');
const { saveProduct, productSchema } = require('./productService');

async function ensureAdmin() {
  const existing = await db.get("SELECT 1 FROM users WHERE role = 'ADMIN'");
  if (existing) return;
  let pw = config.adminPassword;
  let generated = false;
  if (!pw) {
    if (config.isProd) { console.error('FATAL: set ADMIN_PASSWORD to create the first admin in production.'); process.exit(1); }
    pw = crypto.randomBytes(9).toString('base64url');
    generated = true;
  }
  await db.run("INSERT INTO users (username, password_hash, role) VALUES (?, ?, 'ADMIN')", config.adminUsername, bcrypt.hashSync(pw, 12));
  console.log(`Created admin user "${config.adminUsername}".`);
  if (generated) console.log(`Generated admin password (shown once, set ADMIN_PASSWORD to choose your own): ${pw}`);
}

async function seedCatalogue() {
  if (await db.get('SELECT 1 FROM products')) return;
  for (const b of ['Paragon', 'Ajanta', "Khadim's", 'Walkaroo', 'VKC']) {
    await db.run('INSERT INTO brands (name, slug) VALUES (?, ?) ON CONFLICT DO NOTHING', b, slugify(b));
  }

  const cat = (g, n, slug, i) => db.run('INSERT INTO categories (gender, name, slug, sort_order) VALUES (?,?,?,?) ON CONFLICT DO NOTHING', g, n, slug, i);
  const tree = {
    men: ['Formal Shoes', 'Sports Shoes', 'Sandals', 'Slippers', 'School Shoes'],
    women: ['Sandals', 'Flats', 'Heels', 'Slippers', 'Sports Shoes'],
    kids: ['School Shoes', 'Sports Shoes', 'Sandals', 'Slippers'],
  };
  for (const [g, names] of Object.entries(tree)) for (const [i, n] of names.entries()) await cat(g, n, slugify(n), i);

  const bid = async (n) => (await db.get('SELECT id FROM brands WHERE name = ?', n)).id;
  const cid = async (g, n) => (await db.get('SELECT id FROM categories WHERE gender = ? AND name = ?', g, n)).id;
  const sizes = (list, q) => list.map((s, i) => ({ size: String(s), quantity: q[i % q.length] }));

  const demo = [
    ['Paragon Runner Pro', 'PAR-SP-101', 'Paragon', 'men', 'Sports Shoes', 1299, 820, true, [['Black', [6, 7, 8, 9, 10], [10, 20, 15, 8, 3]], ['White', [6, 7, 8, 9, 10], [5, 12, 10, 4, 0]]]],
    ['Paragon Flex Trainer', 'PAR-SP-102', 'Paragon', 'men', 'Sports Shoes', 899, 560, false, [['Navy', [7, 8, 9], [14, 9, 4]]]],
    ['Khadim\'s Oxford Classic', 'KHA-FM-201', "Khadim's", 'men', 'Formal Shoes', 1799, 1150, true, [['Black', [7, 8, 9, 10], [6, 10, 10, 4]], ['Brown', [7, 8, 9, 10], [4, 8, 5, 2]]]],
    ['Walkaroo Comfort Slide', 'WAL-SL-301', 'Walkaroo', 'men', 'Slippers', 349, 210, false, [['Blue', [6, 7, 8, 9], [30, 40, 25, 12]], ['Grey', [6, 7, 8, 9], [20, 25, 15, 0]]]],
    ['VKC Pride Sandal', 'VKC-SD-401', 'VKC', 'men', 'Sandals', 599, 380, false, [['Tan', [6, 7, 8, 9], [10, 12, 9, 5]]]],
    ['Ajanta Elegance Heel', 'AJA-HL-501', 'Ajanta', 'women', 'Heels', 999, 640, true, [['Black', [4, 5, 6, 7], [8, 12, 10, 3]], ['Beige', [4, 5, 6, 7], [5, 7, 6, 2]]]],
    ['Khadim\'s Daily Flats', 'KHA-FL-502', "Khadim's", 'women', 'Flats', 449, 280, true, [['Pink', [4, 5, 6, 7], [15, 18, 12, 6]]]],
    ['Walkaroo Ladies Sandal', 'WAL-SD-503', 'Walkaroo', 'women', 'Sandals', 399, 240, false, [['Gold', [4, 5, 6, 7], [10, 10, 8, 4]]]],
    ['Paragon Kids School Shoe', 'PAR-KS-601', 'Paragon', 'kids', 'School Shoes', 699, 440, true, [['Black', [1, 2, 3, 4, 5], [12, 15, 14, 10, 6]]]],
    ['Ajanta Kids Sport', 'AJA-KP-602', 'Ajanta', 'kids', 'Sports Shoes', 549, 340, false, [['Red', [1, 2, 3], [8, 8, 4]], ['Blue', [1, 2, 3], [6, 9, 0]]]],
  ];
  for (const [name, sku, brandName, g, catName, mrp, ws, featured, variants] of demo) {
    await saveProduct(productSchema.parse({
      name, sku, brandId: await bid(brandName), categoryId: await cid(g, catName), mrp, wholesalePrice: ws, costPrice: Math.round(ws * 0.65), featured, active: true,
      description: `${name} from ${brandName}. Durable, comfortable and built for everyday wear.`,
      variants: variants.map(([color, sz, q]) => ({ color, sizes: sizes(sz, q) })),
    }), null);
  }
  console.log(`Seeded ${demo.length} demo products.`);
}

async function run() { await init(); await ensureAdmin(); await seedCatalogue(); }
if (require.main === module) {
  run().then(() => require('./db').close()).catch((err) => { console.error(err); process.exit(1); });
}
module.exports = { run };

process.env.NODE_ENV = 'test';
// Tests run in their own throwaway schema inside the database given by TEST_DATABASE_URL (or DATABASE_URL); it is dropped at the end.
process.env.DB_SCHEMA = `shoe_test_${process.pid}`;
if (process.env.TEST_DATABASE_URL) process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
process.env.UPLOAD_DIR = require('path').join(require('os').tmpdir(), `shoe-up-${process.pid}`);
process.env.ADMIN_PASSWORD = 'TestAdmin#123';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/index');
const dbModule = require('../src/db');

let base, server;
test.before(async () => {
  await require('../src/seed').run();
  await new Promise((r) => { server = createApp().listen(0, () => { base = `http://127.0.0.1:${server.address().port}`; r(); }); });
});
test.after(async () => {
  server.close();
  await dbModule.close({ dropSchema: true });
});

// Minimal cookie-jar client
function client() {
  let cookie = '';
  const call = async (method, url, body) => {
    const res = await fetch(base + url, { method, headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) }, body: body ? JSON.stringify(body) : undefined });
    const sc = res.headers.get('set-cookie');
    if (sc) cookie = sc.split(';')[0].endsWith('=') ? '' : sc.split(';')[0];
    let data = null; try { data = await res.json(); } catch {}
    return { status: res.status, data };
  };
  return { get: (u) => call('GET', u), post: (u, b) => call('POST', u, b || {}), put: (u, b) => call('PUT', u, b), patch: (u, b) => call('PATCH', u, b), del: (u) => call('DELETE', u) };
}
const leaks = (obj) => /wholesale|"ws"|min_ws/i.test(JSON.stringify(obj)) && !/wholesaleEnabled|wholesaleNote|wholesaleAccess/.test(JSON.stringify(obj).replace(/wholesale(Enabled|Note|Access)/g, ''));
const hasWholesaleKey = (obj) => JSON.stringify(obj).replace(/wholesale(Enabled|Note|Access)/g, '').toLowerCase().includes('wholesale');

const reg = (n) => ({ shopName: `Shop ${n}`, ownerName: `Owner ${n}`, mobile: `98765432${String(10 + n)}`, password: 'password123' });

test('anonymous users never receive wholesale prices on any public endpoint', async () => {
  const c = client();
  const list = await c.get('/api/products?limit=50');
  assert.equal(list.status, 200);
  assert.ok(list.data.items.length >= 10);
  assert.equal(hasWholesaleKey(list.data), false);
  const slug = list.data.items[0].slug;
  const detail = await c.get(`/api/products/${slug}`);
  assert.equal(hasWholesaleKey(detail.data), false, 'detail + related must not include wholesale');
  assert.equal(hasWholesaleKey((await c.get('/api/home')).data), false);
  assert.equal(hasWholesaleKey((await c.get('/api/products?sort=price_asc')).data), false);
  assert.equal((await c.get('/api/admin/products')).status, 401);
  assert.equal((await c.get('/api/admin/customers')).status, 401);
});

test('customer lifecycle: pending -> approved sees prices -> suspended loses them', async () => {
  const admin = client();
  assert.equal((await admin.post('/api/auth/login', { username: 'admin', password: 'TestAdmin#123' })).status, 200);

  const cust = client();
  const r = await cust.post('/api/auth/register', reg(1));
  assert.equal(r.status, 201);
  assert.equal(r.data.user.status, 'PENDING');
  assert.equal((await cust.post('/api/auth/register', reg(1))).status, 409, 'duplicate mobile');

  const slug = (await cust.get('/api/products')).data.items[0].slug;
  assert.equal(hasWholesaleKey((await cust.get(`/api/products/${slug}`)).data), false, 'pending customer must not see wholesale');
  assert.equal((await cust.get('/api/admin/dashboard')).status, 403, 'customer cannot hit admin API');

  const pending = (await admin.get('/api/admin/customers?status=PENDING')).data.customers;
  const me = pending.find((c) => c.mobile === reg(1).mobile);
  assert.ok(me);

  assert.equal((await admin.patch(`/api/admin/customers/${me.id}/status`, { status: 'APPROVED' })).status, 200);
  const d = (await cust.get(`/api/products/${slug}`)).data;
  assert.ok(d.product.wholesalePrice > 0 || d.product.variants[0].sizes[0].wholesalePrice > 0, 'approved sees wholesale');
  assert.equal(typeof (await cust.get('/api/products')).data.items[0].wholesale.min, 'number');
  // approved customers still must not see exact stock quantities or admin fields
  assert.equal(d.product.variants[0].sizes[0].quantity, undefined);

  await admin.patch(`/api/admin/customers/${me.id}/status`, { status: 'SUSPENDED' });
  assert.equal(hasWholesaleKey((await cust.get(`/api/products/${slug}`)).data), false, 'suspension takes effect on the existing session');
  await admin.patch(`/api/admin/customers/${me.id}/status`, { status: 'APPROVED' });
  assert.ok(hasWholesaleKey((await cust.get(`/api/products/${slug}`)).data));

  // disabling wholesale globally hides it from customers
  const s = (await admin.get('/api/admin/settings')).data.settings;
  await admin.put('/api/admin/settings', { ...s, wholesaleEnabled: false });
  assert.equal(hasWholesaleKey((await cust.get(`/api/products/${slug}`)).data), false);
  await admin.put('/api/admin/settings', { ...s, wholesaleEnabled: true });
});

test('auth: validation, wrong password, tampered cookie', async () => {
  const c = client();
  assert.equal((await c.post('/api/auth/register', { shopName: 'x' })).status, 400);
  assert.equal((await c.post('/api/auth/register', { ...reg(2), password: 'short' })).status, 400);
  assert.equal((await c.post('/api/auth/register', { ...reg(2), mobile: '12ab' })).status, 400);
  assert.equal((await c.post('/api/auth/login', { username: 'admin', password: 'nope' })).status, 401);
  assert.equal((await c.post('/api/auth/login', { username: 'ghost', password: 'nope' })).status, 401);
  const res = await fetch(base + '/api/admin/dashboard', { headers: { cookie: 'shoe_session=forged.token.value' } });
  assert.equal(res.status, 401);
});

test('filters combine (AND) and respect same-variant semantics', async () => {
  const c = client();
  const r = await c.get('/api/products?gender=men&category=sports-shoes&brand=paragon&size=8&minMrp=500&maxMrp=1500');
  assert.deepEqual(r.data.items.map((p) => p.name).sort(), ['Paragon Flex Trainer', 'Paragon Runner Pro']);
  assert.ok(r.data.items.every((p) => p.gender === 'men' && p.brand.slug === 'paragon' && p.sizes.includes('8')));
  assert.equal((await c.get('/api/products?gender=men&category=sports-shoes&brand=paragon&size=8&maxMrp=1000')).data.total, 1);
  assert.equal((await c.get('/api/products?gender=women&brand=paragon')).data.total, 0);
  assert.equal((await c.get('/api/products?color=white&size=10&availability=in_stock')).data.total, 0, 'white size 10 has 0 stock');
  assert.equal((await c.get('/api/products?color=black&size=10&availability=in_stock&gender=men')).data.items.length, 2);
  assert.equal((await c.get('/api/products?featured=1')).data.items.every((p) => p.featured), true);
  // search by name, sku, brand, gender word
  assert.equal((await c.get('/api/products?q=PAR-SP-101')).data.total, 1);
  assert.ok((await c.get('/api/products?q=khadim')).data.total === 2);
  const womenSearch = (await c.get('/api/products?q=women')).data.items;
  assert.ok(womenSearch.length && womenSearch.every((p) => p.gender === 'women'));
  const menSearch = (await c.get('/api/products?q=men')).data.items;
  assert.ok(menSearch.every((p) => p.gender === 'men'), '"men" must not match women');
  // SQL-injection-ish input is harmless
  assert.equal((await c.get(`/api/products?q=${encodeURIComponent("' OR 1=1 --")}`)).status, 200);
  // sorting
  const asc = (await c.get('/api/products?sort=price_asc&limit=50')).data.items.map((p) => p.mrp.min);
  assert.deepEqual(asc, [...asc].sort((a, b) => a - b));
  const desc = (await c.get('/api/products?sort=price_desc&limit=50')).data.items.map((p) => p.mrp.min);
  assert.deepEqual(desc, [...desc].sort((a, b) => b - a));
});

test('inventory totals are computed, never entered', async () => {
  const admin = client();
  await admin.post('/api/auth/login', { username: 'admin', password: 'TestAdmin#123' });
  const p = (await admin.get('/api/admin/products?q=PAR-SP-101')).data.items[0];
  const full = (await admin.get(`/api/admin/products/${p.id}`)).data.product;
  const totals = Object.fromEntries(full.variants.map((v) => [v.color, v.total]));
  assert.deepEqual(totals, { Black: 56, White: 31 });
  assert.equal(full.totalStock, 87);

  // quick-adjust updates totals
  const row = (await admin.get('/api/admin/inventory?q=PAR-SP-101&color=White&size=10')).data.rows[0];
  assert.equal(row.status, 'OUT');
  const t = { productId: row.productId, colorId: row.colorId, sizeId: row.sizeId };
  assert.equal((await admin.post('/api/admin/stock/receive', { ...t, quantity: 3 })).status, 201);
  assert.equal((await admin.get(`/api/admin/products/${p.id}`)).data.product.totalStock, 90);
  assert.equal((await admin.post('/api/admin/stock/receive', { ...t, quantity: -1 })).status, 400);

  const grouped = (await admin.get('/api/admin/inventory?groupBy=brand')).data;
  const sum = grouped.rows.reduce((a, r) => a + r.units, 0);
  assert.equal(sum, grouped.summary.units);
});

test('product create/update validation and rules', async () => {
  const admin = client();
  await admin.post('/api/auth/login', { username: 'admin', password: 'TestAdmin#123' });
  const brands = (await admin.get('/api/admin/brands')).data.brands;
  const cats = (await admin.get('/api/admin/categories')).data.categories;
  const menSports = cats.find((c) => c.gender === 'men' && c.name === 'Sports Shoes');
  const good = { name: 'Test Shoe X', sku: 'TST-1', brandId: brands[0].id, categoryId: menSports.id, mrp: 999, wholesalePrice: 600, variants: [{ color: 'Black', sizes: [{ size: '6', quantity: 10 }, { size: '7', quantity: 20 }] }, { color: 'White', sizes: [{ size: '6', quantity: 5 }] }] };

  assert.equal((await admin.post('/api/admin/products', { ...good, variants: [] })).status, 400, 'colour required');
  assert.equal((await admin.post('/api/admin/products', { ...good, variants: [{ color: 'Black', sizes: [] }] })).status, 400, 'size required');
  assert.equal((await admin.post('/api/admin/products', { ...good, wholesalePrice: 2000 })).status, 400, 'wholesale > mrp');
  assert.equal((await admin.post('/api/admin/products', { ...good, variants: [{ color: 'Black', sizes: [{ size: '6', quantity: -4 }] }] })).status, 400);
  assert.equal((await admin.post('/api/admin/products', { ...good, variants: [{ color: 'Black', sizes: [{ size: '6', quantity: 1 }, { size: '6', quantity: 2 }] }] })).status, 400, 'duplicate size');
  assert.equal((await admin.post('/api/admin/products', { ...good, images: ['javascript:alert(1)'] })).status, 400);
  const created = await admin.post('/api/admin/products', good);
  assert.equal(created.status, 201);
  assert.equal(created.data.product.totalStock, 35);
  assert.equal((await admin.post('/api/admin/products', good)).status, 409, 'duplicate SKU');

  const slug = created.data.product.slug;
  // inactive products vanish from the storefront
  await admin.patch(`/api/admin/products/${created.data.product.id}/active`, { active: false });
  assert.equal((await client().get(`/api/products/${slug}`)).status, 404);
  await admin.patch(`/api/admin/products/${created.data.product.id}/active`, { active: true });
  assert.equal((await client().get(`/api/products/${slug}`)).status, 200);

  // edit: replace variants
  const upd = await admin.put(`/api/admin/products/${created.data.product.id}`, { ...good, variants: [{ color: 'Red', sizes: [{ size: '8', quantity: 2 }] }] });
  assert.equal(upd.data.product.totalStock, 2);
  assert.equal(upd.data.product.slug, slug, 'slug is stable');

  // categories / brands protected by FK
  assert.equal((await admin.del(`/api/admin/categories/${menSports.id}`)).status, 409);
  assert.equal((await admin.del(`/api/admin/brands/${brands[0].id}`)).status, 409);
  assert.equal((await admin.del(`/api/admin/products/${created.data.product.id}`)).status, 200);

  // deactivated category/brand hides products and category list
  const cat = await admin.post('/api/admin/categories', { gender: 'kids', name: 'Party Shoes' });
  assert.equal(cat.status, 201);
  assert.equal((await admin.post('/api/admin/categories', { gender: 'kids', name: 'party shoes' })).status, 409);
  assert.ok((await client().get('/api/categories')).data.categories.some((c) => c.name === 'Party Shoes'));
  await admin.put(`/api/admin/categories/${cat.data.id}`, { gender: 'kids', name: 'Party Shoes', active: false });
  assert.ok(!(await client().get('/api/categories')).data.categories.some((c) => c.name === 'Party Shoes'));
  assert.equal((await admin.del(`/api/admin/categories/${cat.data.id}`)).status, 200);
});

test('related products are same-gender and exclude the product itself', async () => {
  const c = client();
  const d = (await c.get('/api/products/paragon-runner-pro')).data;
  assert.ok(d.related.length > 0);
  assert.ok(d.related.every((p) => p.gender === 'men' && p.slug !== 'paragon-runner-pro'));
  assert.equal(d.related[0].category.slug, 'sports-shoes');
  assert.equal((await c.get('/api/products/nope')).status, 404);
});

test('customer profile and password change', async () => {
  const c = client();
  await c.post('/api/auth/register', reg(3));
  assert.equal((await c.put('/api/auth/profile', { shopName: 'New Name', ownerName: 'Owner', email: 'a@b.co' })).data.user.shopName, 'New Name');
  assert.equal((await c.put('/api/auth/password', { currentPassword: 'wrong', newPassword: 'newpassword1' })).status, 400);
  assert.equal((await c.put('/api/auth/password', { currentPassword: 'password123', newPassword: 'newpassword1' })).status, 200);
  assert.equal((await client().post('/api/auth/login', { username: reg(3).mobile, password: 'newpassword1' })).status, 200);
  await c.post('/api/auth/logout');
  assert.equal((await c.get('/api/auth/me')).data.user, null);
});

test('settings validation', async () => {
  const admin = client();
  await admin.post('/api/auth/login', { username: 'admin', password: 'TestAdmin#123' });
  const s = (await admin.get('/api/admin/settings')).data.settings;
  assert.equal((await admin.put('/api/admin/settings', { ...s, facebookUrl: 'javascript:alert(1)' })).status, 400);
  assert.equal((await admin.put('/api/admin/settings', { ...s, facebookUrl: 'https://evil.com/x' })).status, 400);
  assert.equal((await admin.put('/api/admin/settings', { ...s, facebookUrl: 'https://facebook.com/shop', lowStockThreshold: 8 })).status, 200);
  assert.equal((await client().get('/api/settings')).data.facebookUrl, 'https://facebook.com/shop');
  assert.equal((await client().get('/api/settings')).data.lowStockThreshold, undefined);
});

test('cost price, profit and margin are admin-only and calculated', async () => {
  const admin = client();
  await admin.post('/api/auth/login', { username: 'admin', password: 'TestAdmin#123' });
  const list = (await admin.get('/api/admin/products?q=PAR-SP-102')).data.items[0];
  assert.equal(list.costPrice, 364);            // 560 * 0.65
  assert.equal(list.marginPct, 35);
  const dash = (await admin.get('/api/admin/dashboard')).data.products;
  assert.ok(dash.stockCost > 0 && dash.expectedProfit > 0);
  assert.equal(dash.marginPct, Math.round((dash.expectedProfit / (dash.expectedProfit + dash.stockCost)) * 1000) / 10);
  // never visible to the public, pending/approved customers included
  const anon = client();
  const pub = JSON.stringify([(await anon.get('/api/products')).data, (await anon.get('/api/products/paragon-runner-pro')).data, (await anon.get('/api/home')).data]);
  assert.ok(!/cost|margin/i.test(pub));
  const cust = client();
  await cust.post('/api/auth/register', { shopName: 'Cost Shop', ownerName: 'Cost Owner', mobile: '9876543299', password: 'password123' });
  const cid = (await admin.get('/api/admin/customers?q=9876543299')).data.customers[0].id;
  await admin.patch(`/api/admin/customers/${cid}/status`, { status: 'APPROVED' });
  assert.ok(!/cost|margin/i.test(JSON.stringify((await cust.get('/api/products/paragon-runner-pro')).data)));
  assert.equal((await cust.get('/api/admin/stock/history')).status, 403);
  assert.equal((await anon.get('/api/admin/stock/reorder')).status, 401);
});

test('stock history logs every change: receive, adjust, product edit, delete', async () => {
  const admin = client();
  await admin.post('/api/auth/login', { username: 'admin', password: 'TestAdmin#123' });
  const brands = (await admin.get('/api/admin/brands')).data.brands;
  const cats = (await admin.get('/api/admin/categories')).data.categories;
  const cat = cats.find((c) => c.gender === 'men' && c.name === 'Slippers');
  const body = { name: 'Ledger Shoe', sku: 'LED-1', brandId: brands[0].id, categoryId: cat.id, mrp: 500, wholesalePrice: 300, costPrice: 200,
    variants: [{ color: 'Black', sizes: [{ size: '7', quantity: 10 }, { size: '8', quantity: 4 }] }] };
  const created = (await admin.post('/api/admin/products', body)).data.product;
  const hist = async () => (await admin.get(`/api/admin/stock/history?productId=${created.id}&limit=100`)).data.rows;
  let h = await hist();
  assert.deepEqual(h.map((r) => [r.type, r.size, r.change, r.quantityAfter]).sort(), [['INITIAL', '7', 10, 10], ['INITIAL', '8', 4, 4]]);
  assert.ok(h.every((r) => r.admin === 'admin'));

  const v = created.variants[0], size7 = v.sizes.find((s) => s.size === '7');
  const t = { productId: created.id, colorId: v.colorId, sizeId: size7.sizeId };
  assert.deepEqual((await admin.post('/api/admin/stock/receive', { ...t, quantity: 5, note: 'Invoice 42' })).data.quantity, 15);
  assert.equal((await admin.post('/api/admin/stock/adjust', { ...t, mode: 'DECREASE', quantity: 3, reason: 'Sold' })).data.quantity, 12);
  assert.equal((await admin.post('/api/admin/stock/adjust', { ...t, mode: 'DECREASE', quantity: 99, reason: 'Sold' })).status, 400, 'cannot go negative');
  assert.equal((await admin.post('/api/admin/stock/adjust', { ...t, mode: 'INCREASE', quantity: 1, reason: 'Sold' })).status, 400, 'sold must reduce');
  assert.equal((await admin.post('/api/admin/stock/adjust', { ...t, mode: 'DECREASE', quantity: 1, reason: 'Lost / theft' })).status, 400, 'note required');
  assert.equal((await admin.post('/api/admin/stock/adjust', { ...t, mode: 'SET', quantity: 12, reason: 'Count correction' })).status, 400, 'no-op rejected');
  assert.equal((await admin.post('/api/admin/stock/adjust', { ...t, mode: 'SET', quantity: 10, reason: 'Count correction', note: 'recount' })).data.change, -2);
  assert.equal((await admin.post('/api/admin/stock/adjust', { ...t, mode: 'DECREASE', quantity: 2, reason: 'Lost / theft', note: 'missing from shelf' })).data.quantity, 8);

  // editing the product via the form is also tracked (size 8: 4 -> 9; size 7 removed)
  await admin.put(`/api/admin/products/${created.id}`, { ...body, variants: [{ color: 'Black', sizes: [{ size: '8', quantity: 9 }] }] });
  h = await hist();
  assert.ok(h.some((r) => r.type === 'EDIT' && r.size === '8' && r.change === 5));
  assert.ok(h.some((r) => r.type === 'REMOVED' && r.size === '7' && r.change === -8));
  assert.equal(h.filter((r) => r.type === 'RECEIVE')[0].note, 'Invoice 42');
  // running quantity is consistent: sum of changes for a size == its final quantity
  const net = (size) => h.filter((r) => r.size === size).reduce((a, r) => a + r.change, 0);
  assert.equal(net('7'), 0); assert.equal(net('8'), 9);

  const movers = (await admin.get('/api/admin/stock/movers?days=30')).data;
  assert.ok(movers.bySize.some((r) => r.label === '7' && r.units >= 3));

  // deleting logs the removal and history survives the product
  assert.equal((await admin.del(`/api/admin/products/${created.id}`)).status, 200);
  const after = (await admin.get('/api/admin/stock/history?q=LED-1&limit=100')).data.rows;
  assert.ok(after.some((r) => r.reason === 'Product deleted' && r.change === -9 && r.productId === null));
});

test('reorder report lists low/out sizes with suggested quantities', async () => {
  const admin = client();
  await admin.post('/api/auth/login', { username: 'admin', password: 'TestAdmin#123' });
  const r = (await admin.get('/api/admin/stock/reorder')).data;
  assert.equal(r.target, 20);
  assert.ok(r.rows.length > 0 && r.rows.every((x) => x.quantity <= r.threshold && x.suggested === Math.max(20 - x.quantity, 0)));
  assert.ok((await admin.get('/api/admin/stock/reorder?status=OUT')).data.rows.every((x) => x.quantity === 0));
  assert.ok((await admin.get('/api/admin/stock/reorder?status=LOW')).data.rows.every((x) => x.quantity > 0));
  assert.ok((await admin.get('/api/admin/stock/reorder?brand=paragon')).data.rows.every((x) => x.brand === 'Paragon'));
  const s = (await admin.get('/api/admin/settings')).data.settings;
  await admin.put('/api/admin/settings', { ...s, reorderTarget: 50 });
  assert.equal((await admin.get('/api/admin/stock/reorder')).data.target, 50);
});

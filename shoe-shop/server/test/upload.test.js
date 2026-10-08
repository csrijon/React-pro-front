process.env.NODE_ENV = 'test';
process.env.DB_SCHEMA = `shoe_up_${process.pid}`;
if (process.env.TEST_DATABASE_URL) process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
process.env.UPLOAD_DIR = require('path').join(require('os').tmpdir(), `shoe-up2-${process.pid}`);
process.env.ADMIN_PASSWORD = 'TestAdmin#123';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

// A fake Supabase Storage that records what the server sends it.
const received = [];
let failWith = null;
const fake = http.createServer((req, res) => {
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => {
    received.push({ method: req.method, url: req.url, auth: req.headers.authorization, type: req.headers['content-type'], size: Buffer.concat(chunks).length });
    res.statusCode = failWith || 200;
    res.end(JSON.stringify({ Key: 'ok' }));
  });
});

const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(40, 1)]);
let base, server, dbModule, cookie = '';

test.before(async () => {
  await new Promise((r) => fake.listen(0, '127.0.0.1', r));
  process.env.SUPABASE_URL = `http://127.0.0.1:${fake.address().port}/`;
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
  process.env.SUPABASE_BUCKET = 'shop-images';
  const { createApp } = require('../src/index');
  dbModule = require('../src/db');
  await require('../src/seed').run();
  await new Promise((r) => { server = createApp().listen(0, () => { base = `http://127.0.0.1:${server.address().port}`; r(); }); });
  const res = await fetch(`${base}/api/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username: 'admin', password: 'TestAdmin#123' }) });
  cookie = res.headers.get('set-cookie').split(';')[0];
});
test.after(async () => { server.close(); fake.close(); await dbModule.close({ dropSchema: true }); });

const send = (buf, type = 'image/png', name = 'a.png') => {
  const fd = new FormData();
  fd.append('files', new Blob([buf], { type }), name);
  return fetch(`${base}/api/admin/upload`, { method: 'POST', headers: { cookie }, body: fd });
};

test('uploads go to cloud storage and return a public https URL', async () => {
  const res = await send(PNG);
  assert.equal(res.status, 201);
  const { urls } = await res.json();
  assert.match(urls[0], new RegExp(`^http://127\\.0\\.0\\.1:${fake.address().port}/storage/v1/object/public/shop-images/[0-9a-f]{24}\\.png$`));
  const r = received.at(-1);
  assert.equal(r.method, 'POST');
  assert.match(r.url, /^\/storage\/v1\/object\/shop-images\/[0-9a-f]{24}\.png$/);
  assert.equal(r.auth, 'Bearer test-service-key');
  assert.equal(r.type, 'image/png');
  assert.equal(r.size, PNG.length);
  // nothing is written to local disk when cloud storage is on
  assert.equal(require('fs').existsSync(process.env.UPLOAD_DIR), false);
});

test('the stored cloud URL is accepted for brand logos', async () => {
  const { urls } = await (await send(PNG)).json();
  // Real Supabase URLs are https; the fake server here is plain http, so swap the scheme for this check.
  const httpsUrl = urls[0].replace(/^http:/, 'https:');
  const res = await fetch(`${base}/api/admin/brands`, { method: 'POST', headers: { cookie, 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Cloud Brand', logoUrl: httpsUrl }) });
  assert.equal(res.status, 201);
  assert.equal((await fetch(`${base}/api/admin/brands`, { method: 'POST', headers: { cookie, 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Bad Brand', logoUrl: 'javascript:alert(1)' }) })).status, 400);
});

test('bad files never reach storage', async () => {
  const before = received.length;
  assert.equal((await send(Buffer.from('<script>alert(1)</script>'))).status, 400);            // fake PNG
  assert.equal((await send(Buffer.from('<svg/>'), 'image/svg+xml', 'x.svg')).status, 400);     // wrong type
  assert.equal((await send(Buffer.alloc(6 * 1024 * 1024, 1))).status, 413);                     // too big
  const anon = new FormData(); anon.append('files', new Blob([PNG], { type: 'image/png' }), 'a.png');
  assert.equal((await fetch(`${base}/api/admin/upload`, { method: 'POST', body: anon })).status, 401);
  assert.equal(received.length, before);
});

test('storage errors become a clean 502, not a crash', async () => {
  failWith = 404;
  const res = await send(PNG);
  assert.equal(res.status, 502);
  assert.match((await res.json()).error, /bucket "shop-images" was not found/);
  failWith = 500;
  assert.equal((await send(PNG)).status, 502);
  failWith = null;
});

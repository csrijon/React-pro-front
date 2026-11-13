// Performance & caching regression tests: cache correctness (freshness, privacy, invalidation), payload size, index usage.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-test-secret-test-secret'
const base = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
process.env.MONGODB_URI = `${base.replace(/\/$/, '')}/motogear_perf_t_${Date.now()}`
process.env.UPLOAD_DIR = 'uploads-test'
process.env.RESPONSE_CACHE_TTL = '30' // switch the response cache ON for this file

const { default: request } = await import('supertest')
const { createApp } = await import('../src/app.js')
const { connectDB, disconnectDB } = await import('../src/config/db.js')
const { seedCatalog } = await import('../src/seed/seed.js')
const { User, Product, mongoose } = await import('../src/models/index.js')
const { cacheStats, clearPublicCache } = await import('../src/middleware/cache.js')
const { signToken } = await import('../src/middleware/index.js')
const bcrypt = (await import('bcrypt')).default

let api, adminToken, userToken
const auth = (t) => ({ Authorization: `Bearer ${t}` })

before(async () => {
  await connectDB()
  await seedCatalog()
  await Product.syncIndexes()
  api = request(createApp())
  const admin = await User.create({ name: 'Boss', email: 'boss@perf.test', password: await bcrypt.hash('Str0ng-Admin-Pass', 4), role: 'admin' })
  const user = await User.create({ name: 'Cust', email: 'cust@perf.test', password: await bcrypt.hash('Str0ng-Cust-Pass', 4) })
  adminToken = signToken(admin)
  userToken = signToken(user)
})
after(async () => { await mongoose.connection.dropDatabase(); await disconnectDB() })

test('public catalogue responses are cached, revalidatable and compressed', async () => {
  clearPublicCache()
  const a = await api.get('/api/products?limit=12').set('Accept-Encoding', 'gzip')
  assert.equal(a.status, 200)
  assert.match(a.headers['cache-control'], /public, max-age=\d+, stale-while-revalidate=\d+/)
  assert.ok(a.headers.etag)
  assert.match(a.headers.vary, /Accept-Encoding/)
  assert.equal(a.headers['content-encoding'], 'gzip')
  const before = cacheStats().hits
  const b = await api.get('/api/products?limit=12').set('Accept-Encoding', 'gzip')
  assert.equal(cacheStats().hits, before + 1)
  assert.deepEqual(b.body, a.body)
  assert.equal(b.headers.etag, a.headers.etag)
  const notModified = await api.get('/api/products?limit=12').set('If-None-Match', a.headers.etag)
  assert.equal(notModified.status, 304)
  assert.equal(notModified.text ?? '', '')
  // clients that do not accept gzip still get valid JSON
  const plain = await api.get('/api/products?limit=12').set('Accept-Encoding', 'identity')
  assert.equal(plain.status, 200)
  assert.equal(plain.body.items.length, 12)
  assert.equal(plain.headers['content-encoding'], undefined)
})

test('different queries never share a cache entry', async () => {
  const h = await api.get('/api/products?category=helmets')
  const j = await api.get('/api/products?category=riding-jackets')
  assert.ok(h.body.items.every((p) => p.category === 'helmets'))
  assert.ok(j.body.items.every((p) => p.category === 'riding-jackets'))
})

test('errors are not cached, and private/user-specific endpoints are never cacheable', async () => {
  assert.equal((await api.get('/api/products/does-not-exist')).status, 404)
  const again = await api.get('/api/products/does-not-exist')
  assert.equal(again.status, 404)
  for (const path of ['/api/auth/me', '/api/orders', '/api/cart', '/api/wishlist', '/api/users/addresses']) {
    const r = await api.get(path).set(auth(userToken))
    assert.equal(r.headers['cache-control'], 'no-store', path)
  }
  assert.equal((await api.get('/api/admin/stats').set(auth(adminToken))).headers['cache-control'], 'no-store')
})

test('requests carrying credentials bypass the shared cache', async () => {
  const hits = cacheStats().hits
  await api.get('/api/products?limit=3').set(auth(userToken))
  await api.get('/api/products?limit=3').set(auth(userToken))
  assert.equal(cacheStats().hits, hits)
})

test('admin edits, stock changes and reviews show up immediately (cache is invalidated)', async () => {
  const first = await api.get('/api/products/axor-apex-full-face-helmet')
  const id = first.body.id
  assert.equal((await api.get('/api/products/axor-apex-full-face-helmet')).headers.etag, first.headers.etag) // cached

  await api.put(`/api/admin/products/${id}`).set(auth(adminToken)).send({ price: 1234, mrp: 2000 })
  const afterEdit = await api.get('/api/products/axor-apex-full-face-helmet')
  assert.equal(afterEdit.body.price, 1234)

  // an order reserves stock -> the product page must not keep showing the old stock
  const stock = afterEdit.body.stock
  const order = await api.post('/api/orders').set(auth(userToken)).send({
    customer: { name: 'Cust', email: 'cust@perf.test', phone: '9876543210' }, items: [{ id, qty: 2, size: 'M' }],
    shippingAddress: { name: 'Cust', phone: '9876543210', line1: '1 Test Lane', city: 'Kolkata', state: 'West Bengal', pincode: '700001' },
    delivery: { id: 'standard' }, payment: { method: 'cod' },
  })
  assert.equal(order.status, 201)
  assert.equal((await api.get('/api/products/axor-apex-full-face-helmet')).body.stock, stock - 2)

  // cancelling returns stock and is visible at once
  await api.post(`/api/orders/${order.body.id}/cancel`).set(auth(userToken))
  assert.equal((await api.get('/api/products/axor-apex-full-face-helmet')).body.stock, stock)

  // hiding a product removes it from listings immediately
  await api.put(`/api/admin/products/${id}`).set(auth(adminToken)).send({ isActive: false })
  assert.equal((await api.get('/api/products/axor-apex-full-face-helmet')).status, 404)
  assert.ok(!(await api.get('/api/products?limit=60')).body.items.some((p) => p.id === id))
})

test('list payloads omit long fields, detail payload keeps them', async () => {
  const list = await api.get('/api/products?limit=5')
  for (const p of list.body.items) { assert.equal(p.description, undefined); assert.equal(p.specs, undefined); assert.equal(p.features, undefined) }
  const detail = await api.get(`/api/products/${list.body.items[0].slug}`)
  assert.ok(detail.body.description.length > 20)
  assert.ok(detail.body.specs.length > 0)
  const related = await api.get(`/api/products/${list.body.items[0].slug}/related`)
  assert.equal(related.body[0]?.description, undefined)
  assert.ok(JSON.stringify(list.body).length < 12 * 1100 + 400) // ~1 KB per product card
})

test('storefront queries use compound indexes (no in-memory sort)', async () => {
  const plan = async (filter, sort) => JSON.stringify((await Product.find(filter).sort(sort).limit(12).explain('queryPlanner')).queryPlanner.winningPlan)
  const popular = { sold: -1, reviewCount: -1, createdAt: -1 }
  for (const [name, filter, sort] of [
    ['popular', { isActive: true }, popular],
    ['category + popular', { isActive: true, category: 'helmets' }, popular],
    ['bestsellers', { isActive: true, bestseller: true }, { rating: -1, reviewCount: -1 }],
    ['newest', { isActive: true }, { createdAt: -1 }],
    ['price asc', { isActive: true }, { price: 1 }],
  ]) {
    const p = await plan(filter, sort)
    assert.ok(p.includes('IXSCAN'), `${name}: expected an index scan`)
    assert.ok(!p.includes('"stage":"SORT"'), `${name}: must not sort in memory`)
  }
})

test('password hashing does not block the event loop', async () => {
  // 6 concurrent logins (bcrypt cost 12 in production) must not freeze a concurrent cheap request
  const { default: bcryptNative } = await import('bcrypt')
  const hash = await bcryptNative.hash('Str0ng-Cust-Pass', 12)
  let maxGap = 0, last = Date.now()
  const timer = setInterval(() => { const now = Date.now(); maxGap = Math.max(maxGap, now - last); last = now }, 5)
  await Promise.all(Array.from({ length: 6 }, () => bcryptNative.compare('Str0ng-Cust-Pass', hash)))
  clearInterval(timer)
  assert.ok(maxGap < 120, `event loop was blocked for ${maxGap}ms`)
})

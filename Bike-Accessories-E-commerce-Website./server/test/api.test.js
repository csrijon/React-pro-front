// Integration tests - run against a real MongoDB:  MONGODB_URI=mongodb://127.0.0.1:27017 npm test
// Each run uses its own throw-away database and drops it at the end.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-test-secret-test-secret'
const base = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
process.env.MONGODB_URI = `${base.replace(/\/$/, '')}/motogear_test_${Date.now()}`
process.env.UPLOAD_DIR = 'uploads-test'

const { default: request } = await import('supertest')
const { createApp } = await import('../src/app.js')
const { connectDB, disconnectDB } = await import('../src/config/db.js')
const { seedCatalog } = await import('../src/seed/seed.js')
const { User, Product, Order, mongoose } = await import('../src/models/index.js')
const bcrypt = (await import('bcrypt')).default

let api, adminToken, userToken, helmet, jacket

before(async () => {
  await connectDB()
  await seedCatalog()
  api = request(createApp())
  await User.create({ name: 'Boss', email: 'admin@shop.test', password: await bcrypt.hash('Admin1234', 4), role: 'admin' })
  const r = await api.post('/api/auth/login').send({ email: 'admin@shop.test', password: 'Admin1234' })
  adminToken = r.body.token
})
after(async () => {
  await mongoose.connection.dropDatabase()
  await disconnectDB()
})

const auth = (t) => ({ Authorization: `Bearer ${t}` })
const address = { name: 'Test Rider', phone: '9876543210', line1: '12 Park Street', city: 'Kolkata', state: 'West Bengal', pincode: '700016' }
const orderBody = (items, extra = {}) => ({
  customer: { name: 'Test Rider', email: 'rider@example.com', phone: '9876543210' },
  items, shippingAddress: address, delivery: { id: 'standard' }, payment: { method: 'cod' }, ...extra,
})

test('health and catalogue', async () => {
  assert.equal((await api.get('/health')).status, 200)
  const list = await api.get('/api/products?limit=60')
  assert.equal(list.body.total, 52)
  assert.ok(list.body.items[0].id && list.body.items[0].slug && typeof list.body.items[0].isNew === 'boolean')
  const helmets = await api.get('/api/products?category=helmets&sort=price-asc')
  assert.equal(helmets.body.total, 6)
  assert.ok(helmets.body.items[0].price <= helmets.body.items[1].price)
  const found = await api.get('/api/products?q=jacket')
  assert.ok(found.body.items.length > 0)
  const injected = await api.get('/api/products?category[$ne]=x')
  assert.equal(injected.status, 200)
  helmet = (await api.get('/api/products/axor-apex-full-face-helmet')).body
  jacket = (await api.get('/api/products/raida-riding-jacket')).body
  assert.equal(helmet.name, 'Axor Apex Full Face Helmet')
  const facets = await api.get('/api/products/facets')
  assert.equal(facets.body.categories.helmets, 6)
  assert.equal((await api.get('/api/categories')).body.length, 10)
  assert.equal((await api.get('/api/products/nope')).status, 404)
  assert.equal((await api.get(`/api/products/by-ids?ids=${helmet.id},bad`)).body.length, 1)
})

test('auth: register, duplicate, login, me, validation, admin guard', async () => {
  const bad = await api.post('/api/auth/register').send({ name: 'A', email: 'x', password: '123' })
  assert.equal(bad.status, 422)
  const reg = await api.post('/api/auth/register').send({ name: 'Rider One', email: 'Rider1@Example.com', phone: '9876543210', password: 'Ride1234' })
  assert.equal(reg.status, 201)
  assert.equal(reg.body.user.email, 'rider1@example.com')
  assert.equal(reg.body.user.password, undefined)
  userToken = reg.body.token
  assert.equal((await api.post('/api/auth/register').send({ name: 'Rider One', email: 'rider1@example.com', password: 'Ride1234' })).status, 409)
  assert.equal((await api.post('/api/auth/login').send({ email: 'rider1@example.com', password: 'wrong123' })).status, 401)
  assert.equal((await api.get('/api/auth/me').set(auth(userToken))).body.user.role, 'user')
  assert.equal((await api.get('/api/auth/me')).status, 401)
  assert.equal((await api.get('/api/admin/stats').set(auth(userToken))).status, 403)
  assert.equal((await api.get('/api/admin/stats')).status, 401)
})

test('password reset flow does not leak and works', async () => {
  const unknown = await api.post('/api/auth/forgot-password').send({ email: 'nobody@example.com' })
  const known = await api.post('/api/auth/forgot-password').send({ email: 'rider1@example.com' })
  assert.deepEqual(unknown.body, known.body)
  assert.equal(known.body.devResetToken, undefined)
  assert.equal((await api.post('/api/auth/reset-password').send({ token: 'x'.repeat(20), password: 'Newpass123' })).status, 400)
})

test('orders: guests cannot order, signed-in customers can', async () => {
  const noAuth = await api.post('/api/orders').send(orderBody([{ id: helmet.id, qty: 1, size: 'L' }]))
  assert.equal(noAuth.status, 401)
  assert.equal(await Order.countDocuments(), 0)
  assert.equal((await api.get('/api/orders')).status, 401)
  assert.equal((await api.post('/api/orders').set({ Authorization: 'Bearer not-a-token' }).send(orderBody([{ id: helmet.id, qty: 1, size: 'L' }]))).status, 401)
})

test('orders: server recomputes prices, validates stock, applies coupon', async () => {
  const stockBefore = (await Product.findById(helmet.id)).stock
  // client tries to cheat on price - server must ignore it
  const res = await api.post('/api/orders').set(auth(userToken)).send(orderBody([{ id: helmet.id, qty: 2, size: 'L', colorName: 'Racing Red', price: 1 }], { totals: { total: 1 } }))
  assert.equal(res.status, 201, JSON.stringify(res.body))
  assert.equal(res.body.items[0].price, helmet.price)
  assert.equal(res.body.totals.subtotal, helmet.price * 2)
  assert.equal(res.body.status, 'Processing')
  assert.match(res.body.id, /^MG[A-Z0-9]{14}$/)
  assert.equal((await Product.findById(helmet.id)).stock, stockBefore - 2)

  // missing size, unknown id, too many
  assert.equal((await api.post('/api/orders').set(auth(userToken)).send(orderBody([{ id: helmet.id, qty: 1 }]))).status, 400)
  assert.equal((await api.post('/api/orders').set(auth(userToken)).send(orderBody([{ id: '0'.repeat(24), qty: 1 }]))).status, 400)
  assert.equal((await api.post('/api/orders').set(auth(userToken)).send(orderBody([{ id: helmet.id, qty: 11, size: 'L' }]))).status, 422)
  assert.equal((await api.post('/api/orders').set(auth(userToken)).send(orderBody([{ id: jacket.id, qty: 1, size: 'M' }], { payment: { method: 'upi' } }))).status, 400) // payments not configured

  // coupon
  const c = await api.post('/api/orders').set(auth(userToken)).send(orderBody([{ id: jacket.id, qty: 1, size: 'M' }], { coupon: 'moto10' }))
  assert.equal(c.status, 201)
  assert.equal(c.body.totals.couponDiscount, Math.round(jacket.price * 0.1))
  assert.equal((await api.post('/api/orders').set(auth(userToken)).send(orderBody([{ id: jacket.id, qty: 1, size: 'M' }], { coupon: 'NOPE' }))).status, 404)

  // ownership
  assert.equal((await api.get('/api/orders').set(auth(userToken))).body.length, 2)
  assert.equal((await api.get(`/api/orders/${c.body.id}`)).status, 401) // not signed in
  assert.equal((await api.get(`/api/orders/${c.body.id}`).set(auth(userToken))).status, 200)
  assert.equal((await api.get(`/api/orders/${res.body.id}`)).status, 401) // not even with the id: sign-in required, owner/admin only

  // out of stock
  const low = await Product.create({ name: 'Last One', slug: 'last-one', brand: 'axor', brandName: 'Axor', category: 'helmets', categoryName: 'Helmets', price: 100, mrp: 120, stock: 1 })
  assert.equal((await api.post('/api/orders').set(auth(userToken)).send(orderBody([{ id: String(low._id), qty: 2 }]))).status, 409)
  assert.equal((await Product.findById(low._id)).stock, 1) // nothing leaked
})

test('customer can cancel and stock returns', async () => {
  const before = (await Product.findById(jacket.id)).stock
  const o = await api.post('/api/orders').set(auth(userToken)).send(orderBody([{ id: jacket.id, qty: 3, size: 'L' }]))
  assert.equal((await Product.findById(jacket.id)).stock, before - 3)
  const c = await api.post(`/api/orders/${o.body.id}/cancel`).set(auth(userToken))
  assert.equal(c.body.status, 'Cancelled')
  assert.equal((await Product.findById(jacket.id)).stock, before)
  assert.equal((await api.post(`/api/orders/${o.body.id}/cancel`).set(auth(userToken))).status, 400)
})

test('reviews update product rating once per user', async () => {
  const r1 = await api.post(`/api/products/${jacket.slug}/reviews`).set(auth(userToken)).send({ rating: 4, title: 'Nice', text: 'Great jacket, very comfortable.' })
  assert.equal(r1.status, 201)
  assert.equal(r1.body.verified, true) // user has a real order for it
  assert.equal((await api.post(`/api/products/${jacket.slug}/reviews`).set(auth(userToken)).send({ rating: 5, text: 'Second review attempt!!' })).status, 409)
  const p = (await api.get(`/api/products/${jacket.slug}`)).body
  assert.equal(p.rating, 4)
  assert.equal(p.reviewCount, 1)
  assert.equal((await api.get(`/api/products/${jacket.slug}/reviews`)).body.length, 1)
  assert.equal((await api.post(`/api/products/${jacket.slug}/reviews`).send({ rating: 5, text: 'not signed in' })).status, 401)
})

test('profile, addresses, wishlist, cart sync', async () => {
  const p = await api.put('/api/users/profile').set(auth(userToken)).send({ name: 'Rider Uno', phone: '9123456780', bike: 'KTM' })
  assert.equal(p.body.user.name, 'Rider Uno')
  const a = await api.post('/api/users/addresses').set(auth(userToken)).send({ ...address, label: 'Home' })
  assert.equal(a.status, 201)
  assert.equal(a.body.isDefault, true)
  const b = await api.post('/api/users/addresses').set(auth(userToken)).send({ ...address, label: 'Work', isDefault: true })
  const list = (await api.get('/api/users/addresses').set(auth(userToken))).body
  assert.equal(list.filter((x) => x.isDefault).length, 1)
  assert.equal(list.find((x) => x.isDefault).id, b.body.id)
  assert.equal((await api.delete(`/api/users/addresses/${b.body.id}`).set(auth(userToken))).status, 200)
  assert.equal((await api.put('/api/wishlist').set(auth(userToken)).send({ ids: [helmet.id] })).body[0], helmet.id)
  assert.equal((await api.put('/api/cart').set(auth(userToken)).send({ items: [], coupon: null })).status, 200)
  assert.equal((await api.put('/api/users/password').set(auth(userToken)).send({ currentPassword: 'bad', newPassword: 'Another123' })).status, 400)
})

test('admin: dashboard, product CRUD, validation, orders workflow', async () => {
  const s = await api.get('/api/admin/stats').set(auth(adminToken))
  assert.equal(s.status, 200)
  assert.ok(s.body.revenue > 0 && s.body.series.length === 30)

  const bad = await api.post('/api/admin/products').set(auth(adminToken)).send({ name: 'X', brand: 'axor', category: 'helmets', price: 500, mrp: 100 })
  assert.equal(bad.status, 400)
  assert.equal((await api.post('/api/admin/products').set(auth(adminToken)).send({ name: 'X', brand: 'nope', category: 'helmets', price: 50, mrp: 100 })).status, 400)
  const created = await api.post('/api/admin/products').set(auth(adminToken)).send({
    name: 'Test Gloves', brand: 'axor', category: 'riding-gloves', price: 999, mrp: 1299, stock: 7, isNew: true, sizes: ['M', 'L'],
    colors: [{ name: 'Red', hex: '#ef252b' }, { name: 'bad', hex: 'red' }], images: ['https://example.com/a.jpg'], specs: [{ label: 'Material', value: 'Leather' }],
  })
  assert.equal(created.status, 201, JSON.stringify(created.body))
  assert.equal(created.body.slug, 'test-gloves')
  assert.equal(created.body.isNew, true)
  assert.equal(created.body.brandName, 'Axor')
  assert.equal(created.body.colors.length, 1)
  assert.equal(created.body.image, 'https://example.com/a.jpg')
  const dup = await api.post('/api/admin/products').set(auth(adminToken)).send({ name: 'Test Gloves', brand: 'axor', category: 'riding-gloves', price: 10, mrp: 20 })
  assert.equal(dup.body.slug, 'test-gloves-2')

  const upd = await api.put(`/api/admin/products/${created.body.id}`).set(auth(adminToken)).send({ price: 899, stock: 3, isActive: false, slug: 'hacked', rating: 5 })
  assert.equal(upd.body.price, 899)
  assert.equal(upd.body.slug, 'test-gloves') // whitelisted fields only
  assert.equal(upd.body.rating, 0)
  assert.equal((await api.get('/api/products/test-gloves')).status, 404) // inactive hidden from storefront

  // order workflow
  const placed = await api.post('/api/orders').set(auth(userToken)).send(orderBody([{ id: helmet.id, qty: 1, size: 'M' }]))
  const id = placed.body.id
  const detail = await api.get(`/api/admin/orders/${id}`).set(auth(adminToken))
  assert.equal(detail.body.customer.email, 'rider@example.com')
  const shipped = await api.patch(`/api/admin/orders/${id}`).set(auth(adminToken)).send({ status: 'Shipped', tracking: { courier: 'Delhivery', number: 'DL123' }, note: 'On the way' })
  assert.equal(shipped.body.status, 'Shipped')
  assert.equal(shipped.body.tracking.number, 'DL123')
  assert.equal((await api.patch(`/api/admin/orders/${id}`).set(auth(adminToken)).send({ status: 'Packed' })).status, 400) // no going back
  const delivered = await api.patch(`/api/admin/orders/${id}`).set(auth(adminToken)).send({ status: 'Delivered' })
  assert.equal(delivered.body.payment.status, 'Paid') // COD collected
  assert.equal(delivered.body.statusHistory.length, 3)
  assert.equal((await api.get('/api/admin/orders?status=Delivered').set(auth(adminToken))).body.total, 1)
  assert.equal((await api.get(`/api/admin/orders?q=${id.slice(0, 6)}`).set(auth(adminToken))).body.total, 1)
  assert.equal((await api.get(`/api/orders/${id}`).set(auth(userToken))).body.tracking.courier, 'Delhivery')

  // deleting a product that has orders is blocked
  assert.equal((await api.delete(`/api/admin/products/${helmet.id}`).set(auth(adminToken))).status, 409)
  assert.equal((await api.delete(`/api/admin/products/${created.body.id}`).set(auth(adminToken))).status, 200)
})

test('admin: categories, brands, coupons, blogs, users, messages, subscribers', async () => {
  const cat = await api.post('/api/admin/categories').set(auth(adminToken)).send({ name: 'Rain Gear', tagline: 'Stay dry' })
  assert.equal(cat.body.slug, 'rain-gear')
  assert.equal((await api.get('/api/categories')).body.length, 11)
  assert.equal((await api.delete(`/api/admin/categories/${(await api.get('/api/admin/categories?q=helmets').set(auth(adminToken))).body.items[0].id}`).set(auth(adminToken))).status, 409)
  assert.equal((await api.delete(`/api/admin/categories/${cat.body.id}`).set(auth(adminToken))).status, 200)

  const br = await api.put(`/api/admin/brands/${(await api.get('/api/admin/brands?q=axor').set(auth(adminToken))).body.items[0].id}`).set(auth(adminToken)).send({ name: 'AXOR Racing' })
  assert.equal((await api.get('/api/products/axor-apex-full-face-helmet')).body.brandName, 'AXOR Racing')
  assert.equal(br.status, 200)

  assert.equal((await api.post('/api/admin/coupons').set(auth(adminToken)).send({ code: 'bad', type: 'percent', value: 500 })).status, 400)
  const cp = await api.post('/api/admin/coupons').set(auth(adminToken)).send({ code: 'save 20', type: 'flat', value: 20, minOrder: 100, hidden: true })
  assert.equal(cp.body.code, 'SAVE20')
  assert.ok(!(await api.get('/api/coupons')).body.some((c) => c.code === 'SAVE20')) // hidden
  assert.equal((await api.post('/api/cart/coupon').send({ code: 'save20', subtotal: 50 })).status, 400)
  assert.equal((await api.post('/api/cart/coupon').send({ code: 'save20', subtotal: 500 })).status, 200)

  const blog = await api.post('/api/admin/blogs').set(auth(adminToken)).send({ title: 'My Post', body: '## Intro\n\nHello there.\n\nSecond para.' })
  assert.deepEqual(blog.body.body[0], ['h', 'Intro'])
  assert.equal((await api.get('/api/blogs/my-post')).body.title, 'My Post')

  const users = await api.get('/api/admin/users').set(auth(adminToken))
  const rider = users.body.items.find((u) => u.email === 'rider1@example.com')
  assert.ok(rider.orders >= 1)
  assert.equal((await api.put(`/api/admin/users/${rider.id}`).set(auth(adminToken)).send({ isBlocked: true })).status, 200)
  assert.equal((await api.get('/api/auth/me').set(auth(userToken))).status, 403) // blocked mid-session
  assert.equal((await api.post('/api/auth/login').send({ email: 'rider1@example.com', password: 'Ride1234' })).status, 403)
  const me = users.body.items.find((u) => u.email === 'admin@shop.test')
  assert.equal((await api.put(`/api/admin/users/${me.id}`).set(auth(adminToken)).send({ role: 'user' })).status, 403) // cannot demote self

  assert.equal((await api.post('/api/contact').send({ name: 'Q', email: 'q@x.com', message: 'short' })).status, 422)
  const msg = await api.post('/api/contact').send({ name: 'Quinn', email: 'q@x.com', message: 'Where is my order please?' })
  assert.match(msg.body.ticket, /^MG-/)
  await api.post('/api/newsletter').send({ email: 'fan@example.com' })
  await api.post('/api/newsletter').send({ email: 'fan@example.com' })
  assert.equal((await api.get('/api/admin/subscribers').set(auth(adminToken))).body.total, 1)
  const inbox = await api.get('/api/admin/messages?status=new').set(auth(adminToken))
  assert.equal(inbox.body.total, 1)
  assert.equal((await api.put(`/api/admin/messages/${inbox.body.items[0].id}`).set(auth(adminToken)).send({ status: 'resolved' })).body.status, 'resolved')
})

test('admin uploads accept real images only', async () => {
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==', 'base64')
  const ok = await api.post('/api/admin/upload').set(auth(adminToken)).attach('images', png, { filename: 'a.png', contentType: 'image/png' })
  assert.equal(ok.status, 201)
  assert.match(ok.body.urls[0], /\/uploads\/[a-f0-9]+\.png$/)
  const fake = await api.post('/api/admin/upload').set(auth(adminToken)).attach('images', Buffer.from('<script>alert(1)</script>'), { filename: 'x.png', contentType: 'image/png' })
  assert.equal(fake.status, 400)
  assert.equal((await api.post('/api/admin/upload').set(auth(adminToken)).attach('images', png, { filename: 'a.gif', contentType: 'image/gif' })).status, 400)
  assert.equal((await api.post('/api/admin/upload').set(auth(userToken)).attach('images', png, { filename: 'a.png', contentType: 'image/png' })).status, 403)
})

test('unknown routes and bad json are handled', async () => {
  assert.equal((await api.get('/api/nope')).status, 404)
  assert.equal((await api.post('/api/auth/login').set('Content-Type', 'application/json').send('{bad')).status, 400)
})

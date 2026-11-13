// Online-payment flow with a mocked Razorpay API but real HMAC signature checks.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-test-secret-test-secret'
const base = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
process.env.MONGODB_URI = `${base.replace(/\/$/, '')}/motogear_pay_${Date.now()}`
process.env.UPLOAD_DIR = 'uploads-test'
process.env.RAZORPAY_KEY_ID = 'rzp_test_key'
process.env.RAZORPAY_KEY_SECRET = 'rzp_test_secret'
process.env.RAZORPAY_WEBHOOK_SECRET = 'whsec_test'

const { default: request } = await import('supertest')
const { createApp } = await import('../src/app.js')
const { connectDB, disconnectDB } = await import('../src/config/db.js')
const { seedCatalog } = await import('../src/seed/seed.js')
const { Product, Order, mongoose } = await import('../src/models/index.js')

let api, helmet, token
const realFetch = globalThis.fetch
let rzCalls = []

before(async () => {
  await connectDB()
  await seedCatalog()
  api = request(createApp())
  helmet = (await api.get('/api/products/axor-apex-full-face-helmet')).body
  token = (await api.post('/api/auth/register').send({ name: 'Pay Tester', email: 'pay@example.com', password: 'P4y-Tester-Pass' })).body.token
  // fake only Razorpay's order API; let supertest's own traffic through untouched
  globalThis.fetch = async (url, opts) => {
    if (String(url).startsWith('https://api.razorpay.com/v1/orders')) {
      const body = JSON.parse(opts.body)
      rzCalls.push({ body, auth: opts.headers.Authorization })
      return { ok: true, json: async () => ({ id: `order_${rzCalls.length}XYZ`, amount: body.amount }) }
    }
    return realFetch(url, opts)
  }
})
after(async () => {
  globalThis.fetch = realFetch
  await mongoose.connection.dropDatabase()
  await disconnectDB()
})

const sign = (orderId, paymentId, secret = 'rzp_test_secret') => crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex')
const body = (extra = {}) => ({
  customer: { name: 'Pay Tester', email: 'pay@example.com', phone: '9876543210' },
  items: [{ id: helmet.id, qty: 1, size: 'M' }],
  shippingAddress: { name: 'Pay Tester', phone: '9876543210', line1: '1 Test Lane', city: 'Kolkata', state: 'West Bengal', pincode: '700001' },
  delivery: { id: 'express' }, payment: { method: 'upi' }, ...extra,
})

test('guests cannot start or verify a payment', async () => {
  assert.equal((await api.post('/api/orders').send(body())).status, 401)
  assert.equal((await api.post('/api/orders/MGXXXXXXXXXXXXXX/verify-payment').send({ razorpay_order_id: 'o', razorpay_payment_id: 'p', razorpay_signature: 's' })).status, 401)
})

test('config advertises online payments', async () => {
  const c = (await api.get('/api/config')).body
  assert.equal(c.paymentsEnabled, true)
  assert.equal(c.razorpayKeyId, 'rzp_test_key')
  assert.equal(JSON.stringify(c).includes('rzp_test_secret'), false) // secret never leaves the server
})

test('online order: server-side amount, pending until verified signature', async () => {
  const stock = (await Product.findById(helmet.id)).stock
  const res = await api.post('/api/orders').set({ Authorization: `Bearer ${token}` }).send(body({ totals: { total: 1 } }))
  assert.equal(res.status, 201, JSON.stringify(res.body))
  assert.equal(res.body.status, 'Pending Payment')
  assert.equal(res.body.payment.checkout.keyId, 'rzp_test_key')
  assert.equal(res.body.payment.checkout.amount, (helmet.price + 149) * 100) // price + express shipping, in paise, computed by the server
  assert.equal(rzCalls[0].body.amount, (helmet.price + 149) * 100)
  assert.match(rzCalls[0].auth, /^Basic /)
  assert.equal((await Product.findById(helmet.id)).stock, stock - 1) // reserved

  const id = res.body.id
  const rid = res.body.payment.checkout.orderId
  const bad = await api.post(`/api/orders/${id}/verify-payment`).set({ Authorization: `Bearer ${token}` }).send({ razorpay_order_id: rid, razorpay_payment_id: 'pay_1', razorpay_signature: sign(rid, 'pay_1', 'wrong-secret') })
  assert.equal(bad.status, 400)
  const mismatch = await api.post(`/api/orders/${id}/verify-payment`).set({ Authorization: `Bearer ${token}` }).send({ razorpay_order_id: 'order_other', razorpay_payment_id: 'pay_1', razorpay_signature: sign('order_other', 'pay_1') })
  assert.equal(mismatch.status, 400)
  assert.equal((await Order.findOne({ orderId: id })).status, 'Pending Payment')

  const ok = await api.post(`/api/orders/${id}/verify-payment`).set({ Authorization: `Bearer ${token}` }).send({ razorpay_order_id: rid, razorpay_payment_id: 'pay_1', razorpay_signature: sign(rid, 'pay_1') })
  assert.equal(ok.status, 200)
  assert.equal(ok.body.status, 'Processing')
  assert.equal(ok.body.payment.status, 'Paid')
  assert.equal(ok.body.payment.checkout, undefined)
  assert.equal(ok.body.payment.razorpayPaymentId, undefined) // not exposed to the storefront
  // idempotent
  assert.equal((await api.post(`/api/orders/${id}/verify-payment`).set({ Authorization: `Bearer ${token}` }).send({ razorpay_order_id: rid, razorpay_payment_id: 'pay_1', razorpay_signature: sign(rid, 'pay_1') })).status, 200)
})

test('webhook confirms payment when the browser never returned; rejects bad signatures', async () => {
  const res = await api.post('/api/orders').set({ Authorization: `Bearer ${token}` }).send(body())
  const rid = res.body.payment.checkout.orderId
  const mk = (amount) => JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_web', order_id: rid, amount } } } })
  const payload = mk((helmet.price + 149) * 100)
  // an under-paid / mismatched capture must NOT confirm the order
  const wrong = mk(100)
  const wrongSig = crypto.createHmac('sha256', 'whsec_test').update(wrong).digest('hex')
  assert.equal((await api.post('/api/webhooks/razorpay').set('Content-Type', 'application/json').set('X-Razorpay-Signature', wrongSig).send(wrong)).status, 200)
  assert.equal((await Order.findOne({ orderId: res.body.id })).status, 'Pending Payment')
  const noSig = await api.post('/api/webhooks/razorpay').set('Content-Type', 'application/json').send(payload)
  assert.equal(noSig.status, 400)
  const badSig = await api.post('/api/webhooks/razorpay').set('Content-Type', 'application/json').set('X-Razorpay-Signature', 'deadbeef').send(payload)
  assert.equal(badSig.status, 400)
  assert.equal((await Order.findOne({ orderId: res.body.id })).status, 'Pending Payment')
  const sig = crypto.createHmac('sha256', 'whsec_test').update(payload).digest('hex')
  const ok = await api.post('/api/webhooks/razorpay').set('Content-Type', 'application/json').set('X-Razorpay-Signature', sig).send(payload)
  assert.equal(ok.status, 200)
  const o = await Order.findOne({ orderId: res.body.id })
  assert.equal(o.status, 'Processing')
  assert.equal(o.payment.status, 'Paid')
})

test('abandoned online order can be cancelled and releases stock', async () => {
  const stock = (await Product.findById(helmet.id)).stock
  const res = await api.post('/api/orders').set({ Authorization: `Bearer ${token}` }).send(body())
  assert.equal((await Product.findById(helmet.id)).stock, stock - 1)
  // guests cannot cancel anonymously; admin/owner only - so release through the expiry path used by the housekeeping job
  const { restoreStock } = await import('../src/routes/shop.js')
  const o = await Order.findOne({ orderId: res.body.id })
  o.status = 'Cancelled'
  await o.save()
  await restoreStock(o)
  assert.equal((await Product.findById(helmet.id)).stock, stock)
})

test('COD still works alongside online payments', async () => {
  const res = await api.post('/api/orders').set({ Authorization: `Bearer ${token}` }).send(body({ payment: { method: 'cod' } }))
  assert.equal(res.status, 201)
  assert.equal(res.body.status, 'Processing')
  assert.equal(res.body.payment.checkout, undefined)
})

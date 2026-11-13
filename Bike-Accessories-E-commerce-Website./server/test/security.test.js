// Security regression tests: lockout, 2FA, sessions, injection, authorization boundaries.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-test-secret-test-secret'
const base = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
process.env.MONGODB_URI = `${base.replace(/\/$/, '')}/motogear_sec_${Date.now()}`
process.env.UPLOAD_DIR = 'uploads-test'
process.env.REQUIRE_ADMIN_2FA = 'true'

const { default: request } = await import('supertest')
const { createApp } = await import('../src/app.js')
const { connectDB, disconnectDB } = await import('../src/config/db.js')
const { seedCatalog } = await import('../src/seed/seed.js')
const { User, Order, AuditLog, mongoose } = await import('../src/models/index.js')
const { totpAt } = await import('../src/utils/totp.js')
const { sendMail } = await import('../src/utils/mailer.js')
const bcrypt = (await import('bcrypt')).default

let api, product
const auth = (t) => ({ Authorization: `Bearer ${t}` })
const addr = { name: 'Sec Tester', phone: '9876543210', line1: '1 Test Lane', city: 'Kolkata', state: 'West Bengal', pincode: '700001' }
const order = (extra = {}) => ({ customer: { name: 'Sec Tester', email: 'sec@example.com', phone: '9876543210' }, items: [{ id: product.id, qty: 1, size: 'M' }], shippingAddress: addr, delivery: { id: 'standard' }, payment: { method: 'cod' }, ...extra })

before(async () => {
  await connectDB()
  await seedCatalog()
  api = request(createApp())
  product = (await api.get('/api/products/axor-apex-full-face-helmet')).body
  await User.create({ name: 'Boss', email: 'boss@shop.test', password: await bcrypt.hash('Str0ng-Admin-Pass', 4), role: 'admin' })
})
after(async () => { await mongoose.connection.dropDatabase(); await disconnectDB() })

const login = (email, password) => api.post('/api/auth/login').send({ email, password })

test('registration can never create an admin, even if role is sent', async () => {
  const r = await api.post('/api/auth/register').send({ name: 'Mallory', email: 'mallory@example.com', password: 'Tr1cky-Pass', role: 'admin', isBlocked: false })
  assert.equal(r.status, 201)
  assert.equal(r.body.user.role, 'user')
  assert.equal((await api.get('/api/admin/stats').set(auth(r.body.token))).status, 403)
  const profile = await api.put('/api/users/profile').set(auth(r.body.token)).send({ name: 'Mallory', role: 'admin' })
  assert.equal(profile.body.user.role, 'user')
})

test('weak / common passwords are rejected', async () => {
  for (const p of ['password123', 'Admin12345', 'short1', 'onlyletters']) {
    assert.equal((await api.post('/api/auth/register').send({ name: 'Weak', email: `weak${p.length}@example.com`, password: p })).status, 422, p)
  }
})

test('account locks after repeated failures and correct password cannot bypass the lock', async () => {
  await api.post('/api/auth/register').send({ name: 'Victim', email: 'victim@example.com', password: 'Vict1m-Secret' })
  for (let i = 0; i < 5; i++) assert.equal((await login('victim@example.com', 'wrong-pass-1')).status, 401)
  const locked = await login('victim@example.com', 'Vict1m-Secret') // right password, but locked
  assert.equal(locked.status, 429)
  assert.match(locked.body.message, /try again/i)
  assert.ok((await AuditLog.countDocuments({ action: 'auth.account_locked' })) >= 1)
})

test('JWTs: wrong algorithm / audience / tampering / expiry are all rejected', async () => {
  const reg = await api.post('/api/auth/register').send({ name: 'Jwt User', email: 'jwt@example.com', password: 'Jwt-Passw0rd-X' })
  const id = reg.body.user.id
  const none = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url') + '.' + Buffer.from(JSON.stringify({ sub: id, aud: 'session', iss: 'motogear-api' })).toString('base64url') + '.'
  assert.equal((await api.get('/api/auth/me').set(auth(none))).status, 401)
  const wrongAud = jwt.sign({ sub: id, tv: 0 }, process.env.JWT_SECRET, { audience: '2fa', issuer: 'motogear-api' })
  assert.equal((await api.get('/api/auth/me').set(auth(wrongAud))).status, 401)
  const noAud = jwt.sign({ sub: id, tv: 0 }, process.env.JWT_SECRET)
  assert.equal((await api.get('/api/auth/me').set(auth(noAud))).status, 401)
  const expired = jwt.sign({ sub: id, tv: 0 }, process.env.JWT_SECRET, { audience: 'session', issuer: 'motogear-api', expiresIn: -10 })
  assert.equal((await api.get('/api/auth/me').set(auth(expired))).status, 401)
  assert.equal((await api.get('/api/auth/me').set(auth(reg.body.token + 'x'))).status, 401)
  assert.equal((await api.get('/api/auth/me').set(auth(reg.body.token))).status, 200)
})

test('changing password / logout-all ends other sessions but keeps this one', async () => {
  const a = (await api.post('/api/auth/register').send({ name: 'Sess', email: 'sess@example.com', password: 'Sess-Passw0rd-1' })).body
  const other = (await login('sess@example.com', 'Sess-Passw0rd-1')).body.token
  const ch = await api.put('/api/users/password').set(auth(a.token)).send({ currentPassword: 'Sess-Passw0rd-1', newPassword: 'Sess-Passw0rd-2' })
  assert.equal(ch.status, 200)
  assert.ok(ch.body.token)
  assert.equal((await api.get('/api/auth/me').set(auth(other))).status, 401) // old device
  assert.equal((await api.get('/api/auth/me').set(auth(a.token))).status, 401) // old token of this device
  assert.equal((await api.get('/api/auth/me').set(auth(ch.body.token))).status, 200)
  assert.equal((await api.put('/api/users/password').set(auth(ch.body.token)).send({ currentPassword: 'Sess-Passw0rd-2', newPassword: 'Sess-Passw0rd-2' })).status, 400)
  const all = await api.post('/api/auth/logout-all').set(auth(ch.body.token))
  assert.equal((await api.get('/api/auth/me').set(auth(ch.body.token))).status, 401)
  assert.equal((await api.get('/api/auth/me').set(auth(all.body.token))).status, 200)
})

test('admin must enable 2FA; full TOTP lifecycle incl. replay + recovery codes', async () => {
  let t = (await login('boss@shop.test', 'Str0ng-Admin-Pass')).body.token
  assert.ok(t)
  const blocked = await api.get('/api/admin/stats').set(auth(t))
  assert.equal(blocked.status, 403)
  assert.match(blocked.body.message, /two-factor/i)
  assert.equal((await api.get('/api/config')).body.adminTwoFactorRequired, true)

  assert.equal((await api.post('/api/auth/2fa/setup').set(auth(t)).send({ password: 'wrong' })).status, 400)
  const setup = await api.post('/api/auth/2fa/setup').set(auth(t)).send({ password: 'Str0ng-Admin-Pass' })
  assert.match(setup.body.otpauthUrl, /^otpauth:\/\/totp\//)
  assert.equal((await api.post('/api/auth/2fa/enable').set(auth(t)).send({ code: '000000' })).status, 400)
  const enabled = await api.post('/api/auth/2fa/enable').set(auth(t)).send({ code: totpAt(setup.body.secret) })
  assert.equal(enabled.status, 200)
  assert.equal(enabled.body.recoveryCodes.length, 8)
  assert.equal(enabled.body.user.twoFactorEnabled, true)
  assert.equal(enabled.body.user.twoFactor, undefined)
  const dbUser = await User.findOne({ email: 'boss@shop.test' }).select('+twoFactor.secret +twoFactor.recoveryCodes')
  assert.ok(!dbUser.twoFactor.secret.includes(setup.body.secret)) // seed is encrypted at rest
  assert.ok(!dbUser.twoFactor.recoveryCodes.includes(enabled.body.recoveryCodes[0])) // codes are hashed

  assert.equal((await api.get('/api/admin/stats').set(auth(t))).status, 200) // allowed once enabled

  // next login needs the second factor
  const step1 = await login('boss@shop.test', 'Str0ng-Admin-Pass')
  assert.equal(step1.body.requires2fa, true)
  assert.equal(step1.body.token, undefined)
  assert.equal((await api.get('/api/admin/stats').set(auth(step1.body.challenge))).status, 401) // challenge is not a session
  assert.equal((await api.post('/api/auth/2fa/login').send({ challenge: step1.body.challenge, code: '123456' })).status, 401)
  assert.equal((await api.post('/api/auth/2fa/login').send({ challenge: 'x'.repeat(30), code: totpAt(setup.body.secret) })).status, 401)

  // the code used while enabling cannot be replayed; wait-free check uses the *next* step's code
  const next = totpAt(setup.body.secret, Date.now() + 30000)
  const ok = await api.post('/api/auth/2fa/login').send({ challenge: step1.body.challenge, code: next })
  assert.equal(ok.status, 200, JSON.stringify(ok.body))
  assert.ok(ok.body.token)
  const replay = await login('boss@shop.test', 'Str0ng-Admin-Pass')
  assert.equal((await api.post('/api/auth/2fa/login').send({ challenge: replay.body.challenge, code: next })).status, 401)

  // recovery code works once
  const rc = enabled.body.recoveryCodes[0]
  const s2 = await login('boss@shop.test', 'Str0ng-Admin-Pass')
  assert.equal((await api.post('/api/auth/2fa/login').send({ challenge: s2.body.challenge, code: rc })).status, 200)
  const s3 = await login('boss@shop.test', 'Str0ng-Admin-Pass')
  assert.equal((await api.post('/api/auth/2fa/login').send({ challenge: s3.body.challenge, code: rc })).status, 401)

  // mandatory for admins: cannot be switched off
  assert.equal((await api.post('/api/auth/2fa/disable').set(auth(ok.body.token)).send({ password: 'Str0ng-Admin-Pass', code: enabled.body.recoveryCodes[1] })).status, 403)
  t = ok.body.token
  // admin actions are audited (no bodies)
  const c = await api.post('/api/admin/coupons').set(auth(t)).send({ code: 'AUDIT5', type: 'flat', value: 5 })
  assert.equal(c.status, 201)
  const log = await api.get('/api/admin/audit?q=coupons').set(auth(t))
  assert.ok(log.body.items.some((x) => x.action.startsWith('POST') && x.actorEmail === 'boss@shop.test' && x.status === 201))
  assert.ok(!JSON.stringify(log.body).includes('AUDIT5'))
})

test('NoSQL operators in query/body are neutralised', async () => {
  const reg = await api.post('/api/auth/register').send({ name: 'Inj', email: 'inj@example.com', password: 'Inj3ct-Pass-9' })
  const bad = await api.post('/api/auth/login').send({ email: { $ne: 'x' }, password: { $ne: 'x' } })
  assert.equal(bad.status, 422)
  const listed = await api.get('/api/products?category[$ne]=helmets&brand[$regex]=.*')
  assert.equal(listed.status, 200)
  assert.equal((await api.get('/api/orders/%7B%22$ne%22:1%7D').set(auth(reg.body.token))).status, 404)
  assert.equal((await api.post('/api/auth/reset-password').send({ token: { $ne: null }, password: 'Zx9-Zx9-Zx9' })).status, 422)
  assert.ok(reg.body.token)
})

test('ordering requires an account; customers cannot touch each other\'s orders', async () => {
  const guest = await api.post('/api/orders').send(order())
  assert.equal(guest.status, 401)
  const u1 = (await api.post('/api/auth/register').send({ name: 'U One', email: 'u1@example.com', password: 'U1-Passw0rd-x' })).body
  const u2 = (await api.post('/api/auth/register').send({ name: 'U Two', email: 'u2@example.com', password: 'U2-Passw0rd-x' })).body
  const mine = await api.post('/api/orders').set(auth(u1.token)).send(order())
  assert.equal(mine.status, 201)
  assert.match(mine.body.id, /^MG[A-Z0-9]{14}$/)
  assert.equal(mine.body.user, u1.user.id)
  assert.equal((await api.get(`/api/orders/${mine.body.id}`)).status, 401) // anonymous
  assert.equal((await api.get(`/api/orders/${mine.body.id}`).set(auth(u2.token))).status, 404) // other customer
  assert.equal((await api.post(`/api/orders/${mine.body.id}/cancel`).set(auth(u2.token))).status, 404)
  assert.equal((await api.get('/api/orders').set(auth(u2.token))).body.length, 0)
  assert.equal((await api.post(`/api/orders/${mine.body.id}/cancel`).set(auth(u1.token))).body.status, 'Cancelled')
})

test('admin query filters cannot be abused with operators', async () => {
  const admin = await User.findOne({ email: 'boss@shop.test' })
  const jwtMod = await import('../src/middleware/index.js')
  const token = jwtMod.signToken(admin)
  const res = await api.get('/api/admin/orders?status[$ne]=Cancelled').set(auth(token))
  assert.equal(res.status, 200)
  assert.equal(res.body.total, 0) // treated as the literal string "[object Object]"-free value, not an operator
  const o = await Order.findOne()
  const bad = await api.patch(`/api/admin/orders/${o.orderId}`).set(auth(token)).send({ tracking: { url: 'javascript:alert(document.cookie)' } })
  assert.equal(bad.status, 422)
  const good = await api.patch(`/api/admin/orders/${o.orderId}`).set(auth(token)).send({ tracking: { courier: 'X', number: '1', url: 'https://track.example.com/1' } })
  assert.equal(good.status, 200)
})

test('suspending a user ends their active session immediately', async () => {
  const admin = await User.findOne({ email: 'boss@shop.test' })
  const adminToken = (await import('../src/middleware/index.js')).signToken(admin)
  const v = (await api.post('/api/auth/register').send({ name: 'Sus', email: 'sus@example.com', password: 'Sus-Passw0rd-1' })).body
  assert.equal((await api.put(`/api/admin/users/${v.user.id}`).set(auth(adminToken)).send({ isBlocked: true })).status, 200)
  assert.equal((await api.get('/api/auth/me').set(auth(v.token))).status, 403) // denied immediately, no waiting for token expiry
  assert.equal((await api.post('/api/auth/login').send({ email: 'sus@example.com', password: 'Sus-Passw0rd-1' })).status, 403)
})

test('email bodies (reset links) are never written to logs outside development', async () => {
  const lines = []
  const origLog = console.log, origWarn = console.warn
  console.log = (...a) => lines.push(a.join(' ')); console.warn = (...a) => lines.push(a.join(' '))
  try { await sendMail({ to: 'x@example.com', subject: 'Reset', text: 'Reset your password: https://shop/reset-password?token=SECRETTOKEN' }) } finally { console.log = origLog; console.warn = origWarn }
  assert.ok(!lines.join('\n').includes('SECRETTOKEN'))
})

test('uploads are served sandboxed with nosniff', async () => {
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==', 'base64')
  const admin = await User.findOne({ email: 'boss@shop.test' })
  const token = (await import('../src/middleware/index.js')).signToken(admin)
  const up = await api.post('/api/admin/upload').set(auth(token)).attach('images', png, { filename: 'a.png', contentType: 'image/png' })
  const path = new URL(up.body.urls[0]).pathname
  const got = await api.get(path)
  assert.equal(got.status, 200)
  assert.equal(got.headers['x-content-type-options'], 'nosniff')
  assert.match(got.headers['content-security-policy'], /sandbox/)
})

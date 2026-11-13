import fs from 'node:fs'
import path from 'node:path'
import { Router } from 'express'
import { z } from 'zod'
import {
  User, Product, Category, Brand, Order, Review, Coupon, Blog, Faq, Testimonial, Subscriber, Message, AuditLog,
} from '../models/index.js'
import rateLimit from 'express-rate-limit'
import { requireAuth, requireAdmin, validate, upload, audit } from '../middleware/index.js'
import { clearPublicCache } from '../middleware/cache.js'
import { asyncHandler, badRequest, conflict, forbidden, notFound, slugify, escapeRegex, paging, pageResult, isObjectId } from '../utils/helpers.js'
import { config } from '../config/env.js'
import { recalcRating } from './catalog.js'
import { restoreStock } from './shop.js'
import { sendMail, html } from '../utils/mailer.js'

const r = Router()
r.use(requireAuth, requireAdmin)
r.use(rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false, skip: () => config.isTest, message: { message: 'Too many admin requests. Please slow down.' } }))
// Every state-changing admin request is recorded (who, what, from where, outcome) - never the request body
r.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    res.on('finish', () => { if (res.statusCode < 400) clearPublicCache() }) // catalogue/content changed
    res.on('finish', () => audit(req, `${req.method} ${req.baseUrl}${req.route?.path ?? req.path}`, req.params.id || req.path, res.statusCode))
  }
  next()
})
const str = (v) => (v === undefined ? undefined : String(v)) // query values are always compared as plain strings

const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]))

/**
 * Generic admin CRUD.  opts: { fields, search, filters, sort, create, update, remove, beforeSave }
 * `fields` is a whitelist (prevents mass-assignment), `filters` maps query params to schema fields.
 */
function crud(path, Model, { fields, search = [], filters = [], sort = { createdAt: -1 }, canCreate = true, canDelete = true, beforeSave, beforeDelete, afterSave } = {}) {
  r.get(path, asyncHandler(async (req, res) => {
    const { page, limit, skip } = paging(req.query, 20)
    const f = {}
    if (req.query.q && search.length) f.$or = search.map((k) => ({ [k]: new RegExp(escapeRegex(String(req.query.q).slice(0, 60)), 'i') }))
    for (const k of filters) if (req.query[k] !== undefined && req.query[k] !== '') { const v = str(req.query[k]); f[k] = v === 'true' ? true : v === 'false' ? false : v }
    const [items, total] = await Promise.all([Model.find(f).sort(sort).skip(skip).limit(limit), Model.countDocuments(f)])
    res.json(pageResult(items, total, page, limit))
  }))
  r.get(`${path}/:id`, asyncHandler(async (req, res) => {
    if (!isObjectId(req.params.id)) throw notFound()
    const d = await Model.findById(req.params.id)
    if (!d) throw notFound()
    res.json(d)
  }))
  if (canCreate)
    r.post(path, asyncHandler(async (req, res) => {
      let data = pick(req.body, fields)
      if (beforeSave) data = (await beforeSave(data, null, req)) || data
      const d = await Model.create(data)
      if (afterSave) await afterSave(d, null)
      res.status(201).json(d)
    }))
  r.put(`${path}/:id`, asyncHandler(async (req, res) => {
    if (!isObjectId(req.params.id)) throw notFound()
    const d = await Model.findById(req.params.id)
    if (!d) throw notFound()
    let data = pick(req.body, fields)
    if (beforeSave) data = (await beforeSave(data, d, req)) || data
    d.set(data)
    await d.save()
    if (afterSave) await afterSave(d, true)
    res.json(d)
  }))
  if (canDelete)
    r.delete(`${path}/:id`, asyncHandler(async (req, res) => {
      if (!isObjectId(req.params.id)) throw notFound()
      const d = await Model.findById(req.params.id)
      if (!d) throw notFound()
      if (beforeDelete) await beforeDelete(d, req)
      await d.deleteOne()
      res.json({ message: 'Deleted' })
    }))
}

// ---------------- uploads ----------------
// The browser-declared MIME type can be faked, so check the real file signature too
const SIGNATURES = { jpg: [[0xff, 0xd8, 0xff]], png: [[0x89, 0x50, 0x4e, 0x47]], webp: [[0x52, 0x49, 0x46, 0x46]] }
const looksLikeImage = (file) => {
  const buf = fs.readFileSync(file.path).subarray(0, 12)
  const ext = path.extname(file.filename).slice(1)
  const ok = SIGNATURES[ext]?.some((sig) => sig.every((b, i) => buf[i] === b))
  return ok && (ext !== 'webp' || buf.subarray(8, 12).toString() === 'WEBP')
}
r.post('/upload', upload.array('images', 8), (req, res) => {
  if (!req.files?.length) throw badRequest('No image received')
  const bad = req.files.filter((f) => !looksLikeImage(f))
  if (bad.length) {
    req.files.forEach((f) => fs.rmSync(f.path, { force: true }))
    throw badRequest('One of the files is not a valid image')
  }
  res.status(201).json({ urls: req.files.map((f) => `${config.publicUrl}/uploads/${f.filename}`) })
})

// ---------------- dashboard ----------------
const LIVE = { $nin: ['Cancelled', 'Pending Payment'] }
r.get('/stats', asyncHandler(async (_req, res) => {
  const now = new Date()
  const day = (n) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - n)
  const [totals, perDay, byStatus, top, recent, lowStock, counts] = await Promise.all([
    Order.aggregate([{ $match: { status: LIVE } }, { $group: { _id: null, revenue: { $sum: '$totals.total' }, orders: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { status: LIVE, createdAt: { $gte: day(29) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: '+05:30' } }, revenue: { $sum: '$totals.total' }, orders: { $sum: 1 } } },
    ]),
    Order.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
    Product.find().sort({ sold: -1 }).limit(5).select('name slug sold price images art colors category'),
    Order.find().sort({ createdAt: -1 }).limit(6),
    Product.find({ isActive: true, stock: { $lte: 5 } }).sort({ stock: 1 }).limit(8).select('name slug stock images art colors'),
    Promise.all([User.countDocuments({ role: 'user' }), Product.countDocuments(), Order.countDocuments(), Message.countDocuments({ status: 'new' }), Subscriber.countDocuments(), Order.countDocuments({ status: 'Processing' })]),
  ])
  const map = new Map(perDay.map((d) => [d._id, d]))
  const series = Array.from({ length: 30 }, (_, i) => {
    const d = day(29 - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return { date: key, revenue: map.get(key)?.revenue || 0, orders: map.get(key)?.orders || 0 }
  })
  const last30 = series.reduce((s, d) => s + d.revenue, 0)
  const [customers, products, orders, newMessages, subscribers, toProcess] = counts
  res.json({
    revenue: totals[0]?.revenue || 0, paidOrders: totals[0]?.orders || 0, last30Revenue: last30,
    customers, products, orders, newMessages, subscribers, toProcess,
    series, byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.n])),
    topProducts: top, recentOrders: recent, lowStock,
  })
}))

// ---------------- catalogue ----------------
const mustFind = async (Model, slug, label) => {
  const d = await Model.findOne({ slug })
  if (!d) throw badRequest(`Unknown ${label}: ${slug}`)
  return d
}
const uniqueSlug = async (Model, base, ignoreId) => {
  let slug = slugify(base) || 'item', n = 1
  while (await Model.exists({ slug, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) })) slug = `${slugify(base)}-${++n}`
  return slug
}
const num = (v) => (v === '' || v === null || v === undefined ? undefined : Number(v))

crud('/products', Product, {
  fields: ['name', 'brand', 'category', 'subtitle', 'price', 'mrp', 'art', 'colors', 'sizes', 'stock', 'bestseller', 'newArrival', 'trending', 'isActive', 'features', 'specs', 'description', 'images'],
  search: ['name', 'brandName', 'categoryName', 'slug'],
  filters: ['category', 'brand', 'isActive'],
  async beforeSave(data, existing, req) {
    if (req.body.isNew !== undefined) data.newArrival = !!req.body.isNew // `isNew` is reserved by Mongoose
    for (const k of ['price', 'mrp', 'stock']) if (data[k] !== undefined) data[k] = num(data[k])
    const price = data.price ?? existing?.price, mrp = data.mrp ?? existing?.mrp
    if (!existing && !(data.name && price >= 0 && mrp >= 0 && data.brand && data.category)) throw badRequest('Name, brand, category, price and MRP are required')
    if (mrp < price) throw badRequest('MRP cannot be lower than the selling price')
    if (data.stock !== undefined && (!Number.isInteger(data.stock) || data.stock < 0)) throw badRequest('Stock must be a whole number (0 or more)')
    if (data.brand) data.brandName = (await mustFind(Brand, data.brand, 'brand')).name
    if (data.category) data.categoryName = (await mustFind(Category, data.category, 'category')).name
    if (!existing) data.slug = await uniqueSlug(Product, data.name)
    if (data.colors) data.colors = data.colors.filter((c) => c?.name && /^#[0-9a-f]{6}$/i.test(c.hex || ''))
    if (data.sizes) data.sizes = data.sizes.map((s) => String(s).trim()).filter(Boolean)
    if (data.features) data.features = data.features.map((s) => String(s).trim()).filter(Boolean)
    if (data.specs) data.specs = data.specs.filter((s) => s?.label && s?.value)
    if (data.images) data.images = data.images.filter((u) => typeof u === 'string' && /^(https?:)?\/\//.test(u) || String(u).startsWith('/'))
    if (!existing && !data.colors?.length) data.colors = [{ name: 'Matte Black', hex: '#3a3f47' }]
    return data
  },
  async beforeDelete(p) {
    if (await Order.exists({ 'items.id': String(p._id) })) throw conflict('This product has orders. Deactivate it instead of deleting.')
  },
})

crud('/categories', Category, {
  fields: ['name', 'tagline', 'description', 'art', 'color', 'photo', 'image', 'sortOrder', 'isActive'],
  search: ['name', 'slug'], sort: { sortOrder: 1, name: 1 },
  async beforeSave(data, existing, req) {
    if (!existing) {
      if (!data.name) throw badRequest('Name is required')
      data.slug = await uniqueSlug(Category, req.body.slug || data.name)
    }
    return data
  },
  async afterSave(d, updated) { if (updated) await Product.updateMany({ category: d.slug }, { categoryName: d.name }) },
  async beforeDelete(c) {
    if (await Product.exists({ category: c.slug })) throw conflict('This category still has products. Move or delete them first.')
  },
})

crud('/brands', Brand, {
  fields: ['name', 'country', 'founded', 'style', 'tagline', 'about', 'logo', 'isActive'],
  search: ['name', 'slug'], sort: { name: 1 },
  async beforeSave(data, existing, req) {
    if (!existing) {
      if (!data.name) throw badRequest('Name is required')
      data.slug = await uniqueSlug(Brand, req.body.slug || data.name)
    }
    if (data.founded !== undefined) data.founded = num(data.founded)
    return data
  },
  async afterSave(d, updated) { if (updated) await Product.updateMany({ brand: d.slug }, { brandName: d.name }) },
  async beforeDelete(b) {
    if (await Product.exists({ brand: b.slug })) throw conflict('This brand still has products. Move or delete them first.')
  },
})

// ---------------- marketing & content ----------------
crud('/coupons', Coupon, {
  fields: ['code', 'type', 'value', 'minOrder', 'maxDiscount', 'description', 'active', 'hidden', 'expiresAt', 'usageLimit'],
  search: ['code', 'description'],
  async beforeSave(data) {
    for (const k of ['value', 'minOrder', 'maxDiscount', 'usageLimit']) if (data[k] !== undefined) data[k] = num(data[k]) || 0
    if (data.code) data.code = String(data.code).trim().toUpperCase().replace(/\s+/g, '')
    if (data.type === 'percent' && (data.value <= 0 || data.value > 100)) throw badRequest('Percent value must be between 1 and 100')
    if (data.type === 'flat' && data.value <= 0) throw badRequest('Flat discount must be greater than 0')
    if (data.expiresAt === '') data.expiresAt = null
    return data
  },
})

const bodyToArray = (text) => {
  if (Array.isArray(text)) return text
  return String(text || '').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean).map((b) => (b.startsWith('## ') ? ['h', b.slice(3).trim()] : ['p', b.replace(/\n/g, ' ')]))
}
crud('/blogs', Blog, {
  fields: ['title', 'excerpt', 'category', 'photo', 'image', 'author', 'date', 'readTime', 'body', 'published'],
  search: ['title', 'category'], sort: { date: -1 },
  async beforeSave(data, existing) {
    if (data.body !== undefined) data.body = bodyToArray(data.body)
    if (data.readTime !== undefined) data.readTime = num(data.readTime) || 5
    if (!existing) {
      if (!data.title) throw badRequest('Title is required')
      data.slug = await uniqueSlug(Blog, data.title)
    }
    return data
  },
})
crud('/faqs', Faq, { fields: ['q', 'a', 'order'], search: ['q'], sort: { order: 1, createdAt: 1 } })
crud('/testimonials', Testimonial, { fields: ['name', 'city', 'bike', 'rating', 'text', 'active'], search: ['name', 'text'] })

// ---------------- inbox ----------------
crud('/messages', Message, { fields: ['status'], search: ['name', 'email', 'subject', 'message'], filters: ['status'], canCreate: false })
crud('/subscribers', Subscriber, { fields: [], search: ['email'], canCreate: false })
r.get('/subscribers-export/csv', asyncHandler(async (_req, res) => {
  const rows = await Subscriber.find().sort({ createdAt: -1 })
  res.type('text/csv').attachment('subscribers.csv').send('email,subscribed_at\n' + rows.map((s) => `${s.email},${s.createdAt.toISOString()}`).join('\n'))
}))

crud('/reviews', Review, {
  fields: [], search: ['author', 'productSlug', 'text'], filters: ['rating', 'productSlug'], canCreate: false, canDelete: false,
})
// custom delete so the product's rating is recalculated
r.delete('/reviews/:id', asyncHandler(async (req, res) => {
  const rev = await Review.findById(req.params.id)
  if (!rev) throw notFound()
  await rev.deleteOne()
  await recalcRating(rev.product)
  res.json({ message: 'Deleted' })
}))

// ---------------- orders ----------------
r.get('/orders', asyncHandler(async (req, res) => {
  const { page, limit, skip } = paging(req.query, 20)
  const f = {}
  if (req.query.status) f.status = str(req.query.status)
  if (req.query.payment) f['payment.status'] = str(req.query.payment)
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(String(req.query.q).slice(0, 60)), 'i')
    f.$or = [{ orderId: rx }, { 'customer.name': rx }, { 'customer.email': rx }, { 'customer.phone': rx }]
  }
  if (req.query.from || req.query.to) f.createdAt = { ...(req.query.from ? { $gte: new Date(req.query.from) } : {}), ...(req.query.to ? { $lte: new Date(new Date(req.query.to).getTime() + 86400000) } : {}) }
  const [items, total] = await Promise.all([Order.find(f).sort({ createdAt: -1 }).skip(skip).limit(limit), Order.countDocuments(f)])
  res.json(pageResult(items, total, page, limit))
}))
r.get('/orders/:id', asyncHandler(async (req, res) => {
  const o = await Order.findOne({ orderId: req.params.id.toUpperCase() }).populate('user', 'name email phone')
  if (!o) throw notFound('Order not found')
  res.json(o)
}))

const STATUS_FLOW = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered']
r.patch('/orders/:id', validate(z.object({
  status: z.enum(['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']).optional(),
  note: z.string().max(300).optional(),
  tracking: z.object({
    courier: z.string().max(60).optional(), number: z.string().max(60).optional(),
    // only http(s) links: blocks javascript:/data: URLs that would run in the customer's browser
    url: z.string().max(300).refine((v) => v === '' || /^https?:\/\/[^\s]+$/i.test(v), 'Tracking link must start with http:// or https://').optional(),
  }).optional(),
  paymentStatus: z.enum(['Paid', 'Pending', 'Pay on delivery', 'Refund pending', 'Refunded', 'Failed']).optional(),
})), asyncHandler(async (req, res) => {
  const o = await Order.findOne({ orderId: req.params.id.toUpperCase() })
  if (!o) throw notFound('Order not found')
  const { status, note, tracking, paymentStatus } = req.body
  if (tracking) o.tracking = { ...(o.tracking?.toObject?.() || {}), ...tracking }
  if (paymentStatus) {
    o.payment.status = paymentStatus
    if (paymentStatus === 'Paid' && !o.payment.paidAt) o.payment.paidAt = new Date()
  }
  if (status && status !== o.status) {
    if (o.status === 'Cancelled') throw badRequest('A cancelled order cannot be reopened')
    if (o.status === 'Pending Payment' && status !== 'Cancelled') throw badRequest('Waiting for payment. You can only cancel this order until it is paid.')
    if (o.status === 'Delivered' && status !== 'Cancelled') throw badRequest('This order is already delivered')
    if (status === 'Cancelled') {
      o.cancelledAt = new Date()
      if (o.payment.status === 'Paid') o.payment.status = 'Refund pending'
      await restoreStock(o)
    } else if (STATUS_FLOW.indexOf(status) < STATUS_FLOW.indexOf(o.status)) throw badRequest('Orders cannot move backwards')
    if (status === 'Delivered' && o.payment.method === 'cod') { o.payment.status = 'Paid'; o.payment.paidAt = new Date() }
    o.status = status
    o.statusHistory.push({ status, at: new Date(), note: note || '' })
    if (['Shipped', 'Delivered', 'Cancelled'].includes(status))
      sendMail({
        to: o.customer.email, subject: `Your order ${o.orderId} is ${status.toLowerCase()}`,
        html: html(`Order ${status}`, `<p>Order <b>${o.orderId}</b> is now <b>${status}</b>.</p>${o.tracking?.number ? `<p>Tracking: ${o.tracking.courier || ''} ${o.tracking.number}</p>` : ''}${note ? `<p>${note.replace(/</g, '&lt;')}</p>` : ''}`),
        text: `Order ${o.orderId} is ${status}.`,
      })
  }
  o.markModified('payment')
  await o.save()
  res.json(o)
}))

// ---------------- security trail ----------------
r.get('/audit', asyncHandler(async (req, res) => {
  const { page, limit, skip } = paging(req.query, 25)
  const f = {}
  if (req.query.q) { const rx = new RegExp(escapeRegex(String(req.query.q).slice(0, 60)), 'i'); f.$or = [{ action: rx }, { actorEmail: rx }, { target: rx }, { ip: rx }] }
  const [items, total] = await Promise.all([AuditLog.find(f).sort({ at: -1 }).skip(skip).limit(limit), AuditLog.countDocuments(f)])
  res.json(pageResult(items, total, page, limit))
}))

// ---------------- customers ----------------
r.get('/users', asyncHandler(async (req, res) => {
  const { page, limit, skip } = paging(req.query, 20)
  const f = {}
  if (req.query.role) f.role = str(req.query.role)
  if (req.query.blocked === 'true') f.isBlocked = true
  if (req.query.q) { const rx = new RegExp(escapeRegex(String(req.query.q).slice(0, 60)), 'i'); f.$or = [{ name: rx }, { email: rx }, { phone: rx }] }
  const [users, total] = await Promise.all([User.find(f).sort({ createdAt: -1 }).skip(skip).limit(limit), User.countDocuments(f)])
  const stats = await Order.aggregate([{ $match: { user: { $in: users.map((u) => u._id) }, status: LIVE } }, { $group: { _id: '$user', orders: { $sum: 1 }, spent: { $sum: '$totals.total' } } }])
  const m = new Map(stats.map((s) => [String(s._id), s]))
  res.json(pageResult(users.map((u) => ({ ...u.toJSON(), orders: m.get(String(u._id))?.orders || 0, spent: m.get(String(u._id))?.spent || 0 })), total, page, limit))
}))
r.put('/users/:id', validate(z.object({ role: z.enum(['user', 'admin']).optional(), isBlocked: z.boolean().optional() })), asyncHandler(async (req, res) => {
  const u = await User.findById(req.params.id)
  if (!u) throw notFound('User not found')
  if (String(u._id) === String(req.user._id)) throw forbidden('You cannot change your own role or suspend yourself')
  Object.assign(u, req.body)
  if (req.body.isBlocked || req.body.role) u.tokenVersion = (u.tokenVersion || 0) + 1 // end their active sessions on suspension / role change
  await u.save()
  res.json(u)
}))

export default r

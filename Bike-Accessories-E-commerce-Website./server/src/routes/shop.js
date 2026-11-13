import { Router } from 'express'
import express from 'express'
import { z } from 'zod'
import { Coupon, Product, Order, User } from '../models/index.js'
import { requireAuth, validate } from '../middleware/index.js'
import { asyncHandler, badRequest, conflict, forbidden, notFound, isObjectId, makeOrderId } from '../utils/helpers.js'
import { calcTotals, DELIVERY_OPTIONS, FREE_SHIPPING_ABOVE, STANDARD_SHIPPING } from '../utils/pricing.js'
import { createRazorpayOrder, paymentsEnabled, verifyCheckoutSignature, verifyWebhookSignature } from '../utils/razorpay.js'
import { sendMail, html } from '../utils/mailer.js'
import { config } from '../config/env.js'
import { formatPrice } from '../utils/format.js'
import { clearPublicCache, publicCache } from '../middleware/cache.js'

const r = Router()

// ---------- public config ----------
r.get('/config', (_req, res) => res.json({
  paymentsEnabled: paymentsEnabled(),
  adminTwoFactorRequired: config.requireAdmin2fa,
  razorpayKeyId: config.razorpay?.keyId || null,
  freeShippingAbove: FREE_SHIPPING_ABOVE,
  standardShipping: STANDARD_SHIPPING,
  deliveryOptions: DELIVERY_OPTIONS,
}))

// ---------- coupons ----------
const publicCoupon = (c) => ({ code: c.code, type: c.type, value: c.value, minOrder: c.minOrder, maxDiscount: c.maxDiscount || undefined, description: c.description })

export async function findValidCoupon(code, subtotal = Infinity) {
  const c = await Coupon.findOne({ code: String(code || '').trim().toUpperCase() })
  if (!c || !c.active) throw notFound('Invalid coupon code')
  if (c.expiresAt && c.expiresAt < new Date()) throw badRequest('This coupon has expired')
  if (c.usageLimit && c.usedCount >= c.usageLimit) throw badRequest('This coupon has reached its usage limit')
  if (subtotal < c.minOrder) throw badRequest(`Add items worth ₹${Math.ceil(c.minOrder - subtotal)} more to use ${c.code}`)
  return c
}

r.get('/coupons', publicCache(), asyncHandler(async (_req, res) => {
  const now = new Date()
  const list = await Coupon.find({ active: true, hidden: false, $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] }).sort({ createdAt: -1 })
  res.json(list.map(publicCoupon))
}))
r.post('/cart/coupon', validate(z.object({ code: z.string().min(1), subtotal: z.coerce.number().min(0) })), asyncHandler(async (req, res) => {
  res.json(publicCoupon(await findValidCoupon(req.body.code, req.body.subtotal)))
}))

// ---------- cart & wishlist (synced for signed-in users) ----------
r.get('/cart', requireAuth, (req, res) => res.json(req.user.cart || { items: [], coupon: null }))
r.put('/cart', requireAuth, validate(z.object({ items: z.array(z.any()).max(50), coupon: z.any().optional().nullable() })), asyncHandler(async (req, res) => {
  req.user.cart = { items: req.body.items, coupon: req.body.coupon ?? null }
  req.user.markModified('cart')
  await req.user.save()
  res.json(req.user.cart)
}))
r.get('/wishlist', requireAuth, (req, res) => res.json(req.user.wishlist || []))
r.put('/wishlist', requireAuth, validate(z.object({ ids: z.array(z.string().regex(/^[a-f\d]{24}$/i)).max(200) })), asyncHandler(async (req, res) => {
  req.user.wishlist = req.body.ids
  await req.user.save()
  res.json(req.user.wishlist)
}))

// ---------- orders ----------
const addr = z.object({
  name: z.string().trim().min(2, 'Name is required').max(80),
  phone: z.string().trim().regex(/^(\+?91)?[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  line1: z.string().trim().min(3, 'Address is required').max(200),
  line2: z.string().trim().max(200).optional().default(''),
  city: z.string().trim().min(2, 'City is required').max(80),
  state: z.string().trim().min(2, 'State is required').max(80),
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, 'Enter a valid 6-digit pincode'),
})
const orderBody = z.object({
  customer: z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().toLowerCase().email('Enter a valid email address'), phone: addr.shape.phone }),
  items: z.array(z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid product'),
    qty: z.coerce.number().int().min(1).max(10),
    size: z.string().max(10).nullish(),
    colorName: z.string().max(40).nullish(),
  })).min(1, 'Your cart is empty').max(30),
  shippingAddress: addr,
  billingAddress: addr.optional(),
  delivery: z.object({ id: z.enum(['standard', 'express', 'nextday']) }).passthrough(),
  payment: z.object({ method: z.enum(['upi', 'card', 'netbanking', 'cod']) }).passthrough(),
  coupon: z.string().max(30).nullish(),
  notes: z.string().max(500).optional().default(''),
})

export async function restoreStock(order) {
  await Promise.all(order.items.map((i) => Product.updateOne({ _id: i.id }, { $inc: { stock: i.qty, sold: -i.qty } })))
  clearPublicCache() // stock changed
}

function checkoutInfo(order) {
  if (order.status !== 'Pending Payment' || !order.payment?.razorpayOrderId || !config.razorpay) return undefined
  return { keyId: config.razorpay.keyId, orderId: order.payment.razorpayOrderId, amount: Math.round(order.totals.total * 100), currency: 'INR' }
}
const serialize = (order) => {
  const o = order.toJSON()
  if (o.payment) o.payment = { ...o.payment, razorpayPaymentId: undefined, checkout: checkoutInfo(order) }
  return o
}

async function sendOrderEmails(order) {
  const rows = order.items.map((i) => `<li>${i.qty} × ${String(i.name).replace(/</g, '&lt;')} - ${formatPrice(i.price * i.qty)}</li>`).join('')
  await sendMail({
    to: order.customer.email, subject: `Order ${order.orderId} confirmed`,
    html: html(`Thanks for your order, ${order.customer.name.split(' ')[0]}!`, `<p>Order <b>${order.orderId}</b> is confirmed.</p><ul>${rows}</ul><p><b>Total: ${formatPrice(order.totals.total)}</b></p><p>Estimated delivery: ${order.estimatedDelivery.toDateString()}</p>`),
    text: `Order ${order.orderId} confirmed. Total ${formatPrice(order.totals.total)}.`,
  })
  if (config.adminNotifyEmail)
    await sendMail({ to: config.adminNotifyEmail, subject: `New order ${order.orderId} (${formatPrice(order.totals.total)})`, html: html('New order received', `<p>${order.orderId} - ${order.customer.name} - ${formatPrice(order.totals.total)} - ${order.payment.method}</p>`), text: `New order ${order.orderId}` })
}

// Ordering requires an account: guests can browse and fill a cart, but cannot place orders
r.post('/orders', requireAuth, validate(orderBody), asyncHandler(async (req, res) => {
  const b = req.body
  if (b.payment.method !== 'cod' && !paymentsEnabled()) throw badRequest('Online payment is not available right now. Please choose Cash on Delivery.')

  // 1. Load authoritative product data - never trust prices coming from the browser
  const ids = [...new Set(b.items.map((i) => i.id))]
  const products = new Map((await Product.find({ _id: { $in: ids }, isActive: true })).map((p) => [String(p._id), p]))
  const lines = []
  const need = new Map()
  for (const it of b.items) {
    const p = products.get(it.id)
    if (!p) throw badRequest('One of the items in your cart is no longer available')
    if (p.sizes.length && !p.sizes.includes(it.size)) throw badRequest(`Please select a size for ${p.name}`)
    const color = p.colors.find((c) => c.name === it.colorName) || p.colors[0]
    need.set(it.id, (need.get(it.id) || 0) + it.qty)
    lines.push({ id: String(p._id), slug: p.slug, name: p.name, brandName: p.brandName, price: p.price, mrp: Math.max(p.mrp, p.price), art: p.art, category: p.category, image: p.images?.[0], colorName: color?.name || null, colorHex: color?.hex || null, size: it.size || null, qty: it.qty })
  }
  for (const [id, qty] of need) if (products.get(id).stock < qty) throw conflict(`Only ${products.get(id).stock} left of ${products.get(id).name}`)

  // 2. Coupon + totals
  const rawSubtotal = lines.reduce((s, l) => s + l.price * l.qty, 0)
  const coupon = b.coupon ? await findValidCoupon(b.coupon, rawSubtotal) : null
  const totals = calcTotals(lines, coupon, b.delivery.id)

  // 3. Reserve stock atomically (rolled back on any failure)
  const reserved = []
  try {
    for (const [id, qty] of need) {
      const ok = await Product.updateOne({ _id: id, stock: { $gte: qty } }, { $inc: { stock: -qty, sold: qty } })
      if (!ok.modifiedCount) throw conflict(`${products.get(id).name} just went out of stock`)
      reserved.push([id, qty])
    }
  } catch (e) {
    await Promise.all(reserved.map(([id, qty]) => Product.updateOne({ _id: id }, { $inc: { stock: qty, sold: -qty } })))
    throw e
  }

  // 4. Create order (+ Razorpay order for online methods)
  const delivery = DELIVERY_OPTIONS.find((d) => d.id === b.delivery.id)
  const online = b.payment.method !== 'cod'
  const days = { standard: 5, express: 3, nextday: 1 }[delivery.id]
  const orderId = makeOrderId()
  let rz
  try {
    if (online) rz = await createRazorpayOrder({ amount: totals.total, receipt: orderId })
    const order = await Order.create({
      orderId, user: req.user._id, customer: b.customer, items: lines,
      shippingAddress: b.shippingAddress, billingAddress: b.billingAddress || b.shippingAddress,
      delivery, coupon: coupon?.code || null, totals, notes: b.notes,
      payment: online ? { method: b.payment.method, status: 'Pending', gateway: 'razorpay', razorpayOrderId: rz.id } : { method: 'cod', status: 'Pay on delivery' },
      status: online ? 'Pending Payment' : 'Processing',
      statusHistory: [{ status: online ? 'Pending Payment' : 'Processing', at: new Date(), note: 'Order placed' }],
      estimatedDelivery: new Date(Date.now() + days * 86400000),
    })
    if (coupon) await Coupon.updateOne({ _id: coupon._id }, { $inc: { usedCount: 1 } })
    clearPublicCache() // stock changed
    if (!online) sendOrderEmails(order)
    res.status(201).json(serialize(order))
  } catch (e) {
    await Promise.all(reserved.map(([id, qty]) => Product.updateOne({ _id: id }, { $inc: { stock: qty, sold: -qty } })))
    throw e
  }
}))

const findOrder = async (id) => {
  const o = await Order.findOne({ orderId: String(id).toUpperCase() })
  if (!o) throw notFound('Order not found')
  return o
}
// an order is visible only to the account that placed it (or an admin)
const canView = (order, user) => !!user && !!order.user && (String(order.user) === String(user._id) || user.role === 'admin')

r.get('/orders', requireAuth, asyncHandler(async (req, res) => {
  res.json((await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100)).map(serialize))
}))
r.get('/orders/:id', requireAuth, asyncHandler(async (req, res) => {
  const o = await findOrder(req.params.id)
  if (!canView(o, req.user)) throw notFound('Order not found')
  res.json(serialize(o))
}))

r.post('/orders/:id/cancel', requireAuth, asyncHandler(async (req, res) => {
  const o = await findOrder(req.params.id)
  if (!canView(o, req.user)) throw notFound('Order not found')
  if (!['Pending Payment', 'Processing'].includes(o.status)) throw badRequest('This order can no longer be cancelled. Please contact support.')
  o.status = 'Cancelled'
  o.cancelledAt = new Date()
  o.statusHistory.push({ status: 'Cancelled', at: new Date(), note: 'Cancelled by customer' })
  if (o.payment.status === 'Paid') o.payment.status = 'Refund pending'
  await o.save()
  await restoreStock(o)
  res.json(serialize(o))
}))

const markPaid = async (o, paymentId) => {
  if (o.payment.status === 'Paid') return false
  o.payment.status = 'Paid'
  o.payment.razorpayPaymentId = paymentId
  o.payment.paidAt = new Date()
  if (o.status === 'Pending Payment') {
    o.status = 'Processing'
    o.statusHistory.push({ status: 'Processing', at: new Date(), note: 'Payment received' })
  }
  await o.save()
  return true
}

r.post('/orders/:id/verify-payment', requireAuth, validate(z.object({ razorpay_order_id: z.string(), razorpay_payment_id: z.string(), razorpay_signature: z.string() })), asyncHandler(async (req, res) => {
  const o = await findOrder(req.params.id)
  if (!canView(o, req.user)) throw notFound('Order not found')
  const { razorpay_order_id: rid, razorpay_payment_id: pid, razorpay_signature: sig } = req.body
  if (o.payment.razorpayOrderId !== rid || !verifyCheckoutSignature({ orderId: rid, paymentId: pid, signature: sig })) throw badRequest('Payment verification failed')
  if (o.status === 'Cancelled') throw badRequest('This order was cancelled. If money was deducted it will be refunded.')
  if (await markPaid(o, pid)) sendOrderEmails(o)
  res.json(serialize(o))
}))

// Razorpay webhook - mounted with a raw body parser (see app.js); safety net if the browser closes mid-payment
export const razorpayWebhook = [
  express.raw({ type: 'application/json', limit: '1mb' }),
  asyncHandler(async (req, res) => {
    if (!verifyWebhookSignature(req.body, req.headers['x-razorpay-signature'])) return res.status(400).json({ message: 'Invalid signature' })
    const event = JSON.parse(req.body.toString('utf8'))
    const pay = event.payload?.payment?.entity
    if (['payment.captured', 'order.paid'].includes(event.event) && pay?.order_id) {
      const o = await Order.findOne({ 'payment.razorpayOrderId': pay.order_id })
      // never trust the event blindly: the captured amount must equal what this order costs
      if (o && o.status !== 'Cancelled' && Number(pay.amount) === Math.round(o.totals.total * 100) && (await markPaid(o, pay.id))) sendOrderEmails(o)
    }
    res.json({ received: true })
  }),
]

export default r

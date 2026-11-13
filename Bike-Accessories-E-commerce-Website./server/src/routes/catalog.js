import { Router } from 'express'
import { z } from 'zod'
import { Product, Category, Brand, Review, Order } from '../models/index.js'
import { requireAuth, validate } from '../middleware/index.js'
import { publicCache, clearPublicCache } from '../middleware/cache.js'
import { asyncHandler, notFound, conflict, escapeRegex, isObjectId, paging, pageResult } from '../utils/helpers.js'

const r = Router()
const cached = publicCache()
// Product cards never show the long fields; leaving them out roughly halves list payloads
const CARD_FIELDS = '-description -specs -features'

const csv = (v) => (v ? String(v).split(',').map((s) => s.trim()).filter(Boolean) : [])

const SORTS = {
  popular: { sold: -1, reviewCount: -1, createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  newest: { createdAt: -1 },
  rating: { rating: -1, reviewCount: -1 },
}

export function productFilter(q) {
  const f = { isActive: true }
  if (q.q) {
    const rx = new RegExp(escapeRegex(String(q.q).slice(0, 60)), 'i')
    f.$or = [{ name: rx }, { brandName: rx }, { categoryName: rx }, { subtitle: rx }]
  }
  if (csv(q.category).length) f.category = { $in: csv(q.category) }
  if (csv(q.brand).length) f.brand = { $in: csv(q.brand) }
  if (q.minPrice || q.maxPrice) f.price = { ...(q.minPrice ? { $gte: Number(q.minPrice) } : {}), ...(q.maxPrice ? { $lte: Number(q.maxPrice) } : {}) }
  if (q.rating) f.rating = { $gte: Number(q.rating) }
  if (q.inStock === 'true') f.stock = { $gt: 0 }
  if (q.tag === 'bestseller') f.bestseller = true
  if (q.tag === 'new') f.newArrival = true
  if (q.tag === 'trending') f.trending = true
  return f
}

r.get('/products', cached, asyncHandler(async (req, res) => {
  const { page, limit, skip } = paging(req.query, 12, 60)
  const filter = productFilter(req.query)
  const [items, total] = await Promise.all([
    Product.find(filter).select(CARD_FIELDS).sort(SORTS[req.query.sort] || SORTS.popular).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ])
  res.json(pageResult(items, total, page, limit))
}))

r.get('/products/facets', cached, asyncHandler(async (req, res) => {
  const base = { isActive: true, ...(req.query.q ? { name: new RegExp(escapeRegex(String(req.query.q).slice(0, 60)), 'i') } : {}) }
  const count = async (field) => Object.fromEntries((await Product.aggregate([{ $match: base }, { $group: { _id: `$${field}`, n: { $sum: 1 } } }])).map((x) => [x._id, x.n]))
  const [categories, brands, max, total] = await Promise.all([count('category'), count('brand'), Product.findOne({ isActive: true }).sort({ price: -1 }).select('price'), Product.countDocuments(base)])
  res.json({ categories, brands, maxPrice: max?.price || 10000, total })
}))

r.get('/products/by-ids', cached, asyncHandler(async (req, res) => {
  const ids = csv(req.query.ids).filter(isObjectId).slice(0, 50)
  const found = await Product.find({ _id: { $in: ids }, isActive: true }).select(CARD_FIELDS)
  const map = new Map(found.map((p) => [String(p._id), p]))
  res.json(ids.map((id) => map.get(id)).filter(Boolean))
}))

const findBySlug = async (slug) => {
  const p = await Product.findOne({ slug, isActive: true })
  if (!p) throw notFound('Product not found')
  return p
}

r.get('/products/:slug', cached, asyncHandler(async (req, res) => res.json(await findBySlug(req.params.slug))))

r.get('/products/:slug/related', cached, asyncHandler(async (req, res) => {
  const p = await findBySlug(req.params.slug)
  const same = await Product.find({ isActive: true, category: p.category, _id: { $ne: p._id } }).select(CARD_FIELDS).sort({ sold: -1, rating: -1 }).limit(4)
  if (same.length >= 4) return res.json(same)
  const more = await Product.find({ isActive: true, brand: p.brand, _id: { $nin: [p._id, ...same.map((s) => s._id)] } }).select(CARD_FIELDS).limit(4 - same.length)
  res.json([...same, ...more])
}))

r.get('/products/:slug/reviews', cached, asyncHandler(async (req, res) => {
  res.json(await Review.find({ productSlug: req.params.slug }).sort({ createdAt: -1 }).limit(100))
}))

export async function recalcRating(productId) {
  const [agg] = await Review.aggregate([{ $match: { product: productId } }, { $group: { _id: null, avg: { $avg: '$rating' }, n: { $sum: 1 } } }])
  await Product.updateOne({ _id: productId }, { rating: agg ? Math.round(agg.avg * 10) / 10 : 0, reviewCount: agg?.n || 0 })
}

r.post('/products/:slug/reviews', requireAuth, validate(z.object({
  rating: z.coerce.number().int().min(1, 'Please add a rating').max(5),
  title: z.string().trim().max(100).optional().default(''),
  text: z.string().trim().min(10, 'Write at least 10 characters').max(2000),
})), asyncHandler(async (req, res) => {
  const product = await findBySlug(req.params.slug)
  if (await Review.exists({ product: product._id, user: req.user._id })) throw conflict('You have already reviewed this product')
  const verified = !!(await Order.exists({ user: req.user._id, status: { $in: ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'] }, 'items.id': String(product._id) }))
  const review = await Review.create({ product: product._id, productSlug: product.slug, user: req.user._id, author: req.user.name, verified, ...req.body })
  await recalcRating(product._id)
  clearPublicCache()
  res.status(201).json(review)
}))

// ---- categories & brands ----
const withCounts = async (docs, field) => {
  const agg = await Product.aggregate([{ $match: { isActive: true } }, { $group: { _id: `$${field}`, n: { $sum: 1 } } }])
  const m = Object.fromEntries(agg.map((x) => [x._id, x.n]))
  return docs.map((d) => ({ ...d.toJSON(), count: m[d.slug] || 0 }))
}
r.get('/categories', cached, asyncHandler(async (_req, res) => res.json(await withCounts(await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }), 'category'))))
r.get('/categories/:slug', cached, asyncHandler(async (req, res) => {
  const c = await Category.findOne({ slug: req.params.slug, isActive: true })
  if (!c) throw notFound('Category not found')
  res.json((await withCounts([c], 'category'))[0])
}))
r.get('/brands', cached, asyncHandler(async (_req, res) => res.json(await withCounts(await Brand.find({ isActive: true }).sort({ name: 1 }), 'brand'))))
r.get('/brands/:slug', cached, asyncHandler(async (req, res) => {
  const b = await Brand.findOne({ slug: req.params.slug, isActive: true })
  if (!b) throw notFound('Brand not found')
  res.json((await withCounts([b], 'brand'))[0])
}))

export default r

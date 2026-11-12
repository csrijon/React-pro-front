import { AxiosError } from 'axios'
import { products, getProductBySlug } from '../../data/products'
import { categories, getCategory } from '../../data/categories'
import { brands, getBrand } from '../../data/brands'
import { blogs, getBlog } from '../../data/blogs'
import { testimonials, faqs, coupons, policies, team, stats } from '../../data/content'
import { storage, KEYS } from '../../utils/storage'

/**
 * A tiny in-browser REST server. It plugs into axios as a custom adapter, so services
 * call `api.get('/products')` exactly as they would against a real backend.
 * Replace by setting VITE_USE_MOCK=false - no UI code changes needed.
 */

const LATENCY = 350
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

class HttpError extends Error {
  constructor(status, message, errors) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

const uid = (p = '') => p + Math.random().toString(36).slice(2, 10).toUpperCase()

// Seed one demo account so the app can be explored immediately in mock mode
export const DEMO_USER = { email: 'demo@motogear.in', password: 'Demo@1234' }
;(function seed() {
  const users = storage.get(KEYS.users, [])
  if (!users.some((u) => u.email === DEMO_USER.email)) {
    storage.set(KEYS.users, [...users, { id: 'UDEMO01', name: 'Demo Rider', email: DEMO_USER.email, phone: '9876543210', password: DEMO_USER.password, bike: 'Royal Enfield Himalayan', createdAt: '2026-01-15T10:00:00.000Z' }])
  }
})()

// ---------- helpers ----------
const authUser = (config) => {
  const token = (config.headers?.Authorization || '').replace('Bearer ', '')
  if (!token.startsWith('mock.')) return null
  const users = storage.get(KEYS.users, [])
  return users.find((u) => u.id === token.slice(5)) || null
}
const requireUser = (config) => {
  const u = authUser(config)
  if (!u) throw new HttpError(401, 'Please sign in to continue')
  return u
}
const publicUser = ({ password, resetToken, ...u }) => u

const seededReviews = (p) => {
  const names = ['Rahul S.', 'Priya K.', 'Aman V.', 'Sneha R.', 'Kunal M.', 'Divya P.', 'Sourav D.', 'Meera T.']
  const titles = ['Excellent quality', 'Worth every rupee', 'Great fit and finish', 'Highly recommended', 'Good, but pricey', 'Perfect for daily rides']
  const texts = [
    'Build quality is superb and it feels premium. Delivery was quick and packaging was secure.',
    'Used it on a 600 km highway ride and it performed flawlessly. Very comfortable.',
    'Fits exactly as described. The finish looks even better in person.',
    'Genuine product with warranty card. Would buy again from MotoGear.',
    'Does the job well. Took a day to get used to but now I love it.',
  ]
  const n = Math.min(6, 3 + (p.reviewCount % 4))
  return Array.from({ length: n }, (_, i) => ({
    id: `${p.id}-r${i}`,
    author: names[(p.id.charCodeAt(2) + i) % names.length],
    rating: Math.max(3, Math.min(5, Math.round(p.rating + ((i % 3) - 1) * 0.6))),
    title: titles[(i + p.reviewCount) % titles.length],
    text: texts[(i + p.id.charCodeAt(3)) % texts.length],
    date: new Date(Date.UTC(2026, 9, 20) - i * 86400000 * 9).toISOString(),
    verified: i !== 4,
  }))
}

// ---------- route handlers ----------
const routes = []
const route = (method, pattern, handler) => {
  const keys = []
  const re = new RegExp('^' + pattern.replace(/:([a-zA-Z]+)/g, (_, k) => (keys.push(k), '([^/]+)')) + '/?$')
  routes.push({ method, re, keys, handler })
}

// Products
route('get', '/products', ({ params }) => {
  const { q, category, brand, minPrice, maxPrice, rating, inStock, sort = 'popular', page = 1, limit = 12, tag } = params
  const list = (v) => (v ? String(v).split(',').filter(Boolean) : [])
  let items = products.filter((p) => {
    if (q) {
      const s = String(q).toLowerCase()
      if (![p.name, p.brandName, p.categoryName, p.subtitle].some((x) => x.toLowerCase().includes(s))) return false
    }
    if (list(category).length && !list(category).includes(p.category)) return false
    if (list(brand).length && !list(brand).includes(p.brand)) return false
    if (minPrice && p.price < Number(minPrice)) return false
    if (maxPrice && p.price > Number(maxPrice)) return false
    if (rating && p.rating < Number(rating)) return false
    if (inStock === 'true' && p.stock <= 0) return false
    if (tag === 'bestseller' && !p.bestseller) return false
    if (tag === 'new' && !p.isNew) return false
    if (tag === 'trending' && !p.trending) return false
    return true
  })
  const sorters = {
    popular: (a, b) => b.reviewCount - a.reviewCount,
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
  }
  items = [...items].sort(sorters[sort] || sorters.popular)
  const total = items.length
  const lim = Number(limit)
  const pg = Number(page)
  return { items: items.slice((pg - 1) * lim, pg * lim), total, page: pg, pages: Math.max(1, Math.ceil(total / lim)) }
})
route('get', '/products/facets', ({ params }) => {
  const q = params.q ? String(params.q).toLowerCase() : ''
  const base = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products
  const count = (key) => base.reduce((m, p) => ((m[p[key]] = (m[p[key]] || 0) + 1), m), {})
  return { categories: count('category'), brands: count('brand'), maxPrice: Math.max(...products.map((p) => p.price)), total: base.length }
})
route('get', '/products/by-ids', ({ params }) => {
  const ids = String(params.ids || '').split(',')
  return ids.map((id) => products.find((p) => p.id === id)).filter(Boolean)
})
route('get', '/products/:slug', ({ args }) => {
  const p = getProductBySlug(args.slug)
  if (!p) throw new HttpError(404, 'Product not found')
  return p
})
const userReviews = () => storage.get('mg_mock_reviews', {})
route('get', '/products/:slug/reviews', ({ args }) => {
  const p = getProductBySlug(args.slug)
  if (!p) throw new HttpError(404, 'Product not found')
  return [...(userReviews()[p.slug] || []), ...seededReviews(p)]
})
route('post', '/products/:slug/reviews', ({ args, body, config }) => {
  const me = requireUser(config)
  const p = getProductBySlug(args.slug)
  if (!p) throw new HttpError(404, 'Product not found')
  if (!body.rating || !body.text?.trim()) throw new HttpError(422, 'Please add a rating and a short review')
  const review = { id: uid('R'), author: me.name, rating: body.rating, title: body.title || '', text: body.text.trim(), date: new Date().toISOString(), verified: false }
  const all = userReviews()
  storage.set('mg_mock_reviews', { ...all, [p.slug]: [review, ...(all[p.slug] || [])] })
  return review
})
route('get', '/products/:slug/related', ({ args }) => {
  const p = getProductBySlug(args.slug)
  if (!p) throw new HttpError(404, 'Product not found')
  return products.filter((x) => x.category === p.category && x.id !== p.id).concat(products.filter((x) => x.category !== p.category && x.brand === p.brand)).slice(0, 4)
})

// Categories / brands / content
route('get', '/categories', () => categories.map((c) => ({ ...c, count: products.filter((p) => p.category === c.slug).length })))
route('get', '/categories/:slug', ({ args }) => {
  const c = getCategory(args.slug)
  if (!c) throw new HttpError(404, 'Category not found')
  return { ...c, count: products.filter((p) => p.category === c.slug).length }
})
route('get', '/brands', () => brands.map((b) => ({ ...b, count: products.filter((p) => p.brand === b.slug).length })))
route('get', '/brands/:slug', ({ args }) => {
  const b = getBrand(args.slug)
  if (!b) throw new HttpError(404, 'Brand not found')
  return { ...b, count: products.filter((p) => p.brand === b.slug).length }
})
route('get', '/blogs', () => blogs.map(({ body, ...b }) => b))
route('get', '/blogs/:slug', ({ args }) => {
  const b = getBlog(args.slug)
  if (!b) throw new HttpError(404, 'Article not found')
  return b
})
route('get', '/content/testimonials', () => testimonials)
route('get', '/content/faqs', () => faqs)
route('get', '/content/team', () => ({ team, stats }))
route('get', '/content/policies/:slug', ({ args }) => {
  const p = policies[args.slug]
  if (!p) throw new HttpError(404, 'Page not found')
  return p
})
route('post', '/newsletter', ({ body }) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body?.email || '')) throw new HttpError(422, 'Enter a valid email address')
  return { message: 'Subscribed successfully' }
})
route('post', '/contact', ({ body }) => {
  if (!body?.name || !body?.email || !body?.message) throw new HttpError(422, 'Please complete all required fields')
  return { message: 'Message received', ticket: uid('MG-') }
})

// Auth
route('post', '/auth/register', ({ body }) => {
  const users = storage.get(KEYS.users, [])
  const email = (body.email || '').trim().toLowerCase()
  if (users.some((u) => u.email === email)) throw new HttpError(409, 'An account with this email already exists')
  const user = { id: uid('U'), name: body.name.trim(), email, phone: body.phone || '', password: body.password, createdAt: new Date().toISOString() }
  storage.set(KEYS.users, [...users, user])
  return { token: `mock.${user.id}`, user: publicUser(user) }
})
route('post', '/auth/login', ({ body }) => {
  const users = storage.get(KEYS.users, [])
  const user = users.find((u) => u.email === (body.email || '').trim().toLowerCase())
  if (!user || user.password !== body.password) throw new HttpError(401, 'Invalid email or password')
  return { token: `mock.${user.id}`, user: publicUser(user) }
})
route('get', '/auth/me', ({ config }) => ({ user: publicUser(requireUser(config)) }))
route('post', '/auth/forgot-password', ({ body }) => {
  const users = storage.get(KEYS.users, [])
  const user = users.find((u) => u.email === (body.email || '').trim().toLowerCase())
  if (user) {
    user.resetToken = uid('RST')
    storage.set(KEYS.users, users)
    // A real backend emails this link. For local demos we expose the token so the flow can be tested.
    return { message: 'If an account exists, a reset link has been sent.', devResetToken: user.resetToken }
  }
  return { message: 'If an account exists, a reset link has been sent.' }
})
route('post', '/auth/reset-password', ({ body }) => {
  const users = storage.get(KEYS.users, [])
  const user = users.find((u) => u.resetToken && u.resetToken === body.token)
  if (!user) throw new HttpError(400, 'This reset link is invalid or has expired')
  user.password = body.password
  delete user.resetToken
  storage.set(KEYS.users, users)
  return { message: 'Password updated successfully' }
})

// User
route('put', '/users/profile', ({ config, body }) => {
  const me = requireUser(config)
  const users = storage.get(KEYS.users, [])
  const i = users.findIndex((u) => u.id === me.id)
  users[i] = { ...users[i], name: body.name, phone: body.phone, dob: body.dob, gender: body.gender, bike: body.bike }
  storage.set(KEYS.users, users)
  return { user: publicUser(users[i]) }
})
route('put', '/users/password', ({ config, body }) => {
  const me = requireUser(config)
  const users = storage.get(KEYS.users, [])
  const i = users.findIndex((u) => u.id === me.id)
  if (users[i].password !== body.currentPassword) throw new HttpError(400, 'Current password is incorrect')
  users[i].password = body.newPassword
  storage.set(KEYS.users, users)
  return { message: 'Password changed' }
})
const addrStore = (id) => storage.get(KEYS.addresses, {})[id] || []
const saveAddr = (id, list) => storage.set(KEYS.addresses, { ...storage.get(KEYS.addresses, {}), [id]: list })
route('get', '/users/addresses', ({ config }) => addrStore(requireUser(config).id))
route('post', '/users/addresses', ({ config, body }) => {
  const me = requireUser(config)
  let list = addrStore(me.id)
  const a = { ...body, id: uid('A') }
  if (a.isDefault || !list.length) {
    a.isDefault = true
    list = list.map((x) => ({ ...x, isDefault: false }))
  }
  list = [...list, a]
  saveAddr(me.id, list)
  return a
})
route('put', '/users/addresses/:id', ({ config, body, args }) => {
  const me = requireUser(config)
  let list = addrStore(me.id)
  if (body.isDefault) list = list.map((x) => ({ ...x, isDefault: false }))
  list = list.map((x) => (x.id === args.id ? { ...x, ...body } : x))
  saveAddr(me.id, list)
  return list.find((x) => x.id === args.id)
})
route('delete', '/users/addresses/:id', ({ config, args }) => {
  const me = requireUser(config)
  let list = addrStore(me.id).filter((x) => x.id !== args.id)
  if (list.length && !list.some((x) => x.isDefault)) list[0].isDefault = true
  saveAddr(me.id, list)
  return { message: 'Address removed' }
})

// Cart / wishlist (persisted per browser; a real backend would key these by user)
route('get', '/cart', () => storage.get(KEYS.cart, { items: [], coupon: null }))
route('put', '/cart', ({ body }) => (storage.set(KEYS.cart, body), body))
route('post', '/cart/coupon', ({ body }) => {
  const code = (body.code || '').trim().toUpperCase()
  const c = coupons.find((x) => x.code === code)
  if (!c) throw new HttpError(404, 'Invalid coupon code')
  if (body.subtotal < c.minOrder) throw new HttpError(400, `Add items worth ₹${c.minOrder - body.subtotal} more to use ${c.code}`)
  return c
})
route('get', '/coupons', () => coupons)
route('get', '/wishlist', () => storage.get(KEYS.wishlist, []))
route('put', '/wishlist', ({ body }) => (storage.set(KEYS.wishlist, body.ids), body.ids))

// Orders
route('post', '/orders', ({ config, body }) => {
  const me = authUser(config)
  const orders = storage.get(KEYS.orders, [])
  if (!body.items?.length) throw new HttpError(422, 'Your cart is empty')
  const order = {
    id: `MG${Date.now().toString().slice(-8)}`,
    userId: me?.id || 'guest',
    status: 'Processing',
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString(),
    ...body,
  }
  storage.set(KEYS.orders, [order, ...orders])
  return order
})
route('get', '/orders', ({ config }) => {
  const me = requireUser(config)
  return storage.get(KEYS.orders, []).filter((o) => o.userId === me.id)
})
route('get', '/orders/:id', ({ config, args }) => {
  const me = authUser(config)
  const o = storage.get(KEYS.orders, []).find((x) => x.id === args.id)
  if (!o || (o.userId !== 'guest' && o.userId !== me?.id)) throw new HttpError(404, 'Order not found')
  return o
})

// ---------- axios adapter ----------
export async function mockAdapter(config) {
  await wait(LATENCY + Math.random() * 150)
  const method = (config.method || 'get').toLowerCase()
  const path = '/' + (config.url || '').replace(/^\/+/, '').split('?')[0]
  const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : config.data || {}

  let result
  let status = 200
  try {
    const matched = routes.find((r) => r.method === method && r.re.test(path))
    if (!matched) throw new HttpError(404, `No mock route for ${method.toUpperCase()} ${path}`)
    const m = path.match(matched.re)
    const args = Object.fromEntries(matched.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]))
    result = matched.handler({ args, params: config.params || {}, body, config })
    if (method === 'post') status = 201
  } catch (e) {
    const response = { data: { message: e.message, errors: e.errors }, status: e.status || 500, statusText: 'Error', headers: {}, config }
    throw new AxiosError(e.message, 'ERR_BAD_RESPONSE', config, null, response)
  }
  return { data: JSON.parse(JSON.stringify(result ?? null)), status, statusText: 'OK', headers: {}, config, request: {} }
}

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

export const formatPrice = (n = 0) => `₹${inr.format(Math.round(n))}`
export const discountPercent = (price, mrp) => (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0)
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
export const slugify = (s = '') =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max)
export const cn = (...c) => c.filter(Boolean).join(' ')

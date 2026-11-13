export function formatPrice(value, purpose = 'Buy') {
  const n = Number(value) || 0
  if (purpose === 'Rent') return `₹${n.toLocaleString('en-IN')}`
  if (n >= 10000000) return `₹${+(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${+(n / 100000).toFixed(1).replace(/\.0$/, '')} Lakh`
  return `₹${n.toLocaleString('en-IN')}`
}
export const formatBudget = (n) => formatPrice(n, 'Buy')
export const formatArea = (n) => `${Number(n).toLocaleString('en-IN')} sq ft`
export function timeAgo(iso) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime())
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${Math.max(m, 1)} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hr ago`
  const d = Math.floor(h / 24)
  return d < 30 ? `${d} day${d > 1 ? 's' : ''} ago` : new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
export const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
export const uid = (p = 'id') => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
export const cn = (...c) => c.filter(Boolean).join(' ')

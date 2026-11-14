let currency = { symbol: '₹', system: 'indian' }
export const setCurrency = (c) => { if (c?.symbol) currency = c }
export const currencySymbol = () => currency.symbol
const locale = () => (currency.system === 'indian' ? 'en-IN' : 'en-US')
/** Whole-number price with the owner's digit grouping, e.g. ₹12,50,000 or $1,250,000. */
export const formatMoney = (n) => `${currency.symbol}${Math.round(Number(n) || 0).toLocaleString(locale())}`

export function formatPrice(value, purpose = 'Buy') {
  const n = Number(value) || 0
  const s = currency.symbol
  if (purpose === 'Rent') return formatMoney(n)
  if (currency.system === 'indian') {
    if (n >= 10000000) return `${s}${+(n / 10000000).toFixed(2)} Cr`
    if (n >= 100000) return `${s}${+(n / 100000).toFixed(1).replace(/\.0$/, '')} Lakh`
    return formatMoney(n)
  }
  if (n >= 1000000) return `${s}${+(n / 1000000).toFixed(2)}M`
  return formatMoney(n)
}
/** Unit used in the budget filter: Lakh (100,000) for the Indian system, thousand for international. */
export const budgetUnit = () => (currency.system === 'indian' ? { size: 100000, label: 'Lakh' } : { size: 1000, label: 'thousand' })
export const formatBudget = (n) => formatPrice(n, 'Buy')
export const formatArea = (n) => `${Number(n).toLocaleString(locale())} sq ft`
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

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, X, Loader2, ArrowRight, TrendingUp } from 'lucide-react'
import useDebounce from '../../hooks/useDebounce'
import productService from '../../services/productService'
import ProductImage from '../products/ProductImage'
import { formatPrice } from '../../utils/format'

const POPULAR = ['Helmet', 'Riding Jacket', 'Gloves', 'Exhaust', 'Top Box', 'Chain Lube']

export default function SearchOverlay({ onClose }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const dq = useDebounce(q.trim(), 250)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(() => {
    if (dq.length < 2) return setResults(null)
    let off = false
    setLoading(true)
    productService.search(dq).then((r) => !off && setResults(r)).catch(() => !off && setResults({ items: [], total: 0 })).finally(() => !off && setLoading(false))
    return () => { off = true }
  }, [dq])

  const go = (term) => {
    if (!term.trim()) return
    navigate(`/shop?q=${encodeURIComponent(term.trim())}`)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-ink/90 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Search products"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="container-x pt-20 sm:pt-24">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={(e) => { e.preventDefault(); go(q) }} className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={22} />
            <input
              ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search helmets, jackets, brands..."
              className="w-full rounded-2xl border border-line bg-ink-800 py-4 pl-14 pr-24 text-base shadow-card placeholder-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 sm:text-lg"
              aria-label="Search products"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {loading && <Loader2 size={18} className="animate-spin text-muted" />}
              <button type="button" onClick={onClose} aria-label="Close search" className="rounded-full p-2 text-muted hover:bg-ink-600 hover:text-white"><X size={20} /></button>
            </div>
          </form>

          <div className="mt-4 max-h-[65vh] overflow-y-auto rounded-2xl border border-line bg-ink-800 p-3 sm:p-4">
            {results ? (
              results.items.length ? (
                <>
                  <ul className="divide-y divide-line">
                    {results.items.map((p) => (
                      <li key={p.id}>
                        <button onClick={() => { navigate(`/product/${p.slug}`); onClose() }} className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-ink-700">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line"><ProductImage product={p} /></div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{p.name}</p>
                            <p className="text-xs text-muted">{p.categoryName}</p>
                          </div>
                          <span className="text-sm font-bold">{formatPrice(p.price)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => go(q)} className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-brand hover:bg-ink-700">
                    See all {results.total} results for “{dq}” <ArrowRight size={16} />
                  </button>
                </>
              ) : (
                <p className="py-8 text-center text-sm text-muted">No products match “{dq}”. Try a different keyword.</p>
              )
            ) : (
              <div>
                <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted"><TrendingUp size={14} /> Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR.map((t) => (
                    <button key={t} onClick={() => go(t)} className="chip transition hover:border-brand hover:text-white">{t}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

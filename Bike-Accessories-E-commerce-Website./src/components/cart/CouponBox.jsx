import { useState } from 'react'
import { Tag, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../../context/CartContext'
import useFetch from '../../hooks/useFetch'
import cartService from '../../services/cartService'

export default function CouponBox() {
  const { coupon, applyCoupon, removeCoupon, items, couponInvalid } = useCart()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  // suggested codes come from the store's active public coupons (managed in the admin panel)
  const { data: offers } = useFetch(() => cartService.coupons().catch(() => []), [])
  const SUGGESTIONS = (offers || []).slice(0, 3).map((c) => c.code)

  const apply = async (value = code) => {
    if (!value.trim()) return setError('Enter a coupon code')
    setBusy(true); setError('')
    try {
      const c = await applyCoupon(value)
      toast.success(`Coupon ${c.code} applied`)
      setCode('')
    } catch (e) {
      setError(e.message)
    } finally { setBusy(false) }
  }

  if (coupon)
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Tag size={18} className="shrink-0 text-emerald-400" />
          <div className="min-w-0"><p className="truncate text-sm font-bold">{coupon.code} applied</p><p className="truncate text-xs text-emerald-300/80">{coupon.description}</p></div>
        </div>
        <button onClick={removeCoupon} aria-label="Remove coupon" className="rounded-full p-1.5 text-muted hover:bg-ink-600 hover:text-white"><X size={16} /></button>
      </div>
    )

  return (
    <div>
      {/* NOT a <form>: this box is rendered inside the checkout <form>, and nested forms are invalid HTML */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setError('') }} placeholder="Coupon code" aria-label="Coupon code" aria-invalid={!!error} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); apply() } }} className={`input py-2.5 pl-10 uppercase ${error ? 'input-error' : ''}`} />
        </div>
        <button type="button" onClick={() => apply()} disabled={busy || !items.length} className="btn-ghost px-5 py-2.5">{busy ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}</button>
      </div>
      {error && <p role="alert" className="mt-1.5 text-xs text-brand-light">{error}</p>}
      {couponInvalid && <p className="mt-1.5 text-xs text-amber-400">Your previous coupon no longer applies to this cart value.</p>}
      <div className="mt-2.5 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => <button key={s} onClick={() => apply(s)} disabled={busy} className="chip font-mono tracking-wider transition hover:border-brand hover:text-white">{s}</button>)}
      </div>
    </div>
  )
}

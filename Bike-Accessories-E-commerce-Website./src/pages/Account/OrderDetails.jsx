import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, MapPin, CreditCard, RotateCcw, Headset, Truck, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { StatusBadge } from './OrderBits'
import OrderSummary from '../../components/cart/OrderSummary'
import PayNowButton from '../../components/cart/PayNowButton'
import ItemThumb from '../../components/common/ItemThumb'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import { ErrorState } from '../../components/common/States'
import { Skeleton } from '../../components/common/Skeletons'
import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import useFetch from '../../hooks/useFetch'
import orderService from '../../services/orderService'
import { formatDate, formatPrice } from '../../utils/format'
import { safeHttpUrl } from '../../utils/safeUrl'
import { ORDER_STATUSES, PAYMENT_METHODS } from '../../utils/constants'

export default function OrderDetails() {
  const { id } = useParams()
  const { data: o, loading, error, reload } = useFetch(() => orderService.get(id), [id])
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [cancelling, setCancelling] = useState(false)

  if (loading) return <div className="space-y-4"><Skeleton className="h-10 w-1/2" /><Skeleton className="h-32" /><Skeleton className="h-64" /></div>
  if (error) return <ErrorState message={error.status === 404 ? 'We couldn’t find that order.' : error.message} onRetry={error.status === 404 ? undefined : reload} />

  const stage = Math.max(0, ORDER_STATUSES.indexOf(o.status))
  const cancelled = o.status === 'Cancelled'
  const canCancel = ['Processing', 'Pending Payment'].includes(o.status)
  const cancel = async () => {
    if (!window.confirm('Cancel this order? Reserved items will be released.')) return
    setCancelling(true)
    try { await orderService.cancel(o.id); toast.success('Order cancelled'); reload() } catch (e) { toast.error(e.message) } finally { setCancelling(false) }
  }
  const reorder = () => {
    o.items.forEach((i) => addItem({ id: i.id, slug: i.slug, name: i.name, brandName: i.brandName, price: i.price, mrp: i.mrp, art: i.art, category: i.category, colors: [{ name: i.colorName, hex: i.colorHex }] }, { qty: i.qty, size: i.size, color: i.colorName }))
    toast.success('Items added to your cart')
    navigate('/cart')
  }

  return (
    <>
      <Breadcrumbs className="mb-4" items={[{ label: 'My Orders', to: '/account/orders' }, { label: `#${o.id}` }]} />
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div><h1 className="font-display text-2xl font-bold sm:text-3xl">Order #{o.id}</h1><p className="mt-1 text-sm text-muted">Placed on {formatDate(o.createdAt)}</p></div>
        <StatusBadge status={o.status} />
      </div>

      {o.status === 'Pending Payment' && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-100">Payment is pending. Complete it to confirm your order.</p>
          <PayNowButton order={o} onPaid={reload} />
        </div>
      )}
      {cancelled ? (
        <div className="flex items-center gap-3 rounded-2xl border border-brand/40 bg-brand-soft p-5"><XCircle className="shrink-0 text-brand-light" /><p className="text-sm">This order was cancelled{o.payment?.status === 'Refund pending' ? '. Your refund is being processed (5-7 business days).' : '.'}</p></div>
      ) : (
      <div className="rounded-2xl border border-line bg-ink-800 p-5 sm:p-6">
        <ol className="grid grid-cols-5 gap-1" aria-label="Order progress">
          {ORDER_STATUSES.map((s, i) => (
            <li key={s} className="relative flex flex-col items-center text-center">
              {i > 0 && <span aria-hidden className={`absolute right-1/2 top-4 h-0.5 w-full ${i <= stage ? 'bg-brand-solid' : 'bg-line'}`} />}
              <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${i < stage ? 'border-brand bg-brand-solid' : i === stage ? 'border-brand bg-ink text-brand-light shadow-glow' : 'border-line bg-ink-800 text-muted'}`}>{i < stage ? <Check size={15} /> : i + 1}</span>
              <span className={`mt-2 text-[11px] leading-tight sm:text-xs ${i <= stage ? 'font-semibold text-white' : 'text-muted'}`}>{s}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-center text-sm text-muted">Estimated delivery by <b className="text-white">{formatDate(o.estimatedDelivery)}</b> · {o.delivery?.label}</p>
        {o.tracking?.number && <p className="mt-2 flex items-center justify-center gap-2 text-sm"><Truck size={15} className="text-brand-light" /> {o.tracking.courier} · <b className="font-mono">{o.tracking.number}</b>{safeHttpUrl(o.tracking.url) && <a href={safeHttpUrl(o.tracking.url)} target="_blank" rel="noopener noreferrer" className="text-brand-light underline">Track</a>}</p>}
      </div>
      )}

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-ink-800 p-5">
            <h2 className="mb-4 text-lg font-bold">Items ({o.items.length})</h2>
            <ul className="divide-y divide-line">
              {o.items.map((i, n) => (
                <li key={n} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <Link to={`/product/${i.slug}`} className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line"><ItemThumb item={i} /></Link>
                  <div className="min-w-0 flex-1"><Link to={`/product/${i.slug}`} className="block truncate font-medium hover:text-brand-light">{i.name}</Link><p className="text-xs text-muted">{[i.colorName, i.size && `Size ${i.size}`, `Qty ${i.qty}`].filter(Boolean).join(' · ')}</p></div>
                  <b>{formatPrice(i.price * i.qty)}</b>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-ink-800 p-5">
              <h3 className="mb-2 flex items-center gap-2 font-bold"><MapPin size={17} className="text-brand" /> Shipping address</h3>
              <p className="text-sm font-medium">{o.shippingAddress.name}</p>
              <p className="text-sm text-muted">{o.shippingAddress.line1}{o.shippingAddress.line2 && `, ${o.shippingAddress.line2}`}<br />{o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.pincode}<br />{o.shippingAddress.phone}</p>
            </div>
            <div className="rounded-2xl border border-line bg-ink-800 p-5">
              <h3 className="mb-2 flex items-center gap-2 font-bold"><CreditCard size={17} className="text-brand" /> Payment</h3>
              <p className="text-sm font-medium">{PAYMENT_METHODS.find((m) => m.id === o.payment?.method)?.label}</p>
              <p className="text-sm text-muted">Status: {o.payment?.status}</p>
            </div>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-ink-800 p-5"><OrderSummary totals={o.totals} coupon={o.coupon ? { code: o.coupon } : null} /></div>
          <button onClick={reorder} className="btn-primary w-full"><RotateCcw size={16} /> Reorder these items</button>
          {canCancel && <button onClick={cancel} disabled={cancelling} className="btn-ghost w-full text-brand"><XCircle size={16} /> {cancelling ? 'Cancelling...' : 'Cancel order'}</button>}
          <Link to="/contact" className="btn-ghost w-full"><Headset size={16} /> Need help with this order?</Link>
          <Link to="/account/orders" className="flex items-center justify-center gap-1.5 text-sm text-muted hover:text-white"><ArrowLeft size={14} /> Back to orders</Link>
        </aside>
      </div>
    </>
  )
}

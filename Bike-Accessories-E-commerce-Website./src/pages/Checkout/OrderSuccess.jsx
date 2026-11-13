import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { m as motion } from 'framer-motion'
import { Check, CalendarClock, MapPin, CreditCard, Package, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import OrderSummary from '../../components/cart/OrderSummary'
import PayNowButton from '../../components/cart/PayNowButton'
import ItemThumb from '../../components/common/ItemThumb'
import { ErrorState } from '../../components/common/States'
import { Skeleton } from '../../components/common/Skeletons'
import useFetch from '../../hooks/useFetch'
import usePageTitle from '../../hooks/usePageTitle'
import orderService from '../../services/orderService'
import { useAuth } from '../../context/AuthContext'
import { formatDate, formatPrice } from '../../utils/format'
import { PAYMENT_METHODS } from '../../utils/constants'

export default function OrderSuccess() {
  usePageTitle('Order Confirmed')
  const [sp] = useSearchParams()
  const id = sp.get('order')
  const { isAuthenticated, booting } = useAuth()
  const location = useLocation()
  const { data: order, loading, error, reload } = useFetch(() => orderService.get(id), [id], { enabled: !!id && isAuthenticated })

  if (!id) return <Navigate to="/" replace />
  // order details are private: sign in as the customer who placed it
  if (!booting && !isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  if (loading) return <div className="container-x max-w-3xl space-y-4 py-16"><Skeleton className="mx-auto h-24 w-24 rounded-full" /><Skeleton className="h-10 w-2/3 mx-auto" /><Skeleton className="h-64" /></div>
  if (error) return <div className="container-x py-16"><ErrorState message={error.message} onRetry={reload} /></div>

  const pay = PAYMENT_METHODS.find((m) => m.id === order.payment?.method)
  const pending = order.status === 'Pending Payment'
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-80 w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="container-x relative max-w-4xl py-12 sm:py-16">
        <div className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }} className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${pending ? 'bg-amber-500' : 'bg-emerald-500 shadow-[0_0_60px_-8px_rgba(16,185,129,0.7)]'}`}>
            <motion.span initial={{ pathLength: 0, opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}><Check size={52} strokeWidth={3} /></motion.span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 font-display text-3xl font-extrabold sm:text-4xl">{pending ? 'Payment pending' : 'Order Confirmed!'}</motion.h1>
          <p className="mt-2 text-muted">{pending ? 'We’ve reserved your items for 30 minutes. Complete the payment to confirm your order.' : <>Thanks, {order.customer?.name?.split(' ')[0]}! We’ve received your order and will email {order.customer?.email} with updates.</>}</p>
          {pending && <div className="mt-4"><PayNowButton order={order} onPaid={reload} /></div>}
          <button onClick={() => { navigator.clipboard?.writeText(order.id); toast.success('Order ID copied') }} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-dashed border-brand/60 bg-brand-soft px-4 py-2 font-mono text-sm font-bold tracking-wider" aria-label="Copy order ID">
            Order ID: {order.id} <Copy size={14} />
          </button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            [CalendarClock, 'Estimated Delivery', formatDate(order.estimatedDelivery), order.delivery?.label],
            [MapPin, 'Shipping To', order.shippingAddress?.name, `${order.shippingAddress?.line1}, ${order.shippingAddress?.city} - ${order.shippingAddress?.pincode}`],
            [CreditCard, 'Payment', pay?.label || 'Online', order.payment?.status],
          ].map(([Icon, t, a, b]) => (
            <div key={t} className="rounded-2xl border border-line bg-ink-800 p-5">
              <Icon size={22} className="mb-3 text-brand" />
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t}</p>
              <p className="mt-1 font-semibold">{a}</p>
              <p className="mt-0.5 line-clamp-2 text-sm text-muted">{b}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid items-start gap-6 md:grid-cols-[1fr_340px]">
          <div className="rounded-2xl border border-line bg-ink-800 p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><Package size={18} className="text-brand" /> Items in your order</h2>
            <ul className="divide-y divide-line">
              {order.items.map((i, n) => (
                <li key={n} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line"><ItemThumb item={i} /></div>
                  <div className="min-w-0 flex-1"><p className="truncate font-medium">{i.name}</p><p className="text-xs text-muted">{[i.colorName, i.size && `Size ${i.size}`, `Qty ${i.qty}`].filter(Boolean).join(' · ')}</p></div>
                  <b>{formatPrice(i.price * i.qty)}</b>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-ink-800 p-5"><OrderSummary totals={order.totals} coupon={order.coupon ? { code: order.coupon } : null} /></div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
          <Link to="/account/orders" className="btn-ghost">View My Orders</Link>
        </div>
      </div>
    </div>
  )
}

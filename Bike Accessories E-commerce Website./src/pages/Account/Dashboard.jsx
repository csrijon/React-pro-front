import { Link } from 'react-router-dom'
import { Package, Heart, MapPin, ShoppingCart, ArrowRight } from 'lucide-react'
import { StatusBadge } from './OrderBits'
import { Skeleton } from '../../components/common/Skeletons'
import { EmptyState } from '../../components/common/States'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import useFetch from '../../hooks/useFetch'
import orderService from '../../services/orderService'
import userService from '../../services/userService'
import { formatDate, formatPrice } from '../../utils/format'

export default function Dashboard() {
  const { user } = useAuth()
  const { count: cartCount } = useCart()
  const { count: wishCount } = useWishlist()
  const { data: orders, loading } = useFetch(() => orderService.list(), [])
  const { data: addresses } = useFetch(() => userService.addresses(), [])

  const stats = [
    [Package, 'Orders', orders?.length ?? '–', '/account/orders'],
    [Heart, 'Wishlist', wishCount, '/account/wishlist'],
    [MapPin, 'Addresses', addresses?.length ?? '–', '/account/addresses'],
    [ShoppingCart, 'In Cart', cartCount, '/cart'],
  ]

  return (
    <>
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-brand-dark/60 via-ink-700 to-ink-800 p-6 sm:p-8">
        <div aria-hidden className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand/30 blur-3xl" />
        <p className="eyebrow">Rider dashboard</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">Hey {user.name.split(' ')[0]}, ready to ride?</h1>
        <p className="mt-1 text-sm text-white/70">{user.bike ? `Riding: ${user.bike} · ` : ''}Member since {formatDate(user.createdAt || new Date().toISOString())}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map(([Icon, label, value, to]) => (
          <Link key={label} to={to} className="group rounded-2xl border border-line bg-ink-800 p-4 transition hover:-translate-y-0.5 hover:border-brand/60 sm:p-5">
            <Icon size={22} className="text-brand" />
            <p className="mt-3 font-display text-3xl font-bold">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-ink-800 p-5">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Recent Orders</h2><Link to="/account/orders" className="flex items-center gap-1 text-sm font-semibold text-brand hover:underline">View all <ArrowRight size={14} /></Link></div>
        {loading ? <div className="space-y-3"><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
          : !orders?.length ? <EmptyState icon={Package} title="No orders yet" text="Your orders will show up here once you place one." action="Start Shopping" to="/shop" />
          : (
            <ul className="divide-y divide-line">
              {orders.slice(0, 3).map((o) => (
                <li key={o.id}>
                  <Link to={`/account/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-3 py-3 transition hover:text-brand">
                    <div><p className="font-semibold">#{o.id}</p><p className="text-xs text-muted">{formatDate(o.createdAt)} · {o.items.length} item(s)</p></div>
                    <div className="flex items-center gap-4"><StatusBadge status={o.status} /><b>{formatPrice(o.totals.total)}</b></div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
      </div>
    </>
  )
}

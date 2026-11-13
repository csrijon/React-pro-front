import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import { PageHeading, StatusBadge } from './OrderBits'
import ItemThumb from '../../components/common/ItemThumb'
import { EmptyState, ErrorState } from '../../components/common/States'
import { Skeleton } from '../../components/common/Skeletons'
import useFetch from '../../hooks/useFetch'
import orderService from '../../services/orderService'
import { formatDate, formatPrice } from '../../utils/format'
import { ORDER_STATUSES } from '../../utils/constants'

export default function Orders() {
  const { data, loading, error, reload } = useFetch(() => orderService.list(), [])
  const [filter, setFilter] = useState('All')
  const orders = (data || []).filter((o) => filter === 'All' || o.status === filter)

  return (
    <>
      <PageHeading title="My Orders" text="Track, review and reorder your purchases." />
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
        {['All', ...ORDER_STATUSES, 'Cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} aria-pressed={filter === s} className={`chip shrink-0 px-4 py-2 text-sm transition ${filter === s ? 'border-brand bg-brand-solid text-white' : 'hover:border-brand hover:text-white'}`}>{s}</button>
        ))}
      </div>
      {loading ? <div className="space-y-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-32" />)}</div>
        : error ? <ErrorState message={error.message} onRetry={reload} />
        : !orders.length ? <EmptyState icon={Package} title={filter === 'All' ? 'No orders yet' : `No ${filter.toLowerCase()} orders`} text="When you place an order it will appear here." action="Start Shopping" to="/shop" />
        : (
          <ul className="space-y-4">
            {orders.map((o) => (
              <li key={o.id} className="overflow-hidden rounded-2xl border border-line bg-ink-800">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-ink-700/60 px-5 py-3">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                    <div><p className="text-xs text-muted">Order ID</p><p className="font-mono font-semibold">#{o.id}</p></div>
                    <div><p className="text-xs text-muted">Placed on</p><p className="font-medium">{formatDate(o.createdAt)}</p></div>
                    <div><p className="text-xs text-muted">Total</p><p className="font-semibold">{formatPrice(o.totals.total)}</p></div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-2">
                    {o.items.slice(0, 4).map((i, n) => <div key={n} className="h-14 w-14 overflow-hidden rounded-lg border border-line"><ItemThumb item={i} /></div>)}
                    {o.items.length > 4 && <span className="flex h-14 w-14 items-center justify-center rounded-lg border border-line text-sm text-muted">+{o.items.length - 4}</span>}
                  </div>
                  <Link to={`/account/orders/${o.id}`} className="btn-ghost py-2.5">View Details <ChevronRight size={16} /></Link>
                </div>
              </li>
            ))}
          </ul>
        )}
    </>
  )
}

import { Link } from 'react-router-dom'
import { IndianRupee, ShoppingBag, Users, Package, Clock, Inbox, AlertTriangle, TrendingUp } from 'lucide-react'
import { Card, PageTitle, Badge, ORDER_TONE } from './ui'
import ProductImage from '../../components/products/ProductImage'
import { ErrorState } from '../../components/common/States'
import { Skeleton } from '../../components/common/Skeletons'
import useFetch from '../../hooks/useFetch'
import adminService from '../../services/adminService'
import { formatDate, formatPrice } from '../../utils/format'

function Stat({ icon: Icon, label, value, sub, to, tone = 'text-brand bg-brand-soft' }) {
  const body = (
    <Card className="flex items-center gap-4 p-5 transition hover:border-brand/60">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon size={22} /></span>
      <div className="min-w-0"><p className="truncate text-xs text-muted">{label}</p><p className="font-display text-2xl font-bold tabular-nums">{value}</p>{sub && <p className="truncate text-xs text-muted">{sub}</p>}</div>
    </Card>
  )
  return to ? <Link to={to}>{body}</Link> : body
}

function RevenueChart({ series }) {
  const max = Math.max(...series.map((d) => d.revenue), 1)
  const W = 600, H = 180, bw = W / series.length
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H + 22}`} className="w-full" role="img" aria-label="Revenue for the last 30 days">
        {[0, 0.5, 1].map((t) => <line key={t} x1="0" x2={W} y1={H - t * H} y2={H - t * H} stroke="#30343B" strokeDasharray="3 4" />)}
        {series.map((d, i) => {
          const h = (d.revenue / max) * (H - 6)
          return (
            <g key={d.date}>
              <rect x={i * bw + 2} y={H - Math.max(h, 2)} width={bw - 4} height={Math.max(h, 2)} rx="3" fill={d.revenue ? '#EF252B' : '#2a2f37'} opacity={d.revenue ? 0.95 : 1}>
                <title>{`${formatDate(d.date)}: ${formatPrice(d.revenue)} (${d.orders} order${d.orders === 1 ? '' : 's'})`}</title>
              </rect>
              {i % 5 === 0 && <text x={i * bw + bw / 2} y={H + 16} textAnchor="middle" fontSize="10" fill="#A7ADB5">{d.date.slice(8)}/{d.date.slice(5, 7)}</text>}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function Dashboard() {
  const { data: s, loading, error, reload } = useFetch(() => adminService.stats(), [])

  if (error) return <ErrorState message={error.message} onRetry={reload} />
  if (loading) return <div className="space-y-4"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}</div><Skeleton className="h-64" /></div>

  const statuses = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Pending Payment']
  const totalOrders = Object.values(s.byStatus).reduce((a, b) => a + b, 0) || 1

  return (
    <>
      <PageTitle title="Dashboard" text="How your store is doing." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={IndianRupee} label="Total revenue" value={formatPrice(s.revenue)} sub={`${formatPrice(s.last30Revenue)} in last 30 days`} />
        <Stat icon={ShoppingBag} label="Orders" value={s.orders} sub={`${s.toProcess} waiting to be processed`} to="/admin/orders" tone="text-sky-300 bg-sky-500/15" />
        <Stat icon={Users} label="Customers" value={s.customers} sub={`${s.subscribers} newsletter subscribers`} to="/admin/customers" tone="text-emerald-300 bg-emerald-500/15" />
        <Stat icon={Package} label="Products" value={s.products} sub={`${s.lowStock.length} low on stock`} to="/admin/products" tone="text-violet-300 bg-violet-500/15" />
      </div>

      {(s.toProcess > 0 || s.newMessages > 0) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {s.toProcess > 0 && <Link to="/admin/orders?status=Processing" className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200"><Clock size={16} /> {s.toProcess} order{s.toProcess === 1 ? '' : 's'} to process</Link>}
          {s.newMessages > 0 && <Link to="/admin/messages" className="flex items-center gap-2 rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-2.5 text-sm text-sky-200"><Inbox size={16} /> {s.newMessages} unread message{s.newMessages === 1 ? '' : 's'}</Link>}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><TrendingUp size={18} className="text-brand-light" /> Revenue · last 30 days</h2><span className="text-sm text-muted">{formatPrice(s.last30Revenue)}</span></div>
          <RevenueChart series={s.series} />
        </Card>
        <Card className="p-5">
          <h2 className="mb-4 font-bold">Orders by status</h2>
          <ul className="space-y-3">
            {statuses.filter((k) => s.byStatus[k]).map((k) => (
              <li key={k}>
                <div className="mb-1 flex justify-between text-sm"><span>{k}</span><b>{s.byStatus[k]}</b></div>
                <div className="h-1.5 overflow-hidden rounded bg-line"><div className="h-full rounded bg-brand-solid" style={{ width: `${(s.byStatus[k] / totalOrders) * 100}%` }} /></div>
              </li>
            ))}
            {!Object.keys(s.byStatus).length && <p className="text-sm text-muted">No orders yet.</p>}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b border-line p-5"><h2 className="font-bold">Recent orders</h2><Link to="/admin/orders" className="text-sm font-semibold text-brand-light hover:underline">View all</Link></div>
          {!s.recentOrders.length ? <p className="p-6 text-sm text-muted">No orders yet. They will appear here as customers check out.</p> : (
            <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-sm"><tbody className="divide-y divide-line">
              {s.recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-ink-700/40">
                  <td className="px-5 py-3"><Link to={`/admin/orders/${o.id}`} className="font-mono font-semibold hover:text-brand-light">#{o.id}</Link><p className="text-xs text-muted">{formatDate(o.createdAt)}</p></td>
                  <td className="px-3 py-3">{o.customer?.name}</td>
                  <td className="px-3 py-3 font-semibold">{formatPrice(o.totals.total)}</td>
                  <td className="px-5 py-3 text-right"><Badge tone={ORDER_TONE[o.status]}>{o.status}</Badge></td>
                </tr>
              ))}
            </tbody></table></div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-4 font-bold">Top selling</h2>
            <ul className="space-y-3">
              {s.topProducts.filter((p) => p.sold > 0).map((p) => (
                <li key={p.id} className="flex items-center gap-3"><div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-line"><ProductImage product={p} /></div><Link to={`/product/${p.slug}`} className="min-w-0 flex-1 truncate text-sm hover:text-brand-light">{p.name}</Link><b className="text-sm">{p.sold}</b></li>
              ))}
              {!s.topProducts.some((p) => p.sold > 0) && <p className="text-sm text-muted">Sales data appears after the first order.</p>}
            </ul>
          </Card>
          <Card className="p-5">
            <h2 className="mb-4 flex items-center gap-2 font-bold"><AlertTriangle size={17} className="text-amber-400" /> Low stock</h2>
            <ul className="space-y-3">
              {s.lowStock.map((p) => (
                <li key={p.id} className="flex items-center gap-3"><div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-line"><ProductImage product={p} /></div><span className="min-w-0 flex-1 truncate text-sm">{p.name}</span><Badge tone={p.stock === 0 ? 'red' : 'amber'}>{p.stock === 0 ? 'Out' : `${p.stock} left`}</Badge></li>
              ))}
              {!s.lowStock.length && <p className="text-sm text-muted">All products are well stocked.</p>}
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}

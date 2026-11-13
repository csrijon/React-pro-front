import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Printer, Search, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card, PageTitle, Badge, Pager, ORDER_TONE, PAY_TONE, Label } from './ui'
import FormField from '../../components/forms/FormField'
import LoadingButton from '../../components/forms/LoadingButton'
import ItemThumb from '../../components/common/ItemThumb'
import OrderSummary from '../../components/cart/OrderSummary'
import { ErrorState } from '../../components/common/States'
import { Skeleton } from '../../components/common/Skeletons'
import useFetch from '../../hooks/useFetch'
import useDebounce from '../../hooks/useDebounce'
import adminService from '../../services/adminService'
import { formatDate, formatPrice } from '../../utils/format'

const STATUSES = ['Pending Payment', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
const FLOW = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered']
const PAYMENTS = ['Paid', 'Pending', 'Pay on delivery', 'Refund pending', 'Refunded', 'Failed']

export function OrdersList() {
  const [sp, setSp] = useSearchParams()
  const [q, setQ] = useState('')
  const dq = useDebounce(q, 350)
  const status = sp.get('status') || ''
  const payment = sp.get('payment') || ''
  const from = sp.get('from') || ''
  const to = sp.get('to') || ''
  const [page, setPage] = useState(1)
  useEffect(() => setPage(1), [dq, status, payment, from, to])
  const params = { q: dq || undefined, status: status || undefined, payment: payment || undefined, from: from || undefined, to: to || undefined, page, limit: 15 }
  const { data, loading, error, reload } = useFetch(() => adminService.list('orders', params), [JSON.stringify(params)])
  const setParam = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }) }

  return (
    <>
      <PageTitle title="Orders" text="Track and fulfil customer orders." />
      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <div className="relative min-w-[200px] flex-1"><Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order ID, name, email or phone..." aria-label="Search orders" className="input py-2.5 pl-10" /></div>
          <select aria-label="Status" value={status} onChange={(e) => setParam('status', e.target.value)} className="input w-auto py-2.5"><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          <select aria-label="Payment" value={payment} onChange={(e) => setParam('payment', e.target.value)} className="input w-auto py-2.5"><option value="">Any payment</option>{PAYMENTS.map((s) => <option key={s}>{s}</option>)}</select>
          <label className="flex items-center gap-2 text-xs text-muted">From <input type="date" value={from} onChange={(e) => setParam('from', e.target.value)} className="input w-auto py-2" /></label>
          <label className="flex items-center gap-2 text-xs text-muted">To <input type="date" value={to} onChange={(e) => setParam('to', e.target.value)} className="input w-auto py-2" /></label>
        </div>
        {error ? <div className="p-6"><ErrorState message={error.message} onRetry={reload} /></div> : (
          <>
          <ul className="divide-y divide-line md:hidden" aria-label="Orders list">
            {loading ? Array.from({ length: 4 }, (_, i) => <li key={i} className="p-4"><Skeleton className="h-20" /></li>)
              : !data.items.length ? <li className="px-4 py-12 text-center text-sm text-muted">No orders found.</li>
              : data.items.map((o) => (
                <li key={o.id}>
                  <Link to={`/admin/orders/${o.id}`} className="block space-y-2 p-4 transition hover:bg-ink-700/40">
                    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-mono text-sm font-semibold">#{o.id}</p><p className="text-xs text-muted">{formatDate(o.createdAt)}</p></div><Badge tone={ORDER_TONE[o.status]}>{o.status}</Badge></div>
                    <div className="flex items-center justify-between gap-3 text-sm"><span className="min-w-0 truncate"><b>{o.customer?.name}</b> <span className="text-muted">· {o.totals?.count} item(s)</span></span><b>{formatPrice(o.totals?.total)}</b></div>
                    <Badge tone={PAY_TONE[o.payment?.status]}>{o.payment?.status} · {String(o.payment?.method || '').toUpperCase()}</Badge>
                  </Link>
                </li>
              ))}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line bg-ink-700/50 text-xs uppercase tracking-wide text-muted"><tr>{['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', ''].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-line">
                {loading ? Array.from({ length: 6 }, (_, i) => <tr key={i}><td colSpan={7} className="px-4 py-3"><Skeleton className="h-8" /></td></tr>)
                  : !data.items.length ? <tr><td colSpan={7} className="px-4 py-14 text-center text-muted">No orders found.</td></tr>
                  : data.items.map((o) => (
                    <tr key={o.id} className="hover:bg-ink-700/40">
                      <td className="px-4 py-3"><Link to={`/admin/orders/${o.id}`} className="font-mono font-semibold hover:text-brand-light">#{o.id}</Link><p className="text-xs text-muted">{formatDate(o.createdAt)}</p></td>
                      <td className="px-4 py-3"><b className="block">{o.customer?.name}</b><span className="text-xs text-muted">{o.customer?.email}</span></td>
                      <td className="px-4 py-3">{o.totals?.count}</td>
                      <td className="px-4 py-3 font-semibold">{formatPrice(o.totals?.total)}</td>
                      <td className="px-4 py-3"><Badge tone={PAY_TONE[o.payment?.status]}>{o.payment?.status}</Badge><p className="mt-0.5 text-xs uppercase text-muted">{o.payment?.method}</p></td>
                      <td className="px-4 py-3"><Badge tone={ORDER_TONE[o.status]}>{o.status}</Badge></td>
                      <td className="px-4 py-3 text-right"><Link to={`/admin/orders/${o.id}`} className="btn-ghost px-3 py-1.5 text-xs">Manage</Link></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          </>
        )}
        {data && <Pager page={data.page} pages={data.pages} total={data.total} onChange={setPage} />}
      </Card>
    </>
  )
}

export function OrderDetail() {
  const { id } = useParams()
  const { data: o, loading, error, reload } = useFetch(() => adminService.get('orders', id), [id])
  const [form, setForm] = useState({ status: '', note: '', courier: '', number: '', url: '', paymentStatus: '' })
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    if (o) setForm({ status: o.status, note: '', courier: o.tracking?.courier || '', number: o.tracking?.number || '', url: o.tracking?.url || '', paymentStatus: o.payment?.status || '' })
  }, [o])

  if (loading) return <div className="space-y-4"><Skeleton className="h-10 w-1/3" /><Skeleton className="h-64" /></div>
  if (error) return <ErrorState message={error.message} onRetry={reload} />

  const locked = o.status === 'Cancelled' || o.status === 'Delivered'
  const options = o.status === 'Pending Payment' ? ['Pending Payment', 'Cancelled']
    : o.status === 'Cancelled' ? ['Cancelled'] : [...FLOW.slice(Math.max(0, FLOW.indexOf(o.status))), 'Cancelled']
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    if (form.status === 'Cancelled' && o.status !== 'Cancelled' && !window.confirm('Cancel this order? Stock will be returned' + (o.payment.status === 'Paid' ? ' and a refund will be marked pending.' : '.'))) return
    setSaving(true)
    try {
      const payload = { tracking: { courier: form.courier, number: form.number, url: form.url } }
      if (form.status !== o.status) payload.status = form.status
      if (form.note) payload.note = form.note
      if (form.paymentStatus !== o.payment.status) payload.paymentStatus = form.paymentStatus
      await adminService.updateOrder(o.id, payload)
      toast.success('Order updated')
      reload()
    } catch (err) { toast.error(err.message) } finally { setSaving(false) }
  }
  const addr = (a) => a && <p className="text-sm leading-relaxed text-muted"><b className="text-white">{a.name}</b><br />{a.line1}{a.line2 && `, ${a.line2}`}<br />{a.city}, {a.state} - {a.pincode}<br />{a.phone}</p>

  return (
    <>
      <Link to="/admin/orders" className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-white print:hidden"><ArrowLeft size={14} /> All orders</Link>
      <PageTitle title={`Order #${o.id}`} text={`Placed ${formatDate(o.createdAt)} · ${o.customer?.name}`}>
        <Badge tone={ORDER_TONE[o.status]}>{o.status}</Badge>
        <Badge tone={PAY_TONE[o.payment?.status]}>{o.payment?.status}</Badge>
        <button onClick={() => window.print()} className="btn-ghost px-3 py-2 print:hidden"><Printer size={15} /> Print</button>
      </PageTitle>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-6">
          <Card className="p-5">
            <h2 className="mb-4 font-bold">Items ({o.items.length})</h2>
            <ul className="divide-y divide-line">
              {o.items.map((i, n) => (
                <li key={n} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line"><ItemThumb item={i} /></div>
                  <div className="min-w-0 flex-1"><p className="truncate font-medium">{i.name}</p><p className="text-xs text-muted">{[i.colorName, i.size && `Size ${i.size}`, `Qty ${i.qty}`, `${formatPrice(i.price)} each`].filter(Boolean).join(' · ')}</p></div>
                  <b>{formatPrice(i.price * i.qty)}</b>
                </li>
              ))}
            </ul>
          </Card>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="p-5"><h3 className="mb-2 font-bold">Customer</h3><p className="text-sm"><b>{o.customer?.name}</b></p><p className="text-sm text-muted">{o.customer?.email}<br />{o.customer?.phone}</p>{o.user && <p className="mt-2 text-xs text-muted">Registered customer: {o.user.name}</p>}{!o.user && <p className="mt-2 text-xs text-muted">Guest checkout</p>}</Card>
            <Card className="p-5"><h3 className="mb-2 font-bold">Shipping to</h3>{addr(o.shippingAddress)}</Card>
            <Card className="p-5"><h3 className="mb-2 font-bold">Delivery &amp; payment</h3><p className="text-sm text-muted">{o.delivery?.label}<br />ETA {formatDate(o.estimatedDelivery)}<br /><span className="uppercase">{o.payment?.method}</span>{o.payment?.razorpayPaymentId && <><br /><span className="break-all font-mono text-xs">{o.payment.razorpayPaymentId}</span></>}</p></Card>
          </div>
          {o.notes && <Card className="p-5"><h3 className="mb-1 font-bold">Customer notes</h3><p className="text-sm text-muted">{o.notes}</p></Card>}
          <Card className="p-5">
            <h3 className="mb-4 font-bold">History</h3>
            <ol className="space-y-4 border-l-2 border-line pl-5">
              {[...o.statusHistory].reverse().map((h, i) => (
                <li key={i} className="relative"><span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-brand bg-ink" /><p className="text-sm font-semibold">{h.status}</p><p className="text-xs text-muted">{new Date(h.at).toLocaleString('en-IN')}{h.note && ` · ${h.note}`}</p></li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="min-w-0 space-y-6">
          <Card className="p-5"><OrderSummary totals={o.totals} coupon={o.coupon ? { code: o.coupon } : null} /></Card>
          <Card className="p-5 print:hidden">
            <h2 className="mb-4 font-bold">Update order</h2>
            <form onSubmit={save} className="space-y-4" noValidate>
              <FormField label="Status" as="select" options={options} value={form.status} onChange={set('status')} disabled={locked && o.status !== 'Delivered'} hint={o.status === 'Pending Payment' ? 'Waiting for the customer to pay' : locked ? 'This order is closed' : 'Orders can only move forward'} />
              <FormField label="Note (optional, emailed to customer)" value={form.note} onChange={set('note')} placeholder="e.g. Packed with care" />
              <div><Label>Tracking</Label><div className="grid gap-3"><input className="input" placeholder="Courier (Delhivery, BlueDart...)" aria-label="Courier" value={form.courier} onChange={set('courier')} /><input className="input" placeholder="Tracking number" aria-label="Tracking number" value={form.number} onChange={set('number')} /><input className="input" placeholder="Tracking link (optional)" aria-label="Tracking link" value={form.url} onChange={set('url')} /></div></div>
              <FormField label="Payment status" as="select" options={PAYMENTS} value={form.paymentStatus} onChange={set('paymentStatus')} hint="Mark refunds here once you've sent the money back" />
              <LoadingButton type="submit" loading={saving} loadingText="Saving..." className="btn-primary w-full"><Save size={16} /> Save changes</LoadingButton>
            </form>
          </Card>
        </div>
      </div>
    </>
  )
}

import { formatPrice } from '../../utils/format'

const Row = ({ label, value, className = '' }) => (
  <div className={`flex items-center justify-between gap-4 text-sm ${className}`}><span className="text-muted">{label}</span><span className="font-medium tabular-nums">{value}</span></div>
)

/** Pure price breakdown. `totals` comes from calcTotals(). */
export default function OrderSummary({ totals, coupon, children, title = 'Order Summary' }) {
  return (
    <div>
      {title && <h2 className="mb-4 text-lg font-bold">{title}</h2>}
      <div className="space-y-3">
        <Row label={`Subtotal (${totals.count} item${totals.count === 1 ? '' : 's'})`} value={formatPrice(totals.mrpTotal)} />
        {totals.productDiscount > 0 && <Row label="Discount" value={`-${formatPrice(totals.productDiscount)}`} className="[&>span:last-child]:text-emerald-400" />}
        {totals.couponDiscount > 0 && <Row label={`Coupon (${coupon?.code})`} value={`-${formatPrice(totals.couponDiscount)}`} className="[&>span:last-child]:text-emerald-400" />}
        <Row label="Shipping" value={totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)} className={totals.shipping === 0 ? '[&>span:last-child]:text-emerald-400' : ''} />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="font-bold">Total</span>
        <span className="font-display text-2xl font-bold tabular-nums">{formatPrice(totals.total)}</span>
      </div>
      {totals.totalDiscount > 0 && <p className="mt-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-center text-xs font-medium text-emerald-300">🎉 You’re saving {formatPrice(totals.totalDiscount)} on this order</p>}
      {children}
    </div>
  )
}

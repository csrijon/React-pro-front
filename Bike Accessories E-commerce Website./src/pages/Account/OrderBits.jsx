const STATUS_STYLE = {
  Processing: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Packed: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  Shipped: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  'Out for Delivery': 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  Delivered: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Cancelled: 'bg-brand-soft text-brand border-brand/30',
}

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLE[status] || STATUS_STYLE.Processing}`}>{status}</span>
)

export const PageHeading = ({ title, text, action }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div><h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>{text && <p className="mt-1 text-sm text-muted">{text}</p>}</div>
    {action}
  </div>
)

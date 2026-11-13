import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import adminService from '../../services/adminService'

export const Card = ({ children, className = '' }) => <div className={`rounded-2xl border border-line bg-ink-800 ${className}`}>{children}</div>

export const PageTitle = ({ title, text, children }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div><h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>{text && <p className="mt-1 text-sm text-muted">{text}</p>}</div>
    <div className="flex flex-wrap items-center gap-2">{children}</div>
  </div>
)

const TONES = {
  green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', red: 'bg-brand-soft text-brand border-brand/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30', blue: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  violet: 'bg-violet-500/15 text-violet-300 border-violet-500/30', grey: 'bg-ink-600 text-muted border-line',
}
export const Badge = ({ tone = 'grey', children }) => <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]}`}>{children}</span>

export const ORDER_TONE = { 'Pending Payment': 'amber', Processing: 'amber', Packed: 'blue', Shipped: 'blue', 'Out for Delivery': 'violet', Delivered: 'green', Cancelled: 'red' }
export const PAY_TONE = { Paid: 'green', 'Pay on delivery': 'blue', Pending: 'amber', 'Refund pending': 'red', Refunded: 'grey', Failed: 'red' }

export const Label = ({ children }) => <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">{children}</span>

/** Multi-image uploader. `value` is an array of URLs; the first image is the cover. */
export function ImageUploader({ value = [], onChange, max = 6 }) {
  const input = useRef(null)
  const [busy, setBusy] = useState(false)
  const add = async (files) => {
    if (!files.length) return
    if (value.length + files.length > max) return toast.error(`You can add up to ${max} images`)
    setBusy(true)
    try { onChange([...value, ...(await adminService.upload(files))]) } catch (e) { toast.error(e.message) } finally { setBusy(false); if (input.current) input.current.value = '' }
  }
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((u, i) => (
          <div key={u + i} className="group relative h-20 w-20 overflow-hidden rounded-xl border border-line">
            <img src={u} alt="" className="h-full w-full object-cover" />
            {i === 0 && <span className="absolute inset-x-0 bottom-0 bg-brand/90 text-center text-[10px] font-bold">COVER</span>}
            <button type="button" aria-label="Remove image" onClick={() => onChange(value.filter((_, n) => n !== i))} className="absolute right-1 top-1 rounded-full bg-ink/80 p-0.5 opacity-0 transition group-hover:opacity-100"><X size={14} /></button>
          </div>
        ))}
        {value.length < max && (
          <button type="button" onClick={() => input.current?.click()} disabled={busy} className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line text-xs text-muted transition hover:border-brand hover:text-white">
            {busy ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={20} />}{busy ? 'Uploading' : 'Add'}
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => add(e.target.files)} />
      <p className="mt-2 text-xs text-muted">JPG, PNG or WebP, up to 5 MB each.</p>
    </div>
  )
}

export function Pager({ page, pages, total, onChange }) {
  if (!total) return null
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-muted">
      <span>{total.toLocaleString('en-IN')} result{total === 1 ? '' : 's'} · Page {page} of {pages}</span>
      <div className="flex gap-2">
        <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="btn-ghost px-3 py-1.5 text-xs">Previous</button>
        <button disabled={page >= pages} onClick={() => onChange(page + 1)} className="btn-ghost px-3 py-1.5 text-xs">Next</button>
      </div>
    </div>
  )
}

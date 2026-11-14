import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, X, Eye, Inbox, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useAsync } from '../../hooks/useAsync'
import { submissionService } from '../../services/submissionService'
import { formatPrice, formatDate } from '../../utils/format'
import { AdminHeader, Table, TableSkeleton, StatusBadge } from '../../components/admin/AdminUI'
import Modal from '../../components/common/Modal'
import { EmptyState, ErrorState } from '../../components/common/States'
import { propertyTypes } from '../../data/misc'

const FILTERS = ['Pending', 'Approved', 'Rejected', 'All']

function Review({ sub, onDone, onClose }) {
  const [f, setF] = useState({ title: sub.title, type: sub.type, purpose: sub.purpose, price: sub.price, location: sub.location, city: sub.city, area: sub.area, beds: sub.beds, baths: sub.baths, description: sub.description })
  const [keep, setKeep] = useState(sub.images)
  const [note, setNote] = useState('')
  const [rejecting, setRejecting] = useState(false)
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  const pending = sub.status !== 'Approved'

  const approve = async () => {
    if (!keep.length) return toast.error('Keep at least one photo')
    if (f.title.trim().length < 8 || f.description.trim().length < 30) return toast.error('Title needs 8+ characters and description 30+')
    setBusy(true)
    try { await submissionService.approve(sub.id, { images: keep, edits: { ...f, price: +f.price, area: +f.area, beds: +f.beds, baths: +f.baths } }); toast.success('Approved and published on the website'); onDone() }
    catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }
  const reject = async () => {
    if (note.trim().length < 5) return toast.error('Tell the owner why (at least 5 characters)')
    setBusy(true)
    try { await submissionService.reject(sub.id, note.trim()); toast.success('Submission rejected. The owner has been told why.'); onDone() } catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }
  return (
    <div className="space-y-5 text-sm">
      <div className="rounded-xl bg-amber-50 p-4 text-amber-900"><p className="flex items-center gap-2 font-semibold"><Lock size={15} />Private owner details (never shown publicly)</p>
        <p className="mt-1">{sub.ownerName} · <a className="underline" href={`tel:${sub.phone}`}>{sub.phone}</a> · <a className="underline" href={`mailto:${sub.email}`}>{sub.email}</a></p></div>

      <div><p className="label">Photos to publish {pending && <span className="font-normal text-muted">(untick any you don't want)</span>}</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{sub.images.map((src) => { const on = keep.includes(src); return (
          <label key={src} className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 ${on ? 'border-accent' : 'border-transparent opacity-40'} ${pending ? 'cursor-pointer' : ''}`}>
            <img src={src} alt="" className="h-full w-full object-cover" />{pending && <input type="checkbox" className="absolute left-1.5 top-1.5 h-4 w-4 accent-accent" checked={on} onChange={() => setKeep((k) => (on ? k.filter((x) => x !== src) : [...k, src]))} aria-label="Publish this photo" />}</label>) })}</div></div>

      <fieldset disabled={!pending} className="space-y-3">
        <p className="label">Listing details {pending && <span className="font-normal text-muted">(you can correct them before publishing)</span>}</p>
        <input className="input" value={f.title} onChange={set('title')} aria-label="Title" />
        <div className="grid gap-3 sm:grid-cols-3">
          <select className="input" value={f.type} onChange={set('type')} aria-label="Type">{propertyTypes.map((t) => <option key={t}>{t}</option>)}</select>
          <select className="input" value={f.purpose} onChange={set('purpose')} aria-label="Purpose"><option value="Buy">Sale</option><option value="Rent">Rent</option></select>
          <input type="number" className="input" value={f.price} onChange={set('price')} aria-label="Price" />
          <input className="input" value={f.location} onChange={set('location')} aria-label="Locality" /><input className="input" value={f.city} onChange={set('city')} aria-label="City" /><input type="number" className="input" value={f.area} onChange={set('area')} aria-label="Area" />
          <input type="number" className="input" value={f.beds} onChange={set('beds')} aria-label="Bedrooms" /><input type="number" className="input" value={f.baths} onChange={set('baths')} aria-label="Bathrooms" />
        </div>
        <textarea rows={4} className="input resize-none" value={f.description} onChange={set('description')} aria-label="Description" />
        <p className="text-xs text-muted">Submitted {formatDate(sub.createdAt)} · {sub.reference} · asking {formatPrice(sub.price, sub.purpose)}</p>
      </fieldset>

      {sub.status === 'Rejected' && sub.adminNote && <p className="rounded-lg bg-red-50 p-3 text-red-700"><strong>Rejected: </strong>{sub.adminNote}</p>}
      {sub.status === 'Approved' && <p className="rounded-lg bg-green-50 p-3 text-green-800">Published. Manage it under <Link to="/admin/properties" className="font-semibold underline">Properties</Link>.</p>}

      {pending && (rejecting ? (
        <div className="space-y-2 border-t border-line pt-4"><label className="label" htmlFor="why">Reason for rejecting (sent to the owner)</label>
          <textarea id="why" rows={3} className="input resize-none" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Photos are too dark. Please add clear photos of each room." />
          <div className="flex gap-2"><button className="btn-danger" onClick={reject} disabled={busy}>Reject submission</button><button className="btn-outline" onClick={() => setRejecting(false)}>Back</button></div></div>
      ) : (
        <div className="space-y-3 border-t border-line pt-4">
          <p className="rounded-lg bg-primary-50 p-3 text-xs text-primary">It will be published under your company name. The owner's details stay private.</p>
          <div className="flex flex-wrap gap-2"><button className="btn-accent" onClick={approve} disabled={busy}><Check size={15} />{busy ? 'Publishing…' : 'Approve & publish'}</button><button className="btn-outline" onClick={() => setRejecting(true)}><X size={15} />Reject…</button><button className="btn-ghost" onClick={onClose}>Close</button></div>
        </div>
      ))}
    </div>
  )
}

export default function AdminSubmissions() {
  const { data, loading, error, reload } = useAsync(() => submissionService.list(), [])
  const [view, setView] = useState(null); const [filter, setFilter] = useState('Pending')
  const subs = data || []
  const list = subs.filter((s) => filter === 'All' || s.status === filter)
  const pendingCount = subs.filter((s) => s.status === 'Pending').length
  return (
    <>
      <AdminHeader title="Submissions" subtitle="Owners submit properties here. Review, correct and publish them under your company name." />
      <div className="mb-4 flex flex-wrap gap-2">{FILTERS.map((t) => <button key={t} onClick={() => setFilter(t)} className={`rounded-full border px-4 py-2 text-sm font-medium ${filter === t ? 'border-primary bg-primary text-white' : 'border-line bg-white'}`}>{t}{t === 'Pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}</button>)}</div>
      {loading ? <TableSkeleton /> : error ? <ErrorState error={error} onRetry={reload} /> : (
        <Table head={['Property', 'Owner', 'Price', 'Submitted', 'Status', '']} empty={list.length === 0 && <div className="p-6"><EmptyState icon={Inbox} title={filter === 'Pending' ? 'Nothing waiting for review' : `No ${filter.toLowerCase()} submissions`} text="New submissions from logged-in owners appear here." /></div>}>
          {list.map((s) => (
            <tr key={s.id}><td className="px-4 py-3"><div className="flex items-center gap-3"><img src={s.images?.[0]} alt="" className="h-12 w-16 rounded-lg object-cover" /><div><p className="font-medium">{s.title}</p><p className="text-xs text-muted">{s.type} · {s.location} · {s.reference}</p></div></div></td>
              <td className="px-4 py-3">{s.ownerName}<p className="text-xs text-muted">{s.phone}</p></td><td className="px-4 py-3">{formatPrice(s.price, s.purpose)}</td><td className="px-4 py-3 text-muted">{formatDate(s.createdAt)}</td><td className="px-4 py-3"><StatusBadge status={s.status === 'Pending' ? 'Pending review' : s.status} /></td>
              <td className="px-4 py-3"><button className="btn-outline btn-sm" onClick={() => setView(s)}><Eye size={14} />{s.status === 'Pending' ? 'Review' : 'View'}</button></td></tr>
          ))}
        </Table>
      )}
      <Modal open={!!view} onClose={() => setView(null)} title="Review submission" size="max-w-2xl">{view && <Review key={view.id} sub={view} onClose={() => setView(null)} onDone={() => { setView(null); reload() }} />}</Modal>
    </>
  )
}

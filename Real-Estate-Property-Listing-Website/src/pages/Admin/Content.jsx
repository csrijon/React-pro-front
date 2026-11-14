import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAsync } from '../../hooks/useAsync'
import { contentService } from '../../services/contentService'
import { inquiryService } from '../../services/inquiryService'
import { AdminHeader, TableSkeleton } from '../../components/admin/AdminUI'
import { ErrorState } from '../../components/common/States'
import SingleImage from '../../components/forms/SingleImage'
import Pagination from '../../components/common/Pagination'

const PAGE_SIZE = 5

function Editor({ initial, fields, blank, save, noun }) {
  const [rows, setRows] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [page, setPage] = useState(1)
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const start = (current - 1) * PAGE_SIZE
  const set = (i, k, v) => setRows((r) => r.map((x, n) => (n === i ? { ...x, [k]: v } : x)))
  const submit = async () => {
    const bad = rows.findIndex((r) => fields.some((f) => f.required && String(r[f.key] ?? '').trim().length < (f.min || 3)))
    if (bad >= 0) { setPage(Math.floor(bad / PAGE_SIZE) + 1); return toast.error(`Complete ${noun} ${bad + 1} (each field needs at least a few characters)`) }
    setBusy(true); try { await save(rows); toast.success('Saved') } catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }
  return (
    <div className="space-y-4">
      {rows.length > PAGE_SIZE && <p className="text-sm text-muted">Showing {start + 1}–{Math.min(start + PAGE_SIZE, rows.length)} of {rows.length}</p>}
      {rows.slice(start, start + PAGE_SIZE).map((r, k) => { const i = start + k; return (
        <div key={i} className="card space-y-3 p-4">
          <div className="grid gap-3 sm:grid-cols-2">{fields.filter((f) => !f.wide && f.type !== 'image').map((f) => <label key={f.key} className="block text-sm"><span className="label">{f.label}</span>
            {f.type === 'rating' ? <select className="input" value={r[f.key] ?? 5} onChange={(e) => set(i, f.key, +e.target.value)}>{[5, 4, 3, 2, 1].map((n) => <option key={n}>{n}</option>)}</select> : <input className="input" value={r[f.key] ?? ''} onChange={(e) => set(i, f.key, e.target.value)} />}</label>)}</div>
          {fields.filter((f) => f.type === 'image').map((f) => <SingleImage key={f.key} label={f.label} value={r[f.key] || ''} onChange={(v) => set(i, f.key, v)} wide={false} max={400} hint="Optional. A square photo works best." />)}
          {fields.filter((f) => f.wide).map((f) => <label key={f.key} className="block text-sm"><span className="label">{f.label}</span><textarea rows={3} className="input resize-none" value={r[f.key] ?? ''} onChange={(e) => set(i, f.key, e.target.value)} /></label>)}
          <button className="btn-outline btn-sm hover:!text-red-600" onClick={() => setRows((x) => x.filter((_, n) => n !== i))}><Trash2 size={14} />Remove</button>
        </div>
      ) })}
      <Pagination page={current} pages={pages} onChange={setPage} />
      <div className="flex flex-wrap gap-2"><button className="btn-outline" onClick={() => { setRows((r) => [...r, { ...blank }]); setPage(Math.ceil((rows.length + 1) / PAGE_SIZE)) }}><Plus size={16} />Add {noun}</button><button className="btn-primary" onClick={submit} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></div>
    </div>
  )
}

export default function AdminContent() {
  const { data, loading, error, reload } = useAsync(() => Promise.all([contentService.faqs(), inquiryService.testimonials()]), [])
  return (
    <>
      <AdminHeader title="FAQ & testimonials" subtitle="Edit the questions and customer quotes shown on the public site." />
      {loading ? <TableSkeleton /> : error ? <ErrorState error={error} onRetry={reload} /> : (
        <div className="grid items-start gap-8 xl:grid-cols-2">
          <section aria-labelledby="faq-col">
            <h2 id="faq-col" className="mb-4 text-lg font-semibold">FAQs</h2>
            <Editor initial={data[0]} noun="question" blank={{ q: '', a: '' }} save={contentService.saveFaqs} fields={[{ key: 'q', label: 'Question', required: true }, { key: 'a', label: 'Answer', wide: true, required: true }]} />
          </section>
          <section aria-labelledby="testimonial-col">
            <h2 id="testimonial-col" className="mb-4 text-lg font-semibold">Testimonials</h2>
            <Editor initial={data[1]} noun="testimonial" blank={{ name: '', role: '', avatar: '', rating: 5, text: '' }} save={contentService.saveTestimonials} fields={[{ key: 'name', label: 'Name', required: true, min: 2 }, { key: 'role', label: 'Role (e.g. Bought a 3 BHK)' }, { key: 'avatar', label: 'Customer photo', type: 'image' }, { key: 'rating', label: 'Rating', type: 'rating' }, { key: 'text', label: 'Quote', wide: true, required: true, min: 10 }]} />
          </section>
        </div>
      )}
    </>
  )
}

import { useState } from 'react'
import { Trash2, Eye, PhoneCall, CheckCheck, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { useAsync } from '../../hooks/useAsync'
import { inquiryService } from '../../services/inquiryService'
import { timeAgo, formatDate } from '../../utils/format'
import { AdminHeader, SearchBox, Table, TableSkeleton, StatusBadge } from '../../components/admin/AdminUI'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { EmptyState, ErrorState } from '../../components/common/States'

const STATUSES = ['New', 'Contacted', 'Converted', 'Closed']

export default function AdminInquiries() {
  const { data, loading, error, reload } = useAsync(() => inquiryService.list(), [])
  const [q, setQ] = useState(''); const [status, setStatus] = useState(''); const [view, setView] = useState(null); const [del, setDel] = useState(null)
  const list = (data || []).filter((i) => (!q || `${i.name} ${i.property} ${i.email}`.toLowerCase().includes(q.toLowerCase())) && (!status || i.status === status))
  const setS = async (i, s) => { try { const u = await inquiryService.update(i.id, { status: s }); toast.success(`Marked as ${s.toLowerCase()}`); if (view?.id === i.id) setView(u); reload() } catch (e) { toast.error(e.message) } }
  const remove = async () => { try { await inquiryService.remove(del.id); toast.success('Enquiry deleted'); setDel(null); if (view?.id === del.id) setView(null); reload() } catch (e) { toast.error(e.message) } }
  return (
    <>
      <AdminHeader title="Inquiries" subtitle="Enquiries from property pages, projects and the contact form." />
      <div className="mb-4 flex flex-wrap gap-3"><SearchBox value={q} onChange={setQ} placeholder="Search enquiries" />
        <select className="input w-auto" aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
      {loading ? <TableSkeleton /> : error ? <ErrorState error={error} onRetry={reload} /> : (
        <Table head={['Customer', 'Regarding', 'Received', 'Status', 'Actions']} empty={list.length === 0 && <div className="p-6"><EmptyState icon={MessageSquare} title="No enquiries" text="New enquiries will appear here." /></div>}>
          {list.map((i) => (
            <tr key={i.id}>
              <td className="px-4 py-3"><p className="font-medium">{i.name}</p><p className="text-xs text-muted">{i.phone}</p></td>
              <td className="max-w-[14rem] truncate px-4 py-3">{i.property}</td><td className="px-4 py-3 text-muted">{timeAgo(i.createdAt)}</td>
              <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
              <td className="px-4 py-3"><div className="flex gap-1.5">
                <button className="btn-outline btn-sm" onClick={() => setView(i)} aria-label={`View ${i.name}`}><Eye size={14} /></button>
                <button className="btn-outline btn-sm" disabled={i.status === 'Contacted'} onClick={() => setS(i, 'Contacted')} aria-label="Mark contacted"><PhoneCall size={14} /></button>
                <button className="btn-outline btn-sm" disabled={i.status === 'Converted'} onClick={() => setS(i, 'Converted')} aria-label="Mark converted"><CheckCheck size={14} /></button>
                <button className="btn-outline btn-sm hover:!border-red-300 hover:!text-red-600" onClick={() => setDel(i)} aria-label={`Delete enquiry from ${i.name}`}><Trash2 size={14} /></button></div></td>
            </tr>
          ))}
        </Table>
      )}
      <Modal open={!!view} onClose={() => setView(null)} title="Enquiry details">
        {view && <div className="space-y-4 text-sm">
          <dl className="grid grid-cols-[6rem_1fr] gap-y-2"><dt className="text-muted">Name</dt><dd className="font-medium">{view.name}</dd><dt className="text-muted">Email</dt><dd><a className="text-accent" href={`mailto:${view.email}`}>{view.email}</a></dd><dt className="text-muted">Phone</dt><dd><a className="text-accent" href={`tel:${view.phone}`}>{view.phone}</a></dd><dt className="text-muted">Regarding</dt><dd>{view.property}</dd><dt className="text-muted">Received</dt><dd>{formatDate(view.createdAt)}</dd><dt className="text-muted">Status</dt><dd><StatusBadge status={view.status} /></dd></dl>
          <p className="rounded-xl bg-surface p-4">{view.message}</p>
          <div className="flex flex-wrap gap-2"><span className="self-center text-muted">Update status:</span>{STATUSES.map((s) => <button key={s} onClick={() => setS(view, s)} disabled={view.status === s} className="btn-outline btn-sm">{s}</button>)}</div>
        </div>}
      </Modal>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} title="Delete enquiry?" message={`The enquiry from ${del?.name} will be permanently deleted.`} />
    </>
  )
}

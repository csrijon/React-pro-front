import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, Plus, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAsync } from '../../hooks/useAsync'
import { propertyService } from '../../services/propertyService'
import { formatPrice } from '../../utils/format'
import { AdminHeader, SearchBox, Table, TableSkeleton } from '../../components/admin/AdminUI'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { EmptyState, ErrorState } from '../../components/common/States'
import { propertyTypes } from '../../data/misc'

const STATUSES = ['For Sale', 'For Rent', 'Sold', 'Rented', 'Draft']

export default function AdminProperties() {
  const { data, loading, error, reload } = useAsync(() => propertyService.list(), [])
  const [q, setQ] = useState(''); const [type, setType] = useState(''); const [status, setStatus] = useState('')
  const [del, setDel] = useState(null)
  const list = (data || []).filter((p) => (!q || `${p.title} ${p.location}`.toLowerCase().includes(q.toLowerCase())) && (!type || p.type === type) && (!status || p.status === status))
  const changeStatus = async (p, s) => { try { await propertyService.update(p.id, { status: s }); toast.success(`Marked as ${s}`); reload() } catch (e) { toast.error(e.message) } }
  const remove = async () => { try { await propertyService.remove(del.id); toast.success('Property deleted'); setDel(null); reload() } catch (e) { toast.error(e.message) } }
  return (
    <>
      <AdminHeader title="Properties" subtitle={`${data?.length ?? 0} total listings`} action={<Link to="/admin/properties/new" className="btn-primary"><Plus size={16} />Add property</Link>} />
      <div className="mb-4 flex flex-wrap gap-3">
        <SearchBox value={q} onChange={setQ} placeholder="Search properties" />
        <select className="input w-auto" aria-label="Type" value={type} onChange={(e) => setType(e.target.value)}><option value="">All types</option>{propertyTypes.map((t) => <option key={t}>{t}</option>)}</select>
        <select className="input w-auto" aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{STATUSES.map((t) => <option key={t}>{t}</option>)}</select>
      </div>
      {loading ? <TableSkeleton /> : error ? <ErrorState error={error} onRetry={reload} /> : (
        <Table head={['Property', 'Type', 'Price', 'Status', 'Actions']} empty={list.length === 0 && <div className="p-6"><EmptyState icon={Building2} title="No properties found" text="Adjust your search or add a new property." /></div>}>
          {list.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={p.images[0]} alt="" className="h-12 w-16 rounded-lg object-cover" /><div className="min-w-0"><p className="font-medium">{p.title}</p><p className="text-xs text-muted">{p.location}, {p.city}</p></div></div></td>
              <td className="px-4 py-3">{p.type}</td>
              <td className="px-4 py-3 font-medium">{formatPrice(p.price, p.purpose)}</td>
              <td className="px-4 py-3"><select className="input w-auto py-1.5 text-xs" aria-label={`Status of ${p.title}`} value={p.status} onChange={(e) => changeStatus(p, e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
              <td className="px-4 py-3"><div className="flex gap-1.5">
                <Link to={`/admin/properties/${p.id}/edit`} className="btn-outline btn-sm" aria-label={`Edit ${p.title}`}><Pencil size={14} /></Link>
                <button onClick={() => setDel(p)} className="btn-outline btn-sm hover:!border-red-300 hover:!text-red-600" aria-label={`Delete ${p.title}`}><Trash2 size={14} /></button></div></td>
            </tr>
          ))}
        </Table>
      )}
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} title="Delete property?" message={`“${del?.title}” will be permanently removed from the website. This cannot be undone.`} />
    </>
  )
}

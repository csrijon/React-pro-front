import { useState } from 'react'
import { Trash2, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { useAsync } from '../../hooks/useAsync'
import { inquiryService } from '../../services/inquiryService'
import { formatDate } from '../../utils/format'
import { AdminHeader, SearchBox, Table, TableSkeleton } from '../../components/admin/AdminUI'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { EmptyState, ErrorState } from '../../components/common/States'

export default function AdminCustomers() {
  const { data, loading, error, reload } = useAsync(() => inquiryService.customers.list(), [])
  const [q, setQ] = useState(''); const [del, setDel] = useState(null)
  const list = (data || []).filter((c) => !q || `${c.name} ${c.email}`.toLowerCase().includes(q.toLowerCase()))
  const remove = async () => { try { await inquiryService.customers.remove(del.id); toast.success('Customer removed'); setDel(null); reload() } catch (e) { toast.error(e.message) } }
  return (
    <>
      <AdminHeader title="Customers" subtitle="Registered buyers and tenants." />
      <div className="mb-4"><SearchBox value={q} onChange={setQ} placeholder="Search customers" /></div>
      {loading ? <TableSkeleton /> : error ? <ErrorState error={error} onRetry={reload} /> : (
        <Table head={['Name', 'Contact', 'Joined', 'Saved properties', '']} empty={list.length === 0 && <div className="p-6"><EmptyState icon={UserRound} title="No customers found" /></div>}>
          {list.map((c) => <tr key={c.id}><td className="px-4 py-3 font-medium">{c.name}</td><td className="px-4 py-3"><p>{c.email}</p><p className="text-xs text-muted">{c.phone}</p></td><td className="px-4 py-3">{formatDate(c.joined)}</td><td className="px-4 py-3">{c.saved}</td>
            <td className="px-4 py-3"><button className="btn-outline btn-sm hover:!border-red-300 hover:!text-red-600" onClick={() => setDel(c)} aria-label={`Remove ${c.name}`}><Trash2 size={14} /></button></td></tr>)}
        </Table>
      )}
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} confirmLabel="Remove" title="Remove customer?" message={`${del?.name}'s account will be removed.`} />
    </>
  )
}

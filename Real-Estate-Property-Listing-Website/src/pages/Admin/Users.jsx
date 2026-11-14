import { toast } from 'sonner'
import { useAsync } from '../../hooks/useAsync'
import { inquiryService } from '../../services/inquiryService'
import { AdminHeader, Table, TableSkeleton, StatusBadge } from '../../components/admin/AdminUI'
import { ErrorState } from '../../components/common/States'

export default function AdminUsers() {
  const { data, loading, error, reload } = useAsync(() => inquiryService.users.list(), [])
  const upd = async (u, patch) => { try { await inquiryService.users.update(u.id, patch); toast.success('User updated'); reload() } catch (e) { toast.error(e.message) } }
  return (
    <>
      <AdminHeader title="Users" subtitle="Team members with access to this dashboard. Role enforcement must be done by your backend." />
      {loading ? <TableSkeleton /> : error ? <ErrorState error={error} onRetry={reload} /> : (
        <Table head={['Name', 'Email', 'Role', 'Status', '']}>
          {data.map((u) => <tr key={u.id}><td className="px-4 py-3 font-medium">{u.name}</td><td className="px-4 py-3">{u.email}</td>
            <td className="px-4 py-3"><select className="input w-auto py-1.5 text-xs" aria-label={`Role of ${u.name}`} value={u.role} onChange={(e) => upd(u, { role: e.target.value })}>{['admin', 'editor'].map((r) => <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>)}</select></td>
            <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
            <td className="px-4 py-3"><button className="btn-outline btn-sm" onClick={() => upd(u, { status: u.status === 'Active' ? 'Inactive' : 'Active' })}>{u.status === 'Active' ? 'Deactivate' : 'Activate'}</button></td></tr>)}
        </Table>
      )}
    </>
  )
}

import { useState } from 'react'
import { Trash2, CalendarDays } from 'lucide-react'
import { toast } from 'sonner'
import { useAsync } from '../../hooks/useAsync'
import { inquiryService } from '../../services/inquiryService'
import { formatDate } from '../../utils/format'
import { AdminHeader, Table, TableSkeleton } from '../../components/admin/AdminUI'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { EmptyState, ErrorState } from '../../components/common/States'

const S = ['Pending', 'Confirmed', 'Completed', 'Cancelled']
export default function AdminAppointments() {
  const { data, loading, error, reload } = useAsync(() => inquiryService.appointments.list(), [])
  const [del, setDel] = useState(null)
  const setS = async (a, status) => { try { await inquiryService.appointments.update(a.id, { status }); toast.success(`Visit ${status.toLowerCase()}`); reload() } catch (e) { toast.error(e.message) } }
  const remove = async () => { try { await inquiryService.appointments.remove(del.id); toast.success('Appointment deleted'); setDel(null); reload() } catch (e) { toast.error(e.message) } }
  const list = [...(data || [])].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
  return (
    <>
      <AdminHeader title="Appointments" subtitle="Property visits booked by customers." />
      {loading ? <TableSkeleton /> : error ? <ErrorState error={error} onRetry={reload} /> : (
        <Table head={['Customer', 'Property', 'Date & time', 'Status', '']} empty={list.length === 0 && <div className="p-6"><EmptyState icon={CalendarDays} title="No appointments yet" text="Visits booked from property pages show up here." /></div>}>
          {list.map((a) => (
            <tr key={a.id}><td className="px-4 py-3"><p className="font-medium">{a.name}</p><p className="text-xs text-muted">{a.phone}</p></td><td className="px-4 py-3">{a.property}</td><td className="px-4 py-3">{formatDate(a.date)}, {a.time}</td>
              <td className="px-4 py-3"><select className="input w-auto py-1.5 text-xs" aria-label={`Status for ${a.name}`} value={a.status} onChange={(e) => setS(a, e.target.value)}>{S.map((s) => <option key={s}>{s}</option>)}</select></td>
              <td className="px-4 py-3"><button className="btn-outline btn-sm hover:!border-red-300 hover:!text-red-600" onClick={() => setDel(a)} aria-label={`Delete appointment for ${a.name}`}><Trash2 size={14} /></button></td></tr>
          ))}
        </Table>
      )}
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} title="Delete appointment?" message={`The visit for ${del?.name} will be removed.`} />
    </>
  )
}

import { useState } from 'react'
import { Trash2, Star as StarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useAsync } from '../../hooks/useAsync'
import { reviewService } from '../../services/reviewService'
import { formatDate } from '../../utils/format'
import { AdminHeader, Table, TableSkeleton, StatusBadge } from '../../components/admin/AdminUI'
import StarRating from '../../components/common/StarRating'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { EmptyState, ErrorState } from '../../components/common/States'

export default function AdminReviews() {
  const { data, loading, error, reload } = useAsync(() => reviewService.all(), [])
  const [del, setDel] = useState(null)
  const reviews = data || []
  const setS = async (r, status) => { try { await reviewService.update(r.id, { status }); toast.success(status === 'Published' ? 'Review published' : 'Review hidden'); reload() } catch (e) { toast.error(e.message) } }
  const remove = async () => { try { await reviewService.remove(del.id); toast.success('Review deleted'); setDel(null); reload() } catch (e) { toast.error(e.message) } }
  return (
    <>
      <AdminHeader title="Reviews" subtitle="Customer reviews of your company. New reviews wait here until you publish them on the About page." />
      {loading ? <TableSkeleton /> : error ? <ErrorState error={error} onRetry={reload} /> : (
        <Table head={['Reviewer', 'Review', 'Status', 'Actions']} empty={reviews.length === 0 && <div className="p-6"><EmptyState icon={StarIcon} title="No reviews yet" /></div>}>
          {reviews.map((r) => (
            <tr key={r.id}><td className="px-4 py-3"><p className="font-medium">{r.name}</p><p className="text-xs text-muted">{formatDate(r.date)}</p></td>
              <td className="max-w-xs px-4 py-3"><StarRating value={r.rating} /><p className="mt-1 line-clamp-2 text-muted">{r.text}</p></td><td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              <td className="px-4 py-3"><div className="flex gap-1.5"><button className="btn-outline btn-sm" onClick={() => setS(r, r.status === 'Published' ? 'Hidden' : 'Published')}>{r.status === 'Published' ? 'Hide' : 'Publish'}</button>
                <button className="btn-outline btn-sm hover:!border-red-300 hover:!text-red-600" onClick={() => setDel(r)} aria-label={`Delete review by ${r.name}`}><Trash2 size={14} /></button></div></td></tr>
          ))}
        </Table>
      )}
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} title="Delete review?" message={`The review by ${del?.name} will be permanently deleted.`} />
    </>
  )
}

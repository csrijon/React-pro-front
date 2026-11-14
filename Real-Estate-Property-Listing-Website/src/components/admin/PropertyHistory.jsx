import { useAsync } from '../../hooks/useAsync'
import { activityLogService } from '../../services/activityLogService'
import { LogEntry } from './ActivityTimeline'

export default function PropertyHistory({ propertyId }) {
  const { data, loading, error } = useAsync(() => activityLogService.list({ entityId: propertyId, limit: 15 }), [propertyId])
  if (!activityLogService.available) return null
  return (
    <aside className="card h-fit p-5" aria-label="Change history">
      <h2 className="font-semibold">History</h2>
      {loading && <div className="skeleton mt-3 h-20" />}
      {error && <p className="mt-3 text-sm text-red-600">Could not load history.</p>}
      {data && (data.items.length ? <ul className="mt-2 divide-y divide-line">{data.items.map((e) => <LogEntry key={e.id} e={e} />)}</ul> : <p className="mt-3 text-sm text-muted">No changes recorded yet.</p>)}
    </aside>
  )
}

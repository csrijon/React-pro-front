import { useState } from 'react'
import { Download, ScrollText } from 'lucide-react'
import { toast } from 'sonner'
import { useAsync } from '../../hooks/useAsync'
import { activityLogService } from '../../services/activityLogService'
import { AdminHeader, SearchBox } from '../../components/admin/AdminUI'
import { LogEntry, ACTIONS } from '../../components/admin/ActivityTimeline'
import Pagination from '../../components/common/Pagination'
import { EmptyState, ErrorState } from '../../components/common/States'

const BLANK = { q: '', entity: '', action: '', actor: '', from: '', to: '' }
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""').replace(/^([=+\-@])/, "'$1")}"` // neutralise spreadsheet formulas

export default function AdminActivityLog() {
  const [f, setF] = useState(BLANK)
  const [page, setPage] = useState(1)
  const { data, loading, error, reload } = useAsync(() => activityLogService.list({ ...f, page, limit: 25 }), [f, page])
  const set = (k) => (v) => { setF((x) => ({ ...x, [k]: v })); setPage(1) }
  const active = Object.values(f).some(Boolean)

  const exportCsv = async () => {
    try {
      const all = await activityLogService.list({ ...f, page: 1, limit: 1000 })
      const rows = [['Time', 'Actor', 'Role', 'Action', 'Type', 'Record', 'Summary', 'IP'], ...all.items.map((e) => [new Date(e.createdAt).toISOString(), e.actorName, e.actorRole, e.action, e.entity, e.label, e.summary, e.ip])]
      const url = URL.createObjectURL(new Blob([rows.map((r) => r.map(csvCell).join(',')).join('\n')], { type: 'text/csv' }))
      const a = Object.assign(document.createElement('a'), { href: url, download: `activity-log-${new Date().toISOString().slice(0, 10)}.csv` }); a.click(); URL.revokeObjectURL(url)
      toast.success(`Exported ${all.items.length} entries${all.total > 1000 ? ' (latest 1,000)' : ''}`)
    } catch (e) { toast.error(e.message) }
  }

  if (!activityLogService.available) return <><AdminHeader title="Activity log" /><EmptyState icon={ScrollText} title="Activity log needs the backend" text="Actions are recorded by the API. Set VITE_API_URL to connect it." /></>
  return (
    <>
      <AdminHeader title="Activity log" subtitle="A record of who did what, and when. Entries are kept for 12 months." action={<button className="btn-outline" onClick={exportCsv} disabled={!data?.total}><Download size={16} />Export CSV</button>} />
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2"><SearchBox value={f.q} onChange={set('q')} placeholder="Search activity" /></div>
        <select className="input" aria-label="Type" value={f.entity} onChange={(e) => set('entity')(e.target.value)}><option value="">All record types</option>{(data?.entities || []).sort().map((x) => <option key={x}>{x}</option>)}</select>
        <select className="input" aria-label="Action" value={f.action} onChange={(e) => set('action')(e.target.value)}><option value="">All actions</option>{Object.entries(ACTIONS).map(([k, [l]]) => <option key={k} value={k}>{l}</option>)}</select>
        <input className="input" type="date" aria-label="From date" value={f.from} onChange={(e) => set('from')(e.target.value)} />
        <input className="input" type="date" aria-label="To date" value={f.to} onChange={(e) => set('to')(e.target.value)} />
        <input className="input lg:col-span-2" placeholder="Filter by person" aria-label="Person" value={f.actor} onChange={(e) => set('actor')(e.target.value)} />
        {active && <button className="btn-ghost justify-start" onClick={() => { setF(BLANK); setPage(1) }}>Clear filters</button>}
      </div>
      {error ? <ErrorState error={error} onRetry={reload} /> : (
        <div className="card px-5">
          {loading && !data ? <div className="space-y-3 py-5">{[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-12" />)}</div>
            : data.items.length === 0 ? <div className="py-10"><EmptyState icon={ScrollText} title="No activity found" text={active ? 'Try different filters.' : 'Actions will be recorded here as they happen.'} /></div>
            : <ul className="divide-y divide-line">{data.items.map((e) => <LogEntry key={e.id} e={e} />)}</ul>}
        </div>
      )}
      {data && <><p className="mt-3 text-center text-xs text-muted">{data.total.toLocaleString()} entries</p><Pagination page={data.page} pages={data.pages} onChange={setPage} /></>}
    </>
  )
}

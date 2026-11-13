import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useSEO } from '../../utils/seo'
import { useAsync } from '../../hooks/useAsync'
import { agentService } from '../../services/agentService'
import { propertyService } from '../../services/propertyService'
import AgentCard from '../../components/agents/AgentCard'
import PageHeader from '../../components/common/PageHeader'
import { CardSkeleton, EmptyState, ErrorState } from '../../components/common/States'

export default function Agents() {
  useSEO('Our Trusted Agents', 'Connect with experienced and verified real estate professionals.')
  const [q, setQ] = useState(''); const [loc, setLoc] = useState(''); const [spec, setSpec] = useState('')
  const ag = useAsync(() => agentService.list(), [])
  const pr = useAsync(() => propertyService.list(), [])
  const counts = useMemo(() => (pr.data || []).reduce((m, p) => ({ ...m, [p.agentId]: (m[p.agentId] || 0) + 1 }), {}), [pr.data])
  const list = (ag.data || []).filter((a) => (!q || a.name.toLowerCase().includes(q.toLowerCase())) && (!loc || a.location === loc) && (!spec || a.specialization === spec))
  const uniq = (k) => [...new Set((ag.data || []).map((a) => a[k]))].sort()
  return (
    <>
      <PageHeader title="Our trusted agents" subtitle="Connect with experienced and verified real estate professionals.">
        <div className="mt-5 grid max-w-3xl gap-3 sm:grid-cols-3">
          <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input className="input pl-9" placeholder="Search by name" aria-label="Search agents" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <select className="input" aria-label="Location" value={loc} onChange={(e) => setLoc(e.target.value)}><option value="">All locations</option>{uniq('location').map((l) => <option key={l}>{l}</option>)}</select>
          <select className="input" aria-label="Specialization" value={spec} onChange={(e) => setSpec(e.target.value)}><option value="">All specializations</option>{uniq('specialization').map((l) => <option key={l}>{l}</option>)}</select>
        </div>
      </PageHeader>
      <div className="container-x py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ag.loading && <CardSkeleton count={4} />}
          {!ag.loading && list.map((a) => <AgentCard key={a.id} agent={a} count={counts[a.id] || 0} />)}
        </div>
        {ag.error && <ErrorState error={ag.error} onRetry={ag.reload} />}
        {!ag.loading && !ag.error && list.length === 0 && <EmptyState title="No agents found" text="Try a different name, location or specialization." action={<button className="btn-primary" onClick={() => { setQ(''); setLoc(''); setSpec('') }}>Clear filters</button>} />}
      </div>
    </>
  )
}

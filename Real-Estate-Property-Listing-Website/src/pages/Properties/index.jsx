import { useMemo, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react'
import { useSEO } from '../../utils/seo'
import { useAsync } from '../../hooks/useAsync'
import { useLockBody } from '../../hooks/useLockBody'
import { propertyService } from '../../services/propertyService'
import PropertyCard from '../../components/properties/PropertyCard'
import FilterPanel from '../../components/properties/FilterPanel'
import PageHeader from '../../components/common/PageHeader'
import Pagination from '../../components/common/Pagination'
import { CardSkeleton, EmptyState, ErrorState } from '../../components/common/States'
import { formatBudget } from '../../utils/format'

const PAGE_SIZE = 6
const DEFAULTS = { q: '', purpose: '', type: '', min: '', max: '', beds: '', baths: '', location: '', furnishing: '', status: '', amin: '', amax: '', sort: 'latest', view: 'grid', page: '1' }

export default function Properties() {
  useSEO('Explore Properties', 'Search and filter apartments, villas, builder floors, plots and commercial spaces for sale and rent.')
  const [sp, setSp] = useSearchParams()
  const [drawer, setDrawer] = useState(false)
  useLockBody(drawer)
  const { data, loading, error, reload } = useAsync(() => propertyService.list(), [])
  const f = useMemo(() => Object.fromEntries(Object.keys(DEFAULTS).map((k) => [k, sp.get(k) ?? DEFAULTS[k]])), [sp])
  const set = useCallback((patch) => {
    setSp((prev) => {
      const n = new URLSearchParams(prev)
      Object.entries(patch).forEach(([k, v]) => (v === '' || v == null || (k === 'sort' && v === 'latest') || (k === 'view' && v === 'grid') ? n.delete(k) : n.set(k, v)))
      if (!('page' in patch)) n.delete('page')
      return n
    }, { replace: true })
  }, [setSp])
  const reset = () => setSp({}, { replace: true })

  const locations = useMemo(() => [...new Set((data || []).map((p) => p.location))].sort(), [data])
  const results = useMemo(() => {
    if (!data) return []
    const q = f.q.trim().toLowerCase()
    const types = f.type.split(',').filter(Boolean)
    const out = data.filter((p) => {
      if (q && !`${p.title} ${p.location} ${p.city} ${p.type}`.toLowerCase().includes(q)) return false
      if (f.purpose && p.purpose !== f.purpose) return false
      if (types.length && !types.includes(p.type)) return false
      if (f.min && p.price < +f.min) return false
      if (f.max && p.price > +f.max) return false
      if (f.beds && (f.beds === '5' ? p.beds < 5 : p.beds !== +f.beds)) return false
      if (f.baths && (f.baths === '4' ? p.baths < 4 : p.baths !== +f.baths)) return false
      if (f.location && p.location !== f.location) return false
      if (f.furnishing && p.furnishing !== f.furnishing) return false
      if (f.status && p.propertyStatus !== f.status) return false
      if (f.amin && p.area < +f.amin) return false
      if (f.amax && p.area > +f.amax) return false
      return true
    })
    const s = { latest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt), 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price }[f.sort]
    return out.sort(s)
  }, [data, f])

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const page = Math.min(Math.max(+f.page || 1, 1), pages)
  const shown = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const chips = []
  const add = (label, patch) => chips.push({ label, patch })
  if (f.q) add(`“${f.q}”`, { q: '' })
  if (f.purpose) add(f.purpose, { purpose: '' })
  f.type.split(',').filter(Boolean).forEach((t) => add(t, { type: f.type.split(',').filter((x) => x !== t).join(',') }))
  if (f.min) add(`Min ${formatBudget(f.min)}`, { min: '' })
  if (f.max) add(`Max ${formatBudget(f.max)}`, { max: '' })
  if (f.beds) add(`${f.beds}${f.beds === '5' ? '+' : ''} beds`, { beds: '' })
  if (f.baths) add(`${f.baths}${f.baths === '4' ? '+' : ''} baths`, { baths: '' })
  if (f.location) add(f.location, { location: '' })
  if (f.furnishing) add(f.furnishing, { furnishing: '' })
  if (f.status) add(f.status, { status: '' })
  if (f.amin) add(`≥ ${f.amin} sq ft`, { amin: '' })
  if (f.amax) add(`≤ ${f.amax} sq ft`, { amax: '' })

  const panel = <FilterPanel f={f} set={set} locations={locations} onReset={reset} />

  return (
    <>
      <PageHeader title="Explore properties" subtitle="Browse properties that match your needs.">
        <div className="relative mt-5 max-w-xl"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input py-3 pl-10" placeholder="Search by title, locality or type" aria-label="Search properties" value={f.q} onChange={(e) => set({ q: e.target.value })} /></div>
      </PageHeader>
      <div className="container-x grid gap-8 py-8 lg:grid-cols-[17rem_1fr]">
        <aside className="card hidden h-fit p-5 lg:sticky lg:top-24 lg:block">{panel}</aside>
        <section aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted"><strong className="text-ink">{loading ? '…' : results.length}</strong> properties found</p>
            <div className="flex items-center gap-2">
              <button className="btn-outline btn-sm lg:hidden" onClick={() => setDrawer(true)}><SlidersHorizontal size={14} />Filters{chips.length ? ` (${chips.length})` : ''}</button>
              <select className="input w-auto py-2" aria-label="Sort by" value={f.sort} onChange={(e) => set({ sort: e.target.value })}>
                <option value="latest">Sort: Latest</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option>
              </select>
              <div className="hidden overflow-hidden rounded-xl border border-line bg-white sm:flex">
                {[['grid', LayoutGrid], ['list', List]].map(([v, I]) => (
                  <button key={v} onClick={() => set({ view: v })} aria-label={`${v} view`} aria-pressed={f.view === v} className={`grid h-10 w-10 place-items-center ${f.view === v ? 'bg-primary text-white' : 'text-muted hover:text-primary'}`}><I size={17} /></button>
                ))}
              </div>
            </div>
          </div>
          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {chips.map((c) => <button key={c.label} className="chip hover:bg-primary-50/60" onClick={() => set(c.patch)} aria-label={`Remove filter ${c.label}`}>{c.label}<X size={12} /></button>)}
              <button onClick={reset} className="text-xs font-medium text-accent hover:underline">Clear all filters</button>
            </div>
          )}
          <div className={`mt-5 grid gap-6 ${f.view === 'list' ? 'grid-cols-1' : 'sm:grid-cols-2 xl:grid-cols-3'}`}>
            {loading && <CardSkeleton count={6} />}
            {!loading && !error && shown.map((p) => <PropertyCard key={p.id} property={p} layout={f.view === 'list' ? 'list' : 'grid'} />)}
          </div>
          {error && <ErrorState error={error} onRetry={reload} />}
          {!loading && !error && results.length === 0 && <EmptyState title="No properties match your filters" text="Try widening your budget or removing a filter." action={<button className="btn-primary" onClick={reset}>Clear all filters</button>} />}
          {!loading && <Pagination page={page} pages={pages} onChange={(n) => { set({ page: String(n) }); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />}
        </section>
      </div>
      {drawer && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-white shadow-lift">
            <div className="flex justify-end p-3"><button onClick={() => setDrawer(false)} className="rounded-lg p-1.5 hover:bg-slate-100" aria-label="Close filters"><X /></button></div>
            <div className="flex-1 overflow-y-auto px-5 pb-4">{panel}</div>
            <div className="border-t border-line p-4"><button className="btn-primary w-full" onClick={() => setDrawer(false)}>Show {results.length} results</button></div>
          </div>
        </div>
      )}
    </>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowUpRight } from 'lucide-react'
import BrandMark from '../../components/common/BrandMark'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import { EmptyState, ErrorState } from '../../components/common/States'
import { Skeleton } from '../../components/common/Skeletons'
import useFetch from '../../hooks/useFetch'
import usePageTitle from '../../hooks/usePageTitle'
import contentService from '../../services/contentService'

export default function Brands() {
  usePageTitle('Brands')
  const { data, loading, error, reload } = useFetch(() => contentService.brands(), [])
  const [q, setQ] = useState('')
  const list = (data || []).filter((b) => b.name.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <div className="container-x py-8 sm:py-12">
      <Breadcrumbs className="mb-6" items={[{ label: 'Brands' }]} />
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div><p className="eyebrow">Authorised partners</p><h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">Shop by <span className="text-brand-light">Brand</span></h1><p className="mt-3 max-w-xl text-muted">From race-bred helmets to touring luggage - explore India’s most trusted riding brands.</p></div>
        <div className="relative w-full sm:w-80">
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search brands..." aria-label="Search brands" className="input pl-11" />
        </div>
      </div>

      {loading ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-48" />)}</div>
        : error ? <ErrorState message={error.message} onRetry={reload} />
        : !list.length ? <EmptyState title={`No brands match “${q}”`} text="Check the spelling or try another name." action={<button onClick={() => setQ('')} className="btn-primary">Clear search</button>} />
        : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((b) => (
              <div key={b.slug}>
                <Link to={`/brands/${b.slug}`} className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-700 transition hover:-translate-y-1 hover:border-brand/70 hover:shadow-glow">
                  <div className="relative flex h-32 items-center justify-center border-b border-line bg-gradient-to-br from-ink-600 to-ink-800">
                    <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,37,43,0.18),transparent_60%)]" />
                    <BrandMark brand={b} className="relative text-3xl" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm text-muted">{b.tagline}</p>
                    <div className="mt-auto flex items-center justify-between pt-4 text-sm">
                      <span className="text-muted">{b.count} product{b.count === 1 ? '' : 's'}</span>
                      <span className="flex items-center gap-1 font-semibold text-brand">Shop <ArrowUpRight size={15} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

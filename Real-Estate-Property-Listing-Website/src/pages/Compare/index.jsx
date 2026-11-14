import { Link } from 'react-router-dom'
import { GitCompareArrows, X } from 'lucide-react'
import { useSEO } from '../../utils/seo'
import { useAsync } from '../../hooks/useAsync'
import { useCompare } from '../../context/CompareContext'
import { propertyService } from '../../services/propertyService'
import { formatPrice, formatArea, formatMoney } from '../../utils/format'
import PageHeader from '../../components/common/PageHeader'
import Img from '../../components/common/Img'
import { EmptyState, ErrorState, PageLoader } from '../../components/common/States'

const rows = [
  ['Price', (p) => formatPrice(p.price, p.purpose) + (p.purpose === 'Rent' ? ' /mo' : '')],
  ['Price per sq ft', (p) => formatMoney(p.price / p.area)],
  ['Type', (p) => p.type], ['Listing', (p) => p.status], ['Location', (p) => `${p.location}, ${p.city}`],
  ['Bedrooms', (p) => p.beds || '–'], ['Bathrooms', (p) => p.baths || '–'], ['Area', (p) => formatArea(p.area)], ['Parking', (p) => p.parking || '–'],
  ['Furnishing', (p) => p.furnishing], ['Status', (p) => p.propertyStatus], ['Facing', (p) => p.facing || '–'], ['Floor', (p) => p.floor || '–'], ['Year built', (p) => p.yearBuilt || '–'],
]

export default function Compare() {
  useSEO('Compare Properties', 'Compare properties side by side on price, size and features.')
  const { ids, toggle, clear } = useCompare()
  const { data, loading, error, reload } = useAsync(() => propertyService.list(), [])
  const list = (data || []).filter((p) => ids.includes(p.id))
  return (
    <>
      <PageHeader title="Compare properties" subtitle="See up to three properties side by side." />
      <div className="container-x py-8">
        {loading && <PageLoader />}
        {error && <ErrorState error={error} onRetry={reload} />}
        {!loading && !error && list.length === 0 && <EmptyState icon={GitCompareArrows} title="Nothing to compare yet" text="Use the compare button on property cards to add up to three." action={<Link to="/properties" className="btn-primary">Browse properties</Link>} />}
        {list.length > 0 && (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead><tr><th className="w-36 p-4" />{list.map((p) => (
                <th key={p.id} className="relative min-w-52 p-4 align-top"><button onClick={() => toggle(p.id)} className="absolute right-2 top-2 rounded-full bg-white p-1 shadow" aria-label={`Remove ${p.title}`}><X size={14} /></button>
                  <Img src={p.images[0]} alt="" className="h-32 w-full rounded-xl object-cover" /><Link to={`/properties/${p.id}`} className="mt-2 block font-semibold hover:text-accent">{p.title}</Link></th>))}</tr></thead>
              <tbody className="divide-y divide-line">{rows.map(([label, fn]) => <tr key={label}><th className="p-4 font-medium text-muted">{label}</th>{list.map((p) => <td key={p.id} className="p-4">{fn(p)}</td>)}</tr>)}</tbody>
            </table>
            <div className="border-t border-line p-4 text-right"><button onClick={clear} className="btn-outline btn-sm">Clear all</button></div>
          </div>
        )}
      </div>
    </>
  )
}

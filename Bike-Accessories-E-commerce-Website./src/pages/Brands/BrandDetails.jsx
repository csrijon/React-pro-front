import { useParams } from 'react-router-dom'
import { MapPin, Calendar, Package } from 'lucide-react'
import Catalog from '../../components/products/Catalog'
import BrandMark from '../../components/common/BrandMark'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import { ErrorState } from '../../components/common/States'
import { PageSkeleton } from '../../components/common/Skeletons'
import useFetch from '../../hooks/useFetch'
import usePageTitle from '../../hooks/usePageTitle'
import contentService from '../../services/contentService'
import NotFound from '../NotFound'

export default function BrandDetails() {
  const { slug } = useParams()
  const { data: brand, loading, error, reload } = useFetch(() => contentService.brand(slug), [slug])
  usePageTitle(brand?.name)

  if (loading) return <PageSkeleton />
  if (error) return error.status === 404 ? <NotFound /> : <div className="container-x py-16"><ErrorState message={error.message} onRetry={reload} /></div>

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-br from-ink-700 via-ink-800 to-ink">
        <div aria-hidden className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand/25 blur-3xl" />
        <div className="container-x relative py-10 sm:py-14">
          <Breadcrumbs className="mb-6" items={[{ label: 'Brands', to: '/brands' }, { label: brand.name }]} />
          <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
            <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-line bg-ink px-10 shadow-card md:w-72"><BrandMark brand={brand} className="text-4xl" /></div>
            <div>
              <p className="eyebrow">Official brand store</p>
              <h1 className="mt-1 font-display text-4xl font-extrabold">{brand.name}</h1>
              <p className="mt-3 max-w-2xl text-white/80">{brand.about}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <span className="chip py-1.5"><MapPin size={13} /> {brand.country}</span>
                <span className="chip py-1.5"><Calendar size={13} /> Since {brand.founded}</span>
                <span className="chip py-1.5"><Package size={13} /> {brand.count} products</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container-x pb-4 pt-8"><Catalog key={slug} fixed={{ brand: slug }} hide={['brand']} title={`${brand.name} Products`} /></div>
    </>
  )
}

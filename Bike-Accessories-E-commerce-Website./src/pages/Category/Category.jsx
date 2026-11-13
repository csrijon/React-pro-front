import { Link, useParams } from 'react-router-dom'
import Catalog from '../../components/products/Catalog'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import SmartImage from '../../components/common/SmartImage'
import ProductArt from '../../components/common/ProductArt'
import { ErrorState } from '../../components/common/States'
import { PageSkeleton } from '../../components/common/Skeletons'
import useFetch from '../../hooks/useFetch'
import usePageTitle from '../../hooks/usePageTitle'
import categoryService from '../../services/categoryService'
import { useCatalog } from '../../context/CatalogContext'
import NotFound from '../NotFound'

export default function Category() {
  const { slug } = useParams()
  const { categories } = useCatalog()
  const { data: cat, loading, error, reload } = useFetch(() => categoryService.get(slug), [slug])
  usePageTitle(cat?.name)

  if (loading) return <PageSkeleton />
  if (error) return error.status === 404 ? <NotFound /> : <div className="container-x py-16"><ErrorState message={error.message} onRetry={reload} /></div>

  return (
    <>
      {/* Category hero banner - each category gets its own photo, tagline and artwork */}
      <section className="relative isolate overflow-hidden border-b border-line">
        <SmartImage src={cat.image} photoKey={cat.photo} w={1800} alt="" className="absolute inset-0 -z-10 h-full w-full" priority />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink to-transparent" />
        <div className="container-x grid items-center gap-6 py-10 sm:py-14 md:grid-cols-[1fr_260px] lg:py-16">
          <div>
            <Breadcrumbs items={[{ label: 'Categories', to: '/shop' }, { label: cat.name }]} className="mb-5" />
            <p className="eyebrow">{cat.tagline}</p>
            <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">{cat.name}</h1>
            <p className="mt-3 max-w-xl text-white/80">{cat.description}</p>
            <span className="mt-5 inline-flex items-center rounded-full border border-brand/50 bg-brand-soft px-4 py-1.5 text-sm font-semibold">{cat.count} products</span>
          </div>
          <div className="hidden aspect-square overflow-hidden rounded-3xl border border-line shadow-glow md:block">
            <ProductArt type={cat.art} color={cat.color} />
          </div>
        </div>
      </section>

      <div className="container-x pb-4 pt-6">
        <nav aria-label="Other categories" className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {categories.map((c) => (
            <Link key={c.slug} to={`/category/${c.slug}`} aria-current={c.slug === slug ? 'page' : undefined}
              className={`chip shrink-0 px-4 py-2 text-sm transition ${c.slug === slug ? 'border-brand bg-brand-solid text-white' : 'hover:border-brand hover:text-white'}`}>{c.name}</Link>
          ))}
        </nav>
        <Catalog key={slug} fixed={{ category: slug }} hide={['category']} />
      </div>
    </>
  )
}

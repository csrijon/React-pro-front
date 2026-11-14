import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useSEO } from '../../utils/seo'
import { useAsync } from '../../hooks/useAsync'
import { contentService } from '../../services/contentService'
import { formatDate } from '../../utils/format'
import PageHeader from '../../components/common/PageHeader'
import Img from '../../components/common/Img'
import { CardSkeleton, EmptyState, ErrorState } from '../../components/common/States'

export default function Blog() {
  useSEO('Guides & Insights', 'Practical guides on buying, renting and selling property, plus market insights.')
  const { data, loading, error, reload } = useAsync(() => contentService.posts.list(), [])
  const [cat, setCat] = useState('All')
  const cats = ['All', ...new Set((data || []).map((p) => p.category))]
  const list = (data || []).filter((p) => cat === 'All' || p.category === cat)
  return (
    <>
      <PageHeader title="Guides & insights" subtitle="Advice for buyers, tenants, sellers and investors." />
      <div className="container-x py-8">
        {cats.length > 2 && <div className="mb-6 flex gap-2 overflow-x-auto" role="tablist">{cats.map((c) => <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${cat === c ? 'border-primary bg-primary text-white' : 'border-line bg-white'}`}>{c}</button>)}</div>}
        {error && <ErrorState error={error} onRetry={reload} />}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading && <CardSkeleton />}
          {list.map((p) => (
            <article key={p.id} className="card group overflow-hidden transition-shadow hover:shadow-lift">
              <Link to={`/blog/${p.slug}`}><Img src={p.cover} alt="" className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" /></Link>
              <div className="p-5"><p className="text-xs font-medium text-accent">{p.category} · {formatDate(p.createdAt)}</p>
                <h2 className="mt-2 text-lg font-semibold leading-snug"><Link to={`/blog/${p.slug}`} className="hover:text-accent">{p.title}</Link></h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{p.excerpt}</p></div>
            </article>
          ))}
        </div>
        {!loading && !error && list.length === 0 && <EmptyState title="No articles yet" text="Check back soon for new guides." />}
      </div>
    </>
  )
}

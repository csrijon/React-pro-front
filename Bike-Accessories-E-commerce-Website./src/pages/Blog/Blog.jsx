import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, ArrowUpRight } from 'lucide-react'
import BlogCard from '../../components/common/BlogCard'
import SmartImage from '../../components/common/SmartImage'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import { ErrorState, EmptyState } from '../../components/common/States'
import { Skeleton } from '../../components/common/Skeletons'
import useFetch from '../../hooks/useFetch'
import usePageTitle from '../../hooks/usePageTitle'
import contentService from '../../services/contentService'
import { formatDate } from '../../utils/format'

export default function Blog() {
  usePageTitle('Riding Blog')
  const { data, loading, error, reload } = useFetch(() => contentService.blogs(), [])
  const [cat, setCat] = useState('All')
  const cats = useMemo(() => ['All', ...new Set((data || []).map((b) => b.category))], [data])
  const list = (data || []).filter((b) => cat === 'All' || b.category === cat)
  const [feat, ...rest] = list

  return (
    <div className="container-x py-8 sm:py-12">
      <Breadcrumbs className="mb-6" items={[{ label: 'Blog' }]} />
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">The MotoGear Journal</p><h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">Riding Stories &amp; Guides</h1></div>
        <div className="no-scrollbar flex max-w-full gap-2 overflow-x-auto pb-1">
          {cats.map((c) => <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={`chip shrink-0 px-4 py-2 text-sm transition ${cat === c ? 'border-brand bg-brand-solid text-white' : 'hover:border-brand hover:text-white'}`}>{c}</button>)}
        </div>
      </div>

      {loading ? <div className="space-y-5"><Skeleton className="h-80" /><div className="grid grid-cols-1 gap-5 md:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-72" />)}</div></div>
        : error ? <ErrorState message={error.message} onRetry={reload} />
        : !feat ? <EmptyState title="No articles in this category" />
        : (
          <>
            <article className="group relative isolate overflow-hidden rounded-3xl border border-line">
              <SmartImage src={feat.image} photoKey={feat.photo} w={1600} priority alt="" className="absolute inset-0 -z-10 h-full w-full" imgClassName="transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/10" />
              <Link to={`/blog/${feat.slug}`} className="flex min-h-[380px] flex-col justify-end p-6 sm:min-h-[460px] sm:p-10">
                <span className="mb-3 w-fit rounded bg-brand-solid px-3 py-1 text-xs font-bold uppercase tracking-wide">Featured · {feat.category}</span>
                <h2 className="max-w-3xl font-display text-2xl font-extrabold leading-tight sm:text-4xl">{feat.title}</h2>
                <p className="mt-3 line-clamp-2 max-w-2xl text-white/80">{feat.excerpt}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/70"><span>{feat.author}</span><span aria-hidden>•</span><span>{formatDate(feat.date)}</span><span aria-hidden>•</span><span className="inline-flex items-center gap-1"><Clock size={13} /> {feat.readTime} min read</span><span className="ml-auto hidden items-center gap-1 font-semibold text-brand-light sm:inline-flex">Read article <ArrowUpRight size={16} /></span></div>
              </Link>
            </article>
            {rest.length > 0 && <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{rest.map((b) => <BlogCard key={b.slug} post={b} />)}</div>}
          </>
        )}
    </div>
  )
}

import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSEO } from '../../utils/seo'
import { useAsync } from '../../hooks/useAsync'
import { contentService } from '../../services/contentService'
import { formatDate } from '../../utils/format'
import Img from '../../components/common/Img'
import { PageLoader, EmptyState, ErrorState } from '../../components/common/States'

export default function Post() {
  const { slug } = useParams()
  const { data: p, loading, error, reload } = useAsync(() => contentService.posts.get(slug), [slug])
  useSEO(p?.title || 'Article', p?.excerpt)
  if (loading) return <PageLoader />
  if (error) return <div className="container-x py-16"><ErrorState error={error} onRetry={reload} /></div>
  if (!p) return <div className="container-x py-16"><EmptyState title="Article not found" action={<Link to="/blog" className="btn-primary">All articles</Link>} /></div>
  const share = async () => { try { if (navigator.share) await navigator.share({ title: p.title, url: location.href }); else { await navigator.clipboard.writeText(location.href); toast.success('Link copied') } } catch { /* cancelled */ } }
  return (
    <article className="container-x max-w-3xl py-8">
      <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent"><ChevronLeft size={16} />All articles</Link>
      <p className="mt-4 text-sm font-medium text-accent">{p.category}</p>
      <h1 className="mt-1 text-3xl font-semibold leading-tight sm:text-4xl">{p.title}</h1>
      <p className="mt-3 flex items-center justify-between text-sm text-muted"><span>By {p.author} · {formatDate(p.createdAt)}</span><button onClick={share} className="btn-ghost btn-sm" aria-label="Share article"><Share2 size={15} />Share</button></p>
      {p.cover && <Img src={p.cover} alt="" eager className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover" />}
      <div className="mt-8 space-y-4 text-[17px] leading-relaxed text-ink">{p.content.split(/\n{2,}/).map((para, i) => <p key={i} className="whitespace-pre-line">{para}</p>)}</div>
      <div className="card mt-10 flex flex-wrap items-center justify-between gap-3 p-5"><p className="font-medium">Ready to look at homes?</p><Link to="/properties" className="btn-primary">Browse properties</Link></div>
    </article>
  )
}

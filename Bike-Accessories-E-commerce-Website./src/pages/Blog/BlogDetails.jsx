import { Link, useParams } from 'react-router-dom'
import { m as motion, useScroll, useSpring } from 'framer-motion'
import { Clock, Share2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import SmartImage from '../../components/common/SmartImage'
import BlogCard from '../../components/common/BlogCard'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import NewsletterForm from '../../components/forms/NewsletterForm'
import { ErrorState } from '../../components/common/States'
import { PageSkeleton } from '../../components/common/Skeletons'
import useFetch from '../../hooks/useFetch'
import usePageTitle from '../../hooks/usePageTitle'
import contentService from '../../services/contentService'
import { formatDate } from '../../utils/format'
import NotFound from '../NotFound'

export default function BlogDetails() {
  const { slug } = useParams()
  const { data: post, loading, error, reload } = useFetch(() => contentService.blog(slug), [slug])
  const { data: all } = useFetch(() => contentService.blogs(), [])
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  usePageTitle(post?.title)

  if (loading) return <PageSkeleton />
  if (error) return error.status === 404 ? <NotFound /> : <div className="container-x py-16"><ErrorState message={error.message} onRetry={reload} /></div>

  const related = (all || []).filter((b) => b.slug !== post.slug).sort((a, b) => (b.category === post.category) - (a.category === post.category)).slice(0, 3)
  const share = async () => {
    try { if (navigator.share) await navigator.share({ title: post.title, url: location.href }); else { await navigator.clipboard.writeText(location.href); toast.success('Link copied') } } catch { /* cancelled */ }
  }

  return (
    <>
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[90] h-1 origin-left bg-brand-solid" aria-hidden />
      <header className="relative isolate overflow-hidden">
        <SmartImage src={post.image} photoKey={post.photo} w={1800} alt="" className="absolute inset-0 -z-10 h-full w-full" priority />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/40" />
        <div className="container-x max-w-4xl pb-12 pt-10 sm:pb-16 sm:pt-16">
          <Breadcrumbs className="mb-16 sm:mb-24" items={[{ label: 'Blog', to: '/blog' }, { label: post.category }]} />
          <span className="rounded bg-brand-solid px-3 py-1 text-xs font-bold uppercase tracking-wide">{post.category}</span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-5xl">{post.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/75">
            <span className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-solid text-xs font-bold">{post.author[0]}</span>{post.author}</span>
            <span aria-hidden>•</span><span>{formatDate(post.date)}</span><span aria-hidden>•</span><span className="inline-flex items-center gap-1"><Clock size={14} /> {post.readTime} min read</span>
          </div>
        </div>
      </header>

      <div className="container-x grid max-w-5xl gap-10 py-10 lg:grid-cols-[1fr_200px]">
        <article className="prose-moto max-w-3xl">
          <p className="mb-8 border-l-4 border-brand pl-5 text-lg italic leading-relaxed text-white/90">{post.excerpt}</p>
          {post.body.map(([type, text], i) => type === 'h' ? <h2 key={i}>{text}</h2> : <p key={i}>{text}</p>)}
          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <button onClick={share} className="btn-ghost"><Share2 size={16} /> Share article</button>
            <Link to="/blog" className="btn-ghost"><ArrowLeft size={16} /> All articles</Link>
          </div>
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3 rounded-2xl border border-line bg-ink-800 p-4 text-sm">
            <p className="font-bold">Written by</p><p className="text-muted">{post.author}</p>
            <p className="pt-2 font-bold">Read time</p><p className="text-muted">{post.readTime} minutes</p>
            <button onClick={share} className="btn-primary mt-2 w-full py-2.5"><Share2 size={15} /> Share</button>
          </div>
        </aside>
      </div>

      <section className="container-x pb-6"><h2 className="section-title mb-6">Related articles</h2><div className="grid gap-5 md:grid-cols-3">{related.map((b) => <BlogCard key={b.slug} post={b} />)}</div></section>
      <section className="container-x mt-12"><div className="rounded-3xl border border-line bg-ink-800 p-8 sm:p-10 md:flex md:items-center md:justify-between md:gap-10"><div className="mb-5 md:mb-0"><h2 className="font-display text-2xl font-bold">Never miss a ride tip</h2><p className="mt-1 text-sm text-muted">Fresh guides and gear reviews, delivered monthly.</p></div><div className="md:w-96"><NewsletterForm /></div></div></section>
    </>
  )
}

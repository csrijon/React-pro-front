import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import SmartImage from './SmartImage'
import { formatDate } from '../../utils/format'

export default function BlogCard({ post, className = '' }) {
  return (
    <article className={`group overflow-hidden rounded-2xl border border-line bg-ink-700 transition hover:-translate-y-1 hover:border-brand/60 ${className}`}>
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <SmartImage photoKey={post.photo} w={800} alt={post.title} className="h-full w-full" imgClassName="transition duration-500 group-hover:scale-105" />
          <span className="absolute left-3 top-3 rounded bg-brand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">{post.category}</span>
        </div>
        <div className="p-5">
          <h3 className="line-clamp-2 text-lg font-bold leading-snug transition group-hover:text-brand">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-3 text-xs text-muted">
            <span>{formatDate(post.date)}</span><span aria-hidden>•</span>
            <span className="inline-flex items-center gap-1"><Clock size={12} /> {post.readTime} min read</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

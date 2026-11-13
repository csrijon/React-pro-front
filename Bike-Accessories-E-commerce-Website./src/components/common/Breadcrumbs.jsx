import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumbs({ items, className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1.5 text-xs text-muted ${className}`}>
      <Link to="/" className="hover:text-white">Home</Link>
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <ChevronRight size={12} className="opacity-60" />
          {it.to ? <Link to={it.to} className="hover:text-white">{it.label}</Link> : <span className="text-white/90" aria-current="page">{it.label}</span>}
        </span>
      ))}
    </nav>
  )
}

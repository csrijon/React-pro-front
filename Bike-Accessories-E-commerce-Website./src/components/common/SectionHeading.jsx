import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function SectionHeading({ eyebrow, title, subtitle, to, linkLabel = 'View All', align = 'left', className = '' }) {
  return (
    <div className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${align === 'center' ? 'flex-col items-center text-center' : ''} ${className}`}>
      <div className={align === 'center' ? 'max-w-2xl' : ''}>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-muted sm:text-base">{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="group inline-flex items-center gap-1.5 py-2 text-sm font-semibold text-brand-light hover:text-white">
          {linkLabel}
          <ArrowRight size={16} className="transition group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}

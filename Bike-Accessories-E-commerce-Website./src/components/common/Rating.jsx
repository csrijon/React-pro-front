import { Star } from 'lucide-react'

export default function Rating({ value = 0, count, size = 14, showValue = false, className = '' }) {
  return (
    <span role="img" className={`inline-flex items-center gap-1 ${className}`} aria-label={`Rated ${value} out of 5`}>
      <span className="inline-flex">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, value - (i - 1)))
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-line" fill="currentColor" strokeWidth={0} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star size={size} className="text-amber-400" fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          )
        })}
      </span>
      {showValue && <span className="text-xs font-semibold text-white">{value.toFixed(1)}</span>}
      {count != null && <span className="text-xs text-muted">({count.toLocaleString('en-IN')})</span>}
    </span>
  )
}

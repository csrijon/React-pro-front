import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null
  const nums = Array.from({ length: pages }, (_, i) => i + 1)
  const b = 'grid h-9 min-w-9 place-items-center rounded-lg border px-2 text-sm font-medium transition'
  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button className={`${b} border-line bg-white disabled:opacity-40`} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
      {nums.map((n) => (
        <button key={n} onClick={() => onChange(n)} aria-current={n === page ? 'page' : undefined}
          className={`${b} ${n === page ? 'border-primary bg-primary text-white' : 'border-line bg-white hover:border-primary'}`}>{n}</button>
      ))}
      <button className={`${b} border-line bg-white disabled:opacity-40`} disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
    </nav>
  )
}

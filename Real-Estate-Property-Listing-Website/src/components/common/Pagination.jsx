import { ChevronLeft, ChevronRight } from 'lucide-react'

// 1 … 4 5 6 … 12 — keeps the bar narrow no matter how many pages there are.
function windowed(page, pages) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
  const set = new Set([1, 2, pages - 1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages))
  const nums = [...set].sort((a, b) => a - b)
  const out = []
  nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) out.push('…'); out.push(n) })
  return out
}

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null
  const b = 'grid h-10 min-w-10 place-items-center rounded-lg border px-2 text-sm font-medium transition'
  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
      <button className={`${b} border-line bg-white disabled:opacity-40`} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
      {windowed(page, pages).map((n, i) => (n === '…'
        ? <span key={`gap${i}`} className="px-1 text-muted" aria-hidden>…</span>
        : <button key={n} onClick={() => onChange(n)} aria-current={n === page ? 'page' : undefined} aria-label={`Page ${n}`}
          className={`${b} ${n === page ? 'border-primary bg-primary text-white' : 'border-line bg-white hover:border-primary'}`}>{n}</button>))}
      <button className={`${b} border-line bg-white disabled:opacity-40`} disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
    </nav>
  )
}

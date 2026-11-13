import { ChevronLeft, ChevronRight } from 'lucide-react'

function range(page, pages) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
  const out = [1]
  const s = Math.max(2, page - 1), e = Math.min(pages - 1, page + 1)
  if (s > 2) out.push('…')
  for (let i = s; i <= e; i++) out.push(i)
  if (e < pages - 1) out.push('…')
  out.push(pages)
  return out
}

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null
  const btn = 'flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition'
  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button aria-label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)} className={`${btn} border-line hover:border-brand disabled:opacity-40`}><ChevronLeft size={16} /></button>
      {range(page, pages).map((p, i) =>
        p === '…' ? <span key={`d${i}`} className="px-1 text-muted">…</span> : (
          <button key={p} aria-current={p === page ? 'page' : undefined} onClick={() => onChange(p)}
            className={`${btn} ${p === page ? 'border-brand bg-brand-solid text-white' : 'border-line hover:border-brand'}`}>{p}</button>
        ),
      )}
      <button aria-label="Next page" disabled={page >= pages} onClick={() => onChange(page + 1)} className={`${btn} border-line hover:border-brand disabled:opacity-40`}><ChevronRight size={16} /></button>
    </nav>
  )
}

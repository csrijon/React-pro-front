import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, onChange, dark = false }) {
  if (pages <= 1) return null;
  const base = dark ? 'border-white/10 text-cream/80 hover:bg-white/5' : 'border-forest/30 text-forest hover:bg-forest hover:text-cream';
  const active = dark ? 'bg-forest-700 text-cream border-sage/30' : 'bg-forest text-cream border-forest';
  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page" className={`h-10 w-10 grid place-items-center border disabled:opacity-40 ${base}`}><ChevronLeft size={16} /></button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button key={n} onClick={() => onChange(n)} aria-current={n === page ? 'page' : undefined} className={`h-10 w-10 text-sm border ${n === page ? active : base}`}>{n}</button>
      ))}
      <button disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="Next page" className={`h-10 w-10 grid place-items-center border disabled:opacity-40 ${base}`}><ChevronRight size={16} /></button>
    </nav>
  );
}

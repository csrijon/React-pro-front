import { Minus, Plus } from 'lucide-react'

export default function QuantitySelector({ value, onChange, min = 1, max = 10, size = 'md' }) {
  const pad = size === 'sm' ? 'h-10 w-10' : 'h-11 w-11'
  return (
    <div className="inline-flex items-center rounded-lg border border-line bg-ink-800" role="group" aria-label="Quantity">
      <button type="button" aria-label="Decrease quantity" disabled={value <= min} onClick={() => onChange(value - 1)}
        className={`${pad} flex items-center justify-center text-muted transition hover:text-white disabled:opacity-40`}>
        <Minus size={14} />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(value + 1)}
        className={`${pad} flex items-center justify-center text-muted transition hover:text-white disabled:opacity-40`}>
        <Plus size={14} />
      </button>
    </div>
  )
}

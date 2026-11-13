import { useState } from 'react'
import { ChevronDown, Star } from 'lucide-react'
import { useCatalog } from '../../context/CatalogContext'
import { formatPrice } from '../../utils/format'

function Group({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-t border-line py-4">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between text-left text-sm font-bold">
        {title}<ChevronDown size={16} className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

function Check({ checked, onChange, label, count }) {
  return (
    <label className="group flex cursor-pointer items-center justify-between gap-3 py-1.5 text-sm">
      <span className="flex min-w-0 items-center gap-2.5">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border border-line bg-ink transition peer-checked:border-brand peer-checked:bg-brand-solid peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
          <svg viewBox="0 0 12 12" className={`h-3 w-3 text-white ${checked ? 'opacity-100' : 'opacity-0'}`}><path d="M2.5 6.5l2.500 2.500 4.500-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <span className="truncate text-white/85 group-hover:text-white">{label}</span>
      </span>
      {count != null && <span className="text-xs text-muted">{count}</span>}
    </label>
  )
}

/** Two overlapped native range inputs = accessible dual-handle slider. */
function DualRange({ min, max, valueMin, valueMax, step = 100, onCommit }) {
  const [local, setLocal] = useState([valueMin, valueMax])
  const [prev, setPrev] = useState([valueMin, valueMax])
  if (prev[0] !== valueMin || prev[1] !== valueMax) {
    setPrev([valueMin, valueMax])
    setLocal([valueMin, valueMax])
  }
  const [lo, hi] = local
  const pct = (v) => ((v - min) / (max - min)) * 100
  const thumb = 'pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brand-solid [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-brand-solid'
  const commit = () => onCommit(lo, hi)
  return (
    <div>
      <div className="relative mx-1 mt-2 h-5">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded bg-line" />
        <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-brand-solid" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <input type="range" aria-label="Minimum price" min={min} max={max} step={step} value={lo} className={thumb}
          onChange={(e) => setLocal([Math.min(+e.target.value, hi - step), hi])} onPointerUp={commit} onKeyUp={commit} onBlur={commit} />
        <input type="range" aria-label="Maximum price" min={min} max={max} step={step} value={hi} className={thumb}
          onChange={(e) => setLocal([lo, Math.max(+e.target.value, lo + step)])} onPointerUp={commit} onKeyUp={commit} onBlur={commit} />
      </div>
      <p className="mt-3 text-sm text-muted">{formatPrice(lo)} – {formatPrice(hi)}</p>
    </div>
  )
}

export default function FilterSidebar({ filters, update, clear, facets, hide = [], priceMax = 12000, activeCount }) {
  const { categories, brands } = useCatalog()
  const toggle = (key, val) => {
    const cur = filters[key]
    update({ [key]: cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val] })
  }
  const [showAllBrands, setShowAllBrands] = useState(false)
  const brandList = showAllBrands ? brands : brands.slice(0, 6)

  return (
    <div>
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-base font-bold">Filters {activeCount > 0 && <span className="ml-1 rounded-full bg-brand-solid px-2 py-0.5 text-xs">{activeCount}</span>}</h2>
        <button onClick={clear} disabled={!activeCount} className="text-xs font-medium text-muted transition hover:text-brand-light disabled:opacity-40">Clear All</button>
      </div>

      {!hide.includes('category') && (
        <Group title="Category">
          {categories.map((c) => <Check key={c.slug} label={c.name} count={facets?.categories?.[c.slug]} checked={filters.category.includes(c.slug)} onChange={() => toggle('category', c.slug)} />)}
        </Group>
      )}

      {!hide.includes('brand') && (
        <Group title="Brand">
          {brandList.map((b) => <Check key={b.slug} label={b.name} count={facets?.brands?.[b.slug]} checked={filters.brand.includes(b.slug)} onChange={() => toggle('brand', b.slug)} />)}
          <button onClick={() => setShowAllBrands((s) => !s)} className="mt-1 text-xs font-semibold text-brand-light hover:underline">{showAllBrands ? 'Show less' : `Show all ${brands.length}`}</button>
        </Group>
      )}

      <Group title="Price Range">
        <DualRange min={0} max={priceMax} valueMin={filters.min ?? 0} valueMax={filters.max ?? priceMax} onCommit={(lo, hi) => update({ min: lo <= 0 ? null : lo, max: hi >= priceMax ? null : hi })} />
      </Group>

      <Group title="Customer Rating">
        {[4, 3].map((r) => (
          <label key={r} className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm">
            <input type="radio" name="rating" checked={filters.rating === r} onChange={() => update({ rating: r })} className="h-4 w-4 accent-[#EF252B]" />
            <span className="inline-flex items-center gap-1">{r}<Star size={13} className="fill-amber-400 text-amber-400" /> &amp; up</span>
          </label>
        ))}
        {filters.rating && <button onClick={() => update({ rating: null })} className="mt-1 text-xs font-semibold text-brand-light hover:underline">Reset rating</button>}
      </Group>

      <Group title="Availability">
        <Check label="In stock only" checked={filters.stock} onChange={() => update({ stock: !filters.stock })} />
      </Group>
    </div>
  )
}

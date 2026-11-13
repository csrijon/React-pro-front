import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, m as motion } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import FilterSidebar from './FilterSidebar'
import ProductGrid from './ProductGrid'
import Pagination from '../common/Pagination'
import { EmptyState } from '../common/States'
import useFetch from '../../hooks/useFetch'
import useDebounce from '../../hooks/useDebounce'
import productService from '../../services/productService'
import { useCatalog } from '../../context/CatalogContext'
import { formatPrice } from '../../utils/format'

const PAGE_SIZE = 12
export const SORTS = [
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]
const list = (v) => (v ? v.split(',').filter(Boolean) : [])

/**
 * Filterable, sortable, paginated product listing. All state lives in the URL
 * (?q=&category=&brand=&min=&max=&rating=&stock=&sort=&page=) so it survives refresh and can be shared.
 * `fixed` pins a filter (e.g. {category:'helmets'}) and `hide` removes that sidebar group.
 */
export default function Catalog({ fixed = {}, hide = [], title, subtitle, headerExtra }) {
  const { categories, brands } = useCatalog()
  const [sp, setSp] = useSearchParams()
  const [drawer, setDrawer] = useState(false)

  const filters = useMemo(
    () => ({
      q: sp.get('q') || '',
      category: list(sp.get('category')),
      brand: list(sp.get('brand')),
      min: sp.get('min') ? +sp.get('min') : null,
      max: sp.get('max') ? +sp.get('max') : null,
      rating: sp.get('rating') ? +sp.get('rating') : null,
      stock: sp.get('stock') === '1',
      sort: sp.get('sort') || 'popular',
      page: Math.max(1, +sp.get('page') || 1),
    }),
    [sp],
  )

  const update = (patch) => {
    const next = new URLSearchParams(sp)
    Object.entries(patch).forEach(([k, v]) => {
      const empty = v == null || v === '' || v === false || (Array.isArray(v) && !v.length) || (k === 'sort' && v === 'popular') || (k === 'page' && v === 1)
      if (empty) next.delete(k)
      else next.set(k, Array.isArray(v) ? v.join(',') : v === true ? '1' : String(v))
    })
    if (!('page' in patch)) next.delete('page')
    setSp(next, { replace: true })
  }
  const clear = () => setSp(new URLSearchParams(filters.sort !== 'popular' ? { sort: filters.sort } : {}), { replace: true })

  // debounced search input -> URL
  const [term, setTerm] = useState(filters.q)
  const dTerm = useDebounce(term, 350)
  useEffect(() => setTerm(filters.q), [filters.q])
  useEffect(() => {
    if (dTerm !== filters.q) update({ q: dTerm.trim() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dTerm])

  const query = {
    q: filters.q || undefined,
    category: fixed.category || filters.category.join(',') || undefined,
    brand: fixed.brand || filters.brand.join(',') || undefined,
    minPrice: filters.min ?? undefined,
    maxPrice: filters.max ?? undefined,
    rating: filters.rating ?? undefined,
    inStock: filters.stock ? 'true' : undefined,
    sort: filters.sort,
    page: filters.page,
    limit: PAGE_SIZE,
  }
  const { data, loading, error, reload } = useFetch(() => productService.list(query), [JSON.stringify(query)])
  const { data: facets } = useFetch(() => productService.facets(), [])

  const activeCount = filters.category.length + filters.brand.length + (filters.min != null || filters.max != null ? 1 : 0) + (filters.rating ? 1 : 0) + (filters.stock ? 1 : 0)
  const total = data?.total ?? 0

  const chips = [
    ...filters.category.map((s) => ({ label: categories.find((c) => c.slug === s)?.name, remove: () => update({ category: filters.category.filter((x) => x !== s) }) })),
    ...filters.brand.map((s) => ({ label: brands.find((b) => b.slug === s)?.name, remove: () => update({ brand: filters.brand.filter((x) => x !== s) }) })),
    ...(filters.min != null || filters.max != null ? [{ label: `${formatPrice(filters.min ?? 0)} – ${filters.max != null ? formatPrice(filters.max) : 'Any'}`, remove: () => update({ min: null, max: null }) }] : []),
    ...(filters.rating ? [{ label: `${filters.rating}★ & up`, remove: () => update({ rating: null }) }] : []),
    ...(filters.stock ? [{ label: 'In stock', remove: () => update({ stock: false }) }] : []),
    ...(filters.q ? [{ label: `“${filters.q}”`, remove: () => { setTerm(''); update({ q: '' }) } }] : []),
  ]

  const sidebar = <FilterSidebar filters={filters} update={update} clear={clear} facets={facets} hide={hide} priceMax={facets ? Math.ceil(facets.maxPrice / 1000) * 1000 : 12000} activeCount={activeCount} />

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-line bg-ink-800 p-5 no-scrollbar">{sidebar}</div>
      </aside>

      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            {title && <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>}
            <p className="mt-1 text-sm text-muted" aria-live="polite">{loading ? 'Loading products…' : `${total} product${total === 1 ? '' : 's'}${subtitle ? ` · ${subtitle}` : ''}`}</p>
          </div>
          {headerExtra}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search products..." aria-label="Search products" className="input py-2.5 pl-10" />
          </div>
          <button onClick={() => setDrawer(true)} className="btn-ghost py-2.5 lg:hidden"><SlidersHorizontal size={16} /> Filters{activeCount > 0 && <span className="rounded-full bg-brand-solid px-1.5 text-xs">{activeCount}</span>}</button>
          <div className="relative">
            <label htmlFor="sort" className="sr-only">Sort by</label>
            <select id="sort" value={filters.sort} onChange={(e) => update({ sort: e.target.value })} className="input appearance-none py-2.5 pr-9 font-medium">
              {SORTS.map((s) => <option key={s.value} value={s.value}>Sort by: {s.label}</option>)}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
          </div>
        </div>

        {chips.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {chips.map((c, i) => (
              <button key={i} onClick={c.remove} className="chip border-brand/40 bg-brand-soft text-white transition hover:bg-brand-solid">{c.label}<X size={12} /></button>
            ))}
            <button onClick={() => { setTerm(''); clear() }} className="py-2 text-xs font-semibold text-brand-light hover:underline">Clear all</button>
          </div>
        )}

        <ProductGrid
          products={data?.items} loading={loading} error={error} onRetry={reload} skeletons={6} cols="grid-cols-2 xl:grid-cols-3"
          empty={<EmptyState title="No products match your filters" text="Try removing a filter or searching for something else." action={<button onClick={() => { setTerm(''); clear() }} className="btn-primary">Clear Filters</button>} />}
        />
        {!loading && data && <Pagination page={data.page} pages={data.pages} onChange={(p) => { update({ page: p }); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />}
      </div>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm lg:hidden" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-x-0 bottom-0 z-[61] flex max-h-[88vh] flex-col rounded-t-3xl border-t border-line bg-ink-800 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <span className="font-bold">Filter products</span>
                <button onClick={() => setDrawer(false)} aria-label="Close filters" className="rounded-full p-1.5 hover:bg-ink-600"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-4 pt-2">{sidebar}</div>
              <div className="border-t border-line p-4"><button onClick={() => setDrawer(false)} className="btn-primary w-full">Show {total} results</button></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

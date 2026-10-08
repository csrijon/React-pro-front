import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { GENDERS, qs } from '../lib/api.js';
import { useFetch } from '../lib/hooks.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Empty, ErrorBox, Pagination, ProductSkeletons } from '../components/ui.jsx';

const csv = (v) => (v ? v.split(',').filter(Boolean) : []);
const SORTS = [['newest', 'Newest'], ['price_asc', 'Price: low → high'], ['price_desc', 'Price: high → low'], ['name', 'Product name']];

export default function Products() {
  const { gender: gSlug, category: cSlug } = useParams();
  const [sp, setSp] = useSearchParams();
  const nav = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const gender = gSlug ? GENDERS.find((g) => g.slug === gSlug || g.key === gSlug) : null;
  const invalidGender = gSlug && !gender;

  const query = useMemo(() => ({
    q: sp.get('q') || '', gender: gender?.key, category: cSlug || sp.get('category') || '',
    brand: sp.get('brand') || '', size: sp.get('size') || '', color: sp.get('color') || '',
    minMrp: sp.get('minMrp') || '', maxMrp: sp.get('maxMrp') || '', availability: sp.get('availability') || '',
    featured: sp.get('featured') || '', sort: sp.get('sort') || 'newest', page: sp.get('page') || '1', limit: 12,
  }), [sp, gender, cSlug]);

  const url = invalidGender ? null : `/api/products${qs(query)}`;
  const { data, error, loading, reload } = useFetch(url);
  const { data: cats } = useFetch('/api/categories');
  const { data: brands } = useFetch('/api/brands');
  const { data: facets } = useFetch('/api/filters');

  const [mrp, setMrp] = useState({ min: query.minMrp, max: query.maxMrp });
  useEffect(() => setMrp({ min: query.minMrp, max: query.maxMrp }), [query.minMrp, query.maxMrp]);

  const setParam = (changes) => {
    const next = new URLSearchParams(sp);
    for (const [k, v] of Object.entries(changes)) (v === '' || v == null ? next.delete(k) : next.set(k, v));
    if (!('page' in changes)) next.delete('page');
    setSp(next);
  };
  const toggleIn = (key, val) => {
    const cur = csv(sp.get(key));
    setParam({ [key]: (cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val]).join(',') });
  };
  const goGender = (slug) => nav(`${slug ? `/products/${slug}` : '/products'}${sp.toString() ? `?${sp.toString()}` : ''}`);

  const visibleCats = useMemo(() => {
    const all = cats?.categories || [];
    return gender ? all.filter((c) => c.gender === gender.key) : [...new Map(all.map((c) => [c.slug, c])).values()];
  }, [cats, gender]);

  const activeCat = visibleCats.find((c) => c.slug === query.category);
  const title = [gender ? `${gender.label}'s` : null, activeCat?.name || (query.category ? query.category : null)].filter(Boolean).join(' ')
    || (query.featured ? 'Featured products' : query.q ? `Results for “${query.q}”` : 'All products');

  const activeCount = ['brand', 'size', 'color', 'minMrp', 'maxMrp', 'availability', 'featured'].filter((k) => query[k]).length;
  const clearAll = () => nav(gender ? `/products/${gender.slug}${cSlug ? '/' + cSlug : ''}${query.q ? `?q=${encodeURIComponent(query.q)}` : ''}` : (query.q ? `/products?q=${encodeURIComponent(query.q)}` : '/products'));

  if (invalidGender) return <div className="container"><Empty title="Page not found">That section does not exist. <Link to="/products">Browse all products</Link></Empty></div>;

  const filters = (
    <div className="filters">
      <div className="filters-head"><h2>Filters</h2>{(activeCount > 0 || query.category) && <button className="link" onClick={clearAll}>Clear all</button>}</div>

      <fieldset><legend>Gender</legend>
        {[{ slug: '', label: 'All' }, ...GENDERS].map((g) => (
          <label key={g.slug} className="check"><input type="radio" name="gender" checked={(gender?.slug || '') === g.slug} onChange={() => goGender(g.slug)} /> {g.label}</label>
        ))}
      </fieldset>

      <fieldset><legend>Category</legend>
        <label className="check"><input type="radio" name="cat" checked={!query.category} onChange={() => (gender ? nav(`/products/${gender.slug}${sp.toString() ? '?' + sp : ''}`) : setParam({ category: '' }))} /> All</label>
        {visibleCats.map((c) => (
          <label key={c.id} className="check"><input type="radio" name="cat" checked={query.category === c.slug}
            onChange={() => (gender ? nav(`/products/${gender.slug}/${c.slug}${sp.toString() ? '?' + sp : ''}`) : setParam({ category: c.slug }))} /> {c.name}</label>
        ))}
      </fieldset>

      <fieldset><legend>Brand</legend>
        {(brands?.brands || []).map((b) => (
          <label key={b.id} className="check"><input type="checkbox" checked={csv(query.brand).includes(b.slug)} onChange={() => toggleIn('brand', b.slug)} /> {b.name}</label>
        ))}
      </fieldset>

      <fieldset><legend>Size</legend>
        <div className="chips">{(facets?.sizes || []).map((s) => (
          <button key={s} type="button" className={`chip ${csv(query.size).includes(s) ? 'on' : ''}`} aria-pressed={csv(query.size).includes(s)} onClick={() => toggleIn('size', s)}>{s}</button>
        ))}</div>
      </fieldset>

      <fieldset><legend>Colour</legend>
        <div className="chips">{(facets?.colors || []).map((c) => (
          <button key={c} type="button" className={`chip ${csv(query.color).includes(c) ? 'on' : ''}`} aria-pressed={csv(query.color).includes(c)} onClick={() => toggleIn('color', c)}>{c}</button>
        ))}</div>
      </fieldset>

      <fieldset><legend>MRP (₹)</legend>
        <div className="range">
          <input type="number" min="0" placeholder={facets?.mrp?.min ?? 'Min'} value={mrp.min} onChange={(e) => setMrp({ ...mrp, min: e.target.value })} aria-label="Minimum MRP" />
          <span>–</span>
          <input type="number" min="0" placeholder={facets?.mrp?.max ?? 'Max'} value={mrp.max} onChange={(e) => setMrp({ ...mrp, max: e.target.value })} aria-label="Maximum MRP" />
          <button className="btn sm" onClick={() => setParam({ minMrp: mrp.min, maxMrp: mrp.max })}>Go</button>
        </div>
      </fieldset>

      <fieldset><legend>Availability</legend>
        <select value={query.availability} onChange={(e) => setParam({ availability: e.target.value })} aria-label="Availability">
          <option value="">Any</option><option value="in_stock">In stock</option><option value="low">Low stock</option><option value="out_of_stock">Out of stock</option>
        </select>
        <label className="check"><input type="checkbox" checked={!!query.featured} onChange={(e) => setParam({ featured: e.target.checked ? '1' : '' })} /> Featured only</label>
      </fieldset>
    </div>
  );

  return (
    <div className="container page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/products">Products</Link>
        {gender && <> / <Link to={`/products/${gender.slug}`}>{gender.label}</Link></>}
        {activeCat && <> / <span>{activeCat.name}</span></>}
      </nav>
      <div className="list-head">
        <h1>{title}</h1>
        <div className="list-tools">
          <button className="btn mobile-only" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}>Filters{activeCount ? ` (${activeCount})` : ''}</button>
          <label className="sort"><span className="small muted">Sort by</span>
            <select value={query.sort} onChange={(e) => setParam({ sort: e.target.value === 'newest' ? '' : e.target.value })}>
              {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
        </div>
      </div>
      <div className="list-layout">
        <aside className={`sidebar ${showFilters ? 'open' : ''}`}>{filters}</aside>
        <section aria-live="polite">
          {loading ? <ProductSkeletons count={6} /> : error ? <ErrorBox error={error} onRetry={reload} /> : (
            <>
              <p className="muted small">{data.total} product{data.total === 1 ? '' : 's'} found</p>
              {data.items.length === 0 ? (
                <Empty title="No products match your filters">Try removing a filter or searching for something else. {(activeCount > 0) && <button className="link" onClick={clearAll}>Clear filters</button>}</Empty>
              ) : (
                <div className="grid products">{data.items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
              )}
              <Pagination page={data.page} pages={data.pages} onChange={(n) => { setParam({ page: String(n) }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

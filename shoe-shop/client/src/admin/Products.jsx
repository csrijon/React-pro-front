import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GENDERS, api, genderLabel, inr, qs } from '../lib/api.js';
import { useDebounced, useFetch, useToast } from '../lib/hooks.jsx';
import { Empty, ErrorBox, Pagination, ShoeImage, Spinner, StockBadge, Toggle, useConfirm } from '../components/ui.jsx';

export default function Products() {
  const [sp, setSp] = useSearchParams();
  const toast = useToast();
  const confirm = useConfirm();
  const [q, setQ] = useState(sp.get('q') || '');
  const dq = useDebounced(q);
  useEffect(() => { if (dq !== (sp.get('q') || '')) set({ q: dq }); }, [dq]); // eslint-disable-line

  const f = { q: sp.get('q') || '', gender: sp.get('gender') || '', category: sp.get('category') || '', brand: sp.get('brand') || '', active: sp.get('active') || '', stock: sp.get('stock') || '', page: sp.get('page') || '1' };
  const { data, error, loading, reload } = useFetch(`/api/admin/products${qs({ ...f, limit: 15 })}`);
  const { data: cats } = useFetch('/api/admin/categories');
  const { data: brands } = useFetch('/api/admin/brands');

  function set(ch) {
    const n = new URLSearchParams(sp);
    for (const [k, v] of Object.entries(ch)) (v ? n.set(k, v) : n.delete(k));
    if (!('page' in ch)) n.delete('page');
    setSp(n, { replace: true });
  }
  const catOptions = [...new Map((cats?.categories || []).filter((c) => !f.gender || c.gender === f.gender).map((c) => [c.slug, c])).values()];

  async function flag(p, key, value) {
    try { await api.patch(`/api/admin/products/${p.id}/${key}`, { [key]: value }); toast.success(`${p.name}: ${key === 'featured' ? (value ? 'marked featured' : 'removed from featured') : (value ? 'activated' : 'deactivated')}`); reload(); }
    catch (e) { toast.error(e.message); }
  }
  async function remove(p) {
    if (!(await confirm({ title: 'Delete product?', message: `“${p.name}” and all of its stock records will be permanently deleted. To just hide it from customers, deactivate it instead.`, confirmLabel: 'Delete', danger: true }))) return;
    try { await api.del(`/api/admin/products/${p.id}`); toast.success('Product deleted'); reload(); } catch (e) { toast.error(e.message); }
  }

  return (
    <>
      <div className="page-head"><h1>Products</h1><Link className="btn primary" to="/admin/products/new">+ Add product</Link></div>
      <div className="toolbar">
        <input type="search" placeholder="Search name or SKU…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
        <select value={f.gender} onChange={(e) => set({ gender: e.target.value, category: '' })} aria-label="Gender"><option value="">All genders</option>{GENDERS.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}</select>
        <select value={f.category} onChange={(e) => set({ category: e.target.value })} aria-label="Category"><option value="">All categories</option>{catOptions.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
        <select value={f.brand} onChange={(e) => set({ brand: e.target.value })} aria-label="Brand"><option value="">All brands</option>{(brands?.brands || []).map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}</select>
        <select value={f.active} onChange={(e) => set({ active: e.target.value })} aria-label="Status"><option value="">Any status</option><option value="1">Active</option><option value="0">Inactive</option></select>
        <select value={f.stock} onChange={(e) => set({ stock: e.target.value })} aria-label="Stock"><option value="">Any stock</option><option value="IN">In stock</option><option value="LOW">Low stock</option><option value="OUT">Out of stock</option></select>
      </div>
      {loading ? <Spinner /> : error ? <ErrorBox error={error} onRetry={reload} /> : data.items.length === 0 ? <Empty title="No products found">Adjust the filters or <Link to="/admin/products/new">add a product</Link>.</Empty> : (
        <>
          <div className="table-wrap"><table className="table">
            <thead><tr><th></th><th>Product</th><th>Brand</th><th>Category</th><th>MRP</th><th>Wholesale</th><th className="num">Stock</th><th className="num">Stock value</th><th className="num">Cost / margin</th><th>Featured</th><th>Active</th><th></th></tr></thead>
            <tbody>{data.items.map((p) => (
              <tr key={p.id} className={p.active ? '' : 'inactive'}>
                <td><div className="thumb"><ShoeImage src={p.image} alt="" /></div></td>
                <td><Link to={`/admin/products/${p.id}`}><strong>{p.name}</strong></Link><div className="small muted">{p.sku}</div></td>
                <td>{p.brand.name}</td>
                <td>{genderLabel(p.gender)} · {p.category.name}</td>
                <td>{p.mrp.min === p.mrp.max ? inr(p.mrp.min) : `${inr(p.mrp.min)}+`}</td>
                <td>{p.wholesale?.min != null ? (p.wholesale.min === p.wholesale.max ? inr(p.wholesale.min) : `${inr(p.wholesale.min)}+`) : '—'}</td>
                <td className="num">{p.totalStock} <StockBadge status={p.stockStatus} /></td>
                <td className="num" title={`At MRP: ${inr(p.stockValueMrp)}`}>{inr(p.stockValueWholesale)}</td>
                <td className="num">{p.costPrice != null ? <>{inr(p.costPrice)}<div className={`small ${p.marginPct < 0 ? 'minus' : 'plus'}`}>{p.marginPct != null ? `${p.marginPct}%` : ''}</div></> : <span className="muted" title="No purchase cost entered">—</span>}</td>
                <td><Toggle checked={p.featured} onChange={(v) => flag(p, 'featured', v)} /></td>
                <td><Toggle checked={p.active} onChange={(v) => flag(p, 'active', v)} /></td>
                <td className="actions-cell"><Link className="btn sm" to={`/admin/products/${p.id}`}>Edit</Link> <button className="btn sm danger-o" onClick={() => remove(p)}>Delete</button></td>
              </tr>))}
            </tbody>
          </table></div>
          <p className="muted small">{data.total} product{data.total === 1 ? '' : 's'}</p>
          <Pagination page={data.page} pages={data.pages} onChange={(n) => set({ page: String(n) })} />
        </>
      )}
    </>
  );
}

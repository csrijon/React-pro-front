import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GENDERS, api, genderLabel, inr, qs } from '../lib/api.js';
import { useDebounced, useFetch, useSettings, useToast } from '../lib/hooks.jsx';
import { Empty, ErrorBox, Pagination, ShoeImage, Spinner, StockBadge, Toggle, useConfirm } from '../components/ui.jsx';

const absUrl = (u) => (!u ? '' : /^https?:/i.test(u) ? u : `${window.location.origin}${u}`);
const mrpText = (mrp) => (mrp.min === mrp.max ? inr(mrp.min) : `${inr(mrp.min)} – ${inr(mrp.max)}`);

export default function Products() {
  const [sp, setSp] = useSearchParams();
  const toast = useToast();
  const confirm = useConfirm();
  const { settings } = useSettings();
  const [q, setQ] = useState(sp.get('q') || '');
  const dq = useDebounced(q);
  const [sel, setSel] = useState(() => new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
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

  const items = data?.items || [];
  const selected = useMemo(() => items.filter((p) => sel.has(p.id)), [items, sel]);
  const allOnPage = items.length > 0 && items.every((p) => sel.has(p.id));
  const toggleSel = (id) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSel((s) => { const n = new Set(s); if (allOnPage) items.forEach((p) => n.delete(p.id)); else items.forEach((p) => n.add(p.id)); return n; });

  async function flag(p, key, value) {
    try { await api.patch(`/api/admin/products/${p.id}/${key}`, { [key]: value }); toast.success(`${p.name}: ${key === 'featured' ? (value ? 'marked featured' : 'removed from featured') : (value ? 'activated' : 'deactivated')}`); reload(); }
    catch (e) { toast.error(e.message); }
  }
  async function remove(p) {
    if (!(await confirm({ title: 'Delete product?', message: `“${p.name}” and all of its stock records will be permanently deleted. To just hide it from customers, deactivate it instead.`, confirmLabel: 'Delete', danger: true }))) return;
    try { await api.del(`/api/admin/products/${p.id}`); toast.success('Product deleted'); reload(); } catch (e) { toast.error(e.message); }
  }

  async function bulkActive(active) {
    const n = selected.length;
    if (!n) return;
    if (!(await confirm({
      title: active ? 'Activate products?' : 'Deactivate products?',
      message: active
        ? `${n} product${n > 1 ? 's' : ''} will become visible to customers again.`
        : `${n} product${n > 1 ? 's' : ''} will be hidden from customer listings, search and recommendations. Records, stock and order history are kept and products can be reactivated later.`,
      confirmLabel: active ? 'Activate' : 'Deactivate', danger: !active,
    }))) return;
    setBulkBusy(true);
    try {
      await api.patch('/api/admin/products/bulk', { ids: [...sel], action: active ? 'activate' : 'deactivate' });
      toast.success(`${n} product${n > 1 ? 's' : ''} ${active ? 'activated' : 'deactivated'}`);
      setSel(new Set()); reload();
    } catch (e) { toast.error(e.message); } finally { setBulkBusy(false); }
  }

  // Share only the product image and MRP — never wholesale or customer information.
  async function shareWhatsApp() {
    const chosen = selected.length ? selected : items.filter((p) => sel.has(p.id));
    if (!chosen.length) return;
    const lines = chosen.map((p) => {
      const img = p.image ? `\n${absUrl(p.image)}` : '';
      return `*${p.name}*\nMRP: ${mrpText(p.mrp)}${img}`;
    });
    const text = `${settings.shopName || 'Product list'}\n\n${lines.join('\n\n')}`;
    // Try to attach the real images via the native share sheet where the browser supports it.
    const files = [];
    if (navigator.share && navigator.canShare) {
      for (const p of chosen) {
        if (!p.image) continue;
        try { const r = await fetch(absUrl(p.image)); const b = await r.blob(); files.push(new File([b], `${p.sku}.jpg`, { type: b.type || 'image/jpeg' })); } catch { /* skip unreadable image */ }
      }
      const shareData = { title: settings.shopName, text };
      const canFiles = files.length > 0 && navigator.canShare({ files });
      if (canFiles) shareData.files = files;
      try {
        await navigator.share(shareData);
        toast.success(canFiles ? 'Shared with images' : 'Shared as a text message (images were not attached)');
        return;
      } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    toast.error('Opened WhatsApp with the MRP text. Images cannot be auto-attached here — use “Download images” and add them in WhatsApp.');
  }

  function downloadImages() {
    const chosen = selected;
    if (!chosen.length) return;
    chosen.forEach((p, i) => {
      if (!p.image) return;
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = absUrl(p.image); a.download = `${p.sku || 'product'}-${i + 1}.jpg`; a.target = '_blank'; a.rel = 'noopener';
        document.body.appendChild(a); a.click(); a.remove();
      }, i * 350);
    });
    toast.success(`Opening ${chosen.filter((p) => p.image).length} image(s) to save. Long-press or right-click to download.`);
  }

  return (
    <>
      <div className="page-head"><h1>Products</h1><Link className="btn primary" to="/admin/products/new">+ Add product</Link></div>
      <div className="toolbar">
        <input type="search" placeholder="Search name or model no…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
        <select value={f.gender} onChange={(e) => set({ gender: e.target.value, category: '' })} aria-label="Gender"><option value="">All genders</option>{GENDERS.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}</select>
        <select value={f.category} onChange={(e) => set({ category: e.target.value })} aria-label="Category"><option value="">All categories</option>{catOptions.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
        <select value={f.brand} onChange={(e) => set({ brand: e.target.value })} aria-label="Brand"><option value="">All brands</option>{(brands?.brands || []).map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}</select>
        <select value={f.active} onChange={(e) => set({ active: e.target.value })} aria-label="Status"><option value="">Any status</option><option value="1">Active</option><option value="0">Inactive</option></select>
        <select value={f.stock} onChange={(e) => set({ stock: e.target.value })} aria-label="Stock"><option value="">Any stock</option><option value="IN">In stock</option><option value="LOW">Low stock</option><option value="OUT">Out of stock</option></select>
      </div>

      {sel.size > 0 && (
        <div className="bulk-bar" role="region" aria-label="Bulk actions">
          <strong>{sel.size} selected</strong>
          <div className="bulk-bar-actions">
            <button className="btn sm whatsapp" onClick={shareWhatsApp}>Forward to WhatsApp</button>
            <button className="btn sm" onClick={downloadImages}>Download images</button>
            <button className="btn sm primary" onClick={() => bulkActive(true)} disabled={bulkBusy}>Activate</button>
            <button className="btn sm danger-o" onClick={() => bulkActive(false)} disabled={bulkBusy}>Deactivate</button>
            <button className="btn sm ghost" onClick={() => setSel(new Set())}>Clear</button>
          </div>
        </div>
      )}

      {loading ? <Spinner /> : error ? <ErrorBox error={error} onRetry={reload} /> : items.length === 0 ? <Empty title="No products found">Adjust the filters or <Link to="/admin/products/new">add a product</Link>.</Empty> : (
        <>
          <div className="table-wrap"><table className="table">
            <thead><tr>
              <th className="sel-col"><input type="checkbox" checked={allOnPage} onChange={toggleAll} aria-label="Select all on this page" /></th>
              <th></th><th>Product</th><th>Brand</th><th>Category</th><th>MRP</th><th>Wholesale</th><th className="num">Stock</th><th className="num">Stock value</th><th className="num">Cost / margin</th><th>Featured</th><th>Active</th><th></th>
            </tr></thead>
            <tbody>{items.map((p) => (
              <tr key={p.id} className={`${p.active ? '' : 'inactive'} ${sel.has(p.id) ? 'selected' : ''}`}>
                <td className="sel-col"><input type="checkbox" checked={sel.has(p.id)} onChange={() => toggleSel(p.id)} aria-label={`Select ${p.name}`} /></td>
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

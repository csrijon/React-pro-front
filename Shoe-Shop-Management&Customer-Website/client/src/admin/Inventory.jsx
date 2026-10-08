import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GENDERS, api, genderLabel, inr, qs } from '../lib/api.js';
import { useDebounced, useFetch, useToast } from '../lib/hooks.jsx';
import { Empty, ErrorBox, Pagination, Spinner, StockBadge } from '../components/ui.jsx';
import { AdjustModal, ReceiveModal } from './StockModals.jsx';

const VIEWS = [['none', 'Detailed (product → colour → size)'], ['category', 'By category'], ['brand', 'By brand'], ['product', 'By product'], ['color', 'By colour'], ['size', 'By size']];

export default function Inventory() {
  const [sp, setSp] = useSearchParams();
  const [q, setQ] = useState(sp.get('q') || '');
  const dq = useDebounced(q);
  const f = { gender: sp.get('gender') || '', category: sp.get('category') || '', brand: sp.get('brand') || '', color: sp.get('color') || '', size: sp.get('size') || '', status: sp.get('status') || '', groupBy: sp.get('groupBy') || 'none', page: sp.get('page') || '1', q: sp.get('q') || '' };
  const set = (ch) => { const n = new URLSearchParams(sp); for (const [k, v] of Object.entries(ch)) (v && v !== 'none' ? n.set(k, v) : n.delete(k)); if (!('page' in ch)) n.delete('page'); setSp(n, { replace: true }); };
  useEffect(() => { if (dq !== f.q) set({ q: dq }); }, [dq]); // eslint-disable-line

  const { data, error, loading, reload } = useFetch(`/api/admin/inventory${qs({ ...f, limit: 50 })}`);
  const { data: cats } = useFetch('/api/admin/categories');
  const { data: brands } = useFetch('/api/admin/brands');
  const { data: opts } = useFetch('/api/admin/inventory/options');
  const catOptions = [...new Map((cats?.categories || []).filter((c) => !f.gender || c.gender === f.gender).map((c) => [c.slug, c])).values()];
  const s = data?.summary;
  const [act, setAct] = useState(null);

  return (
    <>
      <div className="page-head"><h1>Inventory</h1><div className="head-actions"><Link className="btn" to="/admin/stock-history">Stock history</Link><Link className="btn" to="/admin/reorder">Reorder report</Link><Link className="btn" to="/admin/settings">Low-stock level: {data?.threshold ?? '…'}</Link></div></div>
      <div className="stats small">
        <div className="stat"><span className="stat-v">{s ? s.units.toLocaleString('en-IN') : '–'}</span><span className="stat-l">Total stock (pairs)</span></div>
        <div className="stat"><span className="stat-v">{s ? inr(s.wholesaleValue) : '–'}</span><span className="stat-l">Stock value (wholesale)</span></div>
        <div className="stat"><span className="stat-v">{s ? inr(s.mrpValue) : '–'}</span><span className="stat-l">Stock value (MRP)</span></div>
        <div className="stat"><span className="stat-v">{s ? s.inStock : '–'}</span><span className="stat-l">Sizes in stock</span></div>
        <div className="stat warn"><span className="stat-v">{s ? s.low : '–'}</span><span className="stat-l">Low stock sizes</span></div>
        <div className="stat bad"><span className="stat-v">{s ? s.out : '–'}</span><span className="stat-l">Out of stock sizes</span></div>
      </div>
      <div className="toolbar">
        <input type="search" placeholder="Search product or SKU…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        <select value={f.gender} onChange={(e) => set({ gender: e.target.value, category: '' })} aria-label="Gender"><option value="">All genders</option>{GENDERS.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}</select>
        <select value={f.category} onChange={(e) => set({ category: e.target.value })} aria-label="Category"><option value="">All categories</option>{catOptions.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
        <select value={f.brand} onChange={(e) => set({ brand: e.target.value })} aria-label="Brand"><option value="">All brands</option>{(brands?.brands || []).map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}</select>
        <select value={f.color} onChange={(e) => set({ color: e.target.value })} aria-label="Colour"><option value="">All colours</option>{(opts?.colors || []).map((c) => <option key={c}>{c}</option>)}</select>
        <select value={f.size} onChange={(e) => set({ size: e.target.value })} aria-label="Size"><option value="">All sizes</option>{(opts?.sizes || []).map((c) => <option key={c}>{c}</option>)}</select>
        <select value={f.status} onChange={(e) => set({ status: e.target.value })} aria-label="Stock status"><option value="">Any status</option><option value="IN">In stock</option><option value="LOW">Low stock</option><option value="OUT">Out of stock</option></select>
        <select value={f.groupBy} onChange={(e) => set({ groupBy: e.target.value })} aria-label="View">{VIEWS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      </div>
      {loading ? <Spinner /> : error ? <ErrorBox error={error} onRetry={reload} /> : data.rows.length === 0 ? <Empty title="No inventory matches these filters" /> : data.groupBy === 'none' ? (
        <>
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Product</th><th>Brand</th><th>Category</th><th>Colour</th><th>Size</th><th className="num">Stock</th><th className="num">Value (wholesale)</th><th className="num">Value (MRP)</th><th>Status</th><th>Stock actions</th></tr></thead>
            <tbody>{data.rows.map((r) => <Row key={`${r.productId}-${r.colorId}-${r.sizeId}`} r={r} onAct={(kind, row) => setAct({ kind, row })} />)}</tbody>
          </table></div>
          <Pagination page={data.page} pages={data.pages} onChange={(n) => set({ page: String(n) })} />
        </>
      ) : (
        <div className="table-wrap"><table className="table">
          <thead><tr><th>{VIEWS.find((v) => v[0] === data.groupBy)[1].replace('By ', '')}</th><th className="num">Total stock</th><th className="num">Value (wholesale)</th><th className="num">Value (MRP)</th><th className="num">Products</th><th className="num">Sizes</th><th className="num">Low</th><th className="num">Out</th></tr></thead>
          <tbody>{data.rows.map((r) => <tr key={r.label}><td><strong>{data.groupBy === 'gender' ? genderLabel(r.label) : r.label.replace(/^(men|women|kids) \//, (m) => `${genderLabel(m.split(' ')[0])} ·`)}</strong></td><td className="num">{r.units.toLocaleString('en-IN')}</td><td className="num">{inr(r.wholesaleValue)}</td><td className="num">{inr(r.mrpValue)}</td><td className="num">{r.products}</td><td className="num">{r.variants}</td><td className="num">{r.low ? <span className="badge stock-low">{r.low}</span> : 0}</td><td className="num">{r.out ? <span className="badge stock-out">{r.out}</span> : 0}</td></tr>)}</tbody>
          <tfoot><tr><td>Total</td><td className="num">{s.units.toLocaleString('en-IN')}</td><td className="num">{inr(s.wholesaleValue)}</td><td className="num">{inr(s.mrpValue)}</td><td className="num">{s.products}</td><td className="num">{s.variants}</td><td className="num">{s.low}</td><td className="num">{s.out}</td></tr></tfoot>
        </table></div>
      )}
      {act?.kind === 'receive' && <ReceiveModal row={act.row} onClose={() => setAct(null)} onDone={reload} />}
      {act?.kind === 'adjust' && <AdjustModal row={act.row} onClose={() => setAct(null)} onDone={reload} />}
    </>
  );
}

function Row({ r, onAct }) {
  return (
    <tr>
      <td><Link to={`/admin/products/${r.productId}`}><strong>{r.product}</strong></Link><div className="small muted">{r.sku}</div></td>
      <td>{r.brand}</td><td>{genderLabel(r.gender)} · {r.category}</td><td>{r.color}</td><td>{r.size}</td>
      <td className="num"><strong>{r.quantity}</strong></td>
      <td className="num">{inr(r.wholesaleValue)}</td><td className="num">{inr(r.mrpValue)}</td>
      <td><StockBadge status={r.status} /></td>
      <td className="actions-cell"><button className="btn sm primary" onClick={() => onAct('receive', r)}>Receive</button><button className="btn sm" onClick={() => onAct('adjust', r)}>Adjust</button></td>
    </tr>
  );
}

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { qs } from '../lib/api.js';
import { useDebounced, useFetch } from '../lib/hooks.jsx';
import { Empty, ErrorBox, Pagination, Spinner } from '../components/ui.jsx';

const TYPES = { INITIAL: 'Initial stock', RECEIVE: 'Received', ADJUST: 'Adjusted', EDIT: 'Product edit', REMOVED: 'Removed' };
const stamp = (s) => new Date(s.replace(' ', 'T') + 'Z').toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function StockHistory() {
  const [sp, setSp] = useSearchParams();
  const [q, setQ] = useState(sp.get('q') || '');
  const dq = useDebounced(q);
  const f = { q: sp.get('q') || '', type: sp.get('type') || '', reason: sp.get('reason') || '', from: sp.get('from') || '', to: sp.get('to') || '', page: sp.get('page') || '1' };
  const set = (ch) => { const n = new URLSearchParams(sp); for (const [k, v] of Object.entries(ch)) (v ? n.set(k, v) : n.delete(k)); if (!('page' in ch)) n.delete('page'); setSp(n, { replace: true }); };
  useEffect(() => { if (dq !== f.q) set({ q: dq }); }, [dq]); // eslint-disable-line
  const [days, setDays] = useState('30');

  const { data, error, loading, reload } = useFetch(`/api/admin/stock/history${qs({ ...f, limit: 50 })}`);
  const movers = useFetch(`/api/admin/stock/movers?days=${days}`);
  const { data: reasons } = useFetch('/api/admin/stock/reasons');

  return (
    <>
      <div className="page-head"><h1>Stock history</h1><Link className="btn" to="/admin/inventory">Go to inventory to receive / adjust</Link></div>

      <section className="panel">
        <div className="panel-head"><h2>Fastest-selling sizes &amp; products</h2>
          <select value={days} onChange={(e) => setDays(e.target.value)} aria-label="Period" style={{ width: 'auto' }}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="365">Last year</option></select>
        </div>
        <p className="small muted">Based on stock you removed with the reason “Sold”. Record sales from Inventory → Adjust → Sold to build this list.</p>
        {movers.loading ? <Spinner /> : movers.error ? <ErrorBox error={movers.error} onRetry={movers.reload} /> : movers.data.bySize.length === 0 ? <Empty title="No sales recorded in this period" /> : (
          <div className="grid two">
            <div><h3>By size</h3><Bars rows={movers.data.bySize} prefix="Size " /></div>
            <div><h3>By product</h3><Bars rows={movers.data.byProduct} /></div>
          </div>
        )}
      </section>

      <div className="toolbar">
        <input type="search" placeholder="Search product, SKU, admin or note…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search history" />
        <select value={f.type} onChange={(e) => set({ type: e.target.value })} aria-label="Type"><option value="">All types</option>{Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select value={f.reason} onChange={(e) => set({ reason: e.target.value })} aria-label="Reason"><option value="">All reasons</option>{(reasons?.reasons || []).map((r) => <option key={r.name}>{r.name}</option>)}</select>
        <label className="date"><span className="small muted">From</span><input type="date" value={f.from} onChange={(e) => set({ from: e.target.value })} /></label>
        <label className="date"><span className="small muted">To</span><input type="date" value={f.to} onChange={(e) => set({ to: e.target.value })} /></label>
      </div>

      {loading ? <Spinner /> : error ? <ErrorBox error={error} onRetry={reload} /> : data.rows.length === 0 ? <Empty title="No stock changes found" /> : (
        <>
          <div className="table-wrap"><table className="table">
            <thead><tr><th>When</th><th>Product</th><th>Colour / size</th><th className="num">Change</th><th className="num">Stock after</th><th>Type</th><th>Reason / note</th><th>By</th></tr></thead>
            <tbody>{data.rows.map((r) => (
              <tr key={r.id}>
                <td className="small">{stamp(r.createdAt)}</td>
                <td>{r.productId ? <Link to={`/admin/products/${r.productId}`}><strong>{r.product}</strong></Link> : <strong>{r.product}</strong>}<div className="small muted">{r.sku}{!r.productId && ' · deleted'}</div></td>
                <td>{r.color} · {r.size}</td>
                <td className={`num ${r.change > 0 ? 'plus' : 'minus'}`}>{r.change > 0 ? '+' : ''}{r.change}</td>
                <td className="num">{r.quantityAfter}</td>
                <td><span className={`badge type-${r.type.toLowerCase()}`}>{TYPES[r.type]}</span></td>
                <td>{r.reason}{r.note && <div className="small muted">{r.note}</div>}</td>
                <td>{r.admin}</td>
              </tr>))}
            </tbody>
          </table></div>
          <p className="muted small">{data.total} change{data.total === 1 ? '' : 's'}</p>
          <Pagination page={data.page} pages={data.pages} onChange={(n) => set({ page: String(n) })} />
        </>
      )}
    </>
  );
}

function Bars({ rows, prefix = '' }) {
  const max = Math.max(1, ...rows.map((r) => r.units));
  return (
    <ul className="bars">{rows.map((r) => (
      <li key={r.label + (r.sku || '')}><span className="bar-label">{prefix}{r.label}</span><span className="bar-track"><span className="bar-fill" style={{ width: `${(r.units / max) * 100}%` }} /></span><span className="bar-val">{r.units} pairs</span></li>
    ))}</ul>
  );
}

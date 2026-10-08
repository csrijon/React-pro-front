import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GENDERS, genderLabel, inr, qs } from '../lib/api.js';
import { useFetch, useSettings } from '../lib/hooks.jsx';
import { Empty, ErrorBox, Spinner, StockBadge } from '../components/ui.jsx';

// Spreadsheet apps run text starting with = + - @ as formulas; prefix such cells with a quote.
const csvCell = (v) => {
  let s = String(v ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export default function Reorder() {
  const [sp, setSp] = useSearchParams();
  const f = { brand: sp.get('brand') || '', gender: sp.get('gender') || '', status: sp.get('status') || '' };
  const set = (ch) => { const n = new URLSearchParams(sp); for (const [k, v] of Object.entries(ch)) (v ? n.set(k, v) : n.delete(k)); setSp(n, { replace: true }); };
  const { data, error, loading, reload } = useFetch(`/api/admin/stock/reorder${qs(f)}`);
  const { data: brands } = useFetch('/api/admin/brands');
  const { settings } = useSettings();
  const [order, setOrder] = useState({});      // row key -> pairs to order (editable)
  const [skip, setSkip] = useState(new Set()); // rows excluded from the order
  const key = (r) => `${r.productId}|${r.color}|${r.size}`;
  useEffect(() => { setOrder({}); setSkip(new Set()); }, [data]);

  const qty = (r) => (order[key(r)] !== undefined ? order[key(r)] : r.suggested);
  const rows = data?.rows || [];
  const groups = useMemo(() => {
    const m = new Map();
    for (const r of rows) { if (!m.has(r.brand)) m.set(r.brand, []); m.get(r.brand).push(r); }
    return [...m.entries()];
  }, [rows]);
  const included = rows.filter((r) => !skip.has(key(r)) && qty(r) > 0);
  const totalPairs = included.reduce((a, r) => a + qty(r), 0);
  const estCost = included.reduce((a, r) => a + (r.costPrice != null ? qty(r) * r.costPrice : 0), 0);
  const noCost = included.some((r) => r.costPrice == null);

  function exportCsv() {
    const head = ['Brand', 'Product', 'SKU', 'Category', 'Colour', 'Size', 'Current stock', 'Sold (30 days)', 'Order quantity'];
    const lines = [head, ...included.map((r) => [r.brand, r.product, r.sku, `${genderLabel(r.gender)} ${r.category}`, r.color, r.size, r.quantity, r.sold30, qty(r)])];
    const blob = new Blob(['﻿' + lines.map((l) => l.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `reorder-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <>
      <div className="page-head no-print"><h1>Reorder report</h1>
        <div className="head-actions"><button className="btn" onClick={() => window.print()} disabled={!included.length}>Print</button><button className="btn primary" onClick={exportCsv} disabled={!included.length}>Download CSV</button></div>
      </div>
      <p className="muted no-print">Sizes at or below the low-stock level ({data?.threshold ?? '…'} pairs). Suggested quantity restocks each size up to <strong>{data?.target ?? '…'}</strong> pairs — change it in <Link to="/admin/settings">Settings</Link>, or edit any quantity below.</p>
      <div className="toolbar no-print">
        <select value={f.brand} onChange={(e) => set({ brand: e.target.value })} aria-label="Brand"><option value="">All brands</option>{(brands?.brands || []).map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}</select>
        <select value={f.gender} onChange={(e) => set({ gender: e.target.value })} aria-label="Gender"><option value="">All genders</option>{GENDERS.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}</select>
        <select value={f.status} onChange={(e) => set({ status: e.target.value })} aria-label="Status"><option value="">Low + out of stock</option><option value="LOW">Low stock only</option><option value="OUT">Out of stock only</option></select>
      </div>

      <div className="print-title"><h1>{settings.shopName} — Reorder list</h1><p>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
      {loading ? <Spinner /> : error ? <ErrorBox error={error} onRetry={reload} /> : rows.length === 0 ? <Empty title="Nothing to reorder">Every size is above the low-stock level.</Empty> : (
        <>
          <div className="stats small no-print">
            <div className="stat"><span className="stat-v">{included.length}</span><span className="stat-l">Lines to order</span></div>
            <div className="stat"><span className="stat-v">{totalPairs.toLocaleString('en-IN')}</span><span className="stat-l">Total pairs</span></div>
            <div className="stat"><span className="stat-v">{inr(estCost)}</span><span className="stat-l">Estimated cost{noCost ? ' (some items have no cost price)' : ''}</span></div>
          </div>
          {groups.map(([brand, list]) => {
            const mine = list.filter((r) => !skip.has(key(r)) && qty(r) > 0);
            return (
              <section className="panel brand-group" key={brand}>
                <div className="panel-head"><h2>{brand}</h2><span className="muted small">{mine.length} lines · {mine.reduce((a, r) => a + qty(r), 0)} pairs</span></div>
                <div className="table-wrap"><table className="table">
                  <thead><tr><th className="no-print"></th><th>Product</th><th>Colour</th><th>Size</th><th className="num">In stock</th><th className="num">Sold (30d)</th><th className="num">Order qty</th></tr></thead>
                  <tbody>{list.map((r) => {
                    const off = skip.has(key(r));
                    return (
                      <tr key={key(r)} className={off || qty(r) === 0 ? 'skipped' : ''}>
                        <td className="no-print"><input type="checkbox" checked={!off} aria-label={`Include ${r.product} ${r.color} ${r.size}`} onChange={() => setSkip((s) => { const n = new Set(s); off ? n.delete(key(r)) : n.add(key(r)); return n; })} /></td>
                        <td><strong>{r.product}</strong><div className="small muted">{r.sku}</div></td>
                        <td>{r.color}</td><td>{r.size}</td>
                        <td className="num">{r.quantity} <span className="no-print"><StockBadge status={r.status} /></span></td>
                        <td className="num">{r.sold30 || '–'}</td>
                        <td className="num"><input className="qty-input no-print" type="number" min="0" step="1" value={qty(r)} onChange={(e) => setOrder({ ...order, [key(r)]: Math.max(0, parseInt(e.target.value, 10) || 0) })} aria-label="Order quantity" /><span className="print-only">{off ? '–' : qty(r)}</span></td>
                      </tr>);
                  })}</tbody>
                </table></div>
              </section>
            );
          })}
        </>
      )}
    </>
  );
}

import { Link } from 'react-router-dom';
import { genderLabel, inr } from '../lib/api.js';
import { useFetch } from '../lib/hooks.jsx';
import { Empty, ErrorBox, Spinner, fmtDate } from '../components/ui.jsx';

const Stat = ({ label, value, to, tone }) => {
  const body = <><span className="stat-v">{value}</span><span className="stat-l">{label}</span></>;
  return to ? <Link to={to} className={`stat ${tone || ''}`}>{body}</Link> : <div className={`stat ${tone || ''}`}>{body}</div>;
};

function Bars({ rows, labelKey, valueKey, unit, extra }) {
  const max = Math.max(1, ...rows.map((r) => r[valueKey]));
  return (
    <ul className="bars">
      {rows.map((r, i) => (
        <li key={i}>
          <span className="bar-label">{r[labelKey]}</span>
          <span className="bar-track"><span className="bar-fill" style={{ width: `${(r[valueKey] / max) * 100}%` }} /></span>
          <span className="bar-val">{r[valueKey].toLocaleString('en-IN')} {unit}{extra && <small className="muted"> · {extra(r)}</small>}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Dashboard() {
  const { data: d, error, loading, reload } = useFetch('/api/admin/dashboard');
  if (loading) return <Spinner />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;
  const { products: p, customers: c } = d;
  return (
    <>
      <h1>Dashboard</h1>
      <div className="stock-hero">
        <div className="stat big"><span className="stat-l">Total stock</span><span className="stat-v">{p.totalUnits.toLocaleString('en-IN')} <small>pairs</small></span><span className="stat-l">across {p.total} products</span></div>
        <div className="stat big"><span className="stat-l">Stock value (wholesale price)</span><span className="stat-v">{inr(p.stockValueWholesale)}</span><span className="stat-l">Quantity × wholesale price</span></div>
        <div className="stat big"><span className="stat-l">Stock value (MRP)</span><span className="stat-v">{inr(p.stockValueMrp)}</span><span className="stat-l">Quantity × MRP · potential retail value</span></div>
      </div>
      <div className="stock-hero">
        <div className="stat big alt"><span className="stat-l">Stock cost (what you paid)</span><span className="stat-v">{inr(p.stockCost)}</span><span className="stat-l">{p.costedUnits.toLocaleString('en-IN')} pairs with a purchase cost</span></div>
        <div className={`stat big alt ${p.expectedProfit < 0 ? 'neg' : ''}`}><span className="stat-l">Expected profit (at wholesale)</span><span className="stat-v">{inr(p.expectedProfit)}</span><span className="stat-l">Wholesale value − stock cost</span></div>
        <div className="stat big alt"><span className="stat-l">Profit margin</span><span className="stat-v">{p.marginPct == null ? '—' : `${p.marginPct}%`}</span><span className="stat-l">Profit ÷ wholesale value</span></div>
      </div>
      {p.uncostedProducts > 0 && <div className="alert info">{p.uncostedProducts} product{p.uncostedProducts > 1 ? 's' : ''} ({p.uncostedUnits.toLocaleString('en-IN')} pairs) {p.uncostedProducts > 1 ? 'have' : 'has'} no purchase cost, so {p.uncostedProducts > 1 ? 'they are' : 'it is'} left out of cost and profit. Add the cost when editing the product.</div>}
      {p.unpricedVariants > 0 && <div className="alert info">{p.unpricedVariants} size{p.unpricedVariants > 1 ? 's have' : ' has'} stock but no wholesale price set, so {p.unpricedVariants > 1 ? 'they are' : 'it is'} counted as ₹0 in the wholesale value. Add wholesale prices in Products.</div>}
      <div className="stats">
        <Stat label="Total products" value={p.total} to="/admin/products" />
        <Stat label="Active products" value={p.active} to="/admin/products?active=1" />
        <Stat label="Featured products" value={p.featured} to="/admin/featured" />
        <Stat label="Total customers" value={c.total} to="/admin/customers" />
        <Stat label="Pending customers" value={c.pending} to="/admin/customers?status=PENDING" tone={c.pending ? 'warn' : ''} />
        <Stat label="Approved customers" value={c.approved} to="/admin/customers?status=APPROVED" />
        <Stat label={`Low stock products (≤ ${d.threshold})`} value={p.lowStock} to="/admin/products?stock=LOW" tone={p.lowStock ? 'warn' : ''} />
        <Stat label="Out of stock products" value={p.outOfStock} to="/admin/products?stock=OUT" tone={p.outOfStock ? 'bad' : ''} />
        <Stat label="Units in stock" value={p.totalUnits.toLocaleString('en-IN')} to="/admin/inventory" />
        <Stat label="Low stock sizes" value={p.lowStockVariants} to="/admin/inventory?status=LOW" />
        <Stat label="Out of stock sizes" value={p.outOfStockVariants} to="/admin/inventory?status=OUT" />
      </div>

      <div className="grid two">
        <section className="panel"><h2>Category-wise inventory <small className="muted">(pairs · wholesale value)</small></h2>
          {d.categoryInventory.length ? <Bars rows={d.categoryInventory.map((r) => ({ ...r, label: `${genderLabel(r.gender)} · ${r.name}` }))} labelKey="label" valueKey="units" unit="pairs" extra={(r) => inr(r.wholesaleValue)} /> : <Empty title="No stock yet" />}
        </section>
        <section className="panel"><h2>Brand-wise products</h2>
          {d.brandCounts.length ? <Bars rows={d.brandCounts} labelKey="name" valueKey="products" unit="products" extra={(r) => `${r.units} pairs · ${inr(r.wholesaleValue)}`} /> : <Empty title="No products yet" />}
        </section>
        <section className="panel"><h2>Profit by product <small className="muted">(current stock)</small></h2>
          {d.profitByProduct.length ? (
            <div className="table-wrap flat"><table className="table"><thead><tr><th>Product</th><th className="num">Pairs</th><th className="num">Cost</th><th className="num">Profit</th><th className="num">Margin</th></tr></thead><tbody>
              {d.profitByProduct.map((r) => <tr key={r.id}><td><Link to={`/admin/products/${r.id}`}>{r.name}</Link><div className="small muted">{r.sku}</div></td><td className="num">{r.units}</td><td className="num">{inr(r.stockCost)}</td><td className={`num ${r.profit < 0 ? 'minus' : 'plus'}`}>{inr(r.profit)}</td><td className="num">{r.marginPct == null ? '—' : `${r.marginPct}%`}</td></tr>)}
            </tbody></table></div>
          ) : <Empty title="No purchase costs entered yet">Add a purchase cost to your products to see profit.</Empty>}
        </section>
        <section className="panel"><h2>Needs restocking</h2>
          {d.lowStockList.length ? (
            <table className="table"><thead><tr><th>Product</th><th className="num">Units</th></tr></thead><tbody>
              {d.lowStockList.map((r) => <tr key={r.id}><td><Link to={`/admin/products/${r.id}`}>{r.name}</Link><div className="small muted">{r.sku}</div></td><td className="num">{r.units === 0 ? <span className="badge stock-out">Out</span> : <span className="badge stock-low">{r.units}</span>}</td></tr>)}
            </tbody></table>
          ) : <Empty title="All stocked up" />}
          <p><Link to="/admin/reorder">Open reorder report →</Link></p>
        </section>
        <section className="panel"><h2>Pending customer approvals</h2>
          {d.pendingCustomers.length ? (
            <table className="table"><tbody>
              {d.pendingCustomers.map((r) => <tr key={r.id}><td><strong>{r.shopName}</strong><div className="small muted">{r.ownerName} · {r.mobile}</div></td><td className="small muted">{fmtDate(r.createdAt)}</td></tr>)}
            </tbody></table>
          ) : <Empty title="No pending requests" />}
          <p><Link to="/admin/customers?status=PENDING">Review customers →</Link></p>
        </section>
      </div>
    </>
  );
}

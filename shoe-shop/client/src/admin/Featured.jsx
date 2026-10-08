import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, genderLabel, qs } from '../lib/api.js';
import { useDebounced, useFetch, useToast } from '../lib/hooks.jsx';
import { Empty, ErrorBox, ShoeImage, Spinner } from '../components/ui.jsx';

export default function Featured() {
  const toast = useToast();
  const feat = useFetch(`/api/admin/products${qs({ featured: 1, limit: 100 })}`);
  const [q, setQ] = useState('');
  const dq = useDebounced(q);
  const search = useFetch(dq.trim() ? `/api/admin/products${qs({ q: dq, active: 1, limit: 8 })}` : null);

  async function setFeatured(p, value) {
    try { await api.patch(`/api/admin/products/${p.id}/featured`, { featured: value }); toast.success(value ? `${p.name} added to Highlighted` : `${p.name} removed from Highlighted`); feat.reload(); if (dq.trim()) search.reload(); }
    catch (e) { toast.error(e.message); }
  }
  const list = feat.data?.items || [];
  return (
    <>
      <div className="page-head"><h1>Highlighted products</h1></div>
      <p className="muted">These products appear in the “Highlighted products” section of the customer homepage. This is the only place products are shown on the homepage, so pin the ones you want customers to see first (the 8 newest pinned, active products are shown).</p>
      <section className="panel">
        <h2>Add a product</h2>
        <input type="search" placeholder="Search by name or SKU…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Find a product to feature" />
        {dq.trim() && (search.loading ? <Spinner /> : search.error ? <ErrorBox error={search.error} /> : (search.data?.items.length ? (
          <ul className="pick-list">{search.data.items.map((p) => (
            <li key={p.id}><div className="thumb"><ShoeImage src={p.image} alt="" /></div><div><strong>{p.name}</strong><div className="small muted">{p.sku} · {p.brand.name}</div></div>
              {p.featured ? <button className="btn sm" onClick={() => setFeatured(p, false)}>Remove</button> : <button className="btn sm primary" onClick={() => setFeatured(p, true)}>Highlight</button>}</li>
          ))}</ul>
        ) : <Empty title="No matching active products" />))}
      </section>
      <section className="panel">
        <h2>Currently highlighted ({list.length})</h2>
        {feat.loading ? <Spinner /> : feat.error ? <ErrorBox error={feat.error} onRetry={feat.reload} /> : list.length === 0 ? <Empty title="Nothing highlighted yet">The homepage will not show any products until you pin some here.</Empty> : (
          <ul className="pick-list">{list.map((p) => (
            <li key={p.id}><div className="thumb"><ShoeImage src={p.image} alt="" /></div><div><Link to={`/admin/products/${p.id}`}><strong>{p.name}</strong></Link><div className="small muted">{p.sku} · {p.brand.name} · {genderLabel(p.gender)} · {p.category.name}{!p.active && ' · inactive (hidden from shop)'}</div></div>
              <button className="btn sm danger-o" onClick={() => setFeatured(p, false)}>Remove</button></li>
          ))}</ul>
        )}
      </section>
    </>
  );
}

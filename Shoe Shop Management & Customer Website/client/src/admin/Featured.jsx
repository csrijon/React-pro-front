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
    try { await api.patch(`/api/admin/products/${p.id}/featured`, { featured: value }); toast.success(value ? `${p.name} added to Featured` : `${p.name} removed from Featured`); feat.reload(); if (dq.trim()) search.reload(); }
    catch (e) { toast.error(e.message); }
  }
  const list = feat.data?.items || [];
  return (
    <>
      <div className="page-head"><h1>Featured products</h1></div>
      <p className="muted">These products appear in the “Featured products” section of the customer homepage (the 8 newest featured, active products).</p>
      <section className="panel">
        <h2>Add a product</h2>
        <input type="search" placeholder="Search by name or SKU…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Find a product to feature" />
        {dq.trim() && (search.loading ? <Spinner /> : search.error ? <ErrorBox error={search.error} /> : (search.data?.items.length ? (
          <ul className="pick-list">{search.data.items.map((p) => (
            <li key={p.id}><div className="thumb"><ShoeImage src={p.image} alt="" /></div><div><strong>{p.name}</strong><div className="small muted">{p.sku} · {p.brand.name}</div></div>
              {p.featured ? <button className="btn sm" onClick={() => setFeatured(p, false)}>Remove</button> : <button className="btn sm primary" onClick={() => setFeatured(p, true)}>Feature</button>}</li>
          ))}</ul>
        ) : <Empty title="No matching active products" />))}
      </section>
      <section className="panel">
        <h2>Currently featured ({list.length})</h2>
        {feat.loading ? <Spinner /> : feat.error ? <ErrorBox error={feat.error} onRetry={feat.reload} /> : list.length === 0 ? <Empty title="Nothing featured yet">The homepage will not show a Featured section until you add products.</Empty> : (
          <ul className="pick-list">{list.map((p) => (
            <li key={p.id}><div className="thumb"><ShoeImage src={p.image} alt="" /></div><div><Link to={`/admin/products/${p.id}`}><strong>{p.name}</strong></Link><div className="small muted">{p.sku} · {p.brand.name} · {genderLabel(p.gender)} · {p.category.name}{!p.active && ' · inactive (hidden from shop)'}</div></div>
              <button className="btn sm danger-o" onClick={() => setFeatured(p, false)}>Unfeature</button></li>
          ))}</ul>
        )}
      </section>
    </>
  );
}

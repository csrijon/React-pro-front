import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { genderLabel, genderSlug, inr } from '../lib/api.js';
import { useAuth, useFetch, useSettings } from '../lib/hooks.jsx';
import ProductCard, { WholesaleCTA } from '../components/ProductCard.jsx';
import { ColorDot, Empty, ErrorBox, ShoeImage, Spinner, StockBadge } from '../components/ui.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const { data, error, loading, reload } = useFetch(`/api/products/${encodeURIComponent(slug)}`, [useAuth().user?.status]);
  const [sp, setSp] = useSearchParams();
  const [img, setImg] = useState(0);
  const { settings } = useSettings();

  const p = data?.product;
  useEffect(() => { setImg(0); }, [slug]);
  useEffect(() => { if (p) document.title = `${p.name} · ${settings.shopName}`; }, [p, settings.shopName]);

  const colorName = sp.get('color');
  const variant = useMemo(() => {
    if (!p) return null;
    return p.variants.find((v) => v.color.toLowerCase() === (colorName || '').toLowerCase())
      || p.variants.find((v) => v.status !== 'OUT') || p.variants[0];
  }, [p, colorName]);
  const sizeLabel = sp.get('size');
  const size = variant?.sizes.find((s) => s.size === sizeLabel) || null;

  const select = (changes) => {
    const next = new URLSearchParams(sp);
    for (const [k, v] of Object.entries(changes)) (v ? next.set(k, v) : next.delete(k));
    setSp(next, { replace: true });
  };

  if (loading) return <Spinner />;
  if (error?.status === 404) return <div className="container page"><Empty title="Product not found">It may have been removed. <Link to="/products">Browse all products</Link></Empty></div>;
  if (error) return <ErrorBox error={error} onRetry={reload} />;

  const shownMrp = size ? size.mrp : null;
  const mrps = variant.sizes.map((s) => s.mrp);
  const wsAll = variant.sizes.map((s) => s.wholesalePrice).filter((x) => x != null);
  const hasWs = wsAll.length > 0;
  const fmtRange = (arr) => (Math.min(...arr) === Math.max(...arr) ? inr(arr[0]) : `${inr(Math.min(...arr))} – ${inr(Math.max(...arr))}`);

  return (
    <div className="container page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to={`/products/${genderSlug(p.gender)}`}>{genderLabel(p.gender)}</Link> / <Link to={`/products/${genderSlug(p.gender)}/${p.category.slug}`}>{p.category.name}</Link> / <span>{p.name}</span>
      </nav>
      <div className="detail">
        <div className="gallery">
          <div className="gallery-main"><ShoeImage key={p.images[img] || 'none'} src={p.images[img]} alt={p.name} className="fade-in" /></div>
          {p.images.length > 1 && (
            <div className="thumbs">{p.images.map((u, i) => (
              <button key={u} className={i === img ? 'on' : ''} onClick={() => setImg(i)} aria-label={`Image ${i + 1}`}><img src={u} alt="" loading="lazy" /></button>
            ))}</div>
          )}
        </div>

        <div className="info">
          <div className="muted small"><Link to={`/products?brand=${p.brand.slug}`}>{p.brand.name}</Link></div>
          <h1>{p.name}</h1>
          <dl className="meta">
            <div><dt>Product code</dt><dd>{p.sku}</dd></div>
            <div><dt>Category</dt><dd><Link to={`/products/${genderSlug(p.gender)}/${p.category.slug}`}>{p.category.name}</Link>{p.subcategory && ` · ${p.subcategory.name}`}</dd></div>
            <div><dt>Gender</dt><dd><Link to={`/products/${genderSlug(p.gender)}`}>{genderLabel(p.gender)}</Link></dd></div>
          </dl>

          <div className="price-panel">
            <div className="mrp-big"><span className="muted">MRP</span> <strong>{shownMrp != null ? inr(shownMrp) : fmtRange(mrps)}</strong></div>
            {hasWs ? (
              <div className="ws-big"><span>Your wholesale price</span> <strong>{size?.wholesalePrice != null ? inr(size.wholesalePrice) : fmtRange(wsAll)}</strong></div>
            ) : <WholesaleCTA />}
          </div>

          <div className="selector">
            <h2>Colour: <span className="sel-val">{variant.color}</span></h2>
            <div className="options" role="radiogroup" aria-label="Colour">
              {p.variants.map((v) => (
                <button key={v.colorId} role="radio" aria-checked={v.colorId === variant.colorId} className={`opt color ${v.colorId === variant.colorId ? 'on' : ''} ${v.status === 'OUT' ? 'out' : ''}`}
                  onClick={() => select({ color: v.color, size: '' })}><ColorDot name={v.color} /> {v.color}</button>
              ))}
            </div>
          </div>

          <div className="selector">
            <h2>Size{size ? <>: <span className="sel-val">{size.size}</span></> : ''}</h2>
            <div className="options" role="radiogroup" aria-label="Size">
              {variant.sizes.map((s) => (
                <button key={s.sizeId} role="radio" aria-checked={s.size === size?.size} className={`opt size ${s.size === size?.size ? 'on' : ''} ${s.status === 'OUT' ? 'out' : ''}`}
                  onClick={() => select({ size: s.size })} title={s.status === 'OUT' ? 'Out of stock' : s.status === 'LOW' ? 'Low stock' : 'In stock'}>{s.size}</button>
              ))}
            </div>
            <p className="small muted">{variant.sizes.length === 1 ? `Available in size ${variant.sizes[0].size} only.` : 'Crossed-out sizes are currently out of stock.'}</p>
          </div>

          <div className="stock-line">
            <StockBadge status={size ? size.status : variant.status} />
            <span className="small muted">{size ? `${variant.color}, size ${size.size}` : `${variant.color} · select a size to see its availability`}</span>
          </div>

          {settings.whatsapp && (
            <a className="btn whatsapp block" target="_blank" rel="noopener noreferrer"
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'd like to enquire about ${p.name} (${p.sku})${variant ? `, ${variant.color}` : ''}${size ? `, size ${size.size}` : ''}.\n${window.location.href}`)}`}>
              Enquire on WhatsApp
            </a>
          )}

          {p.description && <section className="desc"><h2>Description</h2><p>{p.description}</p></section>}
        </div>
      </div>

      <section className="section">
        <div className="section-head"><h2>Related products</h2></div>
        {data.related.length === 0 ? <Empty title="No related products yet" />
          : <div className="grid products">{data.related.map((r) => <ProductCard key={r.id} product={r} />)}</div>}
      </section>
    </div>
  );
}

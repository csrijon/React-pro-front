import { Link } from 'react-router-dom';
import { genderLabel, inr } from '../lib/api.js';
import { useAuth, useSettings } from '../lib/hooks.jsx';
import { useAuthModal } from './AuthModal.jsx';
import { useReveal } from '../lib/motion.jsx';
import { ColorDot, ShoeImage, StockBadge } from './ui.jsx';

export const range = (min, max) => (min === max ? inr(min) : `${inr(min)} – ${inr(max)}`);

// Shows wholesale price when the API returned it, otherwise the right call-to-action for the visitor's state.
export function WholesaleCTA({ compact }) {
  const { user } = useAuth();
  const { settings } = useSettings();
  const modal = useAuthModal();
  if (settings.wholesaleEnabled === false) return null;
  if (!user) {
    return <button className={`btn ${compact ? 'sm' : ''} accent`} onClick={(e) => { e.preventDefault(); modal.open('register'); }}>Request Wholesale Price</button>;
  }
  if (user.role === 'CUSTOMER') {
    const msg = { PENDING: 'Wholesale price: approval pending', REJECTED: 'Wholesale access was not approved', SUSPENDED: 'Wholesale access suspended' }[user.status];
    return msg ? <span className="muted small">{msg}</span> : null;
  }
  return null;
}

export function PriceBlock({ product, compact }) {
  return (
    <div className="prices">
      <div className="mrp"><span className="muted small">MRP</span> <strong>{range(product.mrp.min, product.mrp.max)}</strong></div>
      {product.wholesale && product.wholesale.min != null
        ? <div className="ws"><span className="small">Wholesale</span> <strong>{range(product.wholesale.min, product.wholesale.max)}</strong></div>
        : <WholesaleCTA compact={compact} />}
    </div>
  );
}

export default function ProductCard({ product: p }) {
  const [ref, shown] = useReveal();
  return (
    <article ref={ref} className={`card product-card reveal ${shown ? 'in' : ''}`}>
      <Link to={`/product/${p.slug}`} className="card-img" aria-label={p.name}>
        <ShoeImage src={p.image} alt={p.name} />
        {p.featured && <span className="badge featured">Highlighted</span>}
      </Link>
      <div className="card-body">
        <div className="small muted">{p.brand.name} · {genderLabel(p.gender)} · {p.category.name}</div>
        <h3><Link to={`/product/${p.slug}`}>{p.name}</Link></h3>
        <div className="small muted">Code: {p.sku}</div>
        <div className="swatches">{p.colors.slice(0, 6).map((c) => <span key={c} title={c}><ColorDot name={c} /></span>)}</div>
        <div className="small muted">Sizes: {p.sizes.join(', ')}</div>
        <PriceBlock product={p} compact />
        <StockBadge status={p.stockStatus} />
      </div>
    </article>
  );
}

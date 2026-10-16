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
  const mrp = product.mrp;
  const retail = product.retail || mrp;
  const discounted = retail && mrp && (retail.min < mrp.min || retail.max < mrp.max);
  return (
    <div className="prices">
      {discounted ? (
        <div className="retail">
          <span className="mrp-strike">MRP {range(mrp.min, mrp.max)}</span>
          <strong className="retail-price">{range(retail.min, retail.max)}</strong>
          {product.discountPct > 0 && <span className="off-pill">{product.discountPct}% off</span>}
        </div>
      ) : (
        <div className="mrp"><span className="muted small">MRP</span> <strong>{range(mrp.min, mrp.max)}</strong></div>
      )}
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
        {p.featured && <span className="badge featured">Featured</span>}
        <span className="card-quick" aria-hidden="true">View details</span>
      </Link>
      <div className="card-body">
        <div className="p-eyebrow">{p.brand.name}</div>
        <h3><Link to={`/product/${p.slug}`}>{p.name}</Link></h3>
        <div className="p-meta">
          <span className="small muted">{genderLabel(p.gender)} · {p.category.name}</span>
          <span className="small muted">Code: {p.sku}</span>
          <span className="small muted">Sizes: {p.sizes.join(', ')}</span>
        </div>
        <div className="swatches"><span className="small muted swatch-label">Colours</span>{p.colors.slice(0, 6).map((c) => <span key={c} title={c}><ColorDot name={c} /></span>)}</div>
        <PriceBlock product={p} compact />
        <div className="p-foot"><StockBadge status={p.stockStatus} /></div>
      </div>
    </article>
  );
}

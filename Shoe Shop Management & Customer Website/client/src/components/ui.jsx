import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { STOCK_LABEL } from '../lib/api.js';

export const Spinner = ({ label = 'Loading…' }) => (
  <div className="state" role="status"><div className="spinner" /><span>{label}</span></div>
);
export const ProductSkeletons = ({ count = 6 }) => (
  <div className="grid products" role="status" aria-label="Loading products">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="card skeleton-card" aria-hidden="true">
        <div className="skeleton sk-img" />
        <div className="card-body"><div className="skeleton sk-line" /><div className="skeleton sk-line w60" /><div className="skeleton sk-line w40" /></div>
      </div>
    ))}
  </div>
);
export const Empty = ({ title = 'Nothing found', children }) => (
  <div className="state empty"><strong>{title}</strong>{children && <p>{children}</p>}</div>
);
export const ErrorBox = ({ error, onRetry }) => (
  <div className="state error" role="alert">
    <strong>Something went wrong</strong>
    <p>{error?.message || 'Please try again.'}</p>
    {onRetry && <button className="btn" onClick={onRetry}>Try again</button>}
  </div>
);

export function ShoeImage({ src, alt = '', className = '' }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div className={`img-ph ${className}`} role="img" aria-label={alt || 'No image'}>
        <svg viewBox="0 0 64 64" width="48" height="48" aria-hidden="true"><path d="M8 40c0-7 4-11 9-11l9 7 14 2c9 1 12 4 12 9v3H8z" fill="currentColor" opacity=".35" /></svg>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setBroken(true)} />;
}

const COLOR_HEX = {
  black: '#111', white: '#fff', red: '#d62828', blue: '#1d4ed8', navy: '#1d3557', green: '#2d8a4e', yellow: '#facc15', brown: '#7b4a2a',
  tan: '#c8a27a', beige: '#e3d3b6', grey: '#8d99a6', gray: '#8d99a6', pink: '#f08ab0', purple: '#7e57c2', orange: '#f77f00', gold: '#d4af37',
  silver: '#c0c0c0', maroon: '#7a1f2b', cream: '#f5efe0', khaki: '#b5a27a',
};
export const colorHex = (name) => COLOR_HEX[String(name).toLowerCase()] || '#cbd5e1';
// Brand logo in a fixed-size box; brands without an uploaded logo get a monogram tile.
export function BrandLogo({ brand, size = 'md' }) {
  const [broken, setBroken] = useState(false);
  const hue = [...brand.name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  if (brand.logoUrl && !broken) {
    return <span className={`brand-logo ${size}`}><img src={brand.logoUrl} alt={`${brand.name} logo`} loading="lazy" onError={() => setBroken(true)} /></span>;
  }
  return <span className={`brand-logo mono ${size}`} style={{ '--h': hue }} role="img" aria-label={`${brand.name} logo`}>{brand.name.replace(/[^\p{L}\p{N}]/gu, '').slice(0, 2).toUpperCase()}</span>;
}

export const ColorDot = ({ name }) => <span className="dot" style={{ background: colorHex(name) }} aria-hidden="true" />;

export const StockBadge = ({ status }) => <span className={`badge stock-${String(status).toLowerCase()}`}>{STOCK_LABEL[status] || status}</span>;

export function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const nums = [];
  for (let i = 1; i <= pages; i++) if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
  const out = [];
  nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) out.push('…' + n); out.push(n); });
  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="btn sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>Prev</button>
      {out.map((n) => (typeof n === 'string' ? <span key={n} className="gap">…</span>
        : <button key={n} className={`btn sm ${n === page ? 'primary' : ''}`} aria-current={n === page ? 'page' : undefined} onClick={() => onChange(n)}>{n}</button>))}
      <button className="btn sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next</button>
    </nav>
  );
}

export function Modal({ title, onClose, children, wide }) {
  const ref = useRef(null);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <div className="modal-head"><h2>{title}</h2><button className="icon-btn" aria-label="Close" onClick={onClose}>✕</button></div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

const ConfirmCtx = createContext(null);
export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);
  const confirm = useCallback((opts) => new Promise((resolve) => setState({ ...opts, resolve })), []);
  const close = (v) => { state.resolve(v); setState(null); };
  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {state && (
        <Modal title={state.title || 'Are you sure?'} onClose={() => close(false)}>
          <p>{state.message}</p>
          <div className="actions">
            <button className="btn" onClick={() => close(false)}>Cancel</button>
            <button className={`btn ${state.danger ? 'danger' : 'primary'}`} onClick={() => close(true)} autoFocus>{state.confirmLabel || 'Confirm'}</button>
          </div>
        </Modal>
      )}
    </ConfirmCtx.Provider>
  );
}
export const useConfirm = () => useContext(ConfirmCtx);

export function Field({ label, error, hint, children, required }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <span className="label">{label}{required && <em aria-hidden="true"> *</em>}</span>
      {children}
      {hint && !error && <small className="hint">{hint}</small>}
      {error && <small className="err" role="alert">{error}</small>}
    </label>
  );
}

export function Toggle({ checked, onChange, label, disabled }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="track" aria-hidden="true" />
      {label && <span>{label}</span>}
    </label>
  );
}

export const fmtDate = (s) => (s ? new Date(s.replace(' ', 'T') + 'Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

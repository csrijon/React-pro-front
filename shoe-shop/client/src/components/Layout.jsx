import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { GENDERS } from '../lib/api.js';
import { useAuth, useFetch, useSettings } from '../lib/hooks.jsx';
import { useAuthModal } from './AuthModal.jsx';
import { ScrollEffects } from '../lib/motion.jsx';

function SearchBar({ onDone }) {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const loc = useLocation();
  const [q, setQ] = useState(loc.pathname.startsWith('/products') ? params.get('q') || '' : '');
  useEffect(() => { if (!loc.pathname.startsWith('/products')) setQ(''); }, [loc.pathname]);
  return (
    <form className="search" role="search" onSubmit={(e) => { e.preventDefault(); nav(q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : '/products'); onDone?.(); }}>
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, code, brand…" aria-label="Search products" />
      <button aria-label="Search">Search</button>
    </form>
  );
}

export default function Layout() {
  const { settings } = useSettings();
  const { user, logout } = useAuth();
  const authModal = useAuthModal();
  const { data: cats } = useFetch('/api/categories');
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'instant' }); }, [loc.pathname]);
  // Product listings keep their sidebar/filter state across gender/category changes, so they share one transition key.
  const pageKey = loc.pathname.startsWith('/products') ? 'products' : loc.pathname;

  const logo = (
    <Link to="/" className="logo" aria-label={`${settings.shopName} home`}>
      {settings.logoUrl ? <img src={settings.logoUrl} alt="" /> : <span className="logo-mark" aria-hidden="true">👟</span>}
      <span>{settings.shopName}</span>
    </Link>
  );

  return (
    <div className="site">
      <header className="header">
        <div className="container header-row">
          <button className="icon-btn menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
          {logo}
          <div className="header-search desktop-only"><SearchBar /></div>
          <div className="header-actions">
            {user?.role === 'ADMIN' && <Link className="btn sm" to="/admin">Admin</Link>}
            {user?.role === 'CUSTOMER' && <Link className="btn sm" to="/account">My account</Link>}
            {user ? <button className="btn sm ghost" onClick={logout}>Logout</button>
              : <button className="btn sm primary" onClick={() => authModal.open('login')}>Login</button>}
          </div>
        </div>
        <div className="container mobile-only header-search-m"><SearchBar /></div>
        <nav className={`nav ${open ? 'open' : ''}`} aria-label="Main">
          <div className="container nav-row">
            {GENDERS.map((g) => (
              <div className="nav-item" key={g.key}>
                <NavLink to={`/products/${g.slug}`} end className="nav-link">{g.label}</NavLink>
                <div className="dropdown">
                  {(cats?.categories || []).filter((c) => c.gender === g.key).map((c) => (
                    <Link key={c.id} to={`/products/${g.slug}/${c.slug}`}>{c.name}</Link>
                  ))}
                </div>
              </div>
            ))}
            <NavLink to="/categories" className="nav-link">Categories</NavLink>
            <NavLink to="/brands" className="nav-link">Brands</NavLink>
            <Link to="/products?featured=1" className="nav-link">Featured</Link>
            <NavLink to="/products" end className="nav-link">All products</NavLink>
          </div>
        </nav>
      </header>
      <main key={pageKey} className="page-enter"><Outlet /></main>
      <Footer cats={cats?.categories} />
      <ScrollEffects />
    </div>
  );
}

function Footer({ cats = [] }) {
  const { settings: s } = useSettings();
  const social = [['Facebook', s.facebookUrl], ['Instagram', s.instagramUrl], ['YouTube', s.youtubeUrl]].filter(([, u]) => u);
  const wa = s.whatsapp ? `https://wa.me/${s.whatsapp.replace(/\D/g, '')}` : null;
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>{s.shopName}</h3>
          {s.address && <p>{s.address}</p>}
          {s.phone && <p>Phone: <a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`}>{s.phone}</a></p>}
          {wa && <p>WhatsApp: <a href={wa} target="_blank" rel="noopener noreferrer">{s.whatsapp}</a></p>}
        </div>
        <div>
          <h3>Shop</h3>
          {GENDERS.map((g) => <p key={g.key}><Link to={`/products/${g.slug}`}>{g.label}</Link></p>)}
          <p><Link to="/brands">Brands</Link></p>
        </div>
        <div>
          <h3>Categories</h3>
          {[...new Map(cats.map((c) => [c.slug, c])).values()].slice(0, 6).map((c) => <p key={c.slug}><Link to={`/products?category=${c.slug}`}>{c.name}</Link></p>)}
        </div>
        <div>
          <h3>Follow us</h3>
          {social.length ? (
            <ul className="social">{social.map(([n, u]) => <li key={n}><a href={u} target="_blank" rel="noopener noreferrer">{n}</a></li>)}</ul>
          ) : <p className="muted">Social links coming soon.</p>}
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} {s.shopName}. All rights reserved.</div>
    </footer>
  );
}


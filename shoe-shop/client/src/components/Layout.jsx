import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { GENDERS } from '../lib/api.js';
import { useAuth, useFetch, useSettings } from '../lib/hooks.jsx';
import { useAuthModal } from './AuthModal.jsx';
import { ScrollEffects } from '../lib/motion.jsx';

const SearchIcon = () => (
  <svg className="search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" />
  </svg>
);

function SearchBar({ onDone }) {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const loc = useLocation();
  const [q, setQ] = useState(loc.pathname.startsWith('/products') ? params.get('q') || '' : '');
  useEffect(() => { if (!loc.pathname.startsWith('/products')) setQ(''); }, [loc.pathname]);
  return (
    <form className="search" role="search" onSubmit={(e) => { e.preventDefault(); nav(q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : '/products'); onDone?.(); }}>
      <SearchIcon />
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, code or brand…" aria-label="Search products" />
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
      {settings.logoUrl ? <img src={settings.logoUrl} alt="" /> : <span className="logo-mark" aria-hidden="true">{(settings.shopName || 'S').trim().charAt(0)}</span>}
      <span>{settings.shopName}</span>
    </Link>
  );

  return (
    <div className="site">
      <TopBar />
      <header className="header">
        <div className="container header-row">
          <button className="icon-btn menu-btn" aria-label="Menu" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
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
        <nav id="main-nav" className={`nav ${open ? 'open' : ''}`} aria-label="Main">
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
            <Link to="/categories" className="nav-link">Categories</Link>
            <NavLink to="/brands" className="nav-link">Brands</NavLink>
            <Link to="/products?sort=newest" className="nav-link">New arrivals</Link>
            <Link to="/products?featured=1" className="nav-link">Featured</Link>
            <NavLink to="/products" end className="nav-link">All products</NavLink>
            <Link to="/products/kids/junior" className="nav-link">Junior</Link>
            <Link to="/products?category=school-shoes" className="nav-link">School Shoe</Link>
          </div>
        </nav>
      </header>
      <main key={pageKey} className="page-enter"><Outlet /></main>
      <Footer cats={cats?.categories} />
      <ScrollEffects />
    </div>
  );
}

function TopBar() {
  const { settings: s } = useSettings();
  const wa = s.whatsapp ? `https://wa.me/${s.whatsapp.replace(/\D/g, '')}` : null;
  const social = [['Facebook', s.facebookUrl], ['Instagram', s.instagramUrl], ['YouTube', s.youtubeUrl]].filter(([, u]) => u);
  if (!s.phone && !wa && !social.length) return null;
  return (
    <div className="topbar">
      <div className="container topbar-row">
        <span className="topbar-left">
          <span className="topbar-note">Wholesale footwear for men, women &amp; kids</span>
          {s.phone && <a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`}>Call {s.phone}</a>}
          {wa && <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp orders</a>}
        </span>
        {social.length > 0 && (
          <span className="topbar-social">
            {social.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener noreferrer">{n}</a>)}
          </span>
        )}
      </div>
    </div>
  );
}

const SOCIAL_ICONS = {
  Facebook: <path d="M14 9h3V6h-3c-2 0-3.5 1.5-3.5 3.5V11H8v3h2.5v7h3v-7H16l.5-3h-3V9.7c0-.4.3-.7.7-.7Z" />,
  Instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" /></>,
  YouTube: <><rect x="3" y="6" width="18" height="12" rx="4" /><path d="m11 9.5 4 2.5-4 2.5z" fill="currentColor" stroke="none" /></>,
};

function Footer({ cats = [] }) {
  const { settings: s } = useSettings();
  const social = [['Facebook', s.facebookUrl], ['Instagram', s.instagramUrl], ['YouTube', s.youtubeUrl]].filter(([, u]) => u);
  const wa = s.whatsapp ? `https://wa.me/${s.whatsapp.replace(/\D/g, '')}` : null;
  const hasContact = s.address || s.phone || wa;
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h3>{s.shopName}</h3>
          <p>Wholesale footwear for men, women and kids — browse every brand, colour and size with live stock.</p>
          {s.address && <p><span className="footer-ico" aria-hidden="true">📍</span> {s.address}</p>}
          {s.phone && <p><span className="footer-ico" aria-hidden="true">📞</span> <a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`}>{s.phone}</a></p>}
          {wa && <p><span className="footer-ico" aria-hidden="true">💬</span> <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp {s.whatsapp}</a></p>}
        </div>
        <div>
          <h3>Shop</h3>
          {GENDERS.map((g) => <p key={g.key}><Link to={`/products/${g.slug}`}>{g.label}</Link></p>)}
          <p><Link to="/products?sort=newest">New arrivals</Link></p>
          <p><Link to="/brands">Brands</Link></p>
          <p><Link to="/categories">Categories</Link></p>
        </div>
        <div>
          <h3>Categories</h3>
          {[...new Map(cats.map((c) => [c.slug, c])).values()].slice(0, 6).map((c) => <p key={c.slug}><Link to={`/products?category=${c.slug}`}>{c.name}</Link></p>)}
        </div>
        <div>
          <h3>Follow us</h3>
          {social.length ? (
            <ul className="social-links">
              {social.map(([n, u]) => (
                <li key={n}><a href={u} target="_blank" rel="noopener noreferrer" aria-label={n}>
                  <span className="social-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="19" height="19">{SOCIAL_ICONS[n]}</svg></span>{n}
                </a></li>
              ))}
            </ul>
          ) : <p className="muted">Social links coming soon.</p>}
          <div className="footer-support">
            <h3>Customer support</h3>
            <p><Link to="/account">Track your account</Link></p>
            <p><Link to="/products">Browse products</Link></p>
            {hasContact && <p className="muted small">We reply during shop hours.</p>}
          </div>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} {s.shopName}. All rights reserved.</div>
    </footer>
  );
}

import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, useSettings, useToast } from '../lib/hooks.jsx';
import { Spinner } from '../components/ui.jsx';

const NAV = [
  ['/admin', 'Dashboard', true], ['/admin/products', 'Products'], ['/admin/products/new', 'Add Product'], ['/admin/categories', 'Categories'],
  ['/admin/brands', 'Brands'], ['/admin/customers', 'Customers'], ['/admin/inventory', 'Inventory'], ['/admin/stock-history', 'Stock History'], ['/admin/reorder', 'Reorder Report'], ['/admin/featured', 'Featured Products'],
  ['/admin/settings', 'Settings'], ['/admin/profile', 'Admin Profile'],
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);

  if (user === undefined) return <Spinner />;
  if (!user) return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;
  if (user.role !== 'ADMIN') return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin">
      <header className="admin-top">
        <button className="icon-btn" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
        <strong>{settings.shopName} · Admin</strong>
        <span className="spacer" />
        <Link className="btn sm" to="/" target="_blank">View shop ↗</Link>
      </header>
      <aside className={`admin-side ${open ? 'open' : ''}`}>
        <nav aria-label="Admin">
          {NAV.map(([to, label, end]) => <NavLink key={to} to={to} end={end || to === '/admin/products'}>{label}</NavLink>)}
          <button className="side-logout" onClick={async () => { await logout(); toast.success('Logged out'); }}>Logout</button>
        </nav>
      </aside>
      <main className="admin-main"><Outlet /></main>
    </div>
  );
}

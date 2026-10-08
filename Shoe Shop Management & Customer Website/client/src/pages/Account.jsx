import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth, useSettings, useToast } from '../lib/hooks.jsx';
import { useAuthModal } from '../components/AuthModal.jsx';
import { Field, Spinner, fmtDate } from '../components/ui.jsx';

const STATUS_INFO = {
  PENDING: ['Pending approval', 'Your registration is waiting for admin approval. Wholesale prices will unlock once approved.'],
  APPROVED: ['Approved', 'You can see wholesale prices on all products.'],
  REJECTED: ['Not approved', 'Your registration was not approved. Please contact the shop for details.'],
  SUSPENDED: ['Suspended', 'Your wholesale access is suspended. Please contact the shop.'],
};

// /login and /register open the auth modal then fall back to home (they exist so the URLs work and survive refresh).
export function AuthRoute({ mode }) {
  const { user } = useAuth();
  const modal = useAuthModal();
  const nav = useNavigate();
  useEffect(() => { if (user === null) modal.open(mode); }, [user, mode]); // eslint-disable-line
  if (user === undefined) return <Spinner />;
  if (user) return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/account'} replace />;
  return (
    <div className="container page narrow">
      <h1>{mode === 'login' ? 'Log in' : 'Register for wholesale'}</h1>
      <p className="muted">Use the form to continue. <button className="link" onClick={() => nav('/')}>Back to shop</button></p>
      <button className="btn primary" onClick={() => modal.open(mode)}>Open {mode === 'login' ? 'login' : 'registration'} form</button>
    </div>
  );
}

export default function Account() {
  const { user, setUser, logout } = useAuth();
  const { settings } = useSettings();
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (user?.role === 'CUSTOMER') setForm({ shopName: user.shopName, ownerName: user.ownerName, email: user.email || '', address: user.address || '' }); }, [user]);

  if (user === undefined) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (!form) return <Spinner />;

  const [label, info] = STATUS_INFO[user.status];
  const saveProfile = async (e) => {
    e.preventDefault(); setBusy(true); setErr({});
    try { setUser((await api.put('/api/auth/profile', form)).user); toast.success('Profile updated'); }
    catch (ex) { setErr(ex.fields || {}); toast.error(ex.message); } finally { setBusy(false); }
  };
  const savePw = async (e) => {
    e.preventDefault(); setBusy(true); setErr({});
    try { await api.put('/api/auth/password', pw); setPw({ currentPassword: '', newPassword: '' }); toast.success('Password changed'); }
    catch (ex) { setErr(ex.fields || {}); toast.error(ex.message); } finally { setBusy(false); }
  };

  return (
    <div className="container page">
      <h1>My account</h1>
      <div className="grid two">
        <section className="panel">
          <h2>Shop information</h2>
          <dl className="kv">
            <div><dt>Shop name</dt><dd>{user.shopName}</dd></div>
            <div><dt>Proprietor</dt><dd>{user.ownerName}</dd></div>
            <div><dt>Mobile</dt><dd>{user.mobile}</dd></div>
            <div><dt>Registered</dt><dd>{fmtDate(user.registeredAt)}</dd></div>
            <div><dt>Account status</dt><dd><span className={`badge status-${user.status.toLowerCase()}`}>{label}</span></dd></div>
            <div><dt>Wholesale access</dt><dd>{user.wholesaleAccess ? 'Enabled' : 'Not enabled'}</dd></div>
          </dl>
          <div className={`alert ${user.status === 'APPROVED' ? 'success' : 'info'}`}>{info}</div>
          {settings.phone && <p className="small muted">Questions? Call {settings.phone}.</p>}
          <p><Link className="btn primary" to="/products">Browse products</Link> <button className="btn" onClick={async () => { await logout(); }}>Logout</button></p>
        </section>

        <div>
          <form className="panel" onSubmit={saveProfile} noValidate>
            <h2>Edit profile</h2>
            <Field label="Shop name" required error={err.shopName}><input value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} /></Field>
            <Field label="Proprietor name" required error={err.ownerName}><input value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} /></Field>
            <Field label="Mobile number" hint="Your mobile number is your login and cannot be changed here."><input value={user.mobile} disabled /></Field>
            <Field label="Email" error={err.email}><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Shop address" error={err.address}><textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
            <button className="btn primary" disabled={busy}>Save changes</button>
          </form>
          <form className="panel" onSubmit={savePw} noValidate>
            <h2>Change password</h2>
            <Field label="Current password" error={err.currentPassword}><input type="password" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} /></Field>
            <Field label="New password" error={err.newPassword} hint="At least 8 characters"><input type="password" autoComplete="new-password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} /></Field>
            <button className="btn" disabled={busy}>Change password</button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useSettings, useToast } from '../lib/hooks.jsx';
import { Field, Spinner } from '../components/ui.jsx';

export default function AdminLogin() {
  const { user, login, logout } = useAuth();
  const { settings } = useSettings();
  const toast = useToast();
  const nav = useNavigate();
  const loc = useLocation();
  const [f, setF] = useState({ username: '', password: '' });
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  if (user === undefined) return <Spinner />;
  if (user?.role === 'ADMIN') return <Navigate to={loc.state?.from || '/admin'} replace />;

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(null);
    try {
      const u = await login(f.username, f.password);
      if (u.role !== 'ADMIN') { await logout(); throw new Error('This account does not have admin access.'); }
      toast.success('Welcome back');
      nav(loc.state?.from || '/admin', { replace: true });
    } catch (ex) { setErr(ex); } finally { setBusy(false); }
  }
  return (
    <div className="login-wrap">
      <form className="panel login-card" onSubmit={submit} noValidate>
        <h1>{settings.shopName}</h1>
        <p className="muted">Admin sign in</p>
        <Field label="Username" error={err?.fields?.username}><input value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} autoComplete="username" autoFocus /></Field>
        <Field label="Password" error={err?.fields?.password}><input type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="current-password" /></Field>
        {err && !err.fields?.username && !err.fields?.password && <div className="alert error" role="alert">{err.message}</div>}
        <button className="btn primary block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}

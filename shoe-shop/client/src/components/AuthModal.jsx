import { createContext, useCallback, useContext, useState } from 'react';
import { Field, Modal } from './ui.jsx';
import { useAuth, useToast } from '../lib/hooks.jsx';

const Ctx = createContext(null);
export const useAuthModal = () => useContext(Ctx);

export function AuthModalProvider({ children }) {
  const [mode, setMode] = useState(null); // null | 'login' | 'register'
  const close = useCallback(() => setMode(null), []);
  return (
    <Ctx.Provider value={{ open: setMode }}>
      {children}
      {mode && <AuthModal mode={mode} setMode={setMode} onClose={close} />}
    </Ctx.Provider>
  );
}

function AuthModal({ mode, setMode, onClose }) {
  const { login, register } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ shopName: '', ownerName: '', mobile: '', password: '', email: '', address: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const fe = (k) => err?.fields?.[k];

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      if (mode === 'login') {
        const u = await login(form.mobile, form.password);
        toast.success(u.role === 'ADMIN' ? 'Logged in as admin' : 'Welcome back!');
      } else {
        await register(form);
        toast.success('Registration received. We will review your account shortly.');
      }
      onClose();
    } catch (ex) { setErr(ex); } finally { setBusy(false); }
  }

  return (
    <Modal title={mode === 'login' ? 'Log in' : 'Request wholesale access'} onClose={onClose}>
      <div className="tabs">
        <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setErr(null); }}>Register</button>
        <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setErr(null); }}>Log in</button>
      </div>
      {mode === 'register' && <p className="muted small">Register your shop. After admin approval you can view wholesale prices.</p>}
      <form onSubmit={submit} noValidate>
        {mode === 'register' && (
          <>
            <Field label="Shop name" required error={fe('shopName')}><input value={form.shopName} onChange={set('shopName')} autoComplete="organization" /></Field>
            <Field label="Proprietor / owner name" required error={fe('ownerName')}><input value={form.ownerName} onChange={set('ownerName')} autoComplete="name" /></Field>
          </>
        )}
        <Field label="Mobile number" required error={fe('mobile') || fe('username')}>
          <input type="tel" inputMode="numeric" value={form.mobile} onChange={set('mobile')} autoComplete="tel" placeholder="10-digit mobile" />
        </Field>
        <Field label="Password" required error={fe('password')} hint={mode === 'register' ? 'At least 8 characters' : undefined}>
          <input type="password" value={form.password} onChange={set('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
        </Field>
        {mode === 'register' && (
          <>
            <Field label="Email (optional)" error={fe('email')}><input type="email" value={form.email} onChange={set('email')} autoComplete="email" /></Field>
            <Field label="Shop address (optional)" error={fe('address')}><textarea rows={2} value={form.address} onChange={set('address')} /></Field>
          </>
        )}
        {err && !Object.keys(err.fields || {}).length && <div className="alert error" role="alert">{err.message}</div>}
        <button className="btn primary block" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Register'}</button>
      </form>
    </Modal>
  );
}

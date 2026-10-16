import { createContext, useCallback, useContext, useState } from 'react';
import { Field, Modal } from './ui.jsx';
import { useAuth, useToast } from '../lib/hooks.jsx';

const Ctx = createContext(null);
export const useAuthModal = () => useContext(Ctx);

const BLANK = { accountType: 'CUSTOMER', name: '', mobile: '', password: '', email: '', address: '', shopName: '', shopAddress: '' };

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
  const [form, setForm] = useState(BLANK);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const fe = (k) => err?.fields?.[k];
  const isShop = form.accountType === 'SHOP_OWNER';

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      if (mode === 'login') {
        const u = await login(form.mobile, form.password);
        toast.success(u.role === 'ADMIN' ? 'Logged in as admin' : 'Welcome back!');
      } else {
        const u = await register(form);
        toast.success(isShop ? 'Registration received. We will review your shop account shortly.' : 'Your account is ready.');
      }
      onClose();
    } catch (ex) { setErr(ex); } finally { setBusy(false); }
  }

  return (
    <Modal title={mode === 'login' ? 'Log in' : 'Create your account'} onClose={onClose}>
      <div className="tabs">
        <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setErr(null); }}>Register</button>
        <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setErr(null); }}>Log in</button>
      </div>
      <form onSubmit={submit} noValidate>
        {mode === 'register' && (
          <div className="account-type" role="radiogroup" aria-label="Account type">
            <button type="button" role="radio" aria-checked={!isShop} className={!isShop ? 'on' : ''} onClick={() => setForm((f) => ({ ...f, accountType: 'CUSTOMER' }))}>
              <strong>Customer</strong><span className="small muted">Shop the full range at retail prices.</span>
            </button>
            <button type="button" role="radio" aria-checked={isShop} className={isShop ? 'on' : ''} onClick={() => setForm((f) => ({ ...f, accountType: 'SHOP_OWNER' }))}>
              <strong>Shop Owner</strong><span className="small muted">Buy wholesale — needs approval.</span>
            </button>
          </div>
        )}
        {mode === 'register' && <p className="muted small">{isShop ? 'Register your shop. After admin approval you can view wholesale prices.' : 'Create a free account to save your details.'}</p>}
        {mode === 'register' && (
          <Field label="Your name" required error={fe('name')}><input value={form.name} onChange={set('name')} autoComplete="name" /></Field>
        )}
        <Field label="Mobile number" required error={fe('mobile') || fe('username')}>
          <input type="tel" inputMode="numeric" value={form.mobile} onChange={set('mobile')} autoComplete="tel" placeholder="10-digit mobile" />
        </Field>
        <Field label="Password" required error={fe('password')} hint={mode === 'register' ? 'At least 8 characters' : undefined}>
          <input type="password" value={form.password} onChange={set('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
        </Field>
        {mode === 'register' && (
          <>
            {isShop && (
              <>
                <Field label="Shop name" required error={fe('shopName')}><input value={form.shopName} onChange={set('shopName')} autoComplete="organization" /></Field>
                <Field label="Shop address" error={fe('shopAddress')}><textarea rows={2} value={form.shopAddress} onChange={set('shopAddress')} /></Field>
              </>
            )}
            {!isShop && (
              <Field label="Address (optional)" error={fe('address')}><textarea rows={2} value={form.address} onChange={set('address')} autoComplete="street-address" /></Field>
            )}
            <Field label="Email (optional)" error={fe('email')}><input type="email" value={form.email} onChange={set('email')} autoComplete="email" /></Field>
          </>
        )}
        {err && !Object.keys(err.fields || {}).length && <div className="alert error" role="alert">{err.message}</div>}
        <button className="btn primary block" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Register'}</button>
      </form>
    </Modal>
  );
}

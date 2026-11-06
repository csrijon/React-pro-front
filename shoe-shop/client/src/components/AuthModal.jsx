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
  const [more, setMore] = useState(false);
  const [showPw, setShowPw] = useState(false);
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
        {mode === 'register' && isShop && <p className="muted small">Wholesale prices unlock after admin approval.</p>}
        {mode === 'register' && (
          <Field label="Your name" required error={fe('name')}><input value={form.name} onChange={set('name')} autoComplete="name" /></Field>
        )}
        <Field label="Mobile number" required error={fe('mobile') || fe('username')}>
          <input type="tel" inputMode="numeric" maxLength={10} value={form.mobile} onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value.replace(/\D/g, '') }))} autoComplete="tel-national" placeholder="10-digit mobile" />
        </Field>
        <Field label="Password" required error={fe('password')} hint={mode === 'register' ? 'At least 8 characters' : undefined}>
          <span className="pw-row"><input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /><button type="button" className="btn sm" onClick={() => setShowPw(!showPw)}>{showPw ? 'Hide' : 'Show'}</button></span>
        </Field>
        {mode === 'register' && (
          <>
            {isShop && <Field label="Shop name" required error={fe('shopName')}><input value={form.shopName} onChange={set('shopName')} autoComplete="organization" /></Field>}
            {!more && <button type="button" className="more-link" onClick={() => setMore(true)}>+ Add address / email (optional)</button>}
            {more && (
              <>
                <Field label={isShop ? 'Shop address' : 'Address'} error={fe('shopAddress') || fe('address')}>
                  <textarea rows={2} value={isShop ? form.shopAddress : form.address} onChange={set(isShop ? 'shopAddress' : 'address')} autoComplete="street-address" />
                </Field>
                <Field label="Email" error={fe('email')}><input type="email" value={form.email} onChange={set('email')} autoComplete="email" /></Field>
              </>
            )}
          </>
        )}
        {err && !Object.keys(err.fields || {}).length && <div className="alert error" role="alert">{err.message}</div>}
        <button className="btn primary block" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Register'}</button>
      </form>
    </Modal>
  );
}

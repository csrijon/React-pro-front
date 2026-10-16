import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { api } from './api.js';

/* ---- toast ---- */
const ToastCtx = createContext(null);
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  const toast = useRef({ success: (m) => push(m, 'success'), error: (m) => push(m, 'error') }).current;
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>)}
      </div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);

/* ---- auth ---- */
const AuthCtx = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = anonymous
  const refresh = useCallback(async () => {
    try { setUser((await getJson('/api/auth/me')).user); } catch { setUser(null); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  const login = async (username, password) => {
    const { user: u } = await api.post('/api/auth/login', { username, password });
    setUser(u);
    return u;
  };
  const register = async (data) => {
    const { user: u } = await api.post('/api/auth/register', data);
    setUser(u);
    return u;
  };
  const logout = async () => { try { await api.post('/api/auth/logout'); } finally { setUser(null); } };
  return <AuthCtx.Provider value={{ user, setUser, refresh, login, register, logout }}>{children}</AuthCtx.Provider>;
}
export const useAuth = () => useContext(AuthCtx);

/* ---- public settings ---- */
const SettingsCtx = createContext({});
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({ shopName: 'Footwear Wholesale' });
  const reload = useCallback(() => getJson('/api/settings').then((s) => s && setSettings(s)).catch(() => {}), []);
  useEffect(() => { reload(); }, [reload]);
  useEffect(() => { document.title = settings.shopName; }, [settings.shopName]);
  return <SettingsCtx.Provider value={{ settings, reload }}>{children}</SettingsCtx.Provider>;
}
export const useSettings = () => useContext(SettingsCtx);

/* ---- data fetching ---- */
// Collapse concurrent GETs for the same URL (React Strict Mode's double effect, or two
// components asking for /api/categories at once) into a single network request.
const inflight = new Map();
function getJson(url) {
  const existing = inflight.get(url);
  if (existing) return existing;
  const p = api.get(url).finally(() => { if (inflight.get(url) === p) inflight.delete(url); });
  inflight.set(url, p);
  return p;
}

export function useFetch(url, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (url === null) return undefined;
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    getJson(url).then(
      (data) => !cancelled && setState({ data, error: null, loading: false }),
      (error) => !cancelled && setState({ data: null, error, loading: false }),
    );
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, tick, ...deps]);
  return { ...state, reload: () => setTick((t) => t + 1) };
}

export function useDebounced(value, ms = 350) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}

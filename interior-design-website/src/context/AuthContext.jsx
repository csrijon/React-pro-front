import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, TOKEN_KEY } from '../services/api';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);
const USER_KEY = 'domus.user';

const load = () => {
  const persistent = storage.get(TOKEN_KEY, null);
  if (persistent) return { token: persistent, user: storage.get(USER_KEY, null) };
  try {
    const t = sessionStorage.getItem(TOKEN_KEY);
    if (t) return { token: t, user: JSON.parse(sessionStorage.getItem(USER_KEY) || 'null') };
  } catch { /* noop */ }
  return { token: null, user: null };
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(load);

  const logout = useCallback(() => {
    storage.remove(TOKEN_KEY); storage.remove(USER_KEY);
    try { sessionStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(USER_KEY); } catch { /* noop */ }
    setSession({ token: null, user: null });
  }, []);

  const login = useCallback(async (credentials, remember) => {
    const { token, user } = await authApi.login(credentials);
    if (remember) { storage.set(TOKEN_KEY, token); storage.set(USER_KEY, user); }
    else { try { sessionStorage.setItem(TOKEN_KEY, token); sessionStorage.setItem(USER_KEY, JSON.stringify(user)); } catch { /* noop */ } }
    setSession({ token, user });
  }, []);

  const updateUser = useCallback((patch) => setSession((s) => ({ ...s, user: { ...s.user, ...patch } })), []);

  useEffect(() => {
    window.addEventListener('domus:unauthorized', logout);
    return () => window.removeEventListener('domus:unauthorized', logout);
  }, [logout]);

  const value = useMemo(() => ({ ...session, isAuthenticated: !!session.token, login, logout, updateUser }), [session, login, logout, updateUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

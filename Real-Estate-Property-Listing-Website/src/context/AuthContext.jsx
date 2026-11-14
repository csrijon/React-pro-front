import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { authService } from '../services/authService'
import { USE_MOCK } from '../services/config'

const AuthContext = createContext(null)
const STAFF = ['admin', 'editor']

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // With a real backend, a remembered user without a token is a stale session (e.g. from demo mode).
    if (!USE_MOCK && !localStorage.getItem('estatehub:token')) { localStorage.removeItem('estatehub:user'); return null }
    return authService.current()
  })
  const login = useCallback(async (c) => { const u = await authService.login(c); setUser(u); return u }, [])
  const register = useCallback(async (c) => { const u = await authService.register(c); setUser(u); return u }, [])
  const logout = useCallback(() => { authService.logout(); setUser(null) }, [])
  const update = useCallback((u) => setUser(u), [])

  useEffect(() => {
    const out = () => setUser(null)
    window.addEventListener('estatehub:unauthorized', out)
    return () => window.removeEventListener('estatehub:unauthorized', out)
  }, [])

  // With a real backend, confirm the stored session is still valid (token expired, user deactivated…).
  useEffect(() => {
    if (USE_MOCK || !localStorage.getItem('estatehub:token')) return
    authService.me().then(setUser).catch(() => {})
  }, [logout])

  const value = useMemo(() => ({ user, login, register, logout, update, isAdmin: STAFF.includes(user?.role) }), [user, login, register, logout, update])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)

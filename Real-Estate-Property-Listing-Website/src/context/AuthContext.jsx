import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.current())
  const login = useCallback(async (c) => { const u = await authService.login(c); setUser(u); return u }, [])
  const register = useCallback(async (c) => { const u = await authService.register(c); setUser(u); return u }, [])
  const logout = useCallback(() => { authService.logout(); setUser(null) }, [])
  const value = useMemo(() => ({ user, login, register, logout, isAdmin: user?.role === 'admin' }), [user, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)

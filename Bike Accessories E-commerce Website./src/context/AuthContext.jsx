import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import authService from '../services/authService'
import userService from '../services/userService'
import { storage, KEYS } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // `booting` is true only while we verify an existing token on first load
  const [booting, setBooting] = useState(() => !!storage.get(KEYS.token))

  useEffect(() => {
    if (!storage.get(KEYS.token)) return
    authService
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => storage.remove(KEYS.token))
      .finally(() => setBooting(false))
  }, [])

  const handleAuth = ({ token, user }) => {
    storage.set(KEYS.token, token)
    setUser(user)
    return user
  }

  const login = useCallback((creds) => authService.login(creds).then(handleAuth), [])
  const register = useCallback((data) => authService.register(data).then(handleAuth), [])
  const logout = useCallback(() => {
    storage.remove(KEYS.token)
    setUser(null)
  }, [])
  const updateProfile = useCallback(
    (data) =>
      userService.updateProfile(data).then(({ user }) => {
        setUser(user)
        return user
      }),
    [],
  )

  const value = useMemo(
    () => ({ user, booting, isAuthenticated: !!user, login, register, logout, updateProfile }),
    [user, booting, login, register, logout, updateProfile],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

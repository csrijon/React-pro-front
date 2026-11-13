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

  // may return { requires2fa, challenge } instead of a user when two-factor auth is on
  const login = useCallback((creds) => authService.login(creds).then((r) => (r.requires2fa ? r : handleAuth(r))), [])
  const verifyTwoFactor = useCallback((challenge, code) => authService.login2fa(challenge, code).then(handleAuth), [])
  const refreshUser = useCallback(() => authService.me().then(({ user }) => { setUser(user); return user }), [])
  // for flows that return a fresh token (password change, sign out everywhere, disabling 2FA)
  const adoptSession = useCallback(({ token, user }) => { if (token) storage.set(KEYS.token, token); if (user) setUser(user) }, [])
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

  useEffect(() => {
    const onRevoked = () => setUser(null)
    window.addEventListener('mg:unauthorized', onRevoked)
    return () => window.removeEventListener('mg:unauthorized', onRevoked)
  }, [])

  const value = useMemo(
    () => ({ user, booting, isAuthenticated: !!user, login, verifyTwoFactor, refreshUser, adoptSession, register, logout, updateProfile }),
    [user, booting, login, verifyTwoFactor, refreshUser, adoptSession, register, logout, updateProfile],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

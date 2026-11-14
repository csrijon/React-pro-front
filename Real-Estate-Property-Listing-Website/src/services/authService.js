import { USE_MOCK, http, delay } from './config'

/**
 * Authentication is API-ready. In mock mode NOTHING here is secure — it only lets you
 * click through the UI. Replace with real endpoints by setting VITE_API_URL; the backend
 * must issue and validate tokens (ideally httpOnly cookies) and enforce admin roles.
 */
const KEY = 'estatehub:user'

export const authService = {
  current() { try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null } },
  async login({ email, password }) {
    if (!USE_MOCK) { const r = await http('/auth/login', { method: 'POST', body: { email, password } }); localStorage.setItem('estatehub:token', r.token); localStorage.setItem(KEY, JSON.stringify(r.user)); return r.user }
    await delay(600)
    const user = { id: 'demo', name: email.split('@')[0], email, role: email.startsWith('admin') ? 'admin' : 'user' }
    localStorage.setItem(KEY, JSON.stringify(user))
    return user
  },
  async register({ name, email, password, phone }) {
    if (!USE_MOCK) { const r = await http('/auth/register', { method: 'POST', body: { name, email, password, phone } }); localStorage.setItem('estatehub:token', r.token); localStorage.setItem(KEY, JSON.stringify(r.user)); return r.user }
    await delay(700)
    const user = { id: 'demo', name, email, role: 'user' }
    localStorage.setItem(KEY, JSON.stringify(user))
    return user
  },
  async forgotPassword(email) { if (!USE_MOCK) return http('/auth/forgot-password', { method: 'POST', body: { email } }); await delay(700); return { ok: true } },
  async me() { return http('/auth/me') },
  async updateProfile(d) { if (!USE_MOCK) { const u = await http('/auth/me', { method: 'PUT', body: d }); localStorage.setItem(KEY, JSON.stringify(u)); return u } await delay(300); const u = { ...authService.current(), ...d }; localStorage.setItem(KEY, JSON.stringify(u)); return u },
  async changePassword(d) { if (!USE_MOCK) return http('/auth/password', { method: 'PUT', body: d }); await delay(400); return { ok: true } },
  async resetPassword(d) { if (!USE_MOCK) return http('/auth/reset-password', { method: 'POST', body: d }); await delay(500); return { ok: true } },
  logout() { localStorage.removeItem(KEY); localStorage.removeItem('estatehub:token') },
}

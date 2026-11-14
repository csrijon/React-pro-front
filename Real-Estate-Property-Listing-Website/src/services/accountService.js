import { USE_MOCK, http, delay } from './config'
import { uid } from '../utils/format'

const SS = 'estatehub:saved-searches'
const read = () => { try { return JSON.parse(localStorage.getItem(SS)) || [] } catch { return [] } }
const loggedIn = () => !!localStorage.getItem('estatehub:token')

export const accountService = {
  wishlist: {
    sync: (ids) => http('/me/wishlist/sync', { method: 'POST', body: { ids } }),
    add: (id) => http(`/me/wishlist/${id}`, { method: 'POST' }),
    remove: (id) => http(`/me/wishlist/${id}`, { method: 'DELETE' }),
  },
  savedSearches: {
    async list() { if (!USE_MOCK) return http('/me/saved-searches'); await delay(150); return read() },
    async create(d) { if (!USE_MOCK) return http('/me/saved-searches', { method: 'POST', body: d }); const s = { id: uid('s'), createdAt: new Date().toISOString(), ...d }; localStorage.setItem(SS, JSON.stringify([s, ...read()])); return s },
    async remove(id) { if (!USE_MOCK) return http(`/me/saved-searches/${id}`, { method: 'DELETE' }); localStorage.setItem(SS, JSON.stringify(read().filter((s) => s.id !== id))) },
  },
  async activity() { if (!USE_MOCK) return http('/me/activity'); await delay(200); return { inquiries: [], appointments: [] } },
  isLoggedIn: loggedIn,
}

// Safe localStorage helpers (never throw in private mode / SSR)
export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? fallback : JSON.parse(raw)
    } catch {
      return fallback
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* ignore quota / privacy errors */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  },
}

export const KEYS = {
  token: 'mg_token',
  cart: 'mg_cart',
  wishlist: 'mg_wishlist',
  recent: 'mg_recent',
  users: 'mg_mock_users',
  orders: 'mg_mock_orders',
  addresses: 'mg_mock_addresses',
  lastOrder: 'mg_last_order',
}

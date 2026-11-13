// Set VITE_API_URL in .env to switch every service from mock data to your backend.
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
export const USE_MOCK = !API_URL

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms))

export async function http(path, { method = 'GET', body, headers } = {}) {
  const token = localStorage.getItem('estatehub:token')
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let msg = res.statusText
    try { msg = (await res.json()).message || msg } catch { /* ignore */ }
    throw new Error(msg)
  }
  return res.status === 204 ? null : res.json()
}

export { delay }

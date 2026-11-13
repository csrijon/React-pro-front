import { storage, KEYS } from '../utils/storage'

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

/**
 * Tiny fetch-based HTTP client used by every service (replaces axios: ~22 KB gzipped less JavaScript).
 *   api.get(path, { params, headers, timeout, responseType }) / post / put / patch / delete  ->  { data, status }
 *
 * - VITE_USE_MOCK=true  -> requests are answered by the local mock adapter (lazy-loaded, never shipped otherwise)
 * - VITE_USE_MOCK=false -> real HTTP to VITE_API_URL
 * - Bearer token is attached automatically; a 401 on an existing session signs the user out.
 * - Concurrent identical GETs share one request, and public catalogue GETs are cached for a few seconds
 *   (so navigating back or two components asking for the same list costs nothing). Writes clear the cache.
 */
const TIMEOUT = 15000
const PUBLIC_GET = /^\/(products|categories|brands|blogs|content|coupons|config)(\/|\?|$)/
const CACHE_MS = 20000
const cache = new Map() // key -> { exp, data }
const inflight = new Map() // key -> Promise

class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.status = status
    this.details = details
  }
}

const withQuery = (path, params) => {
  if (!params) return path
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null) q.append(k, String(v))
  const s = q.toString()
  return s ? `${path}?${s}` : path
}

// Normalise every failure into an Error with a human readable message + status
function fail(status, body, url) {
  if (status === 401 && storage.get(KEYS.token) && !/^\/auth\/(login|register|2fa\/login)/.test(url)) {
    storage.remove(KEYS.token) // session revoked / expired
    window.dispatchEvent(new Event('mg:unauthorized'))
  }
  const message = (body && typeof body === 'object' && body.message) || (typeof body === 'string' && body.slice(0, 200)) || `Request failed (${status || 'network'})`
  return new ApiError(message, status, body?.errors)
}

async function send(method, path, { params, data, headers = {}, timeout = TIMEOUT, responseType } = {}) {
  const token = storage.get(KEYS.token)
  const h = { ...headers }
  if (token) h.Authorization = `Bearer ${token}`
  const isForm = typeof FormData !== 'undefined' && data instanceof FormData
  if (data !== undefined && !isForm) h['Content-Type'] = 'application/json'
  if (isForm) delete h['Content-Type'] // the browser adds the multipart boundary

  const url = withQuery(path, params)
  if (USE_MOCK) {
    const { mockAdapter } = await import('./mock/mockAdapter')
    const res = await mockAdapter({ method, url, params, data, headers: h }).catch((e) => { throw fail(e.response?.status, e.response?.data, url) })
    return { data: res.data, status: res.status }
  }

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeout)
  let res
  try {
    res = await fetch(API_URL + url, { method: method.toUpperCase(), headers: h, body: data === undefined ? undefined : isForm ? data : JSON.stringify(data), signal: ctrl.signal })
  } catch (e) {
    throw new ApiError(e.name === 'AbortError' ? 'Request timed out. Please try again.' : 'Network error. Please check your connection.')
  } finally {
    clearTimeout(timer)
  }

  let body = null
  if (res.ok && responseType === 'blob') body = await res.blob()
  else if (res.status !== 204) {
    const text = await res.text()
    try { body = text ? JSON.parse(text) : null } catch { body = text }
  }
  if (!res.ok) throw fail(res.status, body, url)
  return { data: body, status: res.status }
}

function get(path, config = {}) {
  const url = withQuery(path, config.params)
  if (!PUBLIC_GET.test(path) || config.responseType) return send('get', path, config)
  const hit = cache.get(url)
  if (hit && hit.exp > Date.now()) return Promise.resolve({ data: structuredClone(hit.data), status: 200 })
  if (inflight.has(url)) return inflight.get(url).then((r) => ({ data: structuredClone(r.data), status: r.status }))
  const p = send('get', path, config)
    .then((r) => { cache.set(url, { exp: Date.now() + CACHE_MS, data: r.data }); return r })
    .finally(() => inflight.delete(url))
  inflight.set(url, p)
  return p.then((r) => ({ data: structuredClone(r.data), status: r.status }))
}

const write = (method) => (path, data, config = {}) => send(method, path, { ...config, data })

const api = {
  get,
  post: write('post'),
  put: write('put'),
  patch: write('patch'),
  delete: (path, config) => send('delete', path, config),
  /** Drop cached public data (call after anything that changes the catalogue, stock or content). */
  clearCache: () => cache.clear(),
}

export const unwrap = (res) => res.data
export default api

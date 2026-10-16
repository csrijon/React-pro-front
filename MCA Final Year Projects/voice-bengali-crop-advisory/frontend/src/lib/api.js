// Small API client for the Express backend.
// VITE_API_BASE comes from .env (see .env.example). Never put secrets in
// VITE_* variables — anything starting with VITE_ is visible in the browser.
const BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:4000').replace(/\/+$/, '')

async function request(path, options = {}, timeoutMs = 20000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'content-type': 'application/json', ...(options.headers || {}) },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const err = new Error(data.message || `HTTP ${res.status}`)
      err.status = res.status
      err.code = data.error
      throw err
    }
    return data
  } catch (e) {
    if (e?.name === 'AbortError') {
      const err = new Error('সার্ভার সময়মতো উত্তর দেয়নি। আবার চেষ্টা করুন।')
      err.code = 'TIMEOUT'
      throw err
    }
    if (e?.status) throw e
    const err = new Error('সার্ভারের সাথে সংযোগ হয়নি। ব্যাকএন্ড চালু আছে কিনা দেখুন।')
    err.code = 'NETWORK'
    throw err
  } finally {
    clearTimeout(timer)
  }
}

export const getAdvice = (payload) =>
  request('/api/advice', { method: 'POST', body: JSON.stringify(payload) })

export const getHealth = () => request('/api/health')

export const getCropGuide = () => request('/api/crop-guide')

export const getWeather = () => request('/api/weather')

export const apiBase = BASE

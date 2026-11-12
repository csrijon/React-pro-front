import axios from 'axios'
import { mockAdapter } from './mock/mockAdapter'
import { storage, KEYS } from '../utils/storage'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

/**
 * Single axios instance used by every service.
 * - VITE_USE_MOCK=true  -> requests are answered by the local mock adapter
 * - VITE_USE_MOCK=false -> requests go to VITE_API_URL
 */
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  ...(USE_MOCK ? { adapter: mockAdapter } : {}),
})

api.interceptors.request.use((config) => {
  const token = storage.get(KEYS.token)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Normalise every failure into an Error with a human readable message + status
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status
    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? 'Request timed out. Please try again.' : null) ||
      (!error.response ? 'Network error. Please check your connection.' : error.message)
    const err = new Error(message)
    err.status = status
    err.details = error.response?.data?.errors
    return Promise.reject(err)
  },
)

export const unwrap = (res) => res.data
export default api

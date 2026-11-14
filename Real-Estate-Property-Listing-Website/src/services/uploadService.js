import { API_URL, USE_MOCK } from './config'
import { fileToDataUrl } from '../utils/images'

/** Uploads image files and returns their URLs. In mock mode returns compact data URLs instead. */
export async function uploadImages(files, { max = 1000, png = false } = {}) {
  if (USE_MOCK) return Promise.all(files.map((f) => fileToDataUrl(f, max, png ? 'image/png' : 'image/jpeg')))
  const fd = new FormData()
  files.forEach((f) => fd.append('images', f))
  const res = await fetch(`${API_URL}/uploads`, { method: 'POST', body: fd })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Image upload failed')
  return data.urls
}

import { USE_MOCK, http } from './config'
import { createStore } from './mockStore'
import { reviews as seed } from '../data/reviews'
import { uid } from '../utils/format'

const store = createStore('reviews', seed)

/** Customer reviews of the company. Visitors see published ones; new reviews wait for admin approval. */
export const reviewService = {
  async published() { if (!USE_MOCK) return http('/reviews'); return (await store.all()).filter((r) => r.status === 'Published').sort((a, b) => new Date(b.date) - new Date(a.date)) },
  async all() { if (!USE_MOCK) return http('/reviews?all=1'); return (await store.all()).sort((a, b) => new Date(b.date) - new Date(a.date)) },
  add: (d) => (USE_MOCK ? store.add({ id: uid('r'), date: new Date().toISOString().slice(0, 10), status: 'Pending', ...d }) : http('/reviews', { method: 'POST', body: d })),
  update: (id, d) => (USE_MOCK ? store.update(id, d) : http(`/reviews/${id}`, { method: 'PUT', body: d })),
  remove: (id) => (USE_MOCK ? store.remove(id) : http(`/reviews/${id}`, { method: 'DELETE' })),
}

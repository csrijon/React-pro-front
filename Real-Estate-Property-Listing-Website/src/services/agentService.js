import { USE_MOCK, http, delay } from './config'
import { createStore } from './mockStore'
import { agents, agentReviews } from '../data/agents'
import { uid } from '../utils/format'

const store = createStore('agents', agents)
const reviews = createStore('reviews', agentReviews)

export const agentService = {
  list: () => (USE_MOCK ? store.all() : http('/agents')),
  get: (id) => (USE_MOCK ? store.get(id) : http(`/agents/${id}`)),
  create: (d) => (USE_MOCK ? store.add({ id: uid('a'), rating: 0, reviews: 0, ...d }) : http('/agents', { method: 'POST', body: d })),
  update: (id, d) => (USE_MOCK ? store.update(id, d) : http(`/agents/${id}`, { method: 'PUT', body: d })),
  remove: (id) => (USE_MOCK ? store.remove(id) : http(`/agents/${id}`, { method: 'DELETE' })),
  reviews: async (agentId) => {
    if (!USE_MOCK) return http(`/agents/${agentId}/reviews`)
    const all = await reviews.all()
    return agentId ? all.filter((r) => r.agentId === agentId) : all
  },
  updateReview: (id, d) => (USE_MOCK ? reviews.update(id, d) : http(`/reviews/${id}`, { method: 'PUT', body: d })),
  removeReview: (id) => (USE_MOCK ? reviews.remove(id) : http(`/reviews/${id}`, { method: 'DELETE' })),
  addReview: async (agentId, d) => (USE_MOCK ? reviews.add({ id: uid('r'), agentId, date: new Date().toISOString().slice(0, 10), status: 'Pending', ...d }) : (await delay(0), http(`/agents/${agentId}/reviews`, { method: 'POST', body: d }))),
}

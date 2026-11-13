import { USE_MOCK, http } from './config'
import { createStore } from './mockStore'
import { properties } from '../data/properties'
import { uid } from '../utils/format'

const store = createStore('properties', properties)

export const propertyService = {
  list: () => (USE_MOCK ? store.all() : http('/properties')),
  get: (id) => (USE_MOCK ? store.get(id) : http(`/properties/${id}`)),
  create: (data) => (USE_MOCK
    ? store.add({ id: uid('p'), views: 0, createdAt: new Date().toISOString().slice(0, 10), state: 'West Bengal', ...data, status: data.purpose === 'Rent' ? 'For Rent' : 'For Sale' })
    : http('/properties', { method: 'POST', body: data })),
  update: (id, data) => (USE_MOCK
    ? store.update(id, { ...data, ...(data.purpose ? { status: data.purpose === 'Rent' ? 'For Rent' : 'For Sale' } : {}) })
    : http(`/properties/${id}`, { method: 'PUT', body: data })),
  remove: (id) => (USE_MOCK ? store.remove(id) : http(`/properties/${id}`, { method: 'DELETE' })),
  submitListing: (data) => (USE_MOCK
    ? new Promise((r) => setTimeout(() => r({ ok: true, reference: uid('LST').toUpperCase() }), 900))
    : http('/property-submissions', { method: 'POST', body: data })),
}

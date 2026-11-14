import { USE_MOCK, http } from './config'
import { createStore } from './mockStore'
import { propertyService } from './propertyService'
import { authService } from './authService'
import { uid } from '../utils/format'

const store = createStore('submissions', [])

/** Owner submissions. Nothing is published until an admin approves; approved listings go out under the site's own name. */
export const submissionService = {
  submit: async (d) => {
    if (!USE_MOCK) return http('/property-submissions', { method: 'POST', body: d })
    const reference = `LST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    await store.add({ id: uid('sub'), status: 'Pending', adminNote: '', reference, createdAt: new Date().toISOString(), userEmail: authService.current()?.email, ...d })
    return { ok: true, reference }
  },
  mine: async () => {
    if (!USE_MOCK) return http('/me/submissions')
    const me = authService.current()?.email
    return (await store.all()).filter((s) => s.userEmail === me)
  },
  list: () => (USE_MOCK ? store.all() : http('/property-submissions')),
  reject: (id, adminNote) => (USE_MOCK ? store.update(id, { status: 'Rejected', adminNote }) : http(`/property-submissions/${id}`, { method: 'PUT', body: { status: 'Rejected', adminNote } })),
  approve: async (id, { edits, images }) => {
    if (!USE_MOCK) return http(`/property-submissions/${id}/approve`, { method: 'POST', body: { edits, images } })
    const sub = await store.get(id)
    const { id: _i, status, adminNote, reference, createdAt, userEmail, ownerName, phone, email, ...listing } = sub // owner details are not published
    const property = await propertyService.create({ ...listing, ...edits, images: images?.length ? images : sub.images, parking: 0, furnishing: 'Unfurnished', propertyStatus: 'Ready to Move', featured: false })
    await store.update(id, { status: 'Approved', adminNote: '' })
    return { property }
  },
  remove: (id) => (USE_MOCK ? store.remove(id) : http(`/property-submissions/${id}`, { method: 'DELETE' })),
}

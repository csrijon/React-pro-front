import api, { unwrap } from './api'

/**
 * Admin API (requires a user with role "admin"; needs the real backend - not available in mock mode).
 * Every list endpoint accepts ?q&page&limit and returns { items, total, page, pages }.
 */
const fresh = (r) => { api.clearCache(); return r.data }

const adminService = {
  stats: () => api.get('/admin/stats').then(unwrap),
  list: (resource, params) => api.get(`/admin/${resource}`, { params }).then(unwrap),
  get: (resource, id) => api.get(`/admin/${resource}/${id}`).then(unwrap),
  // every admin write drops cached storefront data so the admin sees their change immediately
  create: (resource, data) => api.post(`/admin/${resource}`, data).then(fresh),
  update: (resource, id, data) => api.put(`/admin/${resource}/${id}`, data).then(fresh),
  remove: (resource, id) => api.delete(`/admin/${resource}/${id}`).then(fresh),
  // orders use PATCH + the public order id
  updateOrder: (id, data) => api.patch(`/admin/orders/${id}`, data).then(fresh),
  upload: (files) => {
    const fd = new FormData()
    ;[...files].forEach((f) => fd.append('images', f))
    return api.post('/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 }).then((r) => r.data.urls)
  },
  exportSubscribers: () => api.get('/admin/subscribers-export/csv', { responseType: 'blob' }).then(unwrap),
}

export default adminService

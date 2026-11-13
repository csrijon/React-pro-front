import api, { unwrap } from './api'

/**
 * Admin API (requires a user with role "admin"; needs the real backend - not available in mock mode).
 * Every list endpoint accepts ?q&page&limit and returns { items, total, page, pages }.
 */
// After any admin write: drop cached storefront data, and tell the app when brands/categories changed so menus,
// filters and the product form's dropdowns reload (otherwise a brand you just added can't be selected).
const fresh = (resource) => (r) => {
  api.clearCache()
  if (resource === 'brands' || resource === 'categories') window.dispatchEvent(new Event('mg:catalog-changed'))
  return r.data
}

const adminService = {
  stats: () => api.get('/admin/stats').then(unwrap),
  list: (resource, params) => api.get(`/admin/${resource}`, { params }).then(unwrap),
  get: (resource, id) => api.get(`/admin/${resource}/${id}`).then(unwrap),
  // every admin write drops cached storefront data so the admin sees their change immediately
  create: (resource, data) => api.post(`/admin/${resource}`, data).then(fresh(resource)),
  update: (resource, id, data) => api.put(`/admin/${resource}/${id}`, data).then(fresh(resource)),
  remove: (resource, id) => api.delete(`/admin/${resource}/${id}`).then(fresh(resource)),
  // orders use PATCH + the public order id
  updateOrder: (id, data) => api.patch(`/admin/orders/${id}`, data).then(fresh('orders')),
  upload: (files) => {
    const fd = new FormData()
    ;[...files].forEach((f) => fd.append('images', f))
    return api.post('/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 }).then((r) => r.data.urls)
  },
  exportSubscribers: () => api.get('/admin/subscribers-export/csv', { responseType: 'blob' }).then(unwrap),
}

export default adminService

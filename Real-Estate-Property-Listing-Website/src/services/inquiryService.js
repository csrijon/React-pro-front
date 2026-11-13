import { USE_MOCK, http, delay } from './config'
import { createStore } from './mockStore'
import { inquiries, appointments, customers, users, testimonials } from '../data/misc'
import { uid } from '../utils/format'

const inq = createStore('inquiries', inquiries)
const apt = createStore('appointments', appointments)
const cust = createStore('customers', customers)
const usr = createStore('users', users)

export const inquiryService = {
  list: () => (USE_MOCK ? inq.all() : http('/inquiries')),
  update: (id, d) => (USE_MOCK ? inq.update(id, d) : http(`/inquiries/${id}`, { method: 'PUT', body: d })),
  remove: (id) => (USE_MOCK ? inq.remove(id) : http(`/inquiries/${id}`, { method: 'DELETE' })),
  // Public enquiry (property, project, agent or contact form)
  submit: (d) => (USE_MOCK ? inq.add({ id: uid('q'), status: 'New', createdAt: new Date().toISOString(), property: d.property || 'General enquiry', ...d }) : http('/inquiries', { method: 'POST', body: d })),
  subscribe: async (email) => (USE_MOCK ? (await delay(500), { ok: true }) : http('/newsletter', { method: 'POST', body: { email } })),
  testimonials: async () => (USE_MOCK ? testimonials : http('/testimonials')),
  appointments: {
    list: () => (USE_MOCK ? apt.all() : http('/appointments')),
    create: (d) => (USE_MOCK ? apt.add({ id: uid('ap'), status: 'Pending', ...d }) : http('/appointments', { method: 'POST', body: d })),
    update: (id, d) => (USE_MOCK ? apt.update(id, d) : http(`/appointments/${id}`, { method: 'PUT', body: d })),
    remove: (id) => (USE_MOCK ? apt.remove(id) : http(`/appointments/${id}`, { method: 'DELETE' })),
  },
  customers: { list: () => (USE_MOCK ? cust.all() : http('/customers')), remove: (id) => (USE_MOCK ? cust.remove(id) : http(`/customers/${id}`, { method: 'DELETE' })) },
  users: { list: () => (USE_MOCK ? usr.all() : http('/users')), update: (id, d) => (USE_MOCK ? usr.update(id, d) : http(`/users/${id}`, { method: 'PUT', body: d })) },
}

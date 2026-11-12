import api, { unwrap } from './api'

/**
 *   POST /orders      {items, address, billing, delivery, payment, totals, coupon} -> Order
 *   GET  /orders                                                                    -> Order[]
 *   GET  /orders/:id                                                                -> Order
 * Payments are NOT processed here; the backend should create a payment intent and return its status.
 */
const orderService = {
  create: (payload) => api.post('/orders', payload).then(unwrap),
  list: () => api.get('/orders').then(unwrap),
  get: (id) => api.get(`/orders/${id}`).then(unwrap),
}

export default orderService

import api, { unwrap } from './api'

/**
 *   POST /orders      {items, address, billing, delivery, payment, totals, coupon} -> Order
 *   GET  /orders                                                                    -> Order[]
 *   GET  /orders/:id                                                                -> Order
 * Payments are NOT processed here; the backend should create a payment intent and return its status.
 */
const orderService = {
  // an order changes stock, so cached catalogue data is dropped
  create: (payload) => api.post('/orders', payload).then((r) => { api.clearCache(); return r.data }),
  list: () => api.get('/orders').then(unwrap),
  get: (id) => api.get(`/orders/${id}`).then(unwrap),
  cancel: (id) => api.post(`/orders/${id}/cancel`).then(unwrap),
  // after the Razorpay popup succeeds: {razorpay_order_id, razorpay_payment_id, razorpay_signature}
  verifyPayment: (id, data) => api.post(`/orders/${id}/verify-payment`, data).then(unwrap),
}

export default orderService

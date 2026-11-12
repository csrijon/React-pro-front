import api, { unwrap } from './api'

/**
 *   GET  /cart                 -> { items, coupon }
 *   PUT  /cart  {items,coupon} -> { items, coupon }     (replace the whole cart)
 *   POST /cart/coupon {code, subtotal} -> Coupon        (validate a coupon)
 *   GET  /coupons              -> Coupon[]
 */
const cartService = {
  get: () => api.get('/cart').then(unwrap),
  save: (cart) => api.put('/cart', cart).then(unwrap),
  validateCoupon: (code, subtotal) => api.post('/cart/coupon', { code, subtotal }).then(unwrap),
  coupons: () => api.get('/coupons').then(unwrap),
}

export default cartService

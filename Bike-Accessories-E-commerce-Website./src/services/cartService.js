import api, { unwrap } from './api'
import { storage, KEYS } from '../utils/storage'

/**
 *   GET  /cart                 -> { items, coupon }
 *   PUT  /cart  {items,coupon} -> { items, coupon }     (replace the whole cart)
 *   POST /cart/coupon {code, subtotal} -> Coupon        (validate a coupon)
 *   GET  /coupons              -> Coupon[]
 */
const cartService = {
  get: () => api.get('/cart').then(unwrap),
  // guests keep their cart in the browser only; signed-in carts are also synced to the server
  save: (cart) => (storage.get(KEYS.token) ? api.put('/cart', cart).then(unwrap) : Promise.resolve(cart)),
  validateCoupon: (code, subtotal) => api.post('/cart/coupon', { code, subtotal }).then(unwrap),
  coupons: () => api.get('/coupons').then(unwrap),
}

export default cartService

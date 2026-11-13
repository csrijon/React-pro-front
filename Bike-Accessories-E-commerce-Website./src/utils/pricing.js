export const FREE_SHIPPING_ABOVE = 999
export const STANDARD_SHIPPING = 79

export const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', eta: '4-6 business days', price: 0, note: 'Free above ₹999 (else ₹79)' },
  { id: 'express', label: 'Express Delivery', eta: '2-3 business days', price: 149, note: 'Priority dispatch' },
  { id: 'nextday', label: 'Next-Day Delivery', eta: 'Next business day', price: 299, note: 'Metro cities only' },
]

/**
 * Pure pricing calculation used by cart, checkout and order summary.
 * coupon shape: { code, type: 'percent'|'flat'|'shipping', value, minOrder, maxDiscount }
 */
export function calcTotals(items, coupon = null, deliveryId = 'standard') {
  const mrpTotal = items.reduce((s, i) => s + i.mrp * i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const productDiscount = mrpTotal - subtotal

  let couponDiscount = 0
  let freeShippingCoupon = false
  if (coupon && subtotal >= (coupon.minOrder || 0)) {
    if (coupon.type === 'percent') {
      couponDiscount = Math.round((subtotal * coupon.value) / 100)
      if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount)
    } else if (coupon.type === 'flat') couponDiscount = Math.min(coupon.value, subtotal)
    else if (coupon.type === 'shipping') freeShippingCoupon = true
  }

  const delivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryId) || DELIVERY_OPTIONS[0]
  const afterCoupon = subtotal - couponDiscount
  let shipping = 0
  if (items.length) {
    if (delivery.id === 'standard') shipping = afterCoupon >= FREE_SHIPPING_ABOVE || freeShippingCoupon ? 0 : STANDARD_SHIPPING
    else shipping = freeShippingCoupon ? Math.max(delivery.price - STANDARD_SHIPPING, 0) : delivery.price
  }

  return {
    count: items.reduce((s, i) => s + i.qty, 0),
    mrpTotal,
    subtotal,
    productDiscount,
    couponDiscount,
    totalDiscount: productDiscount + couponDiscount,
    shipping,
    total: Math.max(afterCoupon + shipping, 0),
    freeShippingLeft: Math.max(FREE_SHIPPING_ABOVE - afterCoupon, 0),
  }
}

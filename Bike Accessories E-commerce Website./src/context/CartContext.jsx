import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import cartService from '../services/cartService'
import { calcTotals } from '../utils/pricing'
import { clamp } from '../utils/format'
import { storage, KEYS } from '../utils/storage'

const CartContext = createContext(null)
const MAX_QTY = 10

export const lineKey = (id, size, color) => `${id}|${size || '-'}|${color || '-'}`

export function CartProvider({ children }) {
  const initial = storage.get(KEYS.cart, { items: [], coupon: null })
  const [items, setItems] = useState(initial.items || [])
  const [coupon, setCoupon] = useState(initial.coupon || null)
  const [delivery, setDelivery] = useState('standard')
  const [bump, setBump] = useState(0) // increments on add -> header cart badge animates
  const first = useRef(true)

  // Persist through the service layer (local mock now, real API later)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    storage.set(KEYS.cart, { items, coupon })
    cartService.save({ items, coupon }).catch(() => {})
  }, [items, coupon])

  const addItem = useCallback((product, { qty = 1, size = null, color = null } = {}) => {
    const colorName = color || product.colors?.[0]?.name || null
    const key = lineKey(product.id, size, colorName)
    setItems((prev) => {
      const found = prev.find((i) => i.key === key)
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: clamp(i.qty + qty, 1, MAX_QTY) } : i))
      return [
        ...prev,
        {
          key, id: product.id, slug: product.slug, name: product.name, brandName: product.brandName,
          price: product.price, mrp: product.mrp, art: product.art, category: product.category,
          colorName, colorHex: product.colors?.find((c) => c.name === colorName)?.hex || product.colors?.[0]?.hex,
          size, qty: clamp(qty, 1, MAX_QTY),
        },
      ]
    })
    setBump((b) => b + 1)
  }, [])

  const updateQty = useCallback((key, qty) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: clamp(qty, 1, MAX_QTY) } : i)))
  }, [])
  const removeItem = useCallback((key) => setItems((prev) => prev.filter((i) => i.key !== key)), [])
  const clear = useCallback(() => {
    setItems([])
    setCoupon(null)
    setDelivery('standard')
  }, [])

  const totals = useMemo(() => calcTotals(items, coupon, delivery), [items, coupon, delivery])

  // Re-validate coupon whenever the subtotal changes (e.g. min order no longer met)
  const couponValid = !coupon || totals.subtotal >= (coupon.minOrder || 0)

  const applyCoupon = useCallback(
    async (code) => {
      const c = await cartService.validateCoupon(code, totals.subtotal)
      setCoupon(c)
      return c
    },
    [totals.subtotal],
  )
  const removeCoupon = useCallback(() => setCoupon(null), [])

  const value = useMemo(
    () => ({
      items, count: totals.count, totals, coupon: couponValid ? coupon : null, couponInvalid: !couponValid,
      delivery, setDelivery, bump, addItem, updateQty, removeItem, clear, applyCoupon, removeCoupon,
    }),
    [items, totals, coupon, couponValid, delivery, bump, addItem, updateQty, removeItem, clear, applyCoupon, removeCoupon],
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

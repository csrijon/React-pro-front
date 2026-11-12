import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import wishlistService from '../services/wishlistService'
import { storage, KEYS } from '../utils/storage'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => storage.get(KEYS.wishlist, []))

  const persist = (next) => {
    storage.set(KEYS.wishlist, next)
    wishlistService.save(next).catch(() => {})
  }

  const toggle = useCallback(
    (product) => {
      const has = ids.includes(product.id)
      const next = has ? ids.filter((x) => x !== product.id) : [...ids, product.id]
      setIds(next)
      persist(next)
      toast.success(has ? 'Removed from wishlist' : 'Added to wishlist', { icon: has ? '💔' : '❤️', id: `wl-${product.id}` })
    },
    [ids],
  )

  const remove = useCallback(
    (id) => {
      const next = ids.filter((x) => x !== id)
      setIds(next)
      persist(next)
    },
    [ids],
  )

  const value = useMemo(() => ({ ids, count: ids.length, has: (id) => ids.includes(id), toggle, remove }), [ids, toggle, remove])
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}

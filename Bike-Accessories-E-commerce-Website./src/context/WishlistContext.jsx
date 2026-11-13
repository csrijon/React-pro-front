import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'
import wishlistService from '../services/wishlistService'
import { storage, KEYS } from '../utils/storage'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => storage.get(KEYS.wishlist, []))

  const { user } = useAuth()

  // merge the server wishlist with what was saved while browsing as a guest
  useEffect(() => {
    if (!user) return
    let off = false
    wishlistService.get().then((server) => {
      if (off || !Array.isArray(server)) return
      setIds((cur) => {
        const merged = [...new Set([...server, ...cur])]
        storage.set(KEYS.wishlist, merged)
        return merged
      })
    }).catch(() => {})
    return () => { off = true }
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

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

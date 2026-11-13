import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'

const WishlistContext = createContext(null)
const KEY = 'estatehub:wishlist'

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => { try { const v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : [] } catch { return [] } })
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(ids)) } catch { /* ignore */ } }, [ids])
  const toggle = useCallback((id) => {
    setIds((cur) => {
      const has = cur.includes(id)
      toast(has ? 'Removed from wishlist' : 'Saved to wishlist')
      return has ? cur.filter((i) => i !== id) : [...cur, id]
    })
  }, [])
  const remove = useCallback((id) => setIds((c) => c.filter((i) => i !== id)), [])
  const value = useMemo(() => ({ ids, toggle, remove, has: (id) => ids.includes(id), count: ids.length }), [ids, toggle, remove])
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
export const useWishlist = () => useContext(WishlistContext)

import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { toast } from 'sonner'
import { useAuth } from './AuthContext'
import { accountService } from '../services/accountService'
import { USE_MOCK } from '../services/config'

const WishlistContext = createContext(null)
const KEY = 'estatehub:wishlist'

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [ids, setIds] = useState(() => { try { const v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : [] } catch { return [] } })
  const idsRef = useRef(ids)
  idsRef.current = ids
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(ids)) } catch { /* ignore */ } }, [ids])

  // Logged-in users: merge the device's wishlist into their account and use the account copy.
  useEffect(() => {
    if (USE_MOCK || !user) return
    accountService.wishlist.sync(idsRef.current).then(setIds).catch(() => {})
  }, [user])

  const server = !USE_MOCK && !!user
  const toggle = useCallback((id) => {
    const has = idsRef.current.includes(id)
    setIds((cur) => (has ? cur.filter((i) => i !== id) : [...cur, id]))
    toast(has ? 'Removed from wishlist' : 'Saved to wishlist')
    if (server) (has ? accountService.wishlist.remove(id) : accountService.wishlist.add(id)).catch(() => toast.error('Could not update your saved list. Try again.'))
  }, [server])
  const remove = useCallback((id) => {
    setIds((c) => c.filter((i) => i !== id))
    if (server) accountService.wishlist.remove(id).catch(() => {})
  }, [server])
  const value = useMemo(() => ({ ids, toggle, remove, has: (id) => ids.includes(id), count: ids.length }), [ids, toggle, remove])
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
export const useWishlist = () => useContext(WishlistContext)

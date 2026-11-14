import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'

const CompareContext = createContext(null)
const KEY = 'estatehub:compare'
export const MAX_COMPARE = 3

export function CompareProvider({ children }) {
  const [ids, setIds] = useState(() => { try { const v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : [] } catch { return [] } })
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(ids)) } catch { /* ignore */ } }, [ids])
  const toggle = useCallback((id) => {
    setIds((cur) => cur.includes(id) ? cur.filter((i) => i !== id) : cur.length >= MAX_COMPARE ? (toast.error(`You can compare up to ${MAX_COMPARE} properties`), cur) : [...cur, id])
  }, [])
  const clear = useCallback(() => setIds([]), [])
  const value = useMemo(() => ({ ids, toggle, clear, has: (id) => ids.includes(id) }), [ids, toggle, clear])
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}
export const useCompare = () => useContext(CompareContext)

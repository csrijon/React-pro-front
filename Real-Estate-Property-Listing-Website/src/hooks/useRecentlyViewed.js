import { useCallback, useState } from 'react'
const KEY = 'estatehub:recent'
const read = () => { try { const v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : [] } catch { return [] } }

export function useRecentlyViewed() {
  const [ids, setIds] = useState(read)
  const add = useCallback((id) => {
    const next = [id, ...read().filter((i) => i !== id)].slice(0, 8)
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* ignore */ }
    setIds(next)
  }, [])
  return { ids, add }
}

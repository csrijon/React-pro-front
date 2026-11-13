import { useCallback } from 'react'
import { storage, KEYS } from '../utils/storage'

const MAX = 8

export const getRecentIds = () => storage.get(KEYS.recent, [])

export default function useRecentlyViewed() {
  const track = useCallback((id) => {
    const next = [id, ...getRecentIds().filter((x) => x !== id)].slice(0, MAX)
    storage.set(KEYS.recent, next)
  }, [])
  return { track, get: getRecentIds }
}

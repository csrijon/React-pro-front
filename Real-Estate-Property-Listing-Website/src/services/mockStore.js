import { delay } from './config'

// In-memory + localStorage-backed collection so admin CRUD survives reloads in demo mode.
export function createStore(key, seed) {
  const k = `estatehub:mock:${key}`
  let items
  try { items = JSON.parse(localStorage.getItem(k)) } catch { items = null }
  if (!Array.isArray(items)) items = structuredClone(seed)
  const persist = () => { try { localStorage.setItem(k, JSON.stringify(items)) } catch { /* quota */ } }
  return {
    async all() { await delay(); return [...items] },
    async get(id) { await delay(200); return items.find((i) => i.id === id) || null },
    async add(item) { await delay(250); items = [item, ...items]; persist(); return item },
    async update(id, patch) {
      await delay(250)
      let out = null
      items = items.map((i) => (i.id === id ? (out = { ...i, ...patch }) : i))
      if (!out) throw new Error('Record not found')
      persist(); return out
    },
    async remove(id) { await delay(250); items = items.filter((i) => i.id !== id); persist(); return true },
  }
}

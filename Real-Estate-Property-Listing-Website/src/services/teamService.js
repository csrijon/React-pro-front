import { USE_MOCK, http, delay } from './config'
import { createStore } from './mockStore'
import { team as seed } from '../data/team'
import { DEFAULT_TEAM_ROLES } from '../data/siteDefaults'
import { uid } from '../utils/format'

const store = createStore('team', seed)
const ROLES_KEY = 'estatehub:mock:teamRoles'
const readRoles = () => { try { const v = JSON.parse(localStorage.getItem(ROLES_KEY)); return Array.isArray(v) && v.length ? v : DEFAULT_TEAM_ROLES } catch { return DEFAULT_TEAM_ROLES } }
const sorted = (a) => [...a].sort((x, y) => (x.order ?? 0) - (y.order ?? 0))

/** The company's team and the owner's custom roles. */
export const teamService = {
  async list({ all = false } = {}) {
    if (!USE_MOCK) return http(`/team${all ? '?all=1' : ''}`)
    const items = sorted(await store.all())
    return all ? items : items.filter((m) => m.visible)
  },
  async create(d) {
    if (!USE_MOCK) return http('/team', { method: 'POST', body: d })
    const items = await store.all()
    return store.add({ id: uid('tm'), visible: true, order: items.length, ...d })
  },
  update: (id, d) => (USE_MOCK ? store.update(id, d) : http(`/team/${id}`, { method: 'PUT', body: d })),
  remove: (id) => (USE_MOCK ? store.remove(id) : http(`/team/${id}`, { method: 'DELETE' })),
  async reorder(ids) {
    if (!USE_MOCK) return http('/team/order', { method: 'PUT', body: { ids } })
    await Promise.all(ids.map((id, order) => store.update(id, { order })))
  },
  roles: {
    async get() { if (!USE_MOCK) return http('/team/roles'); await delay(100); return readRoles() },
    async save({ roles, renames = {} }) {
      if (!USE_MOCK) return http('/team/roles', { method: 'PUT', body: { roles, renames } })
      const before = readRoles()
      const items = await store.all()
      const renamed = Object.entries(renames).filter(([f, t]) => before.includes(f) && roles.includes(t) && f !== t)
      for (const x of before.filter((b) => !roles.includes(b) && !renamed.some(([f]) => f === b))) {
        const n = items.filter((m) => m.role === x).length
        if (n) throw new Error(`You cannot remove the role "${x}": ${n} team ${n === 1 ? 'member has' : 'members have'} it. Move them to another role first.`)
      }
      for (const [f, t] of renamed) for (const m of items.filter((i) => i.role === f)) await store.update(m.id, { role: t })
      localStorage.setItem(ROLES_KEY, JSON.stringify(roles))
      return roles
    },
  },
}

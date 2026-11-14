import { ActivityLog } from '../models/activity.js'

const SKIP = new Set(['_id', 'id', '__v', 'createdAt', 'updatedAt', 'passwordHash', 'resetTokenHash', 'resetExpires'])
const short = (v) => {
  if (Array.isArray(v)) return v.length && typeof v[0] === 'string' && v.join('').length > 120 ? `${v.length} items` : v.map(String).join(', ').slice(0, 120)
  if (v && typeof v === 'object') return String(v).length < 40 && v._bsontype ? String(v) : '[object]'
  const s = v === undefined || v === null || v === '' ? '(empty)' : String(v)
  return s.length > 120 ? `${s.slice(0, 117)}…` : s
}

/** Field-by-field changes between a document before and after an edit: { price: ['100', '120'] } */
export function diff(before, after, keys) {
  const a = before?.toObject ? before.toObject() : before || {}
  const b = after?.toObject ? after.toObject() : after || {}
  const out = {}
  for (const k of keys || Object.keys(b)) {
    if (SKIP.has(k)) continue
    if (short(a[k]) !== short(b[k]) || (Array.isArray(a[k]) && JSON.stringify(a[k]) !== JSON.stringify(b[k]))) out[k] = [short(a[k]), short(b[k])]
  }
  return out
}

/** Records who did what. Never throws, never blocks the request. */
export function logActivity(req, { action, entity, entityId, label = '', summary, changes, actor }) {
  const u = actor || req.user
  const hasChanges = changes && Object.keys(changes).length
  ActivityLog.create({
    actor: u?._id, actorName: u?.name || 'Guest', actorRole: u?.role || 'guest', action, entity, entityId: entityId ? String(entityId) : undefined, label: String(label).slice(0, 160),
    summary: String(summary).slice(0, 300), changes: hasChanges ? changes : undefined, ip: req?.ip,
  }).catch((e) => console.error('Activity log failed:', e.message))
}

export const changedList = (c) => (c && Object.keys(c).length ? ` (${Object.keys(c).join(', ')})` : '')

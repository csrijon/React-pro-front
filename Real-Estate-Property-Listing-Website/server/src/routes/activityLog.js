import { Router } from 'express'
import { z } from 'zod'
import { ActivityLog } from '../models/activity.js'
import { requireRole } from '../middleware/auth.js'
import { wrap } from '../utils/asyncHandler.js'

const r = Router()
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Admins see everything; editors can only read the history of a single record they manage.
r.get('/activity-log', requireRole('admin', 'editor'), wrap(async (req, res) => {
  const q = z.object({
    page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(1000).default(25),
    entity: z.string().max(40).optional(), action: z.string().max(40).optional(), actor: z.string().max(80).optional(), entityId: z.string().max(40).optional(),
    q: z.string().max(100).optional(), from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }).parse(req.query)
  if (req.user.role !== 'admin' && !q.entityId) return res.status(403).json({ message: 'Only admins can view the full activity log' })

  const f = {}
  if (req.user.role !== 'admin') f.entity = { $in: ['Property', 'Project', 'TeamMember', 'Post', 'Submission'] } // editors never see user / login records
  if (q.entity) f.entity = req.user.role === 'admin' ? q.entity : { $in: [q.entity].filter((e) => f.entity.$in.includes(e)) }
  if (q.action) f.action = q.action
  if (q.entityId) f.entityId = q.entityId
  if (q.actor) f.actorName = new RegExp(esc(q.actor), 'i')
  if (q.q) f.$or = [{ summary: new RegExp(esc(q.q), 'i') }, { label: new RegExp(esc(q.q), 'i') }]
  if (q.from || q.to) f.createdAt = { ...(q.from && { $gte: new Date(`${q.from}T00:00:00`) }), ...(q.to && { $lte: new Date(`${q.to}T23:59:59.999`) }) }

  const [items, total, entities] = await Promise.all([
    ActivityLog.find(f).sort({ createdAt: -1 }).skip((q.page - 1) * q.limit).limit(q.limit),
    ActivityLog.countDocuments(f),
    q.page === 1 && !q.entityId ? ActivityLog.distinct('entity') : null,
  ])
  res.json({ items, total, page: q.page, pages: Math.max(1, Math.ceil(total / q.limit)), entities })
}))
export default r

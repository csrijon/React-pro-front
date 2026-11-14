import { Router } from 'express'
import mongoose from 'mongoose'
import { z } from 'zod'
import { TeamMember } from '../models/content.js'
import { Setting } from '../models/activity.js'
import { optionalAuth, requireRole, STAFF, isStaff } from '../middleware/auth.js'
import { HttpError, wrap, pick } from '../utils/asyncHandler.js'
import { logActivity, diff, changedList } from '../utils/activity.js'
import { DEFAULT_TEAM_ROLES } from '../config/siteDefaults.js'

const r = Router()
const FIELDS = ['name', 'role', 'photo', 'email', 'phone', 'bio', 'visible']
const roleName = z.string().trim().min(1, 'A role name cannot be empty').max(40, 'Role names can be up to 40 characters')

export async function getRoles() {
  const v = (await Setting.findOne({ key: 'teamRoles' }))?.value
  return Array.isArray(v) && v.length ? v : DEFAULT_TEAM_ROLES
}
const mustBeRole = async (role) => { if (role !== undefined && !(await getRoles()).includes(role)) throw new HttpError(400, `"${role}" is not one of your team roles. Add it under Manage roles first.`) }

/* ---------- Custom roles ---------- */
r.get('/team/roles', wrap(async (_q, res) => res.json(await getRoles())))
r.put('/team/roles', requireRole(...STAFF), wrap(async (req, res) => {
  const d = z.object({
    roles: z.array(roleName).min(1, 'Keep at least one role').max(20, 'You can have up to 20 roles'),
    renames: z.record(z.string(), roleName).default({}), // { "Old name": "New name" }
  }).parse(req.body)
  if (new Set(d.roles.map((x) => x.toLowerCase())).size !== d.roles.length) throw new HttpError(400, 'Role names must be different from each other')
  const before = await getRoles()
  // A rename moves the role's members to the new name; a plain removal is refused while anyone still has that role.
  const renamed = Object.entries(d.renames).filter(([from, to]) => before.includes(from) && d.roles.includes(to) && from !== to)
  const removed = before.filter((x) => !d.roles.includes(x) && !renamed.some(([from]) => from === x))
  for (const x of removed) {
    const n = await TeamMember.countDocuments({ role: x })
    if (n) throw new HttpError(409, `You cannot remove the role "${x}": ${n} team ${n === 1 ? 'member has' : 'members have'} it. Move them to another role first.`)
  }
  for (const [from, to] of renamed) await TeamMember.updateMany({ role: from }, { role: to })
  await Setting.updateOne({ key: 'teamRoles' }, { key: 'teamRoles', value: d.roles }, { upsert: true })
  logActivity(req, { action: 'update', entity: 'TeamRole', label: 'Team roles', summary: `Updated team roles (${d.roles.length})`, changes: { roles: [before.join(', '), d.roles.join(', ')] } })
  res.json(d.roles)
}))

/* ---------- Team members ---------- */
// Visitors only see members marked visible; staff pass ?all=1 to see everyone.
r.get('/team', optionalAuth, wrap(async (req, res) => res.json(await TeamMember.find(isStaff(req.user) && req.query.all === '1' ? {} : { visible: true }).sort({ order: 1, createdAt: 1 }))))

r.post('/team', requireRole(...STAFF), wrap(async (req, res) => {
  const d = pick(req.body, FIELDS)
  await mustBeRole(d.role)
  const last = await TeamMember.findOne().sort({ order: -1 })
  const m = await TeamMember.create({ ...d, order: (last?.order ?? -1) + 1 })
  logActivity(req, { action: 'create', entity: 'TeamMember', entityId: m._id, label: m.name, summary: `Added team member "${m.name}" (${m.role})` })
  res.status(201).json(m)
}))

// Save a new order: body { ids: [...] } lists every member id in the order they should appear.
r.put('/team/order', requireRole(...STAFF), wrap(async (req, res) => {
  const { ids } = z.object({ ids: z.array(z.string()).max(200) }).parse(req.body)
  if (!ids.every((i) => mongoose.isValidObjectId(i))) throw new HttpError(400, 'Invalid team member')
  await Promise.all(ids.map((id, order) => TeamMember.updateOne({ _id: id }, { order })))
  res.json({ ok: true })
}))

r.put('/team/:id', requireRole(...STAFF), wrap(async (req, res) => {
  const d = pick(req.body, FIELDS)
  await mustBeRole(d.role)
  if (d.photo === '') d.photo = undefined
  const before = await TeamMember.findById(req.params.id)
  const m = await TeamMember.findByIdAndUpdate(req.params.id, d, { new: true, runValidators: true })
  if (!m) throw new HttpError(404, 'Team member not found')
  const changes = diff(before, m, FIELDS)
  if (Object.keys(changes).length) logActivity(req, { action: 'update', entity: 'TeamMember', entityId: m._id, label: m.name, summary: `Updated team member "${m.name}"${changedList(changes)}`, changes })
  res.json(m)
}))

r.delete('/team/:id', requireRole(...STAFF), wrap(async (req, res) => {
  const m = await TeamMember.findByIdAndDelete(req.params.id)
  if (m) logActivity(req, { action: 'delete', entity: 'TeamMember', entityId: m._id, label: m.name, summary: `Removed team member "${m.name}"` })
  res.status(204).end()
}))

export default r

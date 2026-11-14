import { Router } from 'express'
import mongoose from 'mongoose'
import { Project } from '../models/content.js'
import { requireRole, STAFF } from '../middleware/auth.js'
import { HttpError, wrap, pick } from '../utils/asyncHandler.js'
import { logActivity, diff, changedList } from '../utils/activity.js'

const r = Router()
const FIELDS = ['name', 'developer', 'location', 'category', 'status', 'priceFrom', 'priceTo', 'units', 'towers', 'possession', 'progress', 'rera', 'configurations', 'amenities', 'images', 'description']

r.get('/', wrap(async (_req, res) => res.json(await Project.find().sort({ createdAt: -1 }))))
r.get('/:id', wrap(async (req, res) => res.json(mongoose.isValidObjectId(req.params.id) ? await Project.findById(req.params.id) : null)))
r.post('/', requireRole(...STAFF), wrap(async (req, res) => {
  const p = await Project.create(pick(req.body, FIELDS))
  logActivity(req, { action: 'create', entity: 'Project', entityId: p._id, label: p.name, summary: `Created project "${p.name}" (${p.status})` })
  res.status(201).json(p)
}))
r.put('/:id', requireRole(...STAFF), wrap(async (req, res) => {
  const before = await Project.findById(req.params.id)
  const p = await Project.findByIdAndUpdate(req.params.id, pick(req.body, FIELDS), { new: true, runValidators: true })
  if (!p) throw new HttpError(404, 'Project not found')
  const changes = diff(before, p, FIELDS)
  if (Object.keys(changes).length) logActivity(req, { action: 'update', entity: 'Project', entityId: p._id, label: p.name, summary: `Updated project "${p.name}"${changedList(changes)}`, changes })
  res.json(p)
}))
r.delete('/:id', requireRole(...STAFF), wrap(async (req, res) => {
  const p = await Project.findByIdAndDelete(req.params.id)
  if (p) logActivity(req, { action: 'delete', entity: 'Project', entityId: p._id, label: p.name, summary: `Deleted project "${p.name}"` })
  res.status(204).end()
}))
export default r

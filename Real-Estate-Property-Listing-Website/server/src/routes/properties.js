import { Router } from 'express'
import mongoose from 'mongoose'
import { Property } from '../models/content.js'
import { ViewLog } from '../models/activity.js'
import { optionalAuth, requireRole, STAFF, isStaff } from '../middleware/auth.js'
import { HttpError, wrap, pick } from '../utils/asyncHandler.js'
import { logActivity, diff, changedList } from '../utils/activity.js'
import { getOptions, mustBeOneOf } from '../utils/siteOptions.js'

const r = Router()
const FIELDS = ['title', 'type', 'purpose', 'status', 'price', 'location', 'city', 'state', 'beds', 'baths', 'parking', 'area', 'furnishing', 'propertyStatus', 'description', 'amenities', 'images', 'featured', 'floor', 'facing', 'yearBuilt', 'lat', 'lng', 'videoUrl', 'floorPlan', 'rooms']
const today = () => new Date().toISOString().slice(0, 10)

r.get('/', optionalAuth, wrap(async (req, res) => {
  const filter = isStaff(req.user) ? {} : { status: { $ne: 'Draft' } }
  res.json(await Property.find(filter).sort({ createdAt: -1 }))
}))

r.get('/:id', optionalAuth, wrap(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.json(null)
  const p = await Property.findById(req.params.id)
  if (!p || (p.status === 'Draft' && !isStaff(req.user))) return res.json(null)
  if (!isStaff(req.user)) { // count public views only
    await Promise.all([Property.updateOne({ _id: p._id }, { $inc: { views: 1 } }), ViewLog.updateOne({ date: today() }, { $inc: { count: 1 } }, { upsert: true })])
  }
  res.json(p)
}))

const body = async (req) => {
  const d = pick(req.body, FIELDS)
  const opts = await getOptions()
  mustBeOneOf(d.type, opts.propertyTypes, 'property type'); mustBeOneOf(d.furnishing, opts.furnishing, 'furnishing option')
  if (d.floorPlan === '') d.floorPlan = undefined
  if (d.purpose && !d.status) d.status = d.purpose === 'Rent' ? 'For Rent' : 'For Sale'
  return d
}
r.post('/', requireRole(...STAFF), wrap(async (req, res) => {
  const p = await Property.create(await body(req))
  logActivity(req, { action: 'create', entity: 'Property', entityId: p._id, label: p.title, summary: `Added property "${p.title}" (${p.status}, ${p.location})` })
  res.status(201).json(p)
}))
r.put('/:id', requireRole(...STAFF), wrap(async (req, res) => {
  const before = await Property.findById(req.params.id)
  const p = await Property.findByIdAndUpdate(req.params.id, await body(req), { new: true, runValidators: true })
  if (!p) throw new HttpError(404, 'Property not found')
  const changes = diff(before, p, FIELDS)
  if (Object.keys(changes).length) logActivity(req, { action: 'update', entity: 'Property', entityId: p._id, label: p.title, summary: `Updated property "${p.title}"${changedList(changes)}`, changes })
  res.json(p)
}))
r.delete('/:id', requireRole(...STAFF), wrap(async (req, res) => {
  const p = await Property.findByIdAndDelete(req.params.id)
  if (p) logActivity(req, { action: 'delete', entity: 'Property', entityId: p._id, label: p.title, summary: `Deleted property "${p.title}"` })
  res.status(204).end()
}))

export default r

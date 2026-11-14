import { Router } from 'express'
import mongoose from 'mongoose'
import crypto from 'node:crypto'
import { z } from 'zod'
import { Inquiry, Appointment, Submission, Newsletter, Setting } from '../models/activity.js'
import { Review, Property } from '../models/content.js'
import { optionalAuth, requireAuth, requireRole, STAFF, isStaff } from '../middleware/auth.js'
import { HttpError, wrap, pick } from '../utils/asyncHandler.js'
import { sendMail } from '../utils/mailer.js'
import { env } from '../config/env.js'
import { getOptions, mustBeOneOf } from '../utils/siteOptions.js'
import { logActivity, diff } from '../utils/activity.js'

const r = Router()
const s = (n, max = 200) => z.string().trim().min(n, n > 1 ? `Must be at least ${n} characters` : 'Required').max(max)
const email = z.string().trim().toLowerCase().email('Enter a valid email address')
const phone = z.string().trim().regex(/^[+\d][\d\s-]{7,14}$/, 'Enter a valid phone number')
const del = (Model, entity, label) => wrap(async (req, res) => {
  const d = await Model.findByIdAndDelete(req.params.id)
  if (d) logActivity(req, { action: 'delete', entity, entityId: d._id, label: label(d), summary: `Deleted ${entity.toLowerCase()} "${label(d)}"` })
  res.status(204).end()
})
const statusChange = (req, entity, before, after, label) => {
  if (before.status !== after.status) logActivity(req, { action: 'update', entity, entityId: after._id, label, summary: `${entity} "${label}" status: ${before.status} → ${after.status}`, changes: { status: [before.status, after.status] } })
}
const notify = (subject, text) => sendMail({ to: env.notifyEmail, subject, text })

/* ---------- Inquiries ---------- */
r.post('/inquiries', optionalAuth, wrap(async (req, res) => {
  const d = z.object({ name: s(2, 80), email, phone, property: s(1).optional(), message: s(10, 2000) }).parse(req.body)
  const q = await Inquiry.create({ ...d, user: req.user?._id })
  logActivity(req, { action: 'create', entity: 'Inquiry', entityId: q._id, label: d.name, summary: `New enquiry from ${d.name} about ${d.property || 'general enquiry'}` })
  notify(`New enquiry from ${d.name}`, `${d.name} (${d.phone}, ${d.email}) asked about ${d.property || 'general enquiry'}:\n\n${d.message}`)
  res.status(201).json(q)
}))
r.get('/inquiries', requireRole(...STAFF), wrap(async (_q, res) => res.json(await Inquiry.find().sort({ createdAt: -1 }))))
r.put('/inquiries/:id', requireRole(...STAFF), wrap(async (req, res) => {
  const d = z.object({ status: z.enum(['New', 'Contacted', 'Converted', 'Closed']) }).parse(req.body)
  const before = await Inquiry.findById(req.params.id)
  const q = await Inquiry.findByIdAndUpdate(req.params.id, d, { new: true }); if (!q) throw new HttpError(404, 'Enquiry not found')
  statusChange(req, 'Inquiry', before, q, q.name); res.json(q)
}))
r.delete('/inquiries/:id', requireRole(...STAFF), del(Inquiry, 'Inquiry', (d) => d.name))

/* ---------- Appointments ---------- */
r.post('/appointments', optionalAuth, wrap(async (req, res) => {
  const d = z.object({ name: s(2, 80), phone, property: s(1), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a valid date'), time: z.string().regex(/^\d{2}:\d{2}$/, 'Pick a time'), notes: s(0, 500).optional() }).parse(req.body)
  if (d.date < new Date().toISOString().slice(0, 10)) throw new HttpError(400, 'Visit date cannot be in the past')
  if (!(await getOptions()).timeSlots.includes(d.time)) throw new HttpError(400, 'Please choose one of the available visit times')
  const clash = await Appointment.exists({ property: d.property, date: d.date, time: d.time, status: { $in: ['Pending', 'Confirmed'] } })
  if (clash) throw new HttpError(409, 'That slot is already booked. Please choose another time.')
  const a = await Appointment.create({ ...d, user: req.user?._id })
  logActivity(req, { action: 'create', entity: 'Appointment', entityId: a._id, label: d.name, summary: `${d.name} booked a visit to ${d.property} on ${d.date} at ${d.time}` })
  notify(`New visit booked: ${d.property}`, `${d.name} (${d.phone}) booked ${d.property} on ${d.date} at ${d.time}.`)
  res.status(201).json(a)
}))
r.get('/appointments', requireRole(...STAFF), wrap(async (_q, res) => res.json(await Appointment.find().sort({ date: 1, time: 1 }))))
r.put('/appointments/:id', requireRole(...STAFF), wrap(async (req, res) => {
  const d = z.object({ status: z.enum(['Pending', 'Confirmed', 'Completed', 'Cancelled']) }).parse(req.body)
  const before = await Appointment.findById(req.params.id)
  const a = await Appointment.findByIdAndUpdate(req.params.id, d, { new: true }); if (!a) throw new HttpError(404, 'Appointment not found')
  statusChange(req, 'Appointment', before, a, `${a.name} – ${a.property}`); res.json(a)
}))
r.delete('/appointments/:id', requireRole(...STAFF), del(Appointment, 'Appointment', (d) => `${d.name} – ${d.property}`))

/* ---------- Customer reviews (of the company) ---------- */
// Visitors see published reviews; staff can pass ?all=1 to see every review for moderation.
r.get('/reviews', optionalAuth, wrap(async (req, res) => res.json(await Review.find(isStaff(req.user) && req.query.all === '1' ? {} : { status: 'Published' }).sort({ date: -1 }))))
r.post('/reviews', optionalAuth, wrap(async (req, res) => {
  const d = z.object({ name: s(2, 80), rating: z.coerce.number().int().min(1).max(5), text: s(10, 1000) }).parse(req.body)
  const v = await Review.create({ ...d, status: 'Pending' }) // held until staff publish it
  logActivity(req, { action: 'create', entity: 'Review', entityId: v._id, label: d.name, summary: `${d.name} left a ${d.rating}-star review (awaiting moderation)` })
  res.status(201).json(v)
}))
r.put('/reviews/:id', requireRole(...STAFF), wrap(async (req, res) => {
  const d = z.object({ status: z.enum(['Pending', 'Published', 'Hidden']) }).parse(req.body)
  const before = await Review.findById(req.params.id)
  const v = await Review.findByIdAndUpdate(req.params.id, d, { new: true }); if (!v) throw new HttpError(404, 'Review not found')
  statusChange(req, 'Review', before, v, `${v.name} (${v.rating}★)`)
  res.json(v)
}))
r.delete('/reviews/:id', requireRole(...STAFF), wrap(async (req, res) => {
  const v = await Review.findByIdAndDelete(req.params.id)
  if (v) logActivity(req, { action: 'delete', entity: 'Review', entityId: v._id, label: v.name, summary: `Deleted review by ${v.name}` })
  res.status(204).end()
}))

/* ---------- Newsletter & testimonials ---------- */
r.post('/newsletter', wrap(async (req, res) => {
  const { email: e } = z.object({ email }).parse(req.body)
  await Newsletter.updateOne({ email: e }, { email: e }, { upsert: true }); res.status(201).json({ ok: true })
}))
r.get('/newsletter', requireRole(...STAFF), wrap(async (_q, res) => res.json(await Newsletter.find().sort({ createdAt: -1 }))))
r.get('/testimonials', wrap(async (_q, res) => res.json((await Setting.findOne({ key: 'testimonials' }))?.value || [])))

/* ---------- Property submissions ----------
   Owners must be logged in. Nothing is published until staff approve it; approved listings are
   published under the website's own name (the company) and never show the owner's details. */
const OVERRIDES = ['title', 'type', 'purpose', 'price', 'location', 'city', 'beds', 'baths', 'area', 'description', 'amenities', 'featured']
r.post('/property-submissions', requireAuth, wrap(async (req, res) => {
  const d = z.object({
    title: s(8), type: s(1, 30), purpose: z.enum(['Buy', 'Rent']), price: z.coerce.number().positive(), location: s(2), city: s(2),
    beds: z.coerce.number().min(0).default(0), baths: z.coerce.number().min(0).default(0), area: z.coerce.number().positive(), description: s(30, 3000),
    amenities: z.array(z.string()).default([]), images: z.array(z.string().url()).min(1, 'Add at least one photo').max(8), ownerName: s(2, 80), phone, email,
  }).parse(req.body)
  mustBeOneOf(d.type, (await getOptions()).propertyTypes, 'property type')
  if ((await Submission.countDocuments({ user: req.user._id, status: 'Pending' })) >= 5) throw new HttpError(429, 'You already have 5 submissions waiting for review. Please wait for them to be reviewed.')
  const reference = `LST-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
  const created = await Submission.create({ ...d, reference, user: req.user._id })
  logActivity(req, { action: 'create', entity: 'Submission', entityId: created._id, label: d.title, summary: `${d.ownerName} submitted "${d.title}" for review (${reference})` })
  notify(`New property submission ${reference}`, `${d.ownerName} (${d.phone}) submitted "${d.title}". Review it in the admin panel.`)
  sendMail({ to: req.user.email, subject: `We received your property (${reference})`, text: `Hi ${d.ownerName},\n\nThanks for submitting "${d.title}". Our team will review it and publish it on EstateHub if approved. We'll email you once it's reviewed.\n\nReference: ${reference}` })
  res.status(201).json({ ok: true, reference })
}))
r.get('/property-submissions', requireRole(...STAFF), wrap(async (_q, res) => res.json(await Submission.find().sort({ createdAt: -1 }))))
r.put('/property-submissions/:id', requireRole(...STAFF), wrap(async (req, res) => {
  const d = z.object({ status: z.literal('Rejected'), adminNote: z.string().trim().min(5, 'Tell the owner why (at least 5 characters)').max(500) }).parse(req.body)
  const sub = await Submission.findById(req.params.id); if (!sub) throw new HttpError(404, 'Submission not found')
  if (sub.status === 'Approved') throw new HttpError(409, 'This listing is already published. Edit or delete it under Properties.')
  sub.status = 'Rejected'; sub.adminNote = d.adminNote; await sub.save()
  logActivity(req, { action: 'reject', entity: 'Submission', entityId: sub._id, label: sub.title, summary: `Rejected submission "${sub.title}" (${sub.reference})`, changes: { reason: ['', d.adminNote] } })
  sendMail({ to: sub.email, subject: `Update on your property submission ${sub.reference}`, text: `Hi ${sub.ownerName},\n\nWe could not publish "${sub.title}" at this time.\n\nReason: ${d.adminNote}\n\nYou are welcome to submit it again with the changes above.` })
  res.json(sub)
}))
r.post('/property-submissions/:id/approve', requireRole(...STAFF), wrap(async (req, res) => {
  const sub = await Submission.findById(req.params.id); if (!sub) throw new HttpError(404, 'Submission not found')
  if (sub.status === 'Approved') throw new HttpError(409, 'Already approved')
  const edits = pick(req.body.edits || {}, OVERRIDES)
  mustBeOneOf(edits.type, (await getOptions()).propertyTypes, 'property type')
  const images = Array.isArray(req.body.images) && req.body.images.length ? req.body.images.filter((u) => sub.images.includes(u)) : sub.images
  // Owner name, phone and email are deliberately NOT copied: the public listing belongs to the website.
  const p = await Property.create({ ...pick(sub.toObject(), [...OVERRIDES.filter((k) => k !== 'featured'), 'images']), ...edits, images: images.length ? images : sub.images, status: (edits.purpose || sub.purpose) === 'Rent' ? 'For Rent' : 'For Sale' })
  sub.status = 'Approved'; sub.property = p._id; sub.adminNote = ''; await sub.save()
  logActivity(req, { action: 'approve', entity: 'Submission', entityId: sub._id, label: sub.title, summary: `Approved submission "${sub.title}" and published it as "${p.title}"`, changes: diff({ title: sub.title, price: sub.price }, { title: p.title, price: p.price }) })
  logActivity(req, { action: 'create', entity: 'Property', entityId: p._id, label: p.title, summary: `Published property "${p.title}" from submission ${sub.reference}` })
  sendMail({ to: sub.email, subject: `Your property is live on EstateHub (${sub.reference})`, text: `Hi ${sub.ownerName},\n\n"${p.title}" has been approved and is now listed on EstateHub.\n\nInterested buyers will contact our team, who will coordinate with you.` })
  res.json({ submission: sub, property: p })
}))
r.delete('/property-submissions/:id', requireRole(...STAFF), del(Submission, 'Submission', (d) => d.title))

export default r

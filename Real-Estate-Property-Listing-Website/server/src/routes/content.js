import { Router } from 'express'
import { z } from 'zod'
import { Post, Setting } from '../models/activity.js'
import { optionalAuth, requireRole, STAFF, isStaff } from '../middleware/auth.js'
import { HttpError, wrap, pick } from '../utils/asyncHandler.js'
import { logActivity, diff, changedList } from '../utils/activity.js'

const r = Router()
const FIELDS = ['title', 'excerpt', 'content', 'cover', 'category', 'author', 'published']
const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
const uniqueSlug = async (title, ignoreId) => {
  const base = slugify(title) || 'post'; let s = base, i = 2
  while (await Post.exists({ slug: s, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) })) s = `${base}-${i++}`
  return s
}

/* Blog */
r.get('/posts', optionalAuth, wrap(async (req, res) => res.json(await Post.find(isStaff(req.user) ? {} : { published: true }).select(isStaff(req.user) ? '' : '-content').sort({ createdAt: -1 }))))
r.get('/posts/:slug', optionalAuth, wrap(async (req, res) => {
  const p = await Post.findOne({ slug: req.params.slug })
  res.json(!p || (!p.published && !isStaff(req.user)) ? null : p)
}))
r.post('/posts', requireRole(...STAFF), wrap(async (req, res) => {
  const d = pick(req.body, FIELDS); const p = await Post.create({ ...d, slug: await uniqueSlug(d.title || '') })
  logActivity(req, { action: 'create', entity: 'Post', entityId: p._id, label: p.title, summary: `${p.published ? 'Published' : 'Drafted'} article "${p.title}"` })
  res.status(201).json(p)
}))
r.put('/posts/:id', requireRole(...STAFF), wrap(async (req, res) => {
  const d = pick(req.body, FIELDS); if (d.title) d.slug = await uniqueSlug(d.title, req.params.id)
  const before = await Post.findById(req.params.id)
  const p = await Post.findByIdAndUpdate(req.params.id, d, { new: true, runValidators: true }); if (!p) throw new HttpError(404, 'Post not found')
  const changes = diff(before, p, [...FIELDS])
  if (Object.keys(changes).length) logActivity(req, { action: 'update', entity: 'Post', entityId: p._id, label: p.title, summary: `Updated article "${p.title}"${changedList(changes)}`, changes: { ...changes, content: changes.content ? ['(edited)', '(edited)'] : undefined } })
  res.json(p)
}))
r.delete('/posts/:id', requireRole(...STAFF), wrap(async (req, res) => {
  const p = await Post.findByIdAndDelete(req.params.id)
  if (p) logActivity(req, { action: 'delete', entity: 'Post', entityId: p._id, label: p.title, summary: `Deleted article "${p.title}"` })
  res.status(204).end()
}))

/* FAQs and testimonials are small admin-edited lists stored as settings */
const list = (key, schema) => {
  r.get(`/${key}`, wrap(async (_q, res) => res.json((await Setting.findOne({ key }))?.value || [])))
  r.put(`/${key}`, requireRole(...STAFF), wrap(async (req, res) => {
    const value = z.array(schema).max(50).parse(req.body)
    await Setting.updateOne({ key }, { key, value }, { upsert: true })
    logActivity(req, { action: 'update', entity: 'FAQ', label: 'FAQs', summary: `Saved FAQs (${value.length} questions)` })
    res.json(value)
  }))
}
list('faqs', z.object({ q: z.string().trim().min(3).max(200), a: z.string().trim().min(3).max(2000) }))
export const testimonialSchema = z.object({ id: z.string().optional(), name: z.string().trim().min(2).max(80), role: z.string().max(120).default(''), avatar: z.string().trim().max(500).refine((u) => u === '' || /^https?:\/\//i.test(u), 'Photo must be an uploaded image or an http(s) link').default(''), rating: z.coerce.number().int().min(1).max(5), text: z.string().trim().min(10).max(600) })
r.put('/testimonials', requireRole(...STAFF), wrap(async (req, res) => {
  const value = z.array(testimonialSchema).max(30).parse(req.body).map((t, i) => ({ ...t, id: t.id || `t${Date.now()}${i}` }))
  await Setting.updateOne({ key: 'testimonials' }, { key: 'testimonials', value }, { upsert: true })
  logActivity(req, { action: 'update', entity: 'Testimonial', label: 'Testimonials', summary: `Saved testimonials (${value.length})` })
  res.json(value)
}))
export default r

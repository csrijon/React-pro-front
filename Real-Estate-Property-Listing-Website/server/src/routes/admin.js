import { Router } from 'express'
import { z } from 'zod'
import { User } from '../models/User.js'
import { ViewLog, Setting } from '../models/activity.js'
import { requireRole } from '../middleware/auth.js'
import { HttpError, wrap } from '../utils/asyncHandler.js'
import { logActivity, diff } from '../utils/activity.js'
import { withDefaults, FONT_CHOICES } from '../config/siteDefaults.js'
import { Property } from '../models/content.js'

const r = Router()
const admin = requireRole('admin')

r.get('/users', admin, wrap(async (_q, res) => res.json(await User.find({ role: { $ne: 'user' } }, '-wishlist -savedSearches').sort({ createdAt: 1 }))))
r.put('/users/:id', admin, wrap(async (req, res) => {
  const d = z.object({ role: z.enum(['editor', 'admin']).optional(), status: z.enum(['Active', 'Inactive']).optional() }).parse(req.body)
  if (req.params.id === String(req.user._id)) throw new HttpError(400, 'You cannot change your own role or status')
  const before = await User.findById(req.params.id)
  const u = await User.findByIdAndUpdate(req.params.id, d, { new: true }); if (!u) throw new HttpError(404, 'User not found')
  const changes = diff(before, u, ['role', 'status'])
  if (Object.keys(changes).length) logActivity(req, { action: 'update', entity: 'User', entityId: u._id, label: u.email, summary: `Changed ${Object.keys(changes).join(' and ')} for ${u.name} (${u.email})`, changes })
  res.json(u)
}))

const customer = (u) => ({ id: String(u._id), name: u.name, email: u.email, phone: u.phone || '–', joined: u.createdAt, saved: u.wishlist.length })
r.get('/customers', requireRole('admin', 'editor'), wrap(async (_q, res) => res.json((await User.find({ role: 'user' }).sort({ createdAt: -1 })).map(customer))))
r.delete('/customers/:id', admin, wrap(async (req, res) => {
  const u = await User.findOneAndDelete({ _id: req.params.id, role: 'user' })
  if (u) logActivity(req, { action: 'delete', entity: 'User', entityId: u._id, label: u.email, summary: `Removed customer ${u.name} (${u.email})` })
  res.status(204).end()
}))

r.get('/admin/stats', requireRole('admin', 'editor'), wrap(async (_q, res) => {
  const from = new Date(Date.now() - 29 * 864e5).toISOString().slice(0, 10)
  const logs = await ViewLog.find({ date: { $gte: from } }).sort({ date: 1 })
  res.json({ viewsSeries: logs.map((l) => ({ day: String(+l.date.slice(8)), views: l.count })) })
}))

// The Agents pages no longer exist, so drop any saved menu / footer link to them.
const dropAgentLinks = (s) => ({ ...s, nav: s.nav.filter((i) => !/^\/agents(\/|$)/.test(i.to)), footerLinks: s.footerLinks.filter((i) => !/^\/agents(\/|$)/.test(i.to)) })
r.get('/settings', wrap(async (_q, res) => res.json(dropAgentLinks(withDefaults((await Setting.findOne({ key: 'site' }))?.value)))))

// Links in the footer are rendered as <a href>, so only https:// is accepted (never javascript: or data:).
const socialUrl = z.string().trim().max(300).refine((u) => u === '' || (/^https:\/\//i.test(u) && URL.canParse(u)), 'Enter a full link starting with https://').default('')
const SOCIAL = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube']
// Images are uploaded through /api/uploads and stored as URLs; accept only http(s) URLs (or empty = use the built-in image).
const imageUrl = z.string().trim().max(500).refine((u) => u === '' || (/^https?:\/\//i.test(u) && URL.canParse(u)), 'Image must be an uploaded image link').default('')
const text = (min, max, label) => z.string().trim().min(min, `${label} is required`).max(max, `${label} is too long (max ${max} characters)`)
const hex = z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, 'Use a colour like #063E2F')
const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] }
const contrastWithWhite = (h) => 1.05 / (lum(h) + 0.05)

// Menu / footer links: an internal page path ("/about") or a full https:// address. Never javascript:, data: or protocol-relative links.
const linkTo = z.string().trim().max(300).refine((u) => /^\/(?!\/)[A-Za-z0-9\-._~!$&'()*+,;=:@%/?#]*$/.test(u) || (/^https:\/\//i.test(u) && URL.canParse(u)), 'Use a page path like /about or a full link starting with https://')
const link = z.object({ label: text(1, 30, 'Link label'), to: linkTo })
const uniqueStrings = (min, max, itemMax, label) => z.array(z.string().trim().min(1, `${label} cannot be empty`).max(itemMax, `${label} is too long`)).min(min, `Add at least ${min} ${label.toLowerCase()}`).max(max)
  .refine((a) => new Set(a.map((x) => x.toLowerCase())).size === a.length, `${label} must be different from each other`)
const SECTION_IDS = ['featured', 'why', 'projects', 'testimonials', 'cta']
const dropAgentLinksBody = (b) => (b && Array.isArray(b.nav) && Array.isArray(b.footerLinks) ? { ...b, nav: b.nav.filter((i) => !/^\/agents(\/|$)/.test(i?.to)), footerLinks: b.footerLinks.filter((i) => !/^\/agents(\/|$)/.test(i?.to)) } : b)
const settingsSchema = z.object({
  company: text(1, 80, 'Company name'), tagline: z.string().trim().max(120).default(''), logo: imageUrl, showNameWithLogo: z.boolean().default(true),
  email: z.string().trim().email('Enter a valid email address'), phone: text(5, 30, 'Phone'), address: text(3, 200, 'Address'), workingHours: z.string().trim().max(100).default(''), notify: z.boolean().optional().default(true),
  favicon: imageUrl,
  fonts: z.object({ heading: z.enum(FONT_CHOICES), body: z.enum(FONT_CHOICES) }),
  currency: z.object({ symbol: z.string().trim().min(1, 'Enter a currency symbol').max(4, 'Symbol is too long').regex(/^[^<>&"'\s]+$/, 'Symbol has invalid characters'), system: z.enum(['indian', 'international']) }),
  nav: z.array(link).min(1, 'Keep at least one menu item').max(8, 'The menu can have up to 8 items'),
  footerLinks: z.array(link).max(16, 'The footer can have up to 16 links'),
  home: z.object({
    sections: z.array(z.object({ id: z.enum(SECTION_IDS), visible: z.boolean() })).length(5).refine((a) => new Set(a.map((s) => s.id)).size === 5, 'Each home section must appear once'),
    featuredTitle: text(1, 80, 'Section title'), projectsTitle: text(1, 80, 'Section title'), testimonialsTitle: text(1, 80, 'Section title'), whyTitle: text(1, 80, 'Section title'), whyIntro: z.string().trim().max(200).default(''),
    whyCards: z.array(z.object({ title: text(1, 50, 'Card title'), text: z.string().trim().max(200).default('') })).length(4, 'Provide exactly four cards'),
    cta: z.object({ title: text(1, 100, 'Box title'), text: z.string().trim().max(240).default(''), button: text(1, 30, 'Button text') }),
  }),
  pages: z.object({
    login: z.object({ title: text(1, 60, 'Title'), subtitle: z.string().trim().max(160).default(''), sideTitle: z.string().trim().max(100).default(''), sideText: z.string().trim().max(200).default('') }),
    register: z.object({ title: text(1, 60, 'Title'), subtitle: z.string().trim().max(160).default('') }),
    listProperty: z.object({ title: text(1, 60, 'Title'), subtitle: z.string().trim().max(200).default(''), privacy: z.string().trim().max(300).default('') }),
  }),
  options: z.object({
    propertyTypes: uniqueStrings(1, 12, 30, 'Property types'), furnishing: uniqueStrings(1, 6, 30, 'Furnishing options'), amenities: uniqueStrings(0, 40, 40, 'Amenities'),
    timeSlots: z.array(z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour times like 14:30')).min(1, 'Add at least one visit time').max(24).refine((a) => new Set(a).size === a.length, 'Visit times must be different'),
  }),
  social: z.object(Object.fromEntries(SOCIAL.map((k) => [k, socialUrl]))).default({}),
  // White text sits on these colours (buttons, headers), so they must stay readable.
  theme: z.object({
    primary: hex.refine((h) => contrastWithWhite(h) >= 4.5, 'Primary colour is too light: white text on it would be hard to read'),
    accent: hex.refine((h) => contrastWithWhite(h) >= 3, 'Accent colour is too light: white text on it would be hard to read'),
  }),
  hero: z.object({ title: text(3, 80, 'Hero headline'), subtitle: z.string().trim().max(240).default(''), image: imageUrl }),
  stats: z.array(z.object({ value: text(1, 12, 'Number'), label: text(1, 30, 'Label') })).length(4, 'Provide exactly four headline numbers'),
  about: z.object({ subtitle: z.string().trim().max(200).default(''), heading: text(3, 200, 'About headline'), intro: z.string().trim().max(1500).default(''), story: z.string().trim().max(4000).default(''), mission: z.string().trim().max(600).default(''), vision: z.string().trim().max(600).default(''), image: imageUrl }),
  footer: z.object({ about: z.string().trim().max(400).default('') }),
  seo: z.object({ description: z.string().trim().max(300).default('') }),
})

// Flattens nested settings to "section.field" keys so the activity log can show field-level before/after values.
const flat = (v, pre = '', out = {}) => {
  for (const [k, x] of Object.entries(v || {})) {
    if (x && typeof x === 'object') flat(x, `${pre}${k}.`, out)
    else out[`${pre}${k}`] = x
  }
  return out
}

r.put('/settings', admin, wrap(async (req, res) => {
  const d = settingsSchema.parse(dropAgentLinksBody(req.body))
  const before = withDefaults((await Setting.findOne({ key: 'site' }))?.value)
  // Removing a property type or furnishing option that listings still use would leave those listings broken.
  for (const [field, list, label] of [['type', d.options.propertyTypes, 'property type'], ['furnishing', d.options.furnishing, 'furnishing option']]) {
    const gone = [...new Set((before.options[field === 'type' ? 'propertyTypes' : 'furnishing']).filter((x) => !list.includes(x)))]
    for (const g of gone) {
      const n = await Property.countDocuments({ [field]: g })
      if (n) throw new HttpError(409, `You cannot remove the ${label} "${g}": ${n} ${n === 1 ? 'property uses' : 'properties use'} it. Change those properties first.`)
    }
  }
  await Setting.updateOne({ key: 'site' }, { key: 'site', value: d }, { upsert: true })
  const a = flat(before), b = flat(d)
  const changes = diff(a, b, Object.keys(b))
  if (Object.keys(changes).length) {
    const sections = [...new Set(Object.keys(changes).map((k) => k.split('.')[0]))]
    logActivity(req, { action: 'update', entity: 'Settings', label: 'Site settings', summary: `Updated site settings (${sections.join(', ')})`, changes })
  }
  res.json(dropAgentLinks(withDefaults(d)))
}))
export default r

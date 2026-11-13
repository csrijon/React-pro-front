import { useState } from 'react'
import { m as motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ExternalLink } from 'lucide-react'
import FormField from '../../components/forms/FormField'
import LoadingButton from '../../components/forms/LoadingButton'
import { SocialLinks } from '../../components/common/SocialIcons'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import contentService from '../../services/contentService'
import useForm from '../../hooks/useForm'
import usePageTitle from '../../hooks/usePageTitle'
import { rules } from '../../utils/validators'
import { SITE } from '../../utils/constants'

const info = [
  [Mail, 'Email', SITE.email, `mailto:${SITE.email}`],
  [Phone, 'Phone', SITE.phone, `tel:${SITE.phone.replace(/\s/g, '')}`],
  [MapPin, 'Location', 'Kolkata, West Bengal, India', null],
  [Clock, 'Working Hours', SITE.hours, null],
]
const SUBJECTS = ['General enquiry', 'Order support', 'Returns & refunds', 'Product advice', 'Business / partnership']

export default function Contact() {
  usePageTitle('Contact Us')
  const [ticket, setTicket] = useState(null)
  const form = useForm({ name: '', email: '', subject: SUBJECTS[0], message: '' }, (v) => ({
    name: rules.required('Name')(v.name), email: rules.email(v.email), message: rules.min(10, 'Message')(v.message),
  }))
  const onSubmit = form.submit(async (v) => { const r = await contentService.contact(v); setTicket(r.ticket); form.reset() })

  return (
    <div className="container-x py-8 sm:py-12">
      <Breadcrumbs className="mb-6" items={[{ label: 'Contact' }]} />
      <div className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Get in <span className="text-brand">Touch</span></h1>
        <p className="mt-3 text-muted">We’d love to hear from you. Reach out for support, queries or business enquiries - a real rider will reply.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-ink-800 p-3">
            {info.map(([Icon, label, value, href]) => {
              const inner = <><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-light"><Icon size={20} /></span><span className="min-w-0"><span className="block text-xs text-muted">{label}</span><span className="block break-words font-medium">{value}</span></span></>
              return href
                ? <a key={label} href={href} className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-ink-700">{inner}</a>
                : <div key={label} className="flex items-center gap-4 rounded-xl p-3">{inner}</div>
            })}
          </div>

          {/* Map placeholder - swap for an embedded Google Map iframe when you have the API key / embed URL */}
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`} target="_blank" rel="noopener noreferrer" aria-label="Open our location in Google Maps"
            className="group relative block aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-ink-800">
            <svg viewBox="0 0 400 250" className="h-full w-full" aria-hidden>
              <rect width="400" height="250" fill="#15181d" />
              {Array.from({ length: 11 }, (_, i) => <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="250" stroke="#20252c" />)}
              {Array.from({ length: 7 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="#20252c" />)}
              <path d="M-10 190 C80 150 140 210 220 140 S350 90 410 60" fill="none" stroke="#2c323b" strokeWidth="14" />
              <path d="M60 -10 C90 70 70 130 130 260" fill="none" stroke="#2c323b" strokeWidth="9" />
              <path d="M-10 190 C80 150 140 210 220 140 S350 90 410 60" fill="none" stroke="#EF252B" strokeOpacity=".35" strokeWidth="2" strokeDasharray="6 6" />
              <circle cx="205" cy="128" r="34" fill="#EF252B" opacity=".15" /><circle cx="205" cy="128" r="18" fill="#EF252B" opacity=".25" />
              <path d="M205 150c-9-12-18-22-18-34a18 18 0 1 1 36 0c0 12-9 22-18 34Z" fill="#EF252B" /><circle cx="205" cy="116" r="7" fill="#fff" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink to-transparent p-4">
              <span className="text-sm font-medium">MotoGear HQ · Park Street, Kolkata</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-brand-light group-hover:underline">Open map <ExternalLink size={13} /></span>
            </div>
          </a>

          <div className="rounded-2xl border border-line bg-ink-800 p-5"><p className="mb-3 text-sm font-semibold">Follow the ride</p><SocialLinks /></div>
        </div>

        <div className="rounded-2xl border border-line bg-ink-800 p-5 sm:p-8">
          {ticket ? (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full min-h-[380px] flex-col items-center justify-center text-center">
              <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400"><CheckCircle2 size={34} /></span>
              <h2 className="text-2xl font-bold">Message sent!</h2>
              <p className="mt-2 max-w-sm text-muted">Thanks for reaching out. Your reference is <b className="font-mono text-white">{ticket}</b>. We usually reply within one business day.</p>
              <button onClick={() => setTicket(null)} className="btn-ghost mt-6">Send another message</button>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <h2 className="text-xl font-bold">Send us a message</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField label="Your name" required autoComplete="name" error={form.errors.name} {...form.field('name')} />
                <FormField label="Your email" required type="email" autoComplete="email" error={form.errors.email} {...form.field('email')} />
              </div>
              <FormField label="Subject" as="select" options={SUBJECTS} {...form.field('subject')} />
              <FormField label="Message" required as="textarea" rows={6} placeholder="How can we help?" error={form.errors.message} {...form.field('message')} />
              {form.formError && <p role="alert" className="rounded-lg border border-brand/40 bg-brand-soft p-3 text-sm text-brand-light">{form.formError}</p>}
              <LoadingButton type="submit" loading={form.submitting} loadingText="Sending..." className="btn-primary w-full py-3.5 sm:w-auto"><Send size={16} /> Send Message</LoadingButton>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

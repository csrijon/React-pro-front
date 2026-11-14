import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import Logo from '../common/Logo'
import SiteLink from '../common/SiteLink'
import { inquiryService } from '../../services/inquiryService'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { SOCIAL_NETWORKS } from '../../services/settingsService'

const icons = {
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" /></>,
  twitter: <path d="M4 4l16 16M20 4L4 20" />,
  youtube: <><path d="M22 8.5a3 3 0 0 0-2.1-2.1C18.1 6 12 6 12 6s-6.1 0-7.9.4A3 3 0 0 0 2 8.5 31 31 0 0 0 1.6 12c0 1.2.1 2.4.4 3.5a3 3 0 0 0 2.1 2.1c1.8.4 7.9.4 7.9.4s6.1 0 7.9-.4a3 3 0 0 0 2.1-2.1c.3-1.1.4-2.3.4-3.5s-.1-2.4-.4-3.5z" /><path d="M10 15l5-3-5-3z" /></>,
  linkedin: <><path d="M7 10v8M7 6.5v.01M11 18v-8m0 3a3 3 0 0 1 6 0v5" /><rect x="3" y="3" width="18" height="18" rx="3" /></>,
}

export default function Footer() {
  const site = useSiteSettings()
  const links = SOCIAL_NETWORKS.filter((k) => /^https:\/\//i.test(site.social?.[k] || ''))
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const subscribe = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error('Enter a valid email address')
    setBusy(true)
    try { await inquiryService.subscribe(email); toast.success('Subscribed. Watch your inbox for new listings.'); setEmail('') }
    catch (err) { toast.error(err.message) } finally { setBusy(false) }
  }
  const h = 'mb-4 text-sm font-semibold text-white'
  const l = 'block py-2 text-sm text-white/70 transition hover:text-white'
  return (
    <footer className="mt-20 bg-primary text-white">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{site.footer.about}</p>
          <form onSubmit={subscribe} className="mt-6 flex max-w-sm gap-2" noValidate>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email" aria-label="Newsletter email" className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none" />
            <button className="btn bg-white text-primary hover:bg-primary-50" disabled={busy}>{busy ? '…' : 'Subscribe'}</button>
          </form>
          <div className="mt-6 flex gap-2">
            {links.map((n) => (
              <a key={n} href={site.social[n]} target="_blank" rel="noopener noreferrer" aria-label={`${site.company} on ${n}`} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white hover:text-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[n]}</svg></a>
            ))}
          </div>
        </div>
        <div><h4 className={h}>Quick links</h4>{site.footerLinks.map((i) => <SiteLink key={i.to + i.label} to={i.to} className={l}>{i.label}</SiteLink>)}</div>
        <div><h4 className={h}>Property categories</h4>{site.options.propertyTypes.map((t) => <Link key={t} to={`/properties?type=${encodeURIComponent(t)}`} className={l}>{t}</Link>)}</div>
        <div>
          <h4 className={h}>Contact</h4>
          <p className="flex gap-2 py-1 text-sm text-white/70"><MapPin size={16} className="mt-0.5 shrink-0" />{site.address}</p>
          <a href={`tel:${site.phone.replace(/[^\d+]/g, '')}`} className={`${l} flex gap-2`}><Phone size={16} className="mt-0.5 shrink-0" />{site.phone}</a>
          <a href={`mailto:${site.email}`} className={`${l} flex gap-2`}><Mail size={16} className="mt-0.5 shrink-0" />{site.email}</a>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/60 [overflow-wrap:anywhere]">© {new Date().getFullYear()} {site.company}. All rights reserved.</div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import Logo from '../common/Logo'
import { SocialLinks } from '../common/SocialIcons'
import NewsletterForm from '../forms/NewsletterForm'
import { photo } from '../../utils/images'

const quick = [['Home', '/'], ['Shop', '/shop'], ['Categories', '/shop'], ['Brands', '/brands'], ['Blog', '/blog'], ['About Us', '/about'], ['Contact', '/contact']]
const cats = [['Helmets', 'helmets'], ['Riding Jackets', 'riding-jackets'], ['Luggage & Carriers', 'luggage-carriers'], ['Bike Care', 'bike-care'], ['Electronics', 'electronics'], ['Performance', 'performance']]
const support = [['FAQs', '/faq'], ['Returns & Refunds', '/return-policy'], ['Shipping Policy', '/shipping-policy'], ['Track Orders', '/account/orders'], ['Terms & Conditions', '/terms'], ['Privacy Policy', '/privacy-policy']]

const Col = ({ title, children }) => (
  <div>
    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{title}</h3>
    <ul className="space-y-2.5 text-sm text-muted">{children}</ul>
  </div>
)
const L = ({ to, children }) => (
  <li><Link to={to} className="transition hover:text-white hover:underline hover:decoration-brand hover:underline-offset-4">{children}</Link></li>
)

/** Payment badges are typographic marks - swap for official brand assets when you integrate payments. */
const Pay = () => (
  <div className="flex flex-wrap items-center gap-2.5" aria-label="Accepted payment methods">
    <span className="rounded-md bg-white px-2.5 py-1 font-display text-sm font-extrabold italic text-[#1a1f71]">VISA</span>
    <span className="flex h-7 items-center rounded-md bg-ink-700 px-2" aria-label="Mastercard"><i className="h-4 w-4 rounded-full bg-[#eb001b]" /><i className="-ml-1.5 h-4 w-4 rounded-full bg-[#f79e1b] opacity-90" /></span>
    <span className="rounded-md bg-white px-2.5 py-1 text-xs font-extrabold italic text-[#ef6c00]">UPI</span>
    <span className="rounded-md bg-white px-2.5 py-1 text-xs font-extrabold italic text-[#1a4fa3]">RuPay</span>
    <span className="rounded-md bg-white px-2.5 py-1 text-xs font-extrabold text-[#00baf2]">Pay<span className="text-[#002970]">tm</span></span>
  </div>
)

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-brand/50 bg-ink-800">
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: `url(${photo('roadRider', 1600)})`, backgroundSize: 'cover', backgroundPosition: 'center 60%' }} />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink via-ink/90 to-ink" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 right-0 h-72 w-[60%] bg-[radial-gradient(closest-side,rgba(239,37,43,0.35),transparent)] blur-2xl" />

      <div className="container-x relative pb-8 pt-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <Logo size="lg" asLink />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">Your one-stop destination for premium bike accessories, riding gear and performance upgrades.</p>
            <SocialLinks className="mt-6" />
          </div>
          <div className="lg:col-span-2"><Col title="Quick Links">{quick.map(([l, t]) => <L key={l} to={t}>{l}</L>)}</Col></div>
          <div className="lg:col-span-2"><Col title="Categories">{cats.map(([l, s]) => <L key={s} to={`/category/${s}`}>{l}</L>)}</Col></div>
          <div className="lg:col-span-2"><Col title="Customer Support">{support.map(([l, t]) => <L key={l} to={t}>{l}</L>)}</Col></div>
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Newsletter</h3>
            <p className="mb-3 text-sm text-muted">Subscribe for the latest offers, new arrivals and riding tips.</p>
            <NewsletterForm dense />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-line pt-6 md:flex-row">
          <p className="text-center text-xs text-muted sm:text-sm">© {new Date().getFullYear()} MotoGear. All Rights Reserved.</p>
          <Pay />
        </div>
      </div>
    </footer>
  )
}

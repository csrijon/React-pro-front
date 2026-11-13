import { ShieldCheck, Truck, Headset, Wallet, BadgeCheck, RotateCcw } from 'lucide-react'
import Reveal from '../common/Reveal'
import SectionHeading from '../common/SectionHeading'

const items = [
  { icon: BadgeCheck, title: '100% Genuine Gear', text: 'Sourced directly from brands and authorised distributors with warranty.' },
  { icon: ShieldCheck, title: 'Safety Certified', text: 'ISI, DOT and CE certified protection you can trust at every speed.' },
  { icon: Truck, title: 'Fast Pan-India Delivery', text: 'Free shipping above ₹999 with express options for 19,000+ pincodes.' },
  { icon: RotateCcw, title: '7-Day Easy Returns', text: 'Wrong size? Exchange or return hassle-free within a week.' },
  { icon: Wallet, title: 'Secure Payments', text: 'UPI, cards, wallets and COD with end-to-end encrypted checkout.' },
  { icon: Headset, title: 'Rider-led Support', text: 'Get gear advice from riders who actually know the road.' },
]

export default function WhyChoose() {
  return (
    <section className="container-x py-14 sm:py-16">
      <SectionHeading align="center" eyebrow="Why MotoGear" title="Built by Riders, for Riders" subtitle="Everything you need to ride safer, farther and in style." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={(i % 3) * 0.08} className="group rounded-2xl border border-line bg-ink-700 p-6 transition hover:-translate-y-1 hover:border-brand/60">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand transition group-hover:bg-brand-solid group-hover:text-white"><Icon size={24} /></span>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

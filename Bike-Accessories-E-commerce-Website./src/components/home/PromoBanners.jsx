import { Link } from 'react-router-dom'
import { ArrowRight, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import Reveal from '../common/Reveal'
import SmartImage from '../common/SmartImage'

const copy = (code) => {
  navigator.clipboard?.writeText(code).then(
    () => toast.success(`Coupon ${code} copied!`),
    () => toast(`Use code ${code} at checkout`),
  )
}

export default function PromoBanners() {
  return (
    <section className="container-x grid grid-cols-1 gap-4 py-6 lg:grid-cols-5 lg:gap-6">
      <Reveal className="relative isolate min-h-[260px] overflow-hidden rounded-3xl border border-line lg:col-span-3 lg:min-h-[320px]">
        <SmartImage photoKey="kawasaki" w={1400} sizes="(min-width: 1024px) 60vw, 100vw" className="absolute inset-0 -z-10 h-full w-full" alt="" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-transparent" />
        <div className="flex h-full max-w-md flex-col justify-center p-7 sm:p-10">
          <span className="eyebrow">Limited Time Offer</span>
          <h3 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl">Helmet Season Sale <span className="text-brand">Flat 20% OFF</span></h3>
          <p className="mt-3 text-sm text-white/80">Certified full-face and flip-up helmets from India’s favourite brands.</p>
          <Link to="/category/helmets" className="btn-primary mt-6 w-fit">Shop Helmets <ArrowRight size={16} /></Link>
        </div>
      </Reveal>

      <div className="grid gap-4 lg:col-span-2 lg:gap-6">
        <Reveal delay={0.1} className="relative isolate overflow-hidden rounded-3xl border border-brand/40 bg-gradient-to-br from-brand-dark to-brand p-7 shadow-glow">
          <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">Exclusive Coupon</p>
          <h3 className="mt-1 font-display text-3xl font-extrabold">Extra 10% OFF</h3>
          <p className="mt-1 text-sm text-white/85">On orders above ₹1,000</p>
          <button onClick={() => copy('MOTO10')} className="mt-4 inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-white/70 bg-ink/30 px-4 py-2 font-mono text-sm font-bold tracking-widest transition hover:bg-ink/50">
            MOTO10 <Copy size={14} />
          </button>
        </Reveal>
        <Reveal delay={0.2} className="relative isolate overflow-hidden rounded-3xl border border-line">
          <SmartImage photoKey="garage" w={900} sizes="(min-width: 1024px) 40vw, 100vw" className="absolute inset-0 -z-10 h-full w-full" alt="" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/95 to-ink/50" />
          <div className="p-7">
            <span className="eyebrow">Bike Care Week</span>
            <h3 className="mt-1 font-display text-2xl font-bold">Keep Her Gleaming</h3>
            <p className="mt-1 text-sm text-white/80">Chain lubes, polishes &amp; detailing kits from ₹249.</p>
            <Link to="/category/bike-care" className="mt-4 inline-flex items-center gap-1.5 py-2 text-sm font-semibold text-brand-light hover:text-white">Explore <ArrowRight size={15} /></Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

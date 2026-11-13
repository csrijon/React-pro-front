import { Link } from 'react-router-dom'
import { m as motion } from 'framer-motion'
import { Target, Eye, Users, Package, ShieldCheck, Star, ArrowRight } from 'lucide-react'
import Reveal from '../../components/common/Reveal'
import SmartImage from '../../components/common/SmartImage'
import SectionHeading from '../../components/common/SectionHeading'
import { Skeleton } from '../../components/common/Skeletons'
import useFetch from '../../hooks/useFetch'
import usePageTitle from '../../hooks/usePageTitle'
import contentService from '../../services/contentService'

const ICONS = { users: Users, package: Package, shield: ShieldCheck, star: Star }
const milestones = [
  ['2018', 'A garage and a dream', 'Three friends start selling helmets and gloves out of a Kolkata garage after a long-weekend ride.'],
  ['2020', 'Going online', 'MotoGear launches nationwide delivery with a rider-tested, genuine-only catalogue.'],
  ['2023', '50,000 riders strong', 'We partner with 50+ brands and open our gear-testing lab for real-world reviews.'],
  ['2026', 'The road ahead', 'A new platform, faster delivery and a growing community of riders across India.'],
]
const gallery = [['ktm', 'row-span-2'], ['roadRider', ''], ['enfield', ''], ['yamaha', 'col-span-2 sm:col-span-1']]

export default function About() {
  usePageTitle('About Us')
  const { data, loading } = useFetch(() => contentService.team(), [])

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <SmartImage photoKey="cruiser" w={1800} alt="" className="absolute inset-0 -z-10 h-full w-full" priority />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink to-transparent" />
        <div className="container-x py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            <p className="eyebrow">About us</p>
            <h1 className="mt-3 font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl">About <span className="text-brand">MotoGear</span></h1>
            <p className="mt-2 font-display text-xl font-bold text-brand sm:text-2xl">Built by riders, for riders.</p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">MotoGear is a dedicated platform for premium riding accessories. Our goal is to make every ride safer, more comfortable and more stylish with gear from trusted brands.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link to="/shop" className="btn-primary">Shop the Collection <ArrowRight size={16} /></Link><Link to="/contact" className="btn-ghost">Talk to a Rider</Link></div>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-6 py-14 md:grid-cols-2">
        <Reveal className="relative overflow-hidden rounded-3xl border border-brand/40 bg-gradient-to-br from-brand-dark to-brand p-8 shadow-glow">
          <Target size={32} /><h2 className="mt-4 font-display text-2xl font-bold">Our Mission</h2>
          <p className="mt-2 leading-relaxed text-white/90">To empower riders with high-quality, reliable and innovative motorcycle accessories - at fair prices, delivered fast.</p>
        </Reveal>
        <Reveal delay={0.1} className="rounded-3xl border border-line bg-ink-700 p-8">
          <Eye size={32} className="text-brand" /><h2 className="mt-4 font-display text-2xl font-bold">Our Vision</h2>
          <p className="mt-2 leading-relaxed text-muted">To become India’s most trusted destination for riding gear - where every rider, from commuter to tourer, finds protection they believe in.</p>
        </Reveal>
      </section>

      <section className="container-x py-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h2 className="section-title mt-2">From a garage to 50,000 garages</h2>
            <p className="mt-4 leading-relaxed text-muted">It started with a simple frustration: finding genuine, well-fitting riding gear shouldn’t be hard. We tested, curated and shipped only what we’d wear ourselves, and riders noticed.</p>
            <ol className="mt-8 space-y-6 border-l-2 border-line pl-6">
              {milestones.map(([y, t, d]) => (
                <li key={y} className="relative"><span className="absolute -left-[33px] top-1 h-3.5 w-3.5 rounded-full border-2 border-brand bg-ink" /><p className="font-display text-sm font-bold text-brand-light">{y}</p><h3 className="font-bold">{t}</h3><p className="text-sm text-muted">{d}</p></li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={0.1} className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px]">
            {gallery.map(([k, cls]) => <SmartImage key={k} photoKey={k} w={800} alt="" className={`rounded-2xl border border-line ${cls}`} imgClassName="transition duration-500 hover:scale-105" />)}
          </Reveal>
        </div>
      </section>

      <section className="my-14 border-y border-line bg-ink-800/60">
        <div className="container-x grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
          {loading ? [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />) : data?.stats.map((s, i) => {
            const Icon = ICONS[s.icon]
            return (
              <Reveal key={s.label} delay={i * 0.08} className="text-center">
                <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand"><Icon size={22} /></span>
                <p className="font-display text-4xl font-extrabold">{s.value}</p><p className="text-sm text-muted">{s.label}</p>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="container-x py-6">
        <SectionHeading align="center" eyebrow="Why MotoGear" title="What sets us apart" />
        <div className="grid gap-4 md:grid-cols-3">
          {[['01', 'Rider-tested', 'Every product is evaluated by our riders before it reaches the catalogue.'], ['02', 'Genuine only', 'Direct from brands and authorised distributors - always with warranty.'], ['03', 'Honest advice', 'Real riders on support who’ll tell you what not to buy, too.']].map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 0.08} className="rounded-2xl border border-line bg-ink-700 p-6"><span className="font-display text-5xl font-extrabold text-brand-light/30">{n}</span><h3 className="mt-2 text-lg font-bold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-14">
        <SectionHeading eyebrow="The crew" title="Meet the team" subtitle="Riders first, shopkeepers second." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {loading ? [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-52" />) : data?.team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.07} className="rounded-2xl border border-line bg-ink-700 p-5 text-center transition hover:-translate-y-1 hover:border-brand/60">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark font-display text-3xl font-bold shadow-glow">{m.name.split(' ').map((w) => w[0]).join('')}</span>
              <h3 className="mt-4 font-bold">{m.name}</h3><p className="text-sm text-brand-light">{m.role}</p><p className="mt-1 text-xs text-muted">Rides: {m.bike}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}

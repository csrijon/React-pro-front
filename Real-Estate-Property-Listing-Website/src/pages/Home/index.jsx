import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Building2, Users, BadgeCheck, MapPinned, ShieldCheck, UserCheck, Eye, Headset, Star, ArrowRight, MapPin } from 'lucide-react'
import SiteLink from '../../components/common/SiteLink'
import { useSEO } from '../../utils/seo'
import { useSite } from '../../context/SiteContext'
import { useAsync } from '../../hooks/useAsync'
import { propertyService } from '../../services/propertyService'
import { projectService } from '../../services/projectService'
import { inquiryService } from '../../services/inquiryService'
import PropertyCard from '../../components/properties/PropertyCard'
import ProjectCard from '../../components/projects/ProjectCard'
import { CardSkeleton, ErrorState } from '../../components/common/States'
import Reveal from '../../components/common/Reveal'
import Img from '../../components/common/Img'
import { HERO_IMAGE } from '../../data/images'
import { formatPrice } from '../../utils/format'

const STAT_ICONS = [Building2, Users, BadgeCheck, MapPinned]
const WHY_ICONS = [ShieldCheck, UserCheck, Eye, Headset]
// Budget choices are formatted in the owner's currency.
const budgetOptions = () => ({
  Buy: [['', 'Any budget'], ['0-5000000', `Under ${formatPrice(5000000)}`], ['5000000-10000000', `${formatPrice(5000000)} – ${formatPrice(10000000)}`], ['10000000-20000000', `${formatPrice(10000000)} – ${formatPrice(20000000)}`], ['20000000-', `Above ${formatPrice(20000000)}`]],
  Rent: [['', 'Any budget'], ['0-20000', `Under ${formatPrice(20000, 'Rent')}`], ['20000-50000', `${formatPrice(20000, 'Rent')} – ${formatPrice(50000, 'Rent')}`], ['50000-', `Above ${formatPrice(50000, 'Rent')}`]],
})

export default function Home() {
  const { site, tx } = useSite()
  const budgets = budgetOptions()
  const hm = site.home
  useSEO(site.hero.title)
  const words = site.hero.title.trim().split(/\s+/)
  const stats = site.stats.map((s, i) => [STAT_ICONS[i % 4], s.value, s.label])
  const nav = useNavigate()
  const [tab, setTab] = useState('Buy')
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [budget, setBudget] = useState('')
  const props = useAsync(() => propertyService.list(), [])
  const projs = useAsync(() => projectService.list(), [])
  const tests = useAsync(() => inquiryService.testimonials(), [])

  const search = (e) => {
    e.preventDefault()
    if (tab === 'Projects') return nav('/projects')
    const p = new URLSearchParams({ purpose: tab })
    if (q.trim()) p.set('q', q.trim()); if (type) p.set('type', type)
    if (budget) { const [a, b] = budget.split('-'); if (a) p.set('min', a); if (b) p.set('max', b) }
    nav(`/properties?${p}`)
  }

  const sections = {
    featured: (
      <section key="featured" className="container-x pt-16">
        <div className="mb-8 flex items-end justify-between"><h2 className="section-title">{tx(hm.featuredTitle)}</h2><Link to="/properties" className="tap inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">View all <ArrowRight size={15} /></Link></div>
        {props.error ? <ErrorState error={props.error} onRetry={props.reload} /> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {props.loading ? <CardSkeleton /> : props.data.filter((p) => p.featured).slice(0, 3).map((p, i) => <Reveal key={p.id} delay={i * 0.08}><PropertyCard property={p} /></Reveal>)}
          </div>
        )}
      </section>
    ),
    why: (
      <section key="why" className="container-x pt-20">
        <Reveal><h2 className="section-title">{tx(hm.whyTitle)}</h2>{hm.whyIntro && <p className="mt-2 max-w-xl text-muted">{tx(hm.whyIntro)}</p>}</Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {hm.whyCards.map((c, i) => { const I = WHY_ICONS[i % 4]; return (
            <Reveal key={i} delay={i * 0.06}><div className="card h-full p-6"><span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-white"><I size={22} /></span><h3 className="mt-4 font-semibold">{tx(c.title)}</h3><p className="mt-1.5 text-sm text-muted">{tx(c.text)}</p></div></Reveal>) })}
        </div>
      </section>
    ),
    projects: (
      <section key="projects" className="container-x pt-20">
        <div className="mb-8 flex items-end justify-between"><h2 className="section-title">{tx(hm.projectsTitle)}</h2><Link to="/projects" className="tap inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">All projects <ArrowRight size={15} /></Link></div>
        {projs.error ? <ErrorState error={projs.error} onRetry={projs.reload} /> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projs.loading ? <CardSkeleton /> : projs.data.slice(0, 3).map((p, i) => <Reveal key={p.id} delay={i * 0.08}><ProjectCard project={p} /></Reveal>)}
          </div>
        )}
      </section>
    ),
    testimonials: (tests.data || []).length > 0 && (
      <section key="testimonials" className="mt-20 bg-white py-16">
        <div className="container-x">
          <h2 className="section-title">{tx(hm.testimonialsTitle)}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tests.data.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.06}>
                <figure className="card h-full p-6">
                  <div className="flex gap-0.5">{Array.from({ length: t.rating }, (_, k) => <Star key={k} size={14} className="fill-amber-400 text-amber-400" />)}</div>
                  <blockquote className="mt-3 text-sm leading-relaxed text-ink">“{t.text}”</blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">{t.avatar && <Img src={t.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />}<div><p className="text-sm font-semibold">{t.name}</p><p className="text-xs text-muted">{t.role}</p></div></figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    ),
    cta: (
      <section key="cta" className="container-x pt-16">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-primary px-6 py-10 text-white sm:px-12 md:flex-row md:items-center">
            <div><h2 className="text-2xl font-semibold !text-white sm:text-3xl">{tx(hm.cta.title)}</h2>{hm.cta.text && <p className="mt-2 max-w-lg text-white/75">{tx(hm.cta.text)}</p>}</div>
            <Link to="/list-property" className="btn bg-white text-primary hover:bg-primary-50">{hm.cta.button}</Link>
          </div>
        </Reveal>
      </section>
    ),
  }

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <Img src={site.hero.image || HERO_IMAGE} alt="" eager className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/90 via-primary/60 to-primary/20" />
        <div className="container-x pb-16 pt-16 sm:pb-24 sm:pt-24 lg:pt-28">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <h1 className="font-heading text-4xl font-semibold leading-[1.1] !text-white sm:text-6xl">{words.length > 1 ? <>{words.slice(0, -1).join(' ')} <span className="text-accent-light">{words.at(-1)}</span></> : site.hero.title}</h1>
            {site.hero.subtitle && <p className="mt-5 max-w-lg text-base text-white/85 sm:text-lg">{site.hero.subtitle}</p>}
          </motion.div>
          <motion.form onSubmit={search} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="mt-8 max-w-4xl" role="search">
            <div className="flex w-fit overflow-hidden rounded-t-2xl bg-white/15 p-1 backdrop-blur" role="tablist">
              {['Buy', 'Rent', 'Projects'].map((t) => (
                <button type="button" role="tab" aria-selected={tab === t} key={t} onClick={() => { setTab(t); setBudget('') }}
                  className={`rounded-xl px-6 py-2 text-sm font-semibold transition ${tab === t ? 'bg-white text-primary' : 'text-white hover:bg-white/10'}`}>{t}</button>
              ))}
            </div>
            <div className="grid gap-3 rounded-b-2xl rounded-tr-2xl bg-white p-3 shadow-lift sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
              <label className="relative"><span className="sr-only">Location</span><MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Enter location, city or project" className="input pl-9" /></label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="input" aria-label="Property type" disabled={tab === 'Projects'}>
                <option value="">Property type</option>{site.options.propertyTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
              <select value={budget} onChange={(e) => setBudget(e.target.value)} className="input" aria-label="Budget" disabled={tab === 'Projects'}>
                {(budgets[tab] || budgets.Buy).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <button className="btn-primary sm:col-span-2 lg:col-span-1" aria-label="Search"><Search size={18} /><span className="lg:hidden">Search</span></button>
            </div>
          </motion.form>
          <div className="mt-10 grid max-w-3xl grid-cols-2 gap-5 sm:grid-cols-4">
            {stats.map(([I, n, l]) => (
              <div key={l} className="flex items-center gap-3 text-white"><I size={26} className="shrink-0 text-white/80" /><div><p className="font-heading text-xl font-semibold leading-none">{n}</p><p className="mt-1 text-xs text-white/75">{l}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      {hm.sections.filter((s) => s.visible).map((s) => sections[s.id])}
    </>
  )
}

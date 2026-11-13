import { ShieldCheck, UserCheck, Eye, Headset, Target, Telescope, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSEO } from '../../utils/seo'
import { useAsync } from '../../hooks/useAsync'
import { agentService } from '../../services/agentService'
import { inquiryService } from '../../services/inquiryService'
import Reveal from '../../components/common/Reveal'
import Img from '../../components/common/Img'
import { ABOUT_IMAGE } from '../../data/images'

const stats = [['10K+', 'Properties listed'], ['5K+', 'Happy clients'], ['150+', 'Verified agents'], ['50+', 'Cities covered']]
const why = [[ShieldCheck, 'Verified listings', 'Only genuine, verified properties.'], [UserCheck, 'Expert agents', 'Experienced professionals who guide you.'], [Eye, 'Transparent process', 'No hidden costs, clear paperwork.'], [Headset, 'Customer support', 'Trusted by thousands of clients.']]

export default function About() {
  useSEO('About Us', 'EstateHub is a modern real estate platform connecting buyers, sellers and investors with verified properties and expert agents.')
  const team = useAsync(() => agentService.list(), [])
  const tests = useAsync(() => inquiryService.testimonials(), [])
  return (
    <>
      <section className="container-x grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
        <div>
          <h1 className="text-3xl font-semibold sm:text-5xl">About EstateHub</h1>
          <p className="mt-3 text-muted">Your trusted partner in finding the right property.</p>
          <p className="mt-8 font-heading text-2xl font-semibold leading-snug text-primary sm:text-3xl">We make real estate simple, transparent, and accessible for everyone.</p>
          <p className="mt-4 leading-relaxed text-muted">EstateHub is a modern real estate platform connecting buyers, sellers and investors with verified properties and expert agents. We combine local expertise with clear information so you can decide with confidence.</p>
          <Link to="/properties" className="btn-primary mt-6">Browse properties</Link>
        </div>
        <Img src={ABOUT_IMAGE} alt="Modern home exterior" eager className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift" />
      </section>
      <section className="bg-white py-14">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <Reveal><h2 className="section-title">Our story</h2><p className="mt-3 leading-relaxed text-muted">EstateHub began in 2016 with a simple frustration: finding a home meant juggling brokers, outdated listings and unclear prices. We built a platform where every listing is verified, every price is visible and every agent is accountable.</p><p className="mt-3 leading-relaxed text-muted">Today we serve thousands of families, investors and businesses across 50+ cities, with a team that still answers the phone.</p></Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {[[Target, 'Our mission', 'To make property decisions easy and trustworthy through verified information and expert guidance.'], [Telescope, 'Our vision', 'To be the most trusted real estate platform in India, where every transaction feels fair.']].map(([I, t, d]) => (
              <Reveal key={t}><div className="card h-full p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-white"><I size={20} /></span><h3 className="mt-4 font-semibold">{t}</h3><p className="mt-1.5 text-sm text-muted">{d}</p></div></Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="container-x grid grid-cols-2 gap-5 py-14 lg:grid-cols-4">
        {stats.map(([n, l]) => <div key={l} className="card p-6 text-center"><p className="font-heading text-3xl font-semibold text-primary">{n}</p><p className="mt-1 text-sm text-muted">{l}</p></div>)}
      </section>
      <section className="container-x pb-14">
        <h2 className="section-title">Why choose us</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{why.map(([I, t, d]) => <div key={t} className="card flex gap-4 p-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-50 text-accent"><I size={20} /></span><div><h3 className="font-semibold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></div></div>)}</div>
      </section>
      <section className="bg-white py-14"><div className="container-x">
        <h2 className="section-title">Meet the team</h2>
        <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
          {(team.data || []).slice(0, 4).map((a) => <Link key={a.id} to={`/agents/${a.id}`} className="group text-center"><Img src={a.photo} alt={a.name} className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-primary-50 transition group-hover:ring-accent/30" /><p className="mt-3 font-semibold">{a.name}</p><p className="text-sm text-muted">{a.designation}</p></Link>)}
        </div>
      </div></section>
      <section className="container-x py-14">
        <h2 className="section-title">Customer testimonials</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {(tests.data || []).slice(0, 3).map((t) => <figure key={t.id} className="card p-6"><div className="flex gap-0.5">{Array.from({ length: t.rating }, (_, k) => <Star key={k} size={14} className="fill-amber-400 text-amber-400" />)}</div><blockquote className="mt-3 text-sm leading-relaxed">“{t.text}”</blockquote><figcaption className="mt-4 text-sm font-semibold">{t.name}<span className="block text-xs font-normal text-muted">{t.role}</span></figcaption></figure>)}
        </div>
      </section>
    </>
  )
}

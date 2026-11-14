import { ShieldCheck, UserCheck, Eye, Headset, Target, Telescope, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSEO } from '../../utils/seo'
import { useSite } from '../../context/SiteContext'
import { useAsync } from '../../hooks/useAsync'
import { teamService } from '../../services/teamService'
import ReviewsSection from '../../components/common/ReviewsSection'
import { inquiryService } from '../../services/inquiryService'
import Reveal from '../../components/common/Reveal'
import Img from '../../components/common/Img'
import { ABOUT_IMAGE } from '../../data/images'

const WHY_ICONS = [ShieldCheck, UserCheck, Eye, Headset]

export default function About() {
  const { site } = useSite()
  const { about } = site
  useSEO('About Us', about.intro.slice(0, 200))
  const stats = site.stats.map((s) => [s.value, s.label])
  const team = useAsync(() => teamService.list(), [])
  const tests = useAsync(() => inquiryService.testimonials(), [])
  return (
    <>
      <section className="container-x grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
        <div>
          <h1 className="text-3xl font-semibold sm:text-5xl">About {site.company}</h1>
          {about.subtitle && <p className="mt-3 text-muted">{about.subtitle}</p>}
          <p className="mt-8 font-heading text-2xl font-semibold leading-snug text-primary sm:text-3xl">{about.heading}</p>
          {about.intro && <p className="mt-4 leading-relaxed text-muted">{about.intro}</p>}
          <Link to="/properties" className="btn-primary mt-6">Browse properties</Link>
        </div>
        <Img src={about.image || ABOUT_IMAGE} alt="" eager className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift" />
      </section>
      <section className="bg-white py-14">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <Reveal><h2 className="section-title">Our story</h2>{about.story.split(/\n{2,}/).filter(Boolean).map((para, i) => <p key={i} className="mt-3 leading-relaxed text-muted">{para}</p>)}</Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {[[Target, 'Our mission', about.mission], [Telescope, 'Our vision', about.vision]].filter(([, , d]) => d).map(([I, t, d]) => (
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
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{site.home.whyCards.map((c, i) => { const I = WHY_ICONS[i % 4]; return <div key={i} className="card flex gap-4 p-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-50 text-accent"><I size={20} /></span><div><h3 className="font-semibold">{c.title.replaceAll('{company}', site.company)}</h3><p className="mt-1 text-sm text-muted">{c.text.replaceAll('{company}', site.company)}</p></div></div> })}</div>
      </section>
      {(team.data || []).length > 0 && (
        <section className="bg-white py-14" aria-labelledby="team-title"><div className="container-x">
          <h2 id="team-title" className="section-title">Meet the team</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.data.map((m) => (
              <article key={m.id} className="card flex flex-col items-center p-6 text-center">
                {m.photo ? <Img src={m.photo} alt={m.name} className="h-24 w-24 rounded-full object-cover ring-4 ring-primary-50" /> : <span className="grid h-24 w-24 place-items-center rounded-full bg-primary text-3xl font-semibold text-white" aria-hidden>{m.name[0]}</span>}
                <h3 className="mt-3 font-semibold">{m.name}</h3>
                <p className="text-sm font-medium text-accent">{m.role}</p>
                {m.bio && <p className="mt-2 text-sm text-muted">{m.bio}</p>}
                {(m.phone || m.email) && <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs">{m.phone && <a className="text-muted hover:text-accent" href={`tel:${m.phone.replace(/[^\d+]/g, '')}`}>{m.phone}</a>}{m.email && <a className="text-muted hover:text-accent" href={`mailto:${m.email}`}>{m.email}</a>}</div>}
              </article>
            ))}
          </div>
        </div></section>
      )}
      <section className="container-x py-14">
        <h2 className="section-title">Customer testimonials</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {(tests.data || []).slice(0, 3).map((t) => <figure key={t.id} className="card p-6"><div className="flex gap-0.5">{Array.from({ length: t.rating }, (_, k) => <Star key={k} size={14} className="fill-amber-400 text-amber-400" />)}</div><blockquote className="mt-3 text-sm leading-relaxed">“{t.text}”</blockquote><figcaption className="mt-4 text-sm font-semibold">{t.name}<span className="block text-xs font-normal text-muted">{t.role}</span></figcaption></figure>)}
        </div>
      </section>
      <ReviewsSection />
    </>
  )
}

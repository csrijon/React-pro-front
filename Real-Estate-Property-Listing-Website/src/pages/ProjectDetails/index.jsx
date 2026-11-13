import { Link, useParams } from 'react-router-dom'
import { ChevronRight, MapPin, Check, Building2, Layers, CalendarClock, FileCheck2, Landmark } from 'lucide-react'
import { useSEO } from '../../utils/seo'
import { useAsync } from '../../hooks/useAsync'
import { projectService } from '../../services/projectService'
import { developers } from '../../data/projects'
import { formatBudget } from '../../utils/format'
import Gallery from '../../components/common/Gallery'
import EnquiryForm from '../../components/forms/EnquiryForm'
import { PageLoader, EmptyState, ErrorState } from '../../components/common/States'

export default function ProjectDetails() {
  const { id } = useParams()
  const { data: p, loading, error, reload } = useAsync(() => projectService.get(id), [id])
  useSEO(p?.name || 'Project', p ? `${p.name} by ${p.developer} in ${p.location}. ${p.description.slice(0, 110)}` : undefined)
  if (loading) return <PageLoader />
  if (error) return <div className="container-x py-16"><ErrorState error={error} onRetry={reload} /></div>
  if (!p) return <div className="container-x py-16"><EmptyState icon={Building2} title="Project not found" text="This project may have been removed." action={<Link to="/projects" className="btn-primary">All projects</Link>} /></div>
  const specs = [['Developer', p.developer], ['Category', p.category], ['Total units', p.units], ['Towers / blocks', p.towers || 'Independent villas'], ['Possession', p.possession], ['RERA number', p.rera]]
  return (
    <div className="container-x py-6">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted"><Link to="/" className="hover:text-accent">Home</Link><ChevronRight size={14} /><Link to="/projects" className="hover:text-accent">Projects</Link><ChevronRight size={14} /><span className="text-ink">{p.name}</span></nav>
      <Gallery images={p.images} alt={p.name} />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-8">
          <header>
            <div className="flex flex-wrap items-center gap-2"><span className="chip">{p.status}</span><span className="chip">{p.category}</span></div>
            <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">{p.name}</h1>
            <p className="mt-1.5 flex items-center gap-1.5 text-muted"><MapPin size={16} />{p.location}</p>
            <p className="mt-3 font-heading text-2xl font-semibold text-primary">{formatBudget(p.priceFrom)} – {formatBudget(p.priceTo)}</p>
          </header>
          <div className="card grid grid-cols-2 divide-x divide-line sm:grid-cols-4">
            {[[Building2, p.units, 'Units'], [Layers, p.towers || '–', 'Towers'], [CalendarClock, p.possession, 'Possession'], [FileCheck2, p.rera === 'Applied' ? 'Applied' : 'Registered', 'RERA']].map(([I, v, l]) => (
              <div key={l} className="flex flex-col items-center gap-1 px-2 py-4 text-center"><I size={20} className="text-accent" /><p className="font-semibold">{v}</p><p className="text-xs text-muted">{l}</p></div>
            ))}
          </div>
          <section><h2 className="text-xl font-semibold">Project overview</h2><p className="mt-3 leading-relaxed text-muted">{p.description}</p></section>
          <section>
            <h2 className="text-xl font-semibold">Construction status</h2>
            <div className="card mt-4 p-5">
              <div className="flex justify-between text-sm"><span className="font-medium">{p.status}</span><span className="text-muted">{p.progress}% complete</span></div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-primary-50" role="progressbar" aria-valuenow={p.progress} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${p.progress}%` }} /></div>
              <p className="mt-3 text-sm text-muted">Expected possession: {p.possession}</p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Available configurations</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{p.configurations.map((c) => <div key={c.type} className="card p-5"><p className="font-heading text-lg font-semibold">{c.type}</p><p className="mt-1 text-sm text-muted">{c.area}</p><p className="mt-3 font-semibold text-primary">{c.price}</p></div>)}</div>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Amenities</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">{p.amenities.map((x) => <li key={x} className="flex items-center gap-2 text-sm"><span className="grid h-6 w-6 place-items-center rounded-full bg-accent-50 text-accent"><Check size={14} /></span>{x}</li>)}</ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Specifications</h2>
            <dl className="card mt-4 grid sm:grid-cols-2">{specs.map(([k, v]) => <div key={k} className="flex justify-between gap-4 border-b border-line px-5 py-3 text-sm"><dt className="text-muted">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}</dl>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Developer</h2>
            <div className="card mt-4 flex gap-4 p-5"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-white"><Landmark size={22} /></span><div><p className="font-semibold">{p.developer}</p><p className="mt-1 text-sm text-muted">{developers[p.developer] || 'Established developer with a track record of timely delivery.'}</p></div></div>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Location</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-line"><iframe title={`Map of ${p.location}`} loading="lazy" className="h-72 w-full" src="https://www.openstreetmap.org/export/embed.html?bbox=88.30%2C22.50%2C88.46%2C22.64&layer=mapnik" /></div>
          </section>
        </div>
        <aside className="card h-fit p-5 lg:sticky lg:top-24"><EnquiryForm property={p.name} title="Enquire about this project" compact defaultMessage={`I'd like to know more about ${p.name}.`} /></aside>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Heart, Share2, MapPin, BedDouble, Bath, Maximize, Car, Check, Phone, MessageCircle, BadgeCheck, ChevronRight, CalendarCheck, Home } from 'lucide-react'
import { toast } from 'sonner'
import { useSEO } from '../../utils/seo'
import { useAsync } from '../../hooks/useAsync'
import { propertyService } from '../../services/propertyService'
import { agentService } from '../../services/agentService'
import { useWishlist } from '../../context/WishlistContext'
import { formatPrice, formatArea } from '../../utils/format'
import Gallery from '../../components/common/Gallery'
import Modal from '../../components/common/Modal'
import Img from '../../components/common/Img'
import EnquiryForm from '../../components/forms/EnquiryForm'
import BookVisitModal from '../../components/forms/BookVisitModal'
import PropertyCard from '../../components/properties/PropertyCard'
import { PageLoader, EmptyState, ErrorState } from '../../components/common/States'
import { FLOORPLAN } from '../../data/images'

const Fact = ({ icon: I, value, label }) => (
  <div className="flex flex-col items-center gap-1 px-2 py-4 text-center"><I size={20} className="text-accent" /><p className="font-semibold">{value}</p><p className="text-xs text-muted">{label}</p></div>
)

export default function PropertyDetails() {
  const { id } = useParams()
  const { data: p, loading, error, reload } = useAsync(() => propertyService.get(id), [id])
  const agent = useAsync(() => (p ? agentService.get(p.agentId) : Promise.resolve(null)), [p?.agentId])
  const all = useAsync(() => propertyService.list(), [])
  const { has, toggle } = useWishlist()
  const [visit, setVisit] = useState(false)
  const [enq, setEnq] = useState(false)
  useSEO(p ? p.title : 'Property', p ? `${p.title} in ${p.location}, ${p.city} – ${formatPrice(p.price, p.purpose)}. ${p.description.slice(0, 110)}` : undefined)

  if (loading) return <PageLoader />
  if (error) return <div className="container-x py-16"><ErrorState error={error} onRetry={reload} /></div>
  if (!p) return <div className="container-x py-16"><EmptyState icon={Home} title="Property not found" text="This listing may have been removed or the link is incorrect." action={<Link to="/properties" className="btn-primary">Browse properties</Link>} /></div>

  const a = agent.data
  const similar = (all.data || []).filter((x) => x.id !== p.id && (x.type === p.type || x.location === p.location)).slice(0, 3)
  const share = async () => {
    try { if (navigator.share) await navigator.share({ title: p.title, url: location.href }); else { await navigator.clipboard.writeText(location.href); toast.success('Link copied') } } catch { /* cancelled */ }
  }
  const idx = Number(p.id.replace(/\D/g, '')) || 1
  const lat = 22.5726 + ((idx * 37) % 100) / 1000 - 0.05, lon = 88.3639 + ((idx * 53) % 100) / 1000 - 0.05
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.012},${lat - 0.008},${lon + 0.012},${lat + 0.008}&layer=mapnik&marker=${lat},${lon}`
  const specs = [['Property type', p.type], ['Status', p.propertyStatus], ['Furnishing', p.furnishing], ['Facing', p.facing], ['Floor', p.floor], ['Year built', p.yearBuilt], ['Built-up area', formatArea(p.area)], ['Listing ID', `EH-${p.id.toUpperCase()}`]].filter(([, v]) => v)
  const rooms = p.beds ? [['Living room', '18 × 14 ft'], ['Master bedroom', '15 × 13 ft'], ...Array.from({ length: Math.max(p.beds - 1, 0) }, (_, k) => [`Bedroom ${k + 2}`, '12 × 11 ft']), ['Kitchen', '11 × 9 ft']] : null

  return (
    <div className="container-x py-6">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link to="/" className="hover:text-accent">Home</Link><ChevronRight size={14} /><Link to="/properties" className="hover:text-accent">Properties</Link><ChevronRight size={14} /><span className="text-ink">{p.title}</span>
      </nav>
      <Gallery images={p.images} alt={p.title} />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-8">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold sm:text-3xl">{p.title}</h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-muted"><MapPin size={16} />{p.location}, {p.city}, {p.state}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="chip">{p.type}</span><span className="chip">{p.status}</span><span className="chip">{p.propertyStatus}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-heading text-3xl font-semibold text-primary">{formatPrice(p.price, p.purpose)}{p.purpose === 'Rent' && <span className="text-base font-normal text-muted"> /month</span>}</p>
              <div className="mt-2 flex justify-end gap-2">
                <button onClick={() => toggle(p.id)} aria-pressed={has(p.id)} aria-label="Save to wishlist" className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white hover:border-red-300"><Heart size={18} className={has(p.id) ? 'fill-red-500 text-red-500' : ''} /></button>
                <button onClick={share} aria-label="Share" className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white hover:border-primary"><Share2 size={18} /></button>
              </div>
            </div>
          </header>

          <div className="card grid grid-cols-2 divide-x divide-line sm:grid-cols-4">
            <Fact icon={BedDouble} value={p.beds || '–'} label="Bedrooms" />
            <Fact icon={Bath} value={p.baths || '–'} label="Bathrooms" />
            <Fact icon={Maximize} value={p.area.toLocaleString('en-IN')} label="Sq ft area" />
            <Fact icon={Car} value={p.parking || '–'} label="Parking" />
          </div>

          <section><h2 className="text-xl font-semibold">About this property</h2><p className="mt-3 leading-relaxed text-muted">{p.description}</p></section>

          <section>
            <h2 className="text-xl font-semibold">Amenities</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">{p.amenities.map((x) => <li key={x} className="flex items-center gap-2 text-sm"><span className="grid h-6 w-6 place-items-center rounded-full bg-accent-50 text-accent"><Check size={14} /></span>{x}</li>)}</ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Floor plan</h2>
            <div className="card mt-4 grid gap-5 p-4 sm:grid-cols-2">
              <Img src={FLOORPLAN} alt={`Floor plan of ${p.title}`} className="h-56 w-full rounded-xl object-cover sm:h-full" />
              <div>
                <p className="text-sm text-muted">Indicative room sizes. Final dimensions are confirmed during the site visit.</p>
                {rooms ? <ul className="mt-3 divide-y divide-line text-sm">{rooms.map(([r, s]) => <li key={r} className="flex justify-between py-2"><span>{r}</span><span className="font-medium">{s}</span></li>)}</ul>
                  : <p className="mt-3 text-sm">Total area: <strong>{formatArea(p.area)}</strong></p>}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Specifications</h2>
            <dl className="card mt-4 grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0">
              {specs.map(([k, v]) => <div key={k} className="flex justify-between gap-4 border-line px-5 py-3 text-sm sm:border-b"><dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd></div>)}
            </dl>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Location</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-line"><iframe title={`Map of ${p.location}`} src={map} loading="lazy" className="h-72 w-full" /></div>
            <p className="mt-2 text-xs text-muted">Approximate location. The exact address is shared when you book a visit.</p>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="card p-5">
            <h2 className="font-semibold">Contact agent</h2>
            {a ? (<>
              <div className="mt-4 flex items-center gap-3">
                <Img src={a.photo} alt={a.name} className="h-14 w-14 rounded-full object-cover" />
                <div><Link to={`/agents/${a.id}`} className="font-semibold hover:text-accent">{a.name}</Link>{a.verified && <p className="flex items-center gap-1 text-xs text-accent"><BadgeCheck size={14} />Verified agent</p>}<p className="text-sm text-muted">{a.phone}</p></div>
              </div>
              <div className="mt-4 space-y-2.5">
                <a href={`tel:${a.phone.replace(/\s/g, '')}`} className="btn-outline w-full"><Phone size={16} />Call now</a>
                <a href={`https://wa.me/${a.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${p.title} (${p.location}).`)}`} target="_blank" rel="noreferrer" className="btn-outline w-full"><MessageCircle size={16} className="text-accent" />WhatsApp</a>
                <button onClick={() => setEnq(true)} className="btn-primary w-full">Send enquiry</button>
              </div>
            </>) : <div className="skeleton mt-4 h-40" />}
          </div>
          <button onClick={() => setVisit(true)} className="btn-accent w-full py-3"><CalendarCheck size={17} />Book a visit</button>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-14"><h2 className="section-title">Similar properties</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{similar.map((s) => <PropertyCard key={s.id} property={s} />)}</div></section>
      )}

      <Modal open={enq} onClose={() => setEnq(false)} title="Send enquiry"><EnquiryForm property={p.title} title="" compact defaultMessage={`I'm interested in ${p.title} in ${p.location}. Please share more details.`} /></Modal>
      <BookVisitModal open={visit} onClose={() => setVisit(false)} property={p.title} agentId={p.agentId} />
    </div>
  )
}

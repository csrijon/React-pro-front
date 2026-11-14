import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Printer, Play, Heart, Share2, MapPin, BedDouble, Bath, Maximize, Car, Check, Phone, MessageCircle, BadgeCheck, ChevronRight, CalendarCheck, Home } from 'lucide-react'
import { toast } from 'sonner'
import { useSEO } from '../../utils/seo'
import { useSite } from '../../context/SiteContext'
import { useAsync } from '../../hooks/useAsync'
import { propertyService } from '../../services/propertyService'
import { useWishlist } from '../../context/WishlistContext'
import { formatPrice, formatArea, formatDate, formatMoney } from '../../utils/format'
import Gallery from '../../components/common/Gallery'
import Modal from '../../components/common/Modal'
import Img from '../../components/common/Img'
import EnquiryForm from '../../components/forms/EnquiryForm'
import BookVisitModal from '../../components/forms/BookVisitModal'
import PropertyCard from '../../components/properties/PropertyCard'
import { PageLoader, EmptyState, ErrorState } from '../../components/common/States'
import EmiCalculator from '../../components/common/EmiCalculator'
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed'

const Fact = ({ icon: I, value, label }) => (
  <div className="flex flex-col items-center gap-1 px-2 py-4 text-center"><I size={20} className="text-accent" /><p className="font-semibold">{value}</p><p className="text-xs text-muted">{label}</p></div>
)

export default function PropertyDetails() {
  const { id } = useParams()
  const { data: p, loading, error, reload } = useAsync(() => propertyService.get(id), [id])
  const { site } = useSite()
  const all = useAsync(() => propertyService.list(), [])
  const { has, toggle } = useWishlist()
  const [visit, setVisit] = useState(false)
  const [enq, setEnq] = useState(false)
  const recent = useRecentlyViewed()
  useEffect(() => { if (p?.id) recent.add(p.id) }, [p?.id]) // eslint-disable-line react-hooks/exhaustive-deps
  useSEO(p ? p.title : 'Property', p ? `${p.title} in ${p.location}, ${p.city} – ${formatPrice(p.price, p.purpose)}. ${p.description.slice(0, 110)}` : undefined)

  if (loading) return <PageLoader />
  if (error) return <div className="container-x py-16"><ErrorState error={error} onRetry={reload} /></div>
  if (!p) return <div className="container-x py-16"><EmptyState icon={Home} title="Property not found" text="This listing may have been removed or the link is incorrect." action={<Link to="/properties" className="btn-primary">Browse properties</Link>} /></div>

  const phoneDigits = site.phone.replace(/[^\d+]/g, '')
  const waNumber = site.phone.replace(/\D/g, '')
  const similar = (all.data || []).filter((x) => x.id !== p.id && (x.type === p.type || x.location === p.location)).slice(0, 3)
  const share = async () => {
    try { if (navigator.share) await navigator.share({ title: p.title, url: location.href }); else { await navigator.clipboard.writeText(location.href); toast.success('Link copied') } } catch { /* cancelled */ }
  }
  const idx = Number(p.id.replace(/\D/g, '').slice(-4)) || 1
  const lat = Number.isFinite(p.lat) ? p.lat : 22.5726 + ((idx * 37) % 100) / 1000 - 0.05, lon = Number.isFinite(p.lng) ? p.lng : 88.3639 + ((idx * 53) % 100) / 1000 - 0.05
  const ytId = (p.videoUrl || '').match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)?.[1]
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.012},${lat - 0.008},${lon + 0.012},${lat + 0.008}&layer=mapnik&marker=${lat},${lon}`
  const specs = [['Property type', p.type], ['Status', p.propertyStatus], ['Furnishing', p.furnishing], ['Facing', p.facing], ['Floor', p.floor], ['Year built', p.yearBuilt], ['Built-up area', formatArea(p.area)], ['Price per sq ft', p.purpose === 'Buy' ? formatMoney(p.price / p.area) : null], ['Listed on', p.createdAt ? formatDate(p.createdAt) : null], ['Listing ID', `EH-${p.id.toUpperCase()}`]].filter(([, v]) => v)
  const rooms = (p.rooms || []).filter((r) => r.name)

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
                <button onClick={() => window.print()} aria-label="Print brochure" className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white hover:border-primary print:hidden"><Printer size={18} /></button>
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

          {ytId && <section className="print:hidden"><h2 className="flex items-center gap-2 text-xl font-semibold"><Play size={18} className="text-accent" />Video tour</h2><div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-line"><iframe title={`Video tour of ${p.title}`} src={`https://www.youtube-nocookie.com/embed/${ytId}`} loading="lazy" allowFullScreen className="h-full w-full" /></div></section>}

          {(p.floorPlan || rooms.length > 0) && (
            <section>
              <h2 className="text-xl font-semibold">Floor plan</h2>
              <div className={`card mt-4 grid gap-5 p-4 ${p.floorPlan && rooms.length ? 'sm:grid-cols-2' : ''}`}>
                {p.floorPlan && <a href={p.floorPlan} target="_blank" rel="noopener noreferrer" aria-label="Open floor plan in a new tab"><Img src={p.floorPlan} alt={`Floor plan of ${p.title}`} className="max-h-96 w-full rounded-xl bg-white object-contain" /></a>}
                {rooms.length > 0 && (
                  <div>
                    <p className="text-sm text-muted">Room sizes are approximate. Final dimensions are confirmed during the site visit.</p>
                    <ul className="mt-3 divide-y divide-line text-sm">{rooms.map((r, i) => <li key={i} className="flex justify-between gap-4 py-2"><span>{r.name}</span><span className="font-medium">{r.size}</span></li>)}</ul>
                  </div>
                )}
              </div>
            </section>
          )}

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
            <h2 className="font-semibold">Contact us</h2>
            <div className="mt-4 flex items-center gap-3">
              {site.logo ? <img src={site.logo} alt="" className="h-14 w-14 rounded-xl bg-white object-contain p-1 ring-1 ring-line" /> : <span className="grid h-14 w-14 place-items-center rounded-xl bg-primary text-white"><Home size={24} /></span>}
              <div className="min-w-0"><p className="truncate font-semibold">{site.company}</p><p className="flex items-center gap-1 text-xs text-accent"><BadgeCheck size={14} />Verified listing</p><p className="text-sm text-muted">{site.phone}</p></div>
            </div>
            <div className="mt-4 space-y-2.5">
              <a href={`tel:${phoneDigits}`} className="btn-outline w-full"><Phone size={16} />Call now</a>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi, I'm interested in ${p.title} (${p.location}).`)}`} target="_blank" rel="noopener noreferrer" className="btn-outline w-full"><MessageCircle size={16} className="text-accent" />WhatsApp</a>
              <button onClick={() => setEnq(true)} className="btn-primary w-full">Send enquiry</button>
            </div>
          </div>
          <button onClick={() => setVisit(true)} className="btn-accent w-full py-3"><CalendarCheck size={17} />Book a visit</button>
          {p.purpose === 'Buy' && p.price >= 500000 && <div className="card p-5"><h2 className="mb-4 font-semibold">Estimate your EMI</h2><EmiCalculator price={p.price} compact /></div>}
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-14"><h2 className="section-title">Similar properties</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{similar.map((s) => <PropertyCard key={s.id} property={s} />)}</div></section>
      )}

      <Modal open={enq} onClose={() => setEnq(false)} title="Send enquiry"><EnquiryForm property={p.title} title="" compact defaultMessage={`I'm interested in ${p.title} in ${p.location}. Please share more details.`} /></Modal>
      <BookVisitModal open={visit} onClose={() => setVisit(false)} property={p.title} />
    </div>
  )
}

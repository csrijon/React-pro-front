import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MapPin, BedDouble, Bath, Maximize } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'
import { formatPrice, formatArea } from '../../utils/format'
import Img from '../common/Img'

function PropertyCard({ property: p, layout = 'grid' }) {
  const { has, toggle } = useWishlist()
  const saved = has(p.id)
  const list = layout === 'list'
  return (
    <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
      className={`card group overflow-hidden transition-shadow hover:shadow-lift ${list ? 'sm:flex' : ''}`}>
      <div className={`relative overflow-hidden ${list ? 'sm:w-72 sm:shrink-0 md:w-80' : ''}`}>
        <Link to={`/properties/${p.id}`} tabIndex={-1} aria-hidden>
          <Img src={p.images[0]} alt="" className={`w-full object-cover transition duration-500 group-hover:scale-105 ${list ? 'h-52 sm:h-full' : 'h-52'}`} />
        </Link>
        <span className={`absolute left-3 top-3 rounded-lg px-2.5 py-1 text-xs font-semibold text-white ${p.purpose === 'Rent' ? 'bg-amber-600' : 'bg-accent'}`}>{p.status}</span>
        <button onClick={() => toggle(p.id)} aria-pressed={saved} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow transition hover:scale-110">
          <Heart size={17} className={saved ? 'fill-red-500 text-red-500' : 'text-slate-600'} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="font-heading text-xl font-semibold text-primary">
          {formatPrice(p.price, p.purpose)}{p.purpose === 'Rent' && <span className="text-sm font-normal text-muted"> /month</span>}
        </p>
        <h3 className="mt-1 text-base font-semibold leading-snug"><Link to={`/properties/${p.id}`} className="hover:text-accent">{p.title}</Link></h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted"><MapPin size={14} />{p.location}, {p.city}</p>
        {list && <p className="mt-2 line-clamp-2 hidden text-sm text-muted md:block">{p.description}</p>}
        <div className="mt-4 flex items-center gap-4 border-t border-line pt-3 text-sm text-muted">
          {p.beds > 0 && <span className="flex items-center gap-1.5"><BedDouble size={15} />{p.beds}</span>}
          {p.baths > 0 && <span className="flex items-center gap-1.5"><Bath size={15} />{p.baths}</span>}
          <span className="flex items-center gap-1.5"><Maximize size={15} />{formatArea(p.area)}</span>
        </div>
        <Link to={`/properties/${p.id}`} className="btn-outline btn-sm mt-4 w-full">View details</Link>
      </div>
    </motion.article>
  )
}
export default memo(PropertyCard)

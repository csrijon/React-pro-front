import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Building2 } from 'lucide-react'
import { formatBudget } from '../../utils/format'
import Img from '../common/Img'

const tone = { 'Ready to Move': 'bg-accent', 'Under Construction': 'bg-amber-600', Upcoming: 'bg-sky-600', Ongoing: 'bg-amber-600' }

export default function ProjectCard({ project: p }) {
  return (
    <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="card group overflow-hidden transition-shadow hover:shadow-lift">
      <div className="relative overflow-hidden">
        <Img src={p.images[0]} alt="" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className={`absolute left-3 top-3 rounded-lg px-2.5 py-1 text-xs font-semibold text-white ${tone[p.status] || 'bg-accent'}`}>{p.status}</span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold"><Link to={`/projects/${p.id}`} className="tap hover:text-accent">{p.name}</Link></h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted"><MapPin size={14} />{p.location}</p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-muted">From <strong className="font-heading text-base text-primary">{formatBudget(p.priceFrom)}</strong></span>
          <span className="flex items-center gap-1 text-muted"><Building2 size={14} />{p.units} units</span>
        </div>
        <Link to={`/projects/${p.id}`} className="btn-outline btn-sm mt-4 w-full">View project</Link>
      </div>
    </motion.article>
  )
}

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, Mail, MessageCircle, BadgeCheck, Star } from 'lucide-react'
import Img from '../common/Img'

export default function AgentCard({ agent: a, count = 0 }) {
  const act = 'grid h-10 w-10 place-items-center rounded-xl border border-line text-accent transition hover:bg-accent hover:text-white'
  return (
    <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="card flex flex-col items-center p-6 text-center transition-shadow hover:shadow-lift">
      <Img src={a.photo} alt={a.name} className="h-20 w-20 rounded-full object-cover ring-4 ring-primary-50" />
      <h3 className="mt-3 flex items-center gap-1 font-semibold">{a.name}{a.verified && <BadgeCheck size={16} className="text-accent" aria-label="Verified" />}</h3>
      <p className="text-sm text-muted">{a.designation}</p>
      <p className="mt-2 flex items-center gap-1 text-sm"><Star size={14} className="fill-amber-400 text-amber-400" /><strong>{a.rating}</strong><span className="text-muted">({a.reviews})</span></p>
      <p className="mt-1 text-xs text-muted">{count} properties · {a.experience} yrs experience</p>
      <div className="mt-4 flex gap-2">
        <a className={act} href={`tel:${a.phone.replace(/\s/g, '')}`} aria-label={`Call ${a.name}`}><Phone size={16} /></a>
        <a className={act} href={`https://wa.me/${a.whatsapp}`} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${a.name}`}><MessageCircle size={16} /></a>
        <a className={act} href={`mailto:${a.email}`} aria-label={`Email ${a.name}`}><Mail size={16} /></a>
      </div>
      <Link to={`/agents/${a.id}`} className="btn-outline btn-sm mt-4 w-full">View profile</Link>
    </motion.article>
  )
}

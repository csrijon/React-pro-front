import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function Logo({ light = false, to = '/' }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2" aria-label="EstateHub home">
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${light ? 'bg-white text-primary' : 'bg-primary text-white'}`}><Home size={18} /></span>
      <span className={`font-heading text-xl font-semibold tracking-tight ${light ? 'text-white' : 'text-primary'}`}>EstateHub</span>
    </Link>
  )
}

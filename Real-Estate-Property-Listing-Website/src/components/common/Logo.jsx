import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { useSite } from '../../context/SiteContext'

/** Site logo and name from the owner's settings. `light` is for dark backgrounds: an uploaded logo sits on a white chip so it always stays visible. */
export default function Logo({ light = false, to = '/' }) {
  const { site } = useSite()
  return (
    <Link to={to} className="inline-flex min-w-0 items-center gap-2" aria-label={`${site.company} home`}>
      {site.logo ? (
        <span className={`inline-flex h-10 shrink-0 items-center rounded-lg ${light ? 'bg-white px-2' : ''}`}><img src={site.logo} alt="" className="max-h-9 w-auto max-w-[9rem] object-contain" /></span>
      ) : (
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${light ? 'bg-white text-primary' : 'bg-primary text-white'}`}><Home size={18} /></span>
      )}
      <span title={site.company} className={`min-w-0 max-w-[9.5rem] truncate font-heading text-xl font-semibold tracking-tight sm:max-w-[16rem] ${site.logo && !site.showNameWithLogo ? 'sr-only' : ''} ${light ? 'text-white' : 'text-primary'}`}>{site.company}</span>
    </Link>
  )
}

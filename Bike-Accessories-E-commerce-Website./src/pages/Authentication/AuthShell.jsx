import { Link } from 'react-router-dom'
import { BadgeCheck, Package, Heart, Zap } from 'lucide-react'
import Logo from '../../components/common/Logo'
import SmartImage from '../../components/common/SmartImage'

const perks = [
  [Package, 'Track every order in real time'],
  [Heart, 'Save gear to your wishlist'],
  [Zap, 'Faster checkout with saved addresses'],
  [BadgeCheck, 'Exclusive member-only offers'],
]

/** Split-screen layout shared by all authentication pages. */
export default function AuthShell({ title, subtitle, children, footer, photo = 'harley' }) {
  return (
    <div className="grid grid-cols-1 min-h-[calc(100vh-110px)] lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden lg:block">
        <SmartImage photoKey={photo} w={1400} alt="" className="absolute inset-0 h-full w-full" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <Logo size="lg" />
          <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight">Gear up.<br /><span className="text-brand">Ride on.</span></h2>
          <ul className="mt-6 space-y-3">
            {perks.map(([Icon, t]) => <li key={t} className="flex items-center gap-3 text-sm text-white/85"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/90"><Icon size={16} /></span>{t}</li>)}
          </ul>
        </div>
      </aside>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-block lg:hidden"><Logo /></Link>
          <h1 className="font-display text-3xl font-extrabold">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-center text-sm text-muted">{footer}</div>}
        </div>
      </div>
    </div>
  )
}

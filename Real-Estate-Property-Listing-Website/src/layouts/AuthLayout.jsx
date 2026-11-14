import { Outlet, Link } from 'react-router-dom'
import Logo from '../components/common/Logo'
import { HERO_IMAGE } from '../data/images'
import { useSite } from '../context/SiteContext'

export default function AuthLayout() {
  const { site, tx } = useSite()
  const t = site.pages.login
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={site.hero.image || HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20" />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <Logo light />
          <div><h2 className="font-heading text-4xl font-semibold leading-tight !text-white">{tx(t.sideTitle)}</h2><p className="mt-3 max-w-sm text-white/80">{tx(t.sideText)}</p></div>
        </div>
      </div>
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <div className="lg:hidden"><Logo /></div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8"><Outlet /></div>
        <Link to="/" className="text-center text-sm text-muted hover:text-accent">Back to website</Link>
      </div>
    </div>
  )
}

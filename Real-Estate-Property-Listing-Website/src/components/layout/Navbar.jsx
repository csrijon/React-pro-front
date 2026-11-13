import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import Logo from '../common/Logo'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'

const links = [['/', 'Home'], ['/properties', 'Properties'], ['/projects', 'Projects'], ['/agents', 'Agents'], ['/about', 'About'], ['/contact', 'Contact']]

export default function Navbar({ overlay = false }) {
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { count } = useWishlist()
  const { user, logout, isAdmin } = useAuth()
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false); setMenu(false) }, [pathname])
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12)
    h(); window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  const solid = scrolled || !overlay
  const linkCls = ({ isActive }) => `relative px-1 py-2 text-sm font-medium transition ${isActive ? 'text-accent after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded after:bg-accent' : 'text-ink hover:text-accent'}`

  return (
    <header className={`sticky top-0 z-50 transition-all ${solid ? 'bg-white/95 shadow-sm backdrop-blur' : 'bg-white/95'}`}>
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={linkCls}>{label}</NavLink>)}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/wishlist" className="relative grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-primary-50" aria-label={`Wishlist, ${count} saved`}>
            <Heart size={20} />
            {count > 0 && <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">{count}</span>}
          </Link>
          <div className="relative">
            <button onClick={() => setMenu((m) => !m)} className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-primary-50" aria-label="Account menu" aria-expanded={menu}>
              {user ? <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-semibold uppercase text-white">{user.name[0]}</span> : <User size={20} />}
            </button>
            <AnimatePresence>
              {menu && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-lift">
                  {user ? (<>
                    <p className="truncate px-3 py-2 text-xs text-muted">{user.email}</p>
                    {isAdmin && <Link to="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-primary-50"><LayoutDashboard size={15} />Admin dashboard</Link>}
                    <Link to="/wishlist" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-primary-50"><Heart size={15} />My wishlist</Link>
                    <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut size={15} />Log out</button>
                  </>) : (<>
                    <Link to="/login" className="block rounded-lg px-3 py-2 text-sm hover:bg-primary-50">Log in</Link>
                    <Link to="/register" className="block rounded-lg px-3 py-2 text-sm hover:bg-primary-50">Create account</Link>
                  </>)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link to="/list-property" className="btn-primary hidden sm:inline-flex">List your property</Link>
          <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-primary-50 lg:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-line bg-white lg:hidden" aria-label="Mobile">
            <div className="container-x flex flex-col py-3">
              {links.map(([to, label]) => (
                <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `rounded-lg px-3 py-3 text-base font-medium ${isActive ? 'bg-primary-50 text-accent' : 'text-ink'}`}>{label}</NavLink>
              ))}
              <Link to="/list-property" className="btn-primary mt-3">List your property</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

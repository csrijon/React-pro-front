import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, m as motion } from 'framer-motion'
import { Search, User, Heart, ShoppingCart, Menu, X, ChevronDown, LogOut, Package, UserCircle, MapPin, Truck, Shield } from 'lucide-react'
import Logo from '../common/Logo'
import ProductArt from '../common/ProductArt'
import SearchOverlay from './SearchOverlay'
import { useCatalog } from '../../context/CatalogContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import useClickOutside from '../../hooks/useClickOutside'
import toast from 'react-hot-toast'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { label: 'Categories', menu: true },
  { to: '/brands', label: 'Brands' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const navCls = ({ isActive }) =>
  `relative py-2 text-sm font-medium transition-colors hover:text-white ${isActive ? 'text-white' : 'text-white/75'}`

function ActiveBar({ active }) {
  return <span className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded bg-brand-solid transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0'}`} />
}

function IconBadge({ count, bumpKey }) {
  if (!count) return null
  return (
    <motion.span
      key={bumpKey}
      initial={{ scale: 0.4 }} animate={{ scale: [1.5, 1] }} transition={{ duration: 0.35 }}
      className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-solid px-1 text-[10px] font-bold text-white"
    >
      {count > 99 ? '99+' : count}
    </motion.span>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [acctOpen, setAcctOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileCats, setMobileCats] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const catRef = useRef(null)
  const acctRef = useRef(null)
  const { categories } = useCatalog()
  const { count, bump } = useCart()
  const { count: wishCount } = useWishlist()
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const closeCat = useCallback(() => setCatOpen(false), [])
  const closeAcct = useCallback(() => setAcctOpen(false), [])
  useClickOutside(catRef, closeCat, catOpen)
  useClickOutside(acctRef, closeAcct, acctOpen)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close everything on navigation
  useEffect(() => {
    setCatOpen(false); setAcctOpen(false); setMobileOpen(false); setSearchOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const onLogout = () => {
    logout()
    setAcctOpen(false)
    toast.success('Signed out')
    navigate('/')
  }

  const iconBtn = 'relative flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white'

  return (
    <>
      <div className="bg-brand-dark text-center text-[11px] font-medium text-white sm:text-xs">
        <div className="container-x flex items-center justify-center gap-2 py-1.5">
          <Truck size={13} className="shrink-0" />
          <span className="truncate">Free shipping above ₹999 · Use code <b>MOTO10</b> for 10% off</span>
        </div>
      </div>

      <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? 'border-line bg-ink/90 shadow-card backdrop-blur-xl' : 'border-transparent bg-ink'}`}>
        <div className={`container-x flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? 'h-14' : 'h-16 sm:h-[72px]'}`}>
          <div className="flex items-center gap-2 lg:hidden">
            <button className={iconBtn} aria-label="Open menu" onClick={() => setMobileOpen(true)}><Menu size={22} /></button>
          </div>
          <Logo asLink />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex xl:gap-9" aria-label="Main">
            {links.map((l) =>
              l.menu ? (
                <div key="cats" ref={catRef} className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
                  <button
                    onClick={() => setCatOpen(true)} aria-expanded={catOpen} aria-haspopup="true"
                    className={`flex items-center gap-1 py-2 text-sm font-medium transition-colors hover:text-white ${catOpen || location.pathname.startsWith('/category') ? 'text-white' : 'text-white/75'}`}
                  >
                    Categories <ChevronDown size={14} className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
                    <ActiveBar active={location.pathname.startsWith('/category')} />
                  </button>
                  <AnimatePresence>
                    {catOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18 }}
                        className="absolute left-1/2 top-full z-50 w-[620px] -translate-x-1/2 pt-3"
                      >
                        <div className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-ink-800 p-3 shadow-card">
                          {categories.map((c) => (
                            <Link key={c.slug} to={`/category/${c.slug}`} className="group flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-ink-700">
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-line"><ProductArt type={c.art} color={c.color} /></div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold group-hover:text-brand-light">{c.name}</p>
                                <p className="truncate text-xs text-muted">{c.tagline}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink key={l.to} to={l.to} end={l.end} className={navCls}>
                  {({ isActive }) => <>{l.label}<ActiveBar active={isActive} /></>}
                </NavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <button className={iconBtn} aria-label="Search" onClick={() => setSearchOpen(true)}><Search size={20} /></button>

            <div ref={acctRef} className="relative hidden sm:block">
              <button className={iconBtn} aria-label="Account menu" aria-expanded={acctOpen} onClick={() => setAcctOpen((o) => !o)}>
                <User size={20} />
                {isAuthenticated && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-ink" />}
              </button>
              <AnimatePresence>
                {acctOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-line bg-ink-800 shadow-card">
                    {isAuthenticated ? (
                      <>
                        <div className="border-b border-line px-4 py-3">
                          <p className="truncate text-sm font-semibold">{user.name}</p>
                          <p className="truncate text-xs text-muted">{user.email}</p>
                        </div>
                        <div className="p-1.5 text-sm">
                          {[['/account', UserCircle, 'My Account'], ['/account/orders', Package, 'My Orders'], ['/account/wishlist', Heart, 'Wishlist'], ['/account/addresses', MapPin, 'Addresses']].map(([to, Icon, label]) => (
                            <Link key={to} to={to} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-white/85 transition hover:bg-ink-700 hover:text-white"><Icon size={16} /> {label}</Link>
                          ))}
                          {user.role === 'admin' && <Link to="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-semibold text-brand transition hover:bg-brand-soft"><Shield size={16} /> Admin Panel</Link>}
                          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-brand transition hover:bg-brand-soft"><LogOut size={16} /> Sign out</button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2 p-4">
                        <p className="text-sm text-muted">Sign in to track orders and save your wishlist.</p>
                        <Link to="/login" className="btn-primary w-full">Sign In</Link>
                        <Link to="/register" className="btn-ghost w-full">Create Account</Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/account/wishlist" className={`${iconBtn} hidden xs:flex`} aria-label={`Wishlist, ${wishCount} items`}>
              <Heart size={20} /><IconBadge count={wishCount} bumpKey={wishCount} />
            </Link>
            <Link to="/cart" className={iconBtn} aria-label={`Cart, ${count} items`}>
              <ShoppingCart size={20} /><IconBadge count={count} bumpKey={bump} />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm lg:hidden" />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-[61] flex w-[86%] max-w-sm flex-col border-r border-line bg-ink-800 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu"
            >
              <div className="flex items-center justify-between border-b border-line p-4">
                <Logo />
                <button className={iconBtn} onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={22} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <button onClick={() => { setMobileOpen(false); setSearchOpen(true) }} className="mb-3 flex w-full items-center gap-3 rounded-xl border border-line bg-ink px-4 py-3 text-sm text-muted">
                  <Search size={18} /> Search products...
                </button>
                <nav className="space-y-1" aria-label="Mobile">
                  {links.map((l) =>
                    l.menu ? (
                      <div key="cats">
                        <button onClick={() => setMobileCats((o) => !o)} aria-expanded={mobileCats} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-medium hover:bg-ink-700">
                          Categories <ChevronDown size={18} className={`transition-transform ${mobileCats ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence initial={false}>
                          {mobileCats && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="ml-3 space-y-0.5 border-l border-line py-1 pl-3">
                                {categories.map((c) => (
                                  <Link key={c.slug} to={`/category/${c.slug}`} className="block rounded-lg px-3 py-2.5 text-sm text-white/80 hover:bg-ink-700 hover:text-white">{c.name}</Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `block rounded-xl px-4 py-3 font-medium transition ${isActive ? 'bg-brand-soft text-brand' : 'hover:bg-ink-700'}`}>{l.label}</NavLink>
                    ),
                  )}
                </nav>
              </div>
              <div className="space-y-2 border-t border-line p-4">
                {isAuthenticated ? (
                  <>
                    <p className="truncate text-sm text-muted">Signed in as <b className="text-white">{user.name}</b></p>
                    <div className="grid grid-cols-2 gap-2">
                      <Link to={user.role === 'admin' ? '/admin' : '/account'} className="btn-ghost">{user.role === 'admin' ? 'Admin Panel' : 'My Account'}</Link>
                      <button onClick={() => { setMobileOpen(false); onLogout() }} className="btn-outline">Sign out</button>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/login" className="btn-primary">Sign In</Link>
                    <Link to="/register" className="btn-ghost">Register</Link>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/account/wishlist" className="btn-ghost"><Heart size={16} /> Wishlist ({wishCount})</Link>
                  <Link to="/cart" className="btn-ghost"><ShoppingCart size={16} /> Cart ({count})</Link>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>{searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}</AnimatePresence>
    </>
  )
}

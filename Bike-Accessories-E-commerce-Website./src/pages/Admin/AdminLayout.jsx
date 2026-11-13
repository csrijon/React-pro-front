import { Suspense, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, m as motion } from 'framer-motion'
import { ShieldCheck, ScrollText, LayoutDashboard, ShoppingBag, Package, Layers, Award, Users, Star, Ticket, Newspaper, HelpCircle, Quote, Inbox, Mail, Store, Menu, X, LogOut, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import Logo from '../../components/common/Logo'
import { useAuth } from '../../context/AuthContext'
import usePageTitle from '../../hooks/usePageTitle'
import { USE_MOCK } from '../../services/api'
import useFetch from '../../hooks/useFetch'
import contentService from '../../services/contentService'
import TwoFactorPanel from '../../components/forms/TwoFactorPanel'

const groups = [
  ['Overview', [['/admin', 'Dashboard', LayoutDashboard, true]]],
  ['Sales', [['/admin/orders', 'Orders', ShoppingBag], ['/admin/customers', 'Customers', Users], ['/admin/coupons', 'Coupons', Ticket]]],
  ['Catalogue', [['/admin/products', 'Products', Package], ['/admin/categories', 'Categories', Layers], ['/admin/brands', 'Brands', Award], ['/admin/reviews', 'Reviews', Star]]],
  ['Content', [['/admin/blogs', 'Blog posts', Newspaper], ['/admin/faqs', 'FAQs', HelpCircle], ['/admin/testimonials', 'Testimonials', Quote]]],
  ['Inbox', [['/admin/messages', 'Messages', Inbox], ['/admin/subscribers', 'Subscribers', Mail]]],
  ['Security', [['/admin/security', 'Two-factor auth', ShieldCheck], ['/admin/audit', 'Audit log', ScrollText]]],
]

function Sidebar({ onNavigate }) {
  return (
    <nav aria-label="Admin" className="flex-1 space-y-5 overflow-y-auto p-3">
      {groups.map(([title, items]) => (
        <div key={title}>
          <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-widest text-muted/70">{title}</p>
          {items.map(([to, label, Icon, end]) => (
            <NavLink key={to} to={to} end={end} onClick={onNavigate} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-brand-solid text-white shadow-glow' : 'text-white/75 hover:bg-ink-700 hover:text-white'}`}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  )
}

export default function AdminLayout() {
  usePageTitle('Admin')
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { data: cfg } = useFetch(() => contentService.config(), [])
  // admins must enrol in two-factor auth before any admin data is available
  const mustEnroll = !!cfg?.adminTwoFactorRequired && !user?.twoFactorEnabled
  useEffect(() => setOpen(false), [pathname])

  return (
    <div className="min-h-screen bg-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-ink-800 lg:flex">
        <div className="flex h-16 items-center justify-between border-b border-line px-5"><Link to="/admin"><Logo /></Link><span className="rounded bg-brand-soft px-2 py-0.5 text-[10px] font-bold uppercase text-brand-light">Admin</span></div>
        <Sidebar />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-50 bg-black/70 lg:hidden" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.25 }} className="fixed inset-y-0 left-0 z-[51] flex w-72 max-w-[85%] flex-col border-r border-line bg-ink-800 lg:hidden">
              <div className="flex h-16 items-center justify-between border-b border-line px-4"><Logo /><button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-full p-2 hover:bg-ink-600"><X size={20} /></button></div>
              <Sidebar onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-ink/90 px-4 backdrop-blur sm:px-6">
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg p-2 hover:bg-ink-700 lg:hidden"><Menu size={22} /></button>
          <p className="hidden text-sm text-muted lg:block">Store administration</p>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link to="/" target="_blank" className="btn-ghost px-3 py-2 text-xs sm:text-sm"><Store size={15} /> <span className="hidden xs:inline">View store</span></Link>
            <span className="hidden text-right text-xs sm:block"><b className="block text-sm">{user?.name}</b><span className="text-muted">{user?.email}</span></span>
            <button onClick={() => { logout(); toast.success('Signed out'); navigate('/login') }} aria-label="Sign out" className="rounded-lg p-2 text-brand hover:bg-brand-soft"><LogOut size={19} /></button>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          {USE_MOCK ? (
            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-center">
              <AlertTriangle className="mx-auto mb-3 text-amber-400" size={32} />
              <h1 className="text-xl font-bold">Admin needs the real backend</h1>
              <p className="mt-2 text-sm text-amber-100/80">The storefront is running on the built-in mock API. Start the server and set <code className="rounded bg-ink px-1.5 py-0.5">VITE_USE_MOCK=false</code> in <code className="rounded bg-ink px-1.5 py-0.5">.env</code> to manage products, orders and customers.</p>
            </div>
          ) : !cfg ? <div className="skeleton h-64" /> : mustEnroll ? (
            <div className="mx-auto max-w-2xl">
              <h1 className="mb-2 font-display text-2xl font-bold">Secure your admin account</h1>
              <p className="mb-6 text-sm text-muted">Two-factor authentication is required before you can use the admin panel.</p>
              <TwoFactorPanel mandatory />
            </div>
          ) : <Suspense fallback={<div className="skeleton h-64" />}><Outlet /></Suspense>}
        </main>
      </div>
    </div>
  )
}

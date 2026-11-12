import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, UserCircle, Package, Heart, MapPin, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import usePageTitle from '../../hooks/usePageTitle'

const nav = [
  { to: '/account', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/account/profile', label: 'My Profile', icon: UserCircle },
  { to: '/account/orders', label: 'My Orders', icon: Package },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
]

export default function AccountLayout() {
  usePageTitle('My Account')
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const out = () => { logout(); toast.success('Signed out'); navigate('/') }

  return (
    <div className="container-x py-8 sm:py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="hidden rounded-2xl border border-line bg-gradient-to-br from-ink-700 to-ink-800 p-5 lg:block">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand font-display text-xl font-bold shadow-glow">{user.name[0]?.toUpperCase()}</span>
              <div className="min-w-0"><p className="truncate font-bold">{user.name}</p><p className="truncate text-xs text-muted">{user.email}</p></div>
            </div>
          </div>
          <nav aria-label="Account" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:mt-4 lg:flex-col lg:gap-1 lg:overflow-visible lg:rounded-2xl lg:border lg:border-line lg:bg-ink-800 lg:p-2">
            {nav.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition lg:py-3 ${isActive ? 'bg-brand text-white shadow-glow' : 'border border-line bg-ink-800 text-white/80 hover:text-white lg:border-0 lg:bg-transparent lg:hover:bg-ink-700'}`}>
                <Icon size={18} />{label}
              </NavLink>
            ))}
            <button onClick={out} className="flex shrink-0 items-center gap-2.5 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-brand transition hover:bg-brand-soft lg:border-0 lg:py-3"><LogOut size={18} /> Sign out</button>
          </nav>
        </aside>
        <section className="min-w-0"><Outlet /></section>
      </div>
    </div>
  )
}

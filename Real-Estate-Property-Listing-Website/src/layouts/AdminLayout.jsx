import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Building2, FolderKanban, Users, UserRound, MessageSquare, CalendarDays, Star, ShieldCheck, Settings, LogOut, Menu, X, Inbox, ScrollText, FileText, MessageSquareQuote } from 'lucide-react'
import Logo from '../components/common/Logo'
import { useAuth } from '../context/AuthContext'
import { useSite } from '../context/SiteContext'
import { useLockBody } from '../hooks/useLockBody'

const nav = [
  ['/admin', 'Dashboard', LayoutDashboard, true], ['/admin/properties', 'Properties', Building2, true],   ['/admin/projects', 'Projects', FolderKanban], ['/admin/team', 'Team', Users], ['/admin/submissions', 'Submissions', Inbox], ['/admin/blog', 'Blog', FileText], ['/admin/content', 'FAQ & Testimonials', MessageSquareQuote], ['/admin/customers', 'Customers', UserRound],
  ['/admin/inquiries', 'Inquiries', MessageSquare], ['/admin/appointments', 'Appointments', CalendarDays], ['/admin/reviews', 'Reviews', Star],
  ['/admin/users', 'Users', ShieldCheck, false, true], ['/admin/activity', 'Activity log', ScrollText, false, true], ['/admin/settings', 'Settings', Settings],
]

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth()
  const { site } = useSite()
  const [open, setOpen] = useState(false)
  const [leaving, setLeaving] = useState(false) // true while logging out, so the access guard does not redirect to /login
  const { pathname } = useLocation()
  const navigate = useNavigate()
  useLockBody(open)
  useEffect(() => { setOpen(false); document.title = `Admin | ${site.company}` }, [pathname, site.company])
  if (!user || !isAdmin) return leaving ? null : <Navigate to="/login" state={{ from: pathname }} replace />

  const link = ([to, label, I, end]) => (
    <NavLink key={to} to={to} end={end} className={({ isActive }) => {
      const active = isActive
      return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
    }}><I size={18} />{label}</NavLink>
  )
  const sidebar = (
    <div className="flex h-full flex-col bg-primary p-4">
      <div className="mb-6 flex items-center justify-between px-1"><Logo light to="/admin" /><button className="text-white lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button></div>
      <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Admin">{nav.filter((n) => !n[4] || user.role === 'admin').map(link)}</nav>
      <button onClick={() => { setLeaving(true); logout(); navigate('/') }} className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"><LogOut size={18} />Logout</button>
    </div>
  )
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-screen lg:block">{sidebar}</aside>
      {open && <div className="fixed inset-0 z-[60] lg:hidden"><div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} /><div className="absolute inset-y-0 left-0 w-72 shadow-lift">{sidebar}</div></div>}
      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-white/95 px-4 backdrop-blur sm:px-8">
          <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
          <span className="hidden text-sm text-muted lg:block">Property management</span>
          <Link to="/admin/profile" className="flex items-center gap-3 rounded-full py-1 pl-3 hover:bg-slate-50" aria-label="Open my profile" title="My profile"><span className="text-sm text-muted">{user.email}</span><span className={`grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-semibold uppercase text-white ${pathname === '/admin/profile' ? 'ring-2 ring-accent ring-offset-2' : ''}`}>{user.name[0]}</span></Link>
        </header>
        <main className="p-4 sm:p-8"><Outlet /></main>
      </div>
    </div>
  )
}

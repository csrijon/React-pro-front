import { NavLink } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { LayoutDashboard, FolderKanban, Layers, Users, Inbox, Image, FileText, Settings, X } from 'lucide-react';
import { ArchMark } from '../common/Logo';

export const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/services', label: 'Services', icon: Layers },
  { to: '/admin/designers', label: 'Designers', icon: Users },
  { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
  { to: '/admin/media', label: 'Media', icon: Image },
  { to: '/admin/pages', label: 'Pages', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

function Nav({ onNavigate }) {
  return (
    <nav className="px-3 py-4 space-y-1" aria-label="Admin">
      {ADMIN_NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} onClick={onNavigate}
          className={({ isActive }) => `flex items-center gap-3 px-3 min-h-[42px] rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-forest text-cream' : 'text-cream/60 hover:bg-white/5 hover:text-cream'}`}>
          <Icon size={17} strokeWidth={1.7} />{label}
        </NavLink>
      ))}
    </nav>
  );
}

const Brand = () => (
  <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/[0.06] text-cream">
    <ArchMark className="h-7 w-6" />
    <span className="leading-none"><span className="block font-display text-xl font-semibold">Domus Studio</span><span className="text-[11px] text-cream/50">Admin</span></span>
  </div>
);

export default function AdminSidebar({ open, onClose }) {
  return (
    <>
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-60 bg-charcoal-800 border-r border-white/[0.06] z-30"><Brand /><Nav /></aside>
      <AnimatePresence>
        {open && (
          <>
            <m.div className="lg:hidden fixed inset-0 bg-black/60 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
            <m.aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-charcoal-800 z-50 border-r border-white/10" initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: 'tween', duration: 0.25 }}>
              <div className="relative"><Brand /><button onClick={onClose} aria-label="Close menu" className="absolute right-3 top-3 p-2 text-cream/70"><X size={18} /></button></div>
              <Nav onNavigate={onClose} />
            </m.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

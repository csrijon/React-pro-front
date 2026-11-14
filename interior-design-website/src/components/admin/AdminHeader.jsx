import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ExternalLink, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminHeader({ onMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const initial = (user?.name || 'A')[0].toUpperCase();
  return (
    <header className="sticky top-0 z-20 h-16 flex items-center justify-between gap-3 px-4 sm:px-6 bg-charcoal/90 backdrop-blur border-b border-white/[0.06]">
      <button className="lg:hidden h-11 w-11 grid place-items-center -ml-2 text-cream" onClick={onMenu} aria-label="Open menu"><Menu size={22} /></button>
      <div className="flex-1" />
      <Link to="/" target="_blank" className="hidden sm:inline-flex items-center gap-1.5 text-xs text-cream/60 hover:text-cream"><ExternalLink size={14} />View website</Link>
      <div className="relative" ref={ref}>
        <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 min-h-[44px] text-sm text-cream" aria-expanded={open} aria-haspopup="menu">
          <span className="h-8 w-8 rounded-full bg-forest border border-sage/40 grid place-items-center text-xs font-bold">{initial}</span>
          <span className="hidden sm:block">{user?.name || 'Admin'}</span><ChevronDown size={14} className="opacity-60" />
        </button>
        {open && (
          <div role="menu" className="absolute right-0 mt-1 w-48 bg-charcoal-700 border border-white/10 rounded-md shadow-xl py-1 text-sm">
            <p className="px-3 py-2 text-xs text-cream/50 truncate">{user?.email}</p>
            <button role="menuitem" className="w-full flex items-center gap-2 px-3 py-2.5 text-cream/80 hover:bg-white/5" onClick={() => { setOpen(false); navigate('/admin/settings'); }}><Settings size={15} />Settings</button>
            <button role="menuitem" className="w-full flex items-center gap-2 px-3 py-2.5 text-cream/80 hover:bg-white/5" onClick={() => { logout(); navigate('/admin/login'); }}><LogOut size={15} />Sign out</button>
          </div>
        )}
      </div>
    </header>
  );
}

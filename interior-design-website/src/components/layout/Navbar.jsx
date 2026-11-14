import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '../common/Logo';
import Button from '../common/Button';
import { useSite } from '../../context/SiteContext';

/** Visible menu items, as configured in Admin → Pages → Site-wide. */
export const useNav = () => useSite().site.nav.filter((n) => n.visible !== false);

export default function Navbar() {
  const NAV = useNav();
  const { site } = useSite();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream/95 backdrop-blur border-b border-forest/10' : 'bg-cream'}`}>
      <div className="shell flex h-[76px] items-center justify-between">
        <Logo />
        <nav className="hidden lg:flex items-center gap-9" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'}
              className={({ isActive }) => `link-u text-[13px] font-semibold ${isActive ? 'text-forest after:w-full' : 'text-charcoal/80 hover:text-forest'}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:block"><Button to="/contact" arrow>{site.ctaLabel}</Button></div>
        <button className="lg:hidden h-11 w-11 grid place-items-center -mr-2 text-forest" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <m.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-x-0 top-[76px] bottom-0 bg-cream overflow-y-auto">
            <nav className="shell py-8 flex flex-col" aria-label="Mobile">
              {NAV.map((n, i) => (
                <m.div key={n.to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <NavLink to={n.to} end={n.to === '/'} className={({ isActive }) => `block py-4 border-b border-forest/10 font-display text-3xl ${isActive ? 'text-forest' : 'text-charcoal'}`}>{n.label}</NavLink>
                </m.div>
              ))}
              <Button to="/contact" arrow className="mt-8 w-full">{site.ctaLabel}</Button>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

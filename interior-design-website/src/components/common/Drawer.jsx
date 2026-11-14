import { useEffect, useRef } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

const WIDTHS = { md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-3xl' };

/** Right-side slide-in panel used for every add / edit / view form in the admin. */
export default function Drawer({ open, onClose, onExited, title, subtitle, children, footer, size = 'lg' }) {
  const reduce = useReducedMotion();
  const panel = useRef(null);

  // Keep the latest onClose in a ref so the effect below runs only when the drawer opens/closes.
  // (Re-running it on every render stole focus from inputs while typing.)
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && closeRef.current();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!panel.current?.contains(document.activeElement)) panel.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open]);

  const t = reduce ? { duration: 0 } : { type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.38 };
  return (
    <AnimatePresence onExitComplete={onExited}>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <m.div className="absolute inset-0 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.25 }} onClick={onClose} aria-hidden="true" />
          <m.aside ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={t}
            className={`absolute right-0 top-0 bottom-0 w-full ${WIDTHS[size]} flex flex-col bg-charcoal border-l border-white/10 shadow-2xl text-cream outline-none`}>
            <header className="flex items-center justify-between gap-3 px-5 h-16 shrink-0 border-b border-white/10 bg-charcoal-800">
              <div className="min-w-0"><h2 className="font-sans text-base font-semibold truncate">{title}</h2>{subtitle && <p className="text-xs text-cream/50 truncate">{subtitle}</p>}</div>
              <button onClick={onClose} aria-label="Close panel" className="h-10 w-10 -mr-2 grid place-items-center rounded-md text-cream/70 hover:text-cream hover:bg-white/5"><X size={18} /></button>
            </header>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
            {footer && <footer className="shrink-0 flex flex-wrap justify-end gap-2 px-5 py-3 border-t border-white/10 bg-charcoal-800">{footer}</footer>}
          </m.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

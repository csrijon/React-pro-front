import { useEffect } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, wide = false, dark = true }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <m.div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
          <m.div role="dialog" aria-modal="true" aria-label={title}
            initial={{ y: 30, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.25 }}
            className={`relative w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-md'} max-h-[92vh] overflow-y-auto shadow-2xl ${dark ? 'bg-charcoal border border-white/10 text-cream rounded-t-xl sm:rounded-lg' : 'bg-cream text-charcoal'}`}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 sticky top-0 bg-inherit z-10">
              <h2 className={`${dark ? 'font-sans text-base font-semibold' : 'text-2xl'}`}>{title}</h2>
              <button onClick={onClose} aria-label="Close" className="p-2 -mr-2 opacity-70 hover:opacity-100"><X size={18} /></button>
            </div>
            <div className="p-5">{children}</div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

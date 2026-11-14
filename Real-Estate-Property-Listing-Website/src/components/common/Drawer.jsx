import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useLockBody } from '../../hooks/useLockBody'

const stack = [] // open drawers, last = top. Esc only closes the top one.

/** A panel that slides in from the right edge (full width on phones). Esc, the backdrop and the close button all close it. */
export default function Drawer({ open, onClose, title, subtitle, children, width = 'max-w-3xl' }) {
  useLockBody(open)
  const panel = useRef(null)
  useEffect(() => {
    if (!open) return
    const token = {}
    stack.push(token)
    const onKey = (e) => e.key === 'Escape' && stack[stack.length - 1] === token && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.activeElement
    panel.current?.focus()
    return () => { window.removeEventListener('keydown', onKey); stack.splice(stack.indexOf(token), 1); prev?.focus?.() }
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.div className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title}
            className={`absolute inset-y-0 right-0 flex w-full ${width} flex-col bg-surface shadow-lift outline-none`}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}>
            <header className="flex items-start justify-between gap-4 border-b border-line bg-white px-5 py-4 sm:px-6">
              <div className="min-w-0"><h2 className="truncate text-lg font-semibold">{title}</h2>{subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}</div>
              <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-slate-100" aria-label="Close panel"><X size={20} /></button>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}

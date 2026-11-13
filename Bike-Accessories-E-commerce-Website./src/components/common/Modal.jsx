import { useEffect } from 'react'
import { AnimatePresence, m as motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[75] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} role="dialog" aria-modal="true" aria-label={title}
            className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-line bg-ink-800 shadow-card sm:rounded-3xl ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'}`}>
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-lg font-bold">{title}</h2>
              <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-muted hover:bg-ink-600 hover:text-white"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLockBody } from '../../hooks/useLockBody'

export default function Lightbox({ images, index, onClose, onChange }) {
  const open = index !== null && index !== undefined
  useLockBody(open)
  const next = () => onChange((index + 1) % images.length)
  const prev = () => onChange((index - 1 + images.length) % images.length)
  useEffect(() => {
    if (!open) return
    const h = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          role="dialog" aria-modal="true" aria-label="Image preview" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Close preview"><X /></button>
          {images.length > 1 && <button onClick={prev} className="absolute left-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Previous image"><ChevronLeft /></button>}
          <AnimatePresence mode="wait">
            <motion.img key={index} src={images[index]} alt={`Photo ${index + 1} of ${images.length}`} className="max-h-[85vh] max-w-full rounded-xl object-contain"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} />
          </AnimatePresence>
          {images.length > 1 && <button onClick={next} className="absolute right-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Next image"><ChevronRight /></button>}
          <span className="absolute bottom-4 rounded-full bg-white/10 px-3 py-1 text-xs text-white">{index + 1} / {images.length}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

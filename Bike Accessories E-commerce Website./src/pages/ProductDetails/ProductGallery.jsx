import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import ProductImage from '../../components/products/ProductImage'

const VIEWS = ['Front', 'Angle', 'Detail', 'Alt']

/**
 * Gallery with thumbnails, hover-zoom (desktop) and a fullscreen lightbox.
 * With real photos, pass product.images (array) - the thumbnails/zoom work unchanged.
 */
export default function ProductGallery({ product, color }) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 })
  const [lightbox, setLightbox] = useState(false)
  const views = product.images?.length ? product.images : VIEWS.map((_, i) => i)
  const render = (v, i, cls = '') =>
    product.images?.length ? <ProductImage product={{ ...product, image: v }} className={cls} /> : <ProductImage product={product} variant={i} color={color} className={cls} />

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowRight') setActive((a) => (a + 1) % views.length)
      if (e.key === 'ArrowLeft') setActive((a) => (a - 1 + views.length) % views.length)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [lightbox, views.length])

  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
      <div className="flex gap-2.5 sm:flex-col" role="tablist" aria-label="Product images">
        {views.map((v, i) => (
          <button key={i} role="tab" aria-selected={i === active} aria-label={`View ${i + 1}`} onClick={() => setActive(i)}
            className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-20 ${i === active ? 'border-brand' : 'border-line opacity-70 hover:opacity-100'}`}>
            {render(v, i)}
          </button>
        ))}
      </div>

      <div className="relative min-w-0 flex-1">
        <div
          className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-ink-800"
          onMouseMove={move} onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))} onClick={() => setLightbox(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div key={`${active}-${color}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full w-full">
              <div className="h-full w-full transition-transform duration-200 ease-out" style={{ transform: zoom.on ? 'scale(1.9)' : 'scale(1)', transformOrigin: `${zoom.x}% ${zoom.y}%` }}>
                {render(views[active], active)}
              </div>
            </motion.div>
          </AnimatePresence>
          <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-xs text-muted backdrop-blur"><ZoomIn size={14} /> Hover to zoom</span>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 backdrop-blur" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={() => setLightbox(false)}>
            <button aria-label="Close" className="absolute right-4 top-4 rounded-full bg-ink-700 p-2.5 hover:bg-brand"><X size={22} /></button>
            <button aria-label="Previous image" onClick={(e) => { e.stopPropagation(); setActive((a) => (a - 1 + views.length) % views.length) }} className="absolute left-3 rounded-full bg-ink-700 p-3 hover:bg-brand sm:left-8"><ChevronLeft size={22} /></button>
            <div onClick={(e) => e.stopPropagation()} className="aspect-square w-full max-w-[min(90vw,80vh)] overflow-hidden rounded-2xl border border-line">{render(views[active], active)}</div>
            <button aria-label="Next image" onClick={(e) => { e.stopPropagation(); setActive((a) => (a + 1) % views.length) }} className="absolute right-3 rounded-full bg-ink-700 p-3 hover:bg-brand sm:right-8"><ChevronRight size={22} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

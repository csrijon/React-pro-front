import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Expand } from 'lucide-react'
import Lightbox from './Lightbox'
import Img from './Img'

export default function Gallery({ images, alt = '' }) {
  const [i, setI] = useState(0)
  const [open, setOpen] = useState(null)
  return (
    <div>
      <div className="grid gap-3 lg:grid-cols-[1fr_9rem]">
        <button onClick={() => setOpen(i)} className="group relative block aspect-[16/10] overflow-hidden rounded-2xl text-left" aria-label="Open full-screen preview">
          <AnimatePresence mode="wait">
            <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <Img src={images[i]} alt={`${alt} – photo ${i + 1}`} eager className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
            </motion.div>
          </AnimatePresence>
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-black/55 px-2.5 py-1.5 text-xs font-medium text-white"><Expand size={13} />{images.length} photos</span>
        </button>
        <div className="flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
          {images.slice(0, 4).map((src, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Show photo ${k + 1}`} aria-pressed={i === k}
              className={`relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-xl border-2 transition lg:w-full ${i === k ? 'border-accent' : 'border-transparent opacity-80 hover:opacity-100'}`}>
              <Img src={src} alt="" className="h-full w-full object-cover" />
              {k === 3 && images.length > 4 && <span className="absolute inset-0 grid place-items-center bg-black/50 text-sm font-semibold text-white">+{images.length - 4}</span>}
            </button>
          ))}
        </div>
      </div>
      <Lightbox images={images} index={open} onClose={() => setOpen(null)} onChange={setOpen} />
    </div>
  )
}

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import useFetch from '../../hooks/useFetch'
import contentService from '../../services/contentService'
import SectionHeading from '../common/SectionHeading'
import Rating from '../common/Rating'
import { Skeleton } from '../common/Skeletons'
import { ErrorState } from '../common/States'

export default function Testimonials() {
  const { data, loading, error, reload } = useFetch(() => contentService.testimonials(), [])
  const [i, setI] = useState(0)

  return (
    <section className="border-y border-line bg-ink-800/60">
      <div className="container-x py-14 sm:py-20">
        <SectionHeading eyebrow="Rider Stories" title="Loved by 50,000+ Riders" />
        {loading ? <Skeleton className="h-56 w-full" /> : error ? <ErrorState message={error.message} onRetry={reload} /> : (
          <>
            <div className="hidden gap-5 lg:grid lg:grid-cols-4">
              {data.map((t) => <Card key={t.id} t={t} />)}
            </div>
            <div className="lg:hidden">
              <AnimatePresence mode="wait">
                <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                  <Card t={data[i]} />
                </motion.div>
              </AnimatePresence>
              <div className="mt-5 flex items-center justify-center gap-4">
                <button aria-label="Previous review" onClick={() => setI((i - 1 + data.length) % data.length)} className="flex h-10 w-10 items-center justify-center rounded-full border border-line hover:border-brand"><ChevronLeft size={18} /></button>
                <span className="text-sm text-muted">{i + 1} / {data.length}</span>
                <button aria-label="Next review" onClick={() => setI((i + 1) % data.length)} className="flex h-10 w-10 items-center justify-center rounded-full border border-line hover:border-brand"><ChevronRight size={18} /></button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function Card({ t }) {
  return (
    <figure className="relative flex h-full flex-col rounded-2xl border border-line bg-ink-700 p-6">
      <Quote size={28} className="absolute right-5 top-5 text-brand/30" />
      <Rating value={t.rating} size={16} />
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-white/85">“{t.text}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-bold">{t.name[0]}</span>
        <span className="min-w-0"><b className="block truncate text-sm">{t.name}</b><span className="block truncate text-xs text-muted">{t.bike} · {t.city}</span></span>
      </figcaption>
    </figure>
  )
}

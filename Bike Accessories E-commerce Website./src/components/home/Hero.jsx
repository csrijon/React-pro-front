import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { photo } from '../../utils/images'

const slides = [
  { badge: 'Bike Accessories Store', lines: ['Upgrade', 'Your Ride'], text: 'Premium bike accessories, riding gear and performance essentials for every rider.', img: 'ducati', cta: '/shop', cta2: '/shop' },
  { badge: 'New Season Collection', lines: ['Gear Up', 'For Every Mile'], text: 'Armoured jackets, certified helmets and weather-proof boots built for the long road.', img: 'roadRider', cta: '/category/riding-jackets', cta2: '/shop' },
  { badge: 'Ride Smart, Ride Safe', lines: ['Protection', 'Meets Style'], text: 'ISI & DOT certified helmets with race-bred graphics - from ₹1,399.', img: 'sunsetRider', cta: '/category/helmets', cta2: '/shop' },
]

export default function Hero() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [paused])
  const s = slides[i]

  return (
    <section className="relative overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel" aria-label="Featured offers">
      {/* image layer */}
      <div className="absolute inset-0 lg:left-[38%]">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand to-brand-dark lg:[clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]" />
        <AnimatePresence mode="sync">
          <motion.img
            key={s.img} src={photo(s.img, 1600)} alt="" fetchPriority="high"
            initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1 }}
            className="absolute inset-0 h-full w-full object-cover object-[65%_center] lg:[clip-path:polygon(24%_0,100%_0,100%_100%,2%_100%)]"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/10 lg:from-ink/70 lg:via-transparent lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50" />
      </div>

      <div className="container-x relative">
        <div className="flex min-h-[520px] flex-col justify-center py-16 sm:min-h-[580px] lg:min-h-[620px] lg:max-w-[46%]">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}>
              <span className="inline-block rounded-md border border-line bg-ink-800/80 px-3 py-1.5 text-xs font-medium backdrop-blur">{s.badge}</span>
              <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                {s.lines[0]}<br /><span className="text-brand">{s.lines[1]}</span>
              </h1>
              <p className="mt-5 max-w-md text-base text-white/85 sm:text-lg">{s.text}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={s.cta} className="btn-primary px-7 py-3.5 text-base">Shop Now <ArrowRight size={18} /></Link>
                <Link to="/shop" className="btn-ghost rounded-full px-7 py-3.5 text-base">Explore Categories</Link>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-10 flex gap-2" role="tablist" aria-label="Slides">
            {slides.map((_, n) => (
              <button key={n} role="tab" aria-selected={n === i} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)}
                className={`h-2 rounded-full transition-all ${n === i ? 'w-8 bg-brand' : 'w-2 bg-white/40 hover:bg-white/70'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import SectionHeading from '../common/SectionHeading'
import BrandMark from '../common/BrandMark'
import { useCatalog } from '../../context/CatalogContext'

export default function BrandStrip() {
  const { brands } = useCatalog()
  const loop = [...brands, ...brands]
  return (
    <section className="py-14 sm:py-16">
      <div className="container-x"><SectionHeading eyebrow="Top Brands" title="Popular Motorcycle Brands" to="/brands" linkLabel="All Brands" /></div>
      <div className="relative overflow-hidden border-y border-line bg-ink-800/50 py-6 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {loop.map((b, i) => (
            <Link key={i} to={`/brands/${b.slug}`} aria-hidden={i >= brands.length} tabIndex={i >= brands.length ? -1 : 0}
              className="flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-line bg-ink-700 text-white/80 transition hover:border-brand hover:text-white">
              <BrandMark brand={b} className="text-xl" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

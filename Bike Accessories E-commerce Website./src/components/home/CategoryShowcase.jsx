import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductArt from '../common/ProductArt'
import SectionHeading from '../common/SectionHeading'
import { categories } from '../../data/categories'

export default function CategoryShowcase() {
  return (
    <section className="container-x pt-14 sm:pt-20">
      <SectionHeading eyebrow="Browse" title="Shop by Category" to="/shop" linkLabel="View All Products" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {categories.map((c, i) => (
          <motion.div key={c.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: (i % 5) * 0.06 }}>
            <Link to={`/category/${c.slug}`} className="group block overflow-hidden rounded-2xl border border-line bg-ink-700 transition hover:-translate-y-1 hover:border-brand/70 hover:shadow-glow">
              <div className="aspect-[4/3] overflow-hidden">
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-110"><ProductArt type={c.art} color={c.color} /></div>
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-4">
                <span className="truncate text-sm font-semibold">{c.name}</span>
                <span className="text-brand transition group-hover:translate-x-1">→</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

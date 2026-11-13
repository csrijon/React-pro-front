import { useState } from 'react'
import { Link } from 'react-router-dom'
import { m as motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import ProductImage from './ProductImage'
import WishlistButton from './WishlistButton'
import Rating from '../common/Rating'
import { useCart } from '../../context/CartContext'
import { formatPrice, discountPercent } from '../../utils/format'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [picking, setPicking] = useState(false)
  const off = discountPercent(product.price, product.mrp)
  const soldOut = product.stock <= 0
  const needsSize = product.sizes?.length > 0

  const commit = (size) => {
    addItem(product, { size })
    setPicking(false)
    setAdded(true)
    toast.success(`${product.name}${size ? ` (${size})` : ''} added to cart`, { id: `cart-${product.id}` })
    setTimeout(() => setAdded(false), 1600)
  }
  const onAdd = () => (needsSize ? setPicking(true) : commit(null))

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-700 transition duration-300 hover:-translate-y-1.5 hover:border-brand/60 hover:shadow-card">
      <div className="relative">
        <Link to={`/product/${product.slug}`} className="block aspect-square overflow-hidden bg-ink-800" aria-label={product.name}>
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
            <ProductImage product={product} />
          </div>
        </Link>
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {soldOut ? (
            <span className="rounded bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted ring-1 ring-line">Sold Out</span>
          ) : product.bestseller ? (
            <span className="rounded bg-brand-solid px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">Bestseller</span>
          ) : product.isNew ? (
            <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">New</span>
          ) : null}
        </div>
        <WishlistButton product={product} className="absolute right-3 top-3" />

        <AnimatePresence>
          {picking && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/90 p-4 backdrop-blur-sm"
            >
              <button onClick={() => setPicking(false)} aria-label="Close size picker" className="absolute right-2 top-2 rounded-full p-1.5 text-muted hover:text-white"><X size={16} /></button>
              <p className="text-sm font-semibold">Select size</p>
              <div className="flex flex-wrap justify-center gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => commit(s)} className="h-9 min-w-9 rounded-lg border border-line px-2 text-sm font-medium transition hover:border-brand hover:bg-brand-solid">{s}</button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link to={`/product/${product.slug}`} className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug transition-colors hover:text-brand-light sm:text-[15px]">
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-1 text-xs text-muted">{product.subtitle}</p>
        {product.reviewCount > 0 ? <Rating value={product.rating} count={product.reviewCount} className="mt-2" /> : <p className="mt-2 text-xs text-muted">No reviews yet</p>}
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-base font-bold sm:text-lg">{formatPrice(product.price)}</span>
          <span className="text-xs text-muted line-through">{formatPrice(product.mrp)}</span>
          {off > 0 && <span className="rounded bg-brand-soft px-1.5 py-0.5 text-[11px] font-bold text-brand-light">-{off}%</span>}
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={soldOut}
          className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${
            added ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-brand text-brand hover:bg-brand-solid hover:text-white'
          }`}
        >
          {added ? <><Check size={16} /> Added</> : <><ShoppingCart size={16} /> {soldOut ? 'Out of Stock' : 'Add to Cart'}</>}
        </button>
      </div>
    </article>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { m as motion } from 'framer-motion'
import { Check, Heart, RotateCcw, Share2, ShieldCheck, ShoppingCart, Truck, Zap, MapPin, Ruler } from 'lucide-react'
import toast from 'react-hot-toast'
import ProductGallery from './ProductGallery'
import ReviewsTab from './ReviewsTab'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Rating from '../../components/common/Rating'
import QuantitySelector from '../../components/common/QuantitySelector'
import SectionHeading from '../../components/common/SectionHeading'
import { ErrorState } from '../../components/common/States'
import { Skeleton } from '../../components/common/Skeletons'
import ProductRow from '../../components/products/ProductRow'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import useFetch from '../../hooks/useFetch'
import useRecentlyViewed from '../../hooks/useRecentlyViewed'
import usePageTitle from '../../hooks/usePageTitle'
import productService from '../../services/productService'
import { formatPrice, discountPercent } from '../../utils/format'
import { isPincode } from '../../utils/validators'
import NotFound from '../NotFound'

function Loading() {
  return (
    <div className="container-x grid grid-cols-1 gap-10 py-10 lg:grid-cols-2" role="status" aria-label="Loading product">
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-4"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-3/4" /><Skeleton className="h-5 w-1/3" /><Skeleton className="h-12 w-1/2" /><Skeleton className="h-24 w-full" /><Skeleton className="h-12 w-full" /></div>
    </div>
  )
}

export default function ProductDetails() {
  const { slug } = useParams()
  const { data: product, loading, error, reload } = useFetch(() => productService.get(slug), [slug])
  usePageTitle(product?.name)
  const { track, get } = useRecentlyViewed()
  const [recent, setRecent] = useState([])

  useEffect(() => {
    if (!product) return
    setRecent(get().filter((id) => id !== product.id).slice(0, 4))
    track(product.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id])

  if (loading) return <Loading />
  if (error) return error.status === 404 ? <NotFound /> : <div className="container-x py-16"><ErrorState message={error.message} onRetry={reload} /></div>
  return <Details key={product.id} product={product} recent={recent} />
}

function Details({ product, recent }) {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const [color, setColor] = useState(product.colors[0])
  const [size, setSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [tab, setTab] = useState('description')
  const [pin, setPin] = useState('')
  const [pinMsg, setPinMsg] = useState(null)
  const [added, setAdded] = useState(false)

  const off = discountPercent(product.price, product.mrp)
  const soldOut = product.stock <= 0
  const lowStock = product.stock > 0 && product.stock <= 10
  const needsSize = product.sizes.length > 0

  const validate = () => {
    if (needsSize && !size) { setSizeError(true); toast.error('Please select a size'); return false }
    return true
  }
  const add = () => {
    if (!validate()) return false
    addItem(product, { qty, size, color: color.name })
    setAdded(true); setTimeout(() => setAdded(false), 1600)
    toast.success(`${qty} × ${product.name} added to cart`, { id: `cart-${product.id}` })
    return true
  }
  const buyNow = () => {
    if (!validate()) return
    addItem(product, { qty, size, color: color.name })
    navigate('/checkout')
  }
  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: product.name, url })
      else { await navigator.clipboard.writeText(url); toast.success('Link copied to clipboard') }
    } catch { /* user cancelled */ }
  }
  const checkPin = (e) => {
    e.preventDefault()
    if (!isPincode(pin)) return setPinMsg({ ok: false, text: 'Enter a valid 6-digit pincode' })
    const d = new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
    setPinMsg({ ok: true, text: `Delivery available. Get it by ${d}` })
  }

  const tabs = useMemo(() => [['description', 'Description'], ['specs', 'Specifications'], ['reviews', `Reviews (${product.reviewCount.toLocaleString('en-IN')})`]], [product.reviewCount])
  const wished = has(product.id)

  return (
    <div className="container-x pb-28 pt-6 lg:pb-8">
      <Breadcrumbs className="mb-6" items={[{ label: product.categoryName, to: `/category/${product.category}` }, { label: product.name }]} />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        <ProductGallery product={product} color={color.hex} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.bestseller && <span className="rounded bg-brand-solid px-2 py-0.5 text-[11px] font-bold uppercase">Bestseller</span>}
            {product.isNew && <span className="rounded bg-white px-2 py-0.5 text-[11px] font-bold uppercase text-ink">New</span>}
            <Link to={`/brands/${product.brand}`} className="inline-block py-1.5 text-sm font-semibold uppercase tracking-wider text-brand-light hover:underline">{product.brandName}</Link>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-4xl">{product.name}</h1>
          <button onClick={() => { setTab('reviews'); document.getElementById('details-tabs')?.scrollIntoView({ behavior: 'smooth' }) }} className="mt-3 flex items-center gap-2" aria-label="Jump to reviews">
            <Rating value={product.rating} showValue size={16} />
            <span className="text-sm text-muted underline-offset-2 hover:underline">({product.reviewCount.toLocaleString('en-IN')} reviews)</span>
          </button>

          <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="font-display text-4xl font-bold">{formatPrice(product.price)}</span>
            <span className="pb-1 text-lg text-muted line-through">{formatPrice(product.mrp)}</span>
            {off > 0 && <span className="mb-1 rounded bg-brand-solid px-2 py-0.5 text-sm font-bold">-{off}%</span>}
          </div>
          <p className="mt-1 text-xs text-muted">Inclusive of all taxes · You save {formatPrice(product.mrp - product.price)}</p>

          <p className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${soldOut ? 'text-brand-light' : 'text-emerald-400'}`}>
            <span className={`h-2 w-2 rounded-full ${soldOut ? 'bg-brand-solid' : 'bg-emerald-400'}`} />
            {soldOut ? 'Out of stock' : lowStock ? `Only ${product.stock} left in stock - order soon` : 'In stock'}
          </p>

          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-2xl border border-line bg-ink-800 p-4 text-sm">
            {product.features.map((f) => <li key={f} className="flex items-center gap-2 text-white/85"><Check size={15} className="shrink-0 text-brand" />{f}</li>)}
          </ul>

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold">Color: <span className="font-normal text-muted">{color.name}</span></p>
            <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Color">
              {product.colors.map((c) => (
                <button key={c.name} role="radio" aria-checked={c.name === color.name} aria-label={c.name} title={c.name} onClick={() => setColor(c)}
                  className={`h-9 w-9 rounded-full border-2 p-0.5 transition ${c.name === color.name ? 'border-brand' : 'border-line hover:border-white/50'}`}>
                  <span className="block h-full w-full rounded-full" style={{ background: c.hex }} />
                </button>
              ))}
            </div>
          </div>

          {needsSize && (
            <motion.div className="mt-6" animate={sizeError ? { x: [0, -8, 8, -6, 6, 0] } : {}} transition={{ duration: 0.4 }} onAnimationComplete={() => setSizeError(false)}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">Size {size && <span className="font-normal text-muted">: {size}</span>}</p>
                <button onClick={() => { setTab('specs'); document.getElementById('details-tabs')?.scrollIntoView({ behavior: 'smooth' }) }} className="flex items-center gap-1 text-xs font-semibold text-brand-light hover:underline"><Ruler size={13} /> Size guide</button>
              </div>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
                {product.sizes.map((s) => (
                  <button key={s} role="radio" aria-checked={s === size} onClick={() => setSize(s)}
                    className={`h-11 min-w-12 rounded-lg border px-3 text-sm font-semibold transition ${s === size ? 'border-brand bg-brand-solid text-white' : `${sizeError ? 'border-brand/70' : 'border-line'} hover:border-white/60`}`}>{s}</button>
                ))}
              </div>
              {sizeError && <p role="alert" className="mt-2 text-xs text-brand-light">Please select a size to continue</p>}
            </motion.div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <QuantitySelector value={qty} onChange={setQty} max={Math.min(10, product.stock || 1)} />
            <button onClick={toggle.bind(null, product)} aria-pressed={wished} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'} className="flex h-10 w-10 items-center justify-center rounded-lg border border-line transition hover:border-brand">
              <Heart size={18} className={wished ? 'fill-brand text-brand' : ''} />
            </button>
            <button onClick={share} aria-label="Share product" className="flex h-10 w-10 items-center justify-center rounded-lg border border-line transition hover:border-brand"><Share2 size={18} /></button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button onClick={add} disabled={soldOut} className="btn-primary py-3.5">
              {added ? <><Check size={18} /> Added to Cart</> : <><ShoppingCart size={18} /> {soldOut ? 'Out of Stock' : 'Add to Cart'}</>}
            </button>
            <button onClick={buyNow} disabled={soldOut} className="btn-ghost py-3.5"><Zap size={18} /> Buy Now</button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 border-y border-line py-5 text-center text-xs text-muted">
            <div className="flex flex-col items-center gap-1.5"><Truck size={20} className="text-brand" /><span>Free Shipping<br />Above ₹999</span></div>
            <div className="flex flex-col items-center gap-1.5"><RotateCcw size={20} className="text-brand" /><span>7 Days<br />Return</span></div>
            <div className="flex flex-col items-center gap-1.5"><ShieldCheck size={20} className="text-brand" /><span>Secure<br />Payment</span></div>
          </div>

          <form onSubmit={checkPin} className="mt-5" noValidate>
            <label htmlFor="pin" className="mb-2 flex items-center gap-2 text-sm font-semibold"><MapPin size={16} className="text-brand-light" /> Check delivery</label>
            <div className="flex gap-2">
              <input id="pin" inputMode="numeric" maxLength={6} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setPinMsg(null) }} placeholder="Enter pincode" className="input max-w-[200px] py-2.5" />
              <button className="btn-ghost py-2.5">Check</button>
            </div>
            {pinMsg && <p role="status" className={`mt-2 text-sm ${pinMsg.ok ? 'text-emerald-400' : 'text-brand-light'}`}>{pinMsg.text}</p>}
          </form>
        </div>
      </div>

      {/* Tabs */}
      <section id="details-tabs" className="mt-14 scroll-mt-24">
        <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line" role="tablist">
          {tabs.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`relative shrink-0 px-5 py-3 text-sm font-semibold transition ${tab === k ? 'text-white' : 'text-muted hover:text-white'}`}>
              {l}{tab === k && <motion.span layoutId="tabline" className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-solid" />}
            </button>
          ))}
        </div>
        <div className="pt-8" role="tabpanel">
          {tab === 'description' && (
            <div className="max-w-3xl">
              <p className="leading-relaxed text-muted">{product.description}</p>
              <h2 className="mb-3 mt-6 font-bold">Highlights</h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">{product.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm text-white/85"><Check size={15} className="text-brand-light" />{f}</li>)}</ul>
            </div>
          )}
          {tab === 'specs' && (
            <div className="max-w-3xl overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-sm"><tbody>
                {product.specs.map((s, i) => <tr key={s.label} className={i % 2 ? 'bg-ink-800' : 'bg-ink-700'}><th scope="row" className="w-2/5 px-5 py-3 text-left font-medium text-muted">{s.label}</th><td className="px-5 py-3">{s.value}</td></tr>)}
                {product.sizes.length > 0 && <tr className="bg-ink-800"><th scope="row" className="px-5 py-3 text-left font-medium text-muted">Available sizes</th><td className="px-5 py-3">{product.sizes.join(', ')}</td></tr>}
              </tbody></table>
            </div>
          )}
          {tab === 'reviews' && <ReviewsTab product={product} />}
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading eyebrow="You may also like" title="Related Products" />
        <ProductRow fetcher={() => productService.related(product.slug)} count={4} />
      </section>

      {recent.length > 0 && (
        <section className="mt-16">
          <SectionHeading eyebrow="Pick up where you left off" title="Recently Viewed" />
          <ProductRow ids={recent} count={recent.length} />
        </section>
      )}

      {/* Sticky mobile purchase bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 p-3 backdrop-blur lg:hidden">
        <div className="container-x flex items-center gap-3 !px-1">
          <div className="min-w-0"><p className="text-lg font-bold leading-none">{formatPrice(product.price)}</p><p className="truncate text-xs text-muted line-through">{formatPrice(product.mrp)}</p></div>
          <button onClick={add} disabled={soldOut} className="btn-primary flex-1 py-3"><ShoppingCart size={17} /> {soldOut ? 'Sold Out' : 'Add to Cart'}</button>
        </div>
      </div>
    </div>
  )
}

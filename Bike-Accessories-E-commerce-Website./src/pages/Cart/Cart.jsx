import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, ShoppingBag, Trash2, Lock, Truck } from 'lucide-react'
import CartItem from '../../components/cart/CartItem'
import CouponBox from '../../components/cart/CouponBox'
import OrderSummary from '../../components/cart/OrderSummary'
import { EmptyState } from '../../components/common/States'
import SectionHeading from '../../components/common/SectionHeading'
import ProductRow from '../../components/products/ProductRow'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import usePageTitle from '../../hooks/usePageTitle'
import { formatPrice } from '../../utils/format'
import { FREE_SHIPPING_ABOVE } from '../../utils/pricing'

export default function Cart() {
  usePageTitle('Shopping Cart')
  const { items, count, totals, coupon, clear } = useCart()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  if (!items.length)
    return (
      <div className="container-x py-12 sm:py-16">
        <EmptyState icon={ShoppingBag} title="Your cart is empty" text="Looks like you haven’t added any gear yet. Explore our best sellers and gear up for your next ride." action="Start Shopping" to="/shop" />
        <div className="mt-14"><SectionHeading eyebrow="Start here" title="Best Sellers" /><ProductRow params={{ tag: 'bestseller' }} count={4} /></div>
      </div>
    )

  const progress = Math.min(100, (totals.subtotal / FREE_SHIPPING_ABOVE) * 100)

  return (
    <div className="container-x py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Your Cart <span className="text-lg font-medium text-muted">({count} item{count === 1 ? '' : 's'})</span></h1>
        <button onClick={clear} className="flex items-center gap-1.5 text-sm text-muted transition hover:text-brand-light"><Trash2 size={15} /> Clear cart</button>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-4 rounded-2xl border border-line bg-ink-800 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm"><Truck size={16} className="text-brand-light" />
              {totals.freeShippingLeft > 0 ? <>Add <b>{formatPrice(totals.freeShippingLeft)}</b> more for <b className="text-emerald-400">free shipping</b></> : <b className="text-emerald-400">You’ve unlocked free shipping!</b>}
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-gradient-to-r from-brand-dark to-brand transition-all duration-500" style={{ width: `${progress}%` }} /></div>
          </div>
          <ul className="space-y-3">
            <AnimatePresence initial={false}>{items.map((it) => <CartItem key={it.key} item={it} />)}</AnimatePresence>
          </ul>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-light hover:text-white"><ArrowLeft size={16} /> Continue Shopping</Link>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-line bg-ink-800 p-5">
            <h2 className="mb-3 text-sm font-bold">Have a coupon?</h2>
            <CouponBox />
          </div>
          <div className="rounded-2xl border border-line bg-ink-800 p-5">
            <OrderSummary totals={totals} coupon={coupon}>
              {!isAuthenticated && <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-center text-xs text-amber-100">You need an account to place an order. Your cart will be waiting for you after you sign in.</p>}
              <button onClick={() => navigate('/checkout')} className="btn-primary mt-5 w-full py-3.5 text-base">{isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'} <ArrowRight size={18} /></button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted"><Lock size={12} /> Secure checkout · 7-day easy returns</p>
            </OrderSummary>
          </div>
        </aside>
      </div>
    </div>
  )
}

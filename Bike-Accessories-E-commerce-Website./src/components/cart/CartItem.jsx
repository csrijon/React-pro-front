import { Link } from 'react-router-dom'
import { m as motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import ItemThumb from '../common/ItemThumb'
import QuantitySelector from '../common/QuantitySelector'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { formatPrice, discountPercent } from '../../utils/format'

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart()
  const { has, toggle } = useWishlist()
  const off = discountPercent(item.price, item.mrp)
  return (
    <motion.li layout initial={false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }} transition={{ duration: 0.25 }}
      className="flex gap-3 rounded-2xl border border-line bg-ink-700 p-3 sm:gap-5 sm:p-4">
      <Link to={`/product/${item.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-line sm:h-28 sm:w-28" aria-label={item.name}>
        <ItemThumb item={item} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-light">{item.brandName}</p>
            <Link to={`/product/${item.slug}`} className="line-clamp-2 font-semibold leading-snug hover:text-brand">{item.name}</Link>
            <p className="mt-1 text-xs text-muted">{[item.colorName, item.size && `Size ${item.size}`].filter(Boolean).join(' · ')}</p>
          </div>
          <button onClick={() => removeItem(item.key)} aria-label={`Remove ${item.name} from cart`} className="shrink-0 rounded-lg p-2 text-muted transition hover:bg-brand-soft hover:text-brand"><Trash2 size={18} /></button>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-center gap-4">
            <QuantitySelector value={item.qty} onChange={(q) => updateQty(item.key, q)} size="sm" />
            <button onClick={() => { toggle({ id: item.id, name: item.name }); removeItem(item.key) }} className="hidden text-xs font-medium text-muted underline-offset-2 hover:text-white hover:underline sm:block" disabled={has(item.id)}>Move to wishlist</button>
          </div>
          <div className="text-right">
            <p className="font-bold tabular-nums">{formatPrice(item.price * item.qty)}</p>
            <p className="text-xs text-muted">{off > 0 && <span className="line-through">{formatPrice(item.mrp * item.qty)}</span>} {item.qty > 1 && <span>({formatPrice(item.price)} each)</span>}</p>
          </div>
        </div>
      </div>
    </motion.li>
  )
}

import { Heart } from 'lucide-react'
import { m as motion } from 'framer-motion'
import { useWishlist } from '../../context/WishlistContext'

export default function WishlistButton({ product, className = '', size = 18 }) {
  const { has, toggle } = useWishlist()
  const active = has(product.id)
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(product)
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-line bg-ink/70 backdrop-blur transition hover:border-brand ${className}`}
    >
      <Heart size={size} className={active ? 'fill-brand text-brand' : 'text-white'} />
    </motion.button>
  )
}

import ProductArt from '../common/ProductArt'
import SmartImage from '../common/SmartImage'

/** Renders the real product photo when `product.image` exists, otherwise the vector render. */
export default function ProductImage({ product, variant = 0, color, className = '' }) {
  if (product.image) return <SmartImage src={product.image} alt={product.name} className={className} />
  return (
    <ProductArt
      type={product.art}
      color={color || product.colors?.[0]?.hex || '#EF252B'}
      variant={variant}
      className={`h-full w-full ${className}`}
    />
  )
}

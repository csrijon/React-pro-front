import ProductArt from './ProductArt'
import SmartImage from './SmartImage'

/** Thumbnail for a cart / order line: real photo when the product has one, otherwise the vector render. */
export default function ItemThumb({ item, className = '' }) {
  if (item.image) return <SmartImage src={item.image} alt={item.name} className={`h-full w-full ${className}`} />
  return <ProductArt type={item.art} color={item.colorHex || '#EF252B'} className={className} />
}

import { useMemo } from 'react'
import { Heart } from 'lucide-react'
import { PageHeading } from './OrderBits'
import ProductGrid from '../../components/products/ProductGrid'
import { EmptyState } from '../../components/common/States'
import { useWishlist } from '../../context/WishlistContext'
import useFetch from '../../hooks/useFetch'
import productService from '../../services/productService'

export default function Wishlist() {
  const { ids, count } = useWishlist()
  // fetch once per distinct id set; items removed later disappear instantly via the filter below
  const initial = useMemo(() => ids, []) // eslint-disable-line react-hooks/exhaustive-deps
  const { data, loading, error, reload } = useFetch(() => productService.byIds(initial), [initial.join(',')])
  const items = (data || []).filter((p) => ids.includes(p.id))

  return (
    <>
      <PageHeading title="My Wishlist" text={`${count} saved item${count === 1 ? '' : 's'}`} />
      <ProductGrid products={items} loading={loading} error={error} onRetry={reload} skeletons={Math.max(count, 2)} cols="grid-cols-2 xl:grid-cols-3"
        empty={<EmptyState icon={Heart} title="Your wishlist is empty" text="Tap the heart on any product to save it for later." action="Discover Products" to="/shop" />} />
    </>
  )
}

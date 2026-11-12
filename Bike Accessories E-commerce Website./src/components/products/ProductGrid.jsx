import ProductCard from './ProductCard'
import { ProductGridSkeleton } from '../common/Skeletons'
import { ErrorState, EmptyState } from '../common/States'

/** Handles loading / error / empty / data in one place so pages stay tiny. */
export default function ProductGrid({ products, loading, error, onRetry, skeletons = 4, cols = 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', empty }) {
  if (loading) return <ProductGridSkeleton count={skeletons} className={cols} />
  if (error) return <ErrorState message={error.message} onRetry={onRetry} />
  if (!products?.length)
    return empty || <EmptyState title="No products found" text="Try adjusting your filters or search terms." />
  return (
    <div className={`grid gap-3 sm:gap-5 ${cols}`}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  )
}

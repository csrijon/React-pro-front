export const Skeleton = ({ className = '' }) => <div className={`skeleton ${className}`} aria-hidden="true" />

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-ink-700" aria-hidden="true">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export const ProductGridSkeleton = ({ count = 8, className = 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' }) => (
  <div className={`grid gap-3 sm:gap-5 ${className}`} role="status" aria-label="Loading products">
    {Array.from({ length: count }, (_, i) => <ProductCardSkeleton key={i} />)}
  </div>
)

export const PageSkeleton = () => (
  <div className="container-x space-y-6 py-12" role="status" aria-label="Loading page">
    <Skeleton className="h-10 w-1/3" />
    <Skeleton className="h-64 w-full" />
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-40" />)}
    </div>
  </div>
)

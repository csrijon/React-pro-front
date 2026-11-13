import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { useSEO } from '../../utils/seo'
import { useAsync } from '../../hooks/useAsync'
import { useWishlist } from '../../context/WishlistContext'
import { propertyService } from '../../services/propertyService'
import PropertyCard from '../../components/properties/PropertyCard'
import PageHeader from '../../components/common/PageHeader'
import { CardSkeleton, EmptyState, ErrorState } from '../../components/common/States'

export default function Wishlist() {
  useSEO('My Wishlist', 'Properties you have saved on EstateHub.')
  const { ids, remove } = useWishlist()
  const { data, loading, error, reload } = useAsync(() => propertyService.list(), [])
  const saved = (data || []).filter((p) => ids.includes(p.id))
  return (
    <>
      <PageHeader title="My wishlist" subtitle={ids.length ? `${ids.length} saved ${ids.length === 1 ? 'property' : 'properties'}. Saved on this device.` : undefined} />
      <div className="container-x py-8">
        {error && <ErrorState error={error} onRetry={reload} />}
        {loading && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><CardSkeleton count={Math.min(ids.length || 3, 3)} /></div>}
        {!loading && !error && saved.length === 0 && <EmptyState icon={Heart} title="Your wishlist is empty" text="Tap the heart on any property to save it here and compare later." action={<Link to="/properties" className="btn-primary">Explore properties</Link>} />}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((p) => (
            <div key={p.id} className="space-y-2"><PropertyCard property={p} />
              <button onClick={() => remove(p.id)} className="btn-ghost btn-sm w-full !text-red-600 hover:!bg-red-50"><Trash2 size={14} />Remove from wishlist</button></div>
          ))}
        </div>
      </div>
    </>
  )
}

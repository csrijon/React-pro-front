import Catalog from '../../components/products/Catalog'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import usePageTitle from '../../hooks/usePageTitle'

export default function Shop() {
  usePageTitle('Shop All Accessories')
  return (
    <div className="container-x pb-4 pt-6">
      <Breadcrumbs items={[{ label: 'Shop' }]} className="mb-5" />
      <Catalog title="All Accessories" />
    </div>
  )
}

import useFetch from '../../hooks/useFetch'
import productService from '../../services/productService'
import ProductGrid from './ProductGrid'

/** Fetches + renders a product strip (home sections, related, recently viewed). */
export default function ProductRow({ params, ids, count = 4, fetcher, cols = 'grid-cols-2 lg:grid-cols-4' }) {
  const { data, loading, error, reload } = useFetch(
    () => (fetcher ? fetcher() : ids ? productService.byIds(ids) : productService.list({ ...params, limit: count }).then((r) => r.items)),
    [JSON.stringify(params), JSON.stringify(ids), count],
  )
  return <ProductGrid products={data} loading={loading} error={error} onRetry={reload} skeletons={count} cols={cols} />
}

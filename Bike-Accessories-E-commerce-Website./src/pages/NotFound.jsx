import { Link } from 'react-router-dom'
import { Home, ShoppingBag } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
      <div className="container-x relative flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-[8rem] font-extrabold italic leading-none text-brand sm:text-[11rem]">404</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Looks like you took a wrong turn</h1>
        <p className="mt-2 max-w-md text-muted">The page you’re looking for doesn’t exist or may have been moved. Let’s get you back on the road.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary"><Home size={16} /> Back to Home</Link>
          <Link to="/shop" className="btn-ghost"><ShoppingBag size={16} /> Browse Shop</Link>
        </div>
      </div>
    </section>
  )
}

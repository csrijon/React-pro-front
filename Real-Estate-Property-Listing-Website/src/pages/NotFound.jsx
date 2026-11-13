import { Link } from 'react-router-dom'
import { useSEO } from '../utils/seo'
export default function NotFound() {
  useSEO('Page not found')
  return <div className="container-x py-24 text-center"><p className="font-heading text-6xl font-semibold text-primary">404</p><h1 className="mt-3 text-2xl font-semibold">We couldn't find that page</h1><p className="mt-2 text-muted">The link may be broken or the page has moved.</p><Link to="/" className="btn-primary mt-6">Back to home</Link></div>
}

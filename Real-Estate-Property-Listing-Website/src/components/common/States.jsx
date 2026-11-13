import { AlertTriangle, SearchX } from 'lucide-react'

export function EmptyState({ icon: Icon = SearchX, title, text, action }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary-50 text-primary"><Icon size={26} /></span>
      <h3 className="text-lg font-semibold">{title}</h3>
      {text && <p className="mt-1.5 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center" role="alert">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-600"><AlertTriangle size={26} /></span>
      <h3 className="text-lg font-semibold">We couldn't load this</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{error?.message || 'Something went wrong. Check your connection and try again.'}</p>
      {onRetry && <button className="btn-primary mt-5" onClick={onRetry}>Try again</button>}
    </div>
  )
}

export function CardSkeleton({ count = 3 }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} className="card overflow-hidden" aria-hidden>
      <div className="skeleton h-48 rounded-none" />
      <div className="space-y-3 p-4"><div className="skeleton h-5 w-1/3" /><div className="skeleton h-4 w-3/4" /><div className="skeleton h-4 w-1/2" /></div>
    </div>
  ))
}

export function PageLoader() {
  return <div className="grid min-h-[50vh] place-items-center"><div className="h-9 w-9 animate-spin rounded-full border-4 border-primary-50 border-t-primary" role="status" aria-label="Loading" /></div>
}

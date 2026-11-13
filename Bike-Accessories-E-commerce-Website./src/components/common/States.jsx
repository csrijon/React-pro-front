import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw, PackageSearch } from 'lucide-react'

export function EmptyState({ icon: Icon = PackageSearch, title, text, action, to }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-ink-800/50 px-6 py-14 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Icon size={30} />
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      {text && <p className="mt-1 max-w-md text-sm text-muted">{text}</p>}
      {action && to && <Link to={to} className="btn-primary mt-6">{action}</Link>}
      {action && !to && typeof action !== 'string' && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong while loading this content.', onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center rounded-2xl border border-brand/30 bg-brand-soft px-6 py-12 text-center">
      <AlertTriangle size={34} className="mb-3 text-brand" />
      <h3 className="text-lg font-bold">Something went wrong</h3>
      <p className="mt-1 max-w-md text-sm text-muted">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-5"><RefreshCw size={16} /> Try again</button>
      )}
    </div>
  )
}

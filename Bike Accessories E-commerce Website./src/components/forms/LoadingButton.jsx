import { Loader2 } from 'lucide-react'

/** Button with built-in loading state. */
export default function LoadingButton({ loading, children, className = 'btn-primary', loadingText, ...rest }) {
  return (
    <button className={className} disabled={loading || rest.disabled} {...rest}>
      {loading ? <><Loader2 size={18} className="animate-spin" /> {loadingText || 'Please wait...'}</> : children}
    </button>
  )
}

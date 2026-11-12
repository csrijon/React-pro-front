import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import contentService from '../../services/contentService'
import { isEmail } from '../../utils/validators'

export default function NewsletterForm({ className = '', dense = false }) {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!isEmail(email)) return setError('Enter a valid email address')
    setError('')
    setBusy(true)
    try {
      await contentService.subscribe(email)
      toast.success('You’re subscribed! Watch your inbox for offers.')
      setEmail('')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className={className}>
      <div className="flex overflow-hidden rounded-lg border border-line bg-ink-800 focus-within:border-brand">
        <label htmlFor={`nl-${dense}`} className="sr-only">Email address</label>
        <input
          id={`nl-${dense}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email" autoComplete="email"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm placeholder-muted/70 focus:outline-none"
        />
        <button type="submit" disabled={busy} aria-label="Subscribe" className="flex w-14 items-center justify-center bg-brand transition hover:bg-brand-dark disabled:opacity-60">
          {busy ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={20} />}
        </button>
      </div>
      {error && <p role="alert" className="mt-1.5 text-xs text-brand">{error}</p>}
    </form>
  )
}

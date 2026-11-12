import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import Rating from '../../components/common/Rating'
import { Skeleton } from '../../components/common/Skeletons'
import { ErrorState, EmptyState } from '../../components/common/States'
import FormField from '../../components/forms/FormField'
import LoadingButton from '../../components/forms/LoadingButton'
import useFetch from '../../hooks/useFetch'
import productService from '../../services/productService'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/format'

function distribution(r) {
  const base = [0.03, 0.05, 0.1, 0.3, 0.52].map((v, i) => v + (i - 2) * (r - 4.3) * 0.06)
  const sum = base.reduce((a, b) => a + b, 0)
  return base.map((v) => Math.max(0.01, v) / sum).reverse() // 5 -> 1
}

export default function ReviewsTab({ product }) {
  const { data, loading, error, reload } = useFetch(() => productService.reviews(product.slug), [product.slug])
  const { isAuthenticated } = useAuth()
  const [form, setForm] = useState({ rating: 0, title: '', text: '' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const dist = distribution(product.rating)

  const submit = async (e) => {
    e.preventDefault()
    if (!form.rating) return setErr('Please choose a star rating')
    if (form.text.trim().length < 10) return setErr('Write at least 10 characters')
    setErr(''); setBusy(true)
    try {
      await productService.addReview(product.slug, form)
      toast.success('Thanks! Your review has been posted.')
      setForm({ rating: 0, title: '', text: '' })
      reload()
    } catch (e2) { setErr(e2.message) } finally { setBusy(false) }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-line bg-ink-800 p-5">
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl font-extrabold">{product.rating.toFixed(1)}</span>
            <div className="pb-1"><Rating value={product.rating} size={16} /><p className="mt-1 text-xs text-muted">{product.reviewCount.toLocaleString('en-IN')} ratings</p></div>
          </div>
          <div className="mt-4 space-y-2">
            {dist.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="flex w-7 items-center gap-0.5">{5 - i}<Star size={10} className="fill-amber-400 text-amber-400" /></span>
                <div className="h-1.5 flex-1 overflow-hidden rounded bg-line"><div className="h-full rounded bg-brand" style={{ width: `${d * 100}%` }} /></div>
                <span className="w-9 text-right text-muted">{Math.round(d * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-line bg-ink-800 p-5" noValidate>
          <h3 className="mb-3 font-bold">Write a review</h3>
          {isAuthenticated ? (
            <div className="space-y-3">
              <div role="radiogroup" aria-label="Your rating" className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button type="button" key={n} role="radio" aria-checked={form.rating === n} aria-label={`${n} stars`} onClick={() => setForm((f) => ({ ...f, rating: n }))}>
                    <Star size={26} className={n <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-line'} />
                  </button>
                ))}
              </div>
              <FormField placeholder="Title (optional)" aria-label="Review title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              <FormField as="textarea" rows={4} placeholder="Share your experience with this product" aria-label="Review" value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} />
              {err && <p role="alert" className="text-xs text-brand">{err}</p>}
              <LoadingButton loading={busy} loadingText="Posting..." className="btn-primary w-full" type="submit">Submit Review</LoadingButton>
            </div>
          ) : (
            <p className="text-sm text-muted"><Link to="/login" state={{ from: `/product/${product.slug}` }} className="font-semibold text-brand hover:underline">Sign in</Link> to share your experience with other riders.</p>
          )}
        </form>
      </div>

      <div>
        {loading ? <div className="space-y-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-28" />)}</div>
          : error ? <ErrorState message={error.message} onRetry={reload} />
          : !data.length ? <EmptyState title="No reviews yet" text="Be the first to review this product." />
          : (
            <ul className="space-y-4">
              {data.map((r) => (
                <li key={r.id} className="rounded-2xl border border-line bg-ink-800 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold">{r.author[0]}</span>
                      <div><p className="text-sm font-semibold">{r.author}</p>{r.verified && <p className="flex items-center gap-1 text-xs text-emerald-400"><BadgeCheck size={13} /> Verified Purchase</p>}</div>
                    </div>
                    <span className="text-xs text-muted">{formatDate(r.date)}</span>
                  </div>
                  <Rating value={r.rating} className="mt-3" />
                  {r.title && <h4 className="mt-2 font-semibold">{r.title}</h4>}
                  <p className="mt-1 text-sm leading-relaxed text-muted">{r.text}</p>
                </li>
              ))}
            </ul>
          )}
      </div>
    </div>
  )
}

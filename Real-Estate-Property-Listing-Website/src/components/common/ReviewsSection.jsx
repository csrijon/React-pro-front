import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { useAsync } from '../../hooks/useAsync'
import { reviewService } from '../../services/reviewService'
import { formatDate } from '../../utils/format'
import StarRating from './StarRating'
import Field from './Field'

function ReviewForm({ onDone }) {
  const [rating, setRating] = useState(5)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
  const submit = async (d) => {
    try { await reviewService.add({ ...d, rating }); toast.success('Thank you! Your review will appear after we approve it.'); reset(); onDone() }
    catch (e) { toast.error(e.message || 'Could not send your review. Please try again.') }
  }
  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="card mt-4 space-y-3 p-5">
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => setRating(n)}><Star size={24} className={n <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} /></button>)}
      </div>
      <Field error={errors.name}><input className="input" placeholder="Your name" aria-label="Your name" {...register('name', { required: 'Please enter your name', minLength: { value: 2, message: 'Name is too short' } })} /></Field>
      <Field error={errors.text}><textarea rows={3} className="input resize-none" placeholder="Share your experience" aria-label="Your review" {...register('text', { required: 'Please write a few words', minLength: { value: 10, message: 'At least 10 characters' } })} /></Field>
      <button className="btn-primary btn-sm" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Submit review'}</button>
    </form>
  )
}

/** Published customer reviews of the company, plus a form to add one (held until the admin approves it). */
export default function ReviewsSection() {
  const { data, loading } = useAsync(() => reviewService.published(), [])
  const [writing, setWriting] = useState(false)
  const list = data || []
  const avg = list.length ? Math.round((list.reduce((s, r) => s + r.rating, 0) / list.length) * 10) / 10 : 0
  return (
    <section className="container-x pb-14" aria-labelledby="reviews-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 id="reviews-title" className="section-title">Customer reviews</h2>{list.length > 0 && <p className="mt-1 flex items-center gap-2 text-sm text-muted"><StarRating value={avg} /><strong className="text-ink">{avg}</strong> from {list.length} {list.length === 1 ? 'review' : 'reviews'}</p>}</div>
        <button className="btn-outline btn-sm" onClick={() => setWriting((w) => !w)}>{writing ? 'Cancel' : 'Write a review'}</button>
      </div>
      {writing && <ReviewForm onDone={() => setWriting(false)} />}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {list.map((r) => <div key={r.id} className="card p-5"><div className="flex items-center justify-between gap-3"><p className="font-semibold">{r.name}</p><span className="shrink-0 text-xs text-muted">{formatDate(r.date)}</span></div><div className="mt-1"><StarRating value={r.rating} /></div><p className="mt-2 text-sm text-muted">{r.text}</p></div>)}
        {!loading && list.length === 0 && <p className="text-sm text-muted">No reviews yet. Be the first to share your experience.</p>}
      </div>
    </section>
  )
}

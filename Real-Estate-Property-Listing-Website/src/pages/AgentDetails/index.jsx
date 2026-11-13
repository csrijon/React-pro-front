import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BadgeCheck, Phone, Mail, MessageCircle, MapPin, Briefcase, Languages, Star, UserX } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useSEO } from '../../utils/seo'
import { useAsync } from '../../hooks/useAsync'
import { agentService } from '../../services/agentService'
import { propertyService } from '../../services/propertyService'
import PropertyCard from '../../components/properties/PropertyCard'
import EnquiryForm from '../../components/forms/EnquiryForm'
import StarRating from '../../components/common/StarRating'
import Field from '../../components/common/Field'
import Img from '../../components/common/Img'
import { PageLoader, EmptyState, ErrorState } from '../../components/common/States'
import { formatDate } from '../../utils/format'

function ReviewForm({ agentId, onDone }) {
  const [rating, setRating] = useState(5)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
  const submit = async (d) => { await agentService.addReview(agentId, { ...d, rating }); toast.success('Thanks! Your review will appear after moderation.'); reset(); onDone() }
  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="mt-4 space-y-3">
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">{[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} stars`} onClick={() => setRating(n)}><Star size={22} className={n <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} /></button>)}</div>
      <Field error={errors.name}><input className="input" placeholder="Your name" aria-label="Your name" {...register('name', { required: 'Please enter your name' })} /></Field>
      <Field error={errors.text}><textarea rows={3} className="input resize-none" placeholder="Share your experience" aria-label="Review" {...register('text', { required: 'Please write a few words', minLength: { value: 10, message: 'At least 10 characters' } })} /></Field>
      <button className="btn-primary btn-sm" disabled={isSubmitting}>Submit review</button>
    </form>
  )
}

export default function AgentDetails() {
  const { id } = useParams()
  const { data: a, loading, error, reload } = useAsync(() => agentService.get(id), [id])
  const props = useAsync(() => propertyService.list(), [])
  const reviews = useAsync(() => agentService.reviews(id), [id])
  const [writing, setWriting] = useState(false)
  useSEO(a?.name || 'Agent', a ? `${a.name}, ${a.designation} at EstateHub. ${a.bio.slice(0, 120)}` : undefined)
  if (loading) return <PageLoader />
  if (error) return <div className="container-x py-16"><ErrorState error={error} onRetry={reload} /></div>
  if (!a) return <div className="container-x py-16"><EmptyState icon={UserX} title="Agent not found" action={<Link to="/agents" className="btn-primary">All agents</Link>} /></div>
  const listed = (props.data || []).filter((p) => p.agentId === a.id)
  const published = (reviews.data || []).filter((r) => r.status === 'Published')
  return (
    <div className="container-x py-8">
      <div className="card flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        <Img src={a.photo} alt={a.name} eager className="h-28 w-28 rounded-full object-cover ring-4 ring-primary-50" />
        <div className="flex-1">
          <h1 className="flex items-center gap-2 text-2xl font-semibold">{a.name}{a.verified && <BadgeCheck className="text-accent" size={22} aria-label="Verified agent" />}</h1>
          <p className="text-muted">{a.designation} · {a.specialization}</p>
          <p className="mt-2 flex items-center gap-2 text-sm"><StarRating value={a.rating} /><strong>{a.rating}</strong><span className="text-muted">({a.reviews} reviews)</span></p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
            <span className="flex items-center gap-1.5"><Briefcase size={15} />{a.experience} years experience</span><span className="flex items-center gap-1.5"><MapPin size={15} />{a.location}</span><span className="flex items-center gap-1.5"><Languages size={15} />{a.languages.join(', ')}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-col">
          <a href={`tel:${a.phone.replace(/\s/g, '')}`} className="btn-primary"><Phone size={16} />Call</a>
          <a href={`https://wa.me/${a.whatsapp}`} target="_blank" rel="noreferrer" className="btn-outline"><MessageCircle size={16} />WhatsApp</a>
          <a href={`mailto:${a.email}`} className="btn-outline"><Mail size={16} />Email</a>
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-10">
          <section><h2 className="text-xl font-semibold">About {a.name.split(' ')[0]}</h2><p className="mt-3 leading-relaxed text-muted">{a.bio}</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><div className="card p-4"><dt className="text-muted">Phone</dt><dd className="font-medium">{a.phone}</dd></div><div className="card p-4"><dt className="text-muted">Email</dt><dd className="truncate font-medium">{a.email}</dd></div><div className="card p-4"><dt className="text-muted">Active listings</dt><dd className="font-medium">{listed.length}</dd></div></dl></section>
          <section><h2 className="text-xl font-semibold">Listed properties</h2>
            {listed.length ? <div className="mt-4 grid gap-6 sm:grid-cols-2">{listed.map((p) => <PropertyCard key={p.id} property={p} />)}</div> : <div className="mt-4"><EmptyState title="No active listings" text="This agent has no properties listed right now." /></div>}</section>
          <section>
            <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Reviews</h2><button className="btn-outline btn-sm" onClick={() => setWriting((w) => !w)}>{writing ? 'Cancel' : 'Write a review'}</button></div>
            {writing && <div className="card mt-4 p-5"><ReviewForm agentId={a.id} onDone={() => { setWriting(false); reviews.reload() }} /></div>}
            <div className="mt-4 space-y-4">
              {published.map((r) => <div key={r.id} className="card p-5"><div className="flex items-center justify-between"><p className="font-semibold">{r.name}</p><span className="text-xs text-muted">{formatDate(r.date)}</span></div><div className="mt-1"><StarRating value={r.rating} /></div><p className="mt-2 text-sm text-muted">{r.text}</p></div>)}
              {!reviews.loading && published.length === 0 && <EmptyState title="No reviews yet" text="Be the first to share your experience." />}
            </div>
          </section>
        </div>
        <aside className="card h-fit p-5 lg:sticky lg:top-24"><EnquiryForm property={`Agent: ${a.name}`} title={`Contact ${a.name.split(' ')[0]}`} compact /></aside>
      </div>
    </div>
  )
}

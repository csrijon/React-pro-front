import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Send, CheckCircle2 } from 'lucide-react'
import Field from '../common/Field'
import { inquiryService } from '../../services/inquiryService'

export const rules = {
  name: { required: 'Please enter your name', minLength: { value: 2, message: 'Name is too short' } },
  email: { required: 'Please enter your email', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } },
  phone: { required: 'Please enter your phone number', pattern: { value: /^[+\d][\d\s-]{7,14}$/, message: 'Enter a valid phone number' } },
}

export default function EnquiryForm({ property = '', title = 'Send an enquiry', compact = false, defaultMessage = '' }) {
  const [done, setDone] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: { message: defaultMessage } })
  const onSubmit = async (d) => {
    try { await inquiryService.submit({ ...d, property }); setDone(true); reset(); toast.success('Enquiry sent. We will call you shortly.') }
    catch (e) { toast.error(e.message || 'Could not send your enquiry. Please try again.') }
  }
  if (done) return (
    <div className="py-6 text-center">
      <CheckCircle2 className="mx-auto text-accent" size={40} />
      <h3 className="mt-3 text-lg font-semibold">Enquiry sent</h3>
      <p className="mt-1 text-sm text-muted">An advisor will contact you within one business day.</p>
      <button className="btn-outline btn-sm mt-4" onClick={() => setDone(false)}>Send another</button>
    </div>
  )
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3.5">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <Field error={errors.name}><input className={`input ${errors.name ? 'input-error' : ''}`} placeholder="Full name" aria-label="Full name" {...register('name', rules.name)} /></Field>
      <div className={compact ? 'space-y-3.5' : 'grid gap-3.5 sm:grid-cols-2'}>
        <Field error={errors.email}><input type="email" className={`input ${errors.email ? 'input-error' : ''}`} placeholder="Email" aria-label="Email" {...register('email', rules.email)} /></Field>
        <Field error={errors.phone}><input type="tel" className={`input ${errors.phone ? 'input-error' : ''}`} placeholder="Phone number" aria-label="Phone number" {...register('phone', rules.phone)} /></Field>
      </div>
      <Field error={errors.message}><textarea rows={3} className={`input resize-none ${errors.message ? 'input-error' : ''}`} placeholder="How can we help?" aria-label="Message" {...register('message', { required: 'Please add a short message', minLength: { value: 10, message: 'Message should be at least 10 characters' } })} /></Field>
      <button className="btn-primary w-full" disabled={isSubmitting}><Send size={16} />{isSubmitting ? 'Sending…' : 'Send enquiry'}</button>
    </form>
  )
}

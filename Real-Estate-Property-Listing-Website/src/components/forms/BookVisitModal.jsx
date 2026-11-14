import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import Modal from '../common/Modal'
import Field from '../common/Field'
import { rules } from './EnquiryForm'
import { inquiryService } from '../../services/inquiryService'
import { useSite } from '../../context/SiteContext'

const today = () => new Date().toISOString().slice(0, 10)

export default function BookVisitModal({ open, onClose, property }) {
  const TIMES = useSite().site.options.timeSlots
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
  const onSubmit = async (d) => {
    try {
      await inquiryService.appointments.create({ ...d, property })
      toast.success(`Visit booked for ${new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at ${d.time}`)
      reset(); onClose()
    } catch (e) { toast.error(e.message || 'Could not book the visit. Please try again.') }
  }
  return (
    <Modal open={open} onClose={onClose} title="Book a visit">
      <p className="mb-4 text-sm text-muted">Choose a time to see <strong className="text-ink">{property}</strong>. We will confirm by phone.</p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3.5">
        <Field label="Full name" error={errors.name}><input className={`input ${errors.name ? 'input-error' : ''}`} {...register('name', rules.name)} /></Field>
        <Field label="Phone number" error={errors.phone}><input type="tel" className={`input ${errors.phone ? 'input-error' : ''}`} {...register('phone', rules.phone)} /></Field>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field label="Date" error={errors.date}>
            <input type="date" min={today()} className={`input ${errors.date ? 'input-error' : ''}`} {...register('date', { required: 'Pick a date', validate: (v) => v >= today() || 'Date cannot be in the past' })} />
          </Field>
          <Field label="Time" error={errors.time}>
            <select className={`input ${errors.time ? 'input-error' : ''}`} defaultValue="" {...register('time', { required: 'Pick a time' })}>
              <option value="" disabled>Select time</option>{TIMES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Notes (optional)"><textarea rows={2} className="input resize-none" {...register('notes')} /></Field>
        <button className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting ? 'Booking…' : 'Confirm visit'}</button>
      </form>
    </Modal>
  )
}

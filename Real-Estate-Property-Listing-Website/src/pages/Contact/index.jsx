import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { useSEO } from '../../utils/seo'
import { inquiryService } from '../../services/inquiryService'
import PageHeader from '../../components/common/PageHeader'
import Field from '../../components/common/Field'
import { rules } from '../../components/forms/EnquiryForm'
import { useSiteSettings } from '../../hooks/useSiteSettings'


export default function Contact() {
  const site = useSiteSettings()
  useSEO('Contact Us', `Have a question or need assistance? Contact the ${site.company} team by phone, email or message.`)
  const info = [[Mail, 'Email', site.email, `mailto:${site.email}`], [Phone, 'Phone', site.phone, `tel:${site.phone.replace(/[^\d+]/g, '')}`], [MapPin, 'Address', site.address], ...(site.workingHours ? [[Clock, 'Working hours', site.workingHours]] : [])]
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
  const onSubmit = async (d) => {
    try { await inquiryService.submit({ ...d, property: `Contact: ${d.subject}` }); toast.success('Message sent. We will reply within one business day.'); reset() }
    catch (e) { toast.error(e.message || 'We could not send your message. Please try again.') }
  }
  const cls = (e) => `input ${e ? 'input-error' : ''}`
  return (
    <>
      <PageHeader title="Get in touch" subtitle="Have a question or need assistance? We're here to help." />
      <div className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <div className="card divide-y divide-line">
            {info.map(([I, t, v, href]) => (
              <div key={t} className="flex gap-4 p-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-50 text-accent"><I size={19} /></span>
                <div><p className="text-sm text-muted">{t}</p>{href ? <a href={href} className="font-medium hover:text-accent">{v}</a> : <p className="font-medium">{v}</p>}</div></div>
            ))}
          </div>
          <div className="overflow-hidden rounded-2xl border border-line">
            <iframe title="Office location map" loading="lazy" className="h-64 w-full" src="https://www.openstreetmap.org/export/embed.html?bbox=88.43%2C22.55%2C88.50%2C22.60&layer=mapnik&marker=22.5758%2C88.4792" />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-4 p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Send us a message</h2>
          <Field label="Full name" error={errors.name}><input className={cls(errors.name)} {...register('name', rules.name)} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" error={errors.email}><input type="email" className={cls(errors.email)} {...register('email', rules.email)} /></Field>
            <Field label="Phone number" error={errors.phone}><input type="tel" className={cls(errors.phone)} {...register('phone', rules.phone)} /></Field>
          </div>
          <Field label="Subject" error={errors.subject}><input className={cls(errors.subject)} {...register('subject', { required: 'Please add a subject', minLength: { value: 3, message: 'Subject is too short' } })} /></Field>
          <Field label="Message" error={errors.message}><textarea rows={5} className={`${cls(errors.message)} resize-none`} {...register('message', { required: 'Please write a message', minLength: { value: 10, message: 'Message should be at least 10 characters' } })} /></Field>
          <button className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send message'}</button>
        </form>
      </div>
    </>
  )
}

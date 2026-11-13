import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AdminHeader } from '../../components/admin/AdminUI'
import Field from '../../components/common/Field'
import { rules } from '../../components/forms/EnquiryForm'
import { USE_MOCK, API_URL } from '../../services/config'

const KEY = 'estatehub:settings'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null } }

export default function AdminSettings() {
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm({ defaultValues: load() || { company: 'EstateHub', email: 'support@estatehub.com', phone: '+91 98765 43210', address: 'New Town, Kolkata, West Bengal 700156', notify: true } })
  const save = async (d) => { await new Promise((r) => setTimeout(r, 400)); localStorage.setItem(KEY, JSON.stringify(d)); toast.success('Settings saved') }
  const c = (e) => `input ${e ? 'input-error' : ''}`
  return (
    <>
      <AdminHeader title="Settings" subtitle="Company details shown across the website." />
      <form onSubmit={handleSubmit(save)} noValidate className="card max-w-2xl space-y-4 p-6">
        <Field label="Company name" error={errors.company}><input className={c(errors.company)} {...register('company', { required: 'Enter the company name' })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Support email" error={errors.email}><input type="email" className={c(errors.email)} {...register('email', rules.email)} /></Field>
          <Field label="Phone" error={errors.phone}><input className={c(errors.phone)} {...register('phone', rules.phone)} /></Field>
        </div>
        <Field label="Office address" error={errors.address}><input className={c(errors.address)} {...register('address', { required: 'Enter the address' })} /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-[#267032]" {...register('notify')} />Email me when a new enquiry arrives</label>
        <button className="btn-primary" disabled={isSubmitting || !isDirty}>{isSubmitting ? 'Saving…' : 'Save settings'}</button>
      </form>
      <div className="card mt-6 max-w-2xl p-6 text-sm"><h2 className="font-semibold">Data source</h2>
        <p className="mt-2 text-muted">{USE_MOCK ? 'Running on built-in demo data stored in this browser. Set VITE_API_URL in your .env file to connect your backend.' : `Connected to ${API_URL}`}</p>
        {USE_MOCK && <button className="btn-outline btn-sm mt-3" onClick={() => { Object.keys(localStorage).filter((k) => k.startsWith('estatehub:mock:')).forEach((k) => localStorage.removeItem(k)); toast.success('Demo data reset'); setTimeout(() => location.reload(), 500) }}>Reset demo data</button>}</div>
    </>
  )
}

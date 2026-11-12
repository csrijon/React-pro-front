import { useState } from 'react'
import { Home, Briefcase, MapPin, Pencil, Trash2, Plus, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageHeading } from './OrderBits'
import Modal from '../../components/common/Modal'
import FormField from '../../components/forms/FormField'
import AddressFields, { validateAddress } from '../../components/forms/AddressFields'
import LoadingButton from '../../components/forms/LoadingButton'
import { EmptyState, ErrorState } from '../../components/common/States'
import { Skeleton } from '../../components/common/Skeletons'
import useFetch from '../../hooks/useFetch'
import useForm from '../../hooks/useForm'
import userService from '../../services/userService'
import { rules } from '../../utils/validators'

const blank = { label: 'Home', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false }
const ICONS = { Home, Work: Briefcase, Other: MapPin }

function AddressForm({ initial, onDone }) {
  const editing = !!initial?.id
  const form = useForm(initial || blank, (v) => ({ name: rules.required('Name')(v.name), phone: rules.phone(v.phone), ...validateAddress(v) }))
  const save = form.submit(async (v) => {
    editing ? await userService.updateAddress(v.id, v) : await userService.addAddress(v)
    toast.success(editing ? 'Address updated' : 'Address added')
    onDone()
  })
  return (
    <form onSubmit={save} noValidate className="space-y-4">
      <div className="flex gap-2" role="radiogroup" aria-label="Address type">
        {['Home', 'Work', 'Other'].map((l) => (
          <button type="button" key={l} role="radio" aria-checked={form.values.label === l} onClick={() => form.setValue('label', l)} className={`chip px-4 py-2 text-sm transition ${form.values.label === l ? 'border-brand bg-brand text-white' : 'hover:border-brand'}`}>{l}</button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full name" required error={form.errors.name} {...form.field('name')} />
        <FormField label="Mobile number" required type="tel" error={form.errors.phone} {...form.field('phone')} />
      </div>
      <AddressFields form={form} />
      <label className="flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" className="h-4 w-4 accent-[#EF252B]" checked={!!form.values.isDefault} onChange={(e) => form.setValue('isDefault', e.target.checked)} /> Set as default address</label>
      {form.formError && <p role="alert" className="text-sm text-brand">{form.formError}</p>}
      <LoadingButton type="submit" loading={form.submitting} loadingText="Saving..." className="btn-primary w-full">{editing ? 'Update Address' : 'Save Address'}</LoadingButton>
    </form>
  )
}

export default function Addresses() {
  const { data, loading, error, reload } = useFetch(() => userService.addresses(), [])
  const [modal, setModal] = useState(null) // null | 'new' | address

  const remove = async (a) => {
    if (!window.confirm('Delete this address?')) return
    try { await userService.removeAddress(a.id); toast.success('Address removed'); reload() } catch (e) { toast.error(e.message) }
  }
  const done = () => { setModal(null); reload() }

  return (
    <>
      <PageHeading title="Manage Addresses" text="Save addresses for faster checkout." action={<button onClick={() => setModal('new')} className="btn-primary"><Plus size={16} /> Add New Address</button>} />
      {loading ? <div className="grid gap-4 sm:grid-cols-2"><Skeleton className="h-44" /><Skeleton className="h-44" /></div>
        : error ? <ErrorState message={error.message} onRetry={reload} />
        : !data.length ? <EmptyState icon={MapPin} title="No saved addresses" text="Add a delivery address to speed up checkout." action={<button onClick={() => setModal('new')} className="btn-primary"><Plus size={16} /> Add Address</button>} />
        : (
          <div className="grid gap-4 sm:grid-cols-2">
            {data.map((a) => {
              const Icon = ICONS[a.label] || MapPin
              return (
                <div key={a.id} className={`relative rounded-2xl border bg-ink-800 p-5 ${a.isDefault ? 'border-brand/60' : 'border-line'}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-bold"><Icon size={17} className="text-brand" /> {a.label}</span>
                    {a.isDefault && <span className="flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand"><CheckCircle2 size={12} /> Default</span>}
                  </div>
                  <p className="font-medium">{a.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{a.line1}{a.line2 && `, ${a.line2}`}<br />{a.city}, {a.state} - {a.pincode}<br />Phone: {a.phone}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setModal(a)} className="btn-ghost px-4 py-2"><Pencil size={14} /> Edit</button>
                    <button onClick={() => remove(a)} className="btn-ghost px-4 py-2 text-brand"><Trash2 size={14} /> Delete</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal && modal !== 'new' ? 'Edit address' : 'Add new address'} wide>
        {modal && <AddressForm key={modal === 'new' ? 'new' : modal.id} initial={modal === 'new' ? null : modal} onDone={done} />}
      </Modal>
    </>
  )
}

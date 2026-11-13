import { useForm, Controller } from 'react-hook-form'
import Field from '../common/Field'
import ImageUploader from './ImageUploader'
import { rules } from './EnquiryForm'
import { propertyTypes, furnishingOptions, propertyStatuses, amenityOptions } from '../../data/misc'

const num = (label) => ({ required: `Enter ${label}`, min: { value: 0, message: 'Cannot be negative' }, valueAsNumber: true, validate: (v) => !Number.isNaN(v) || `Enter ${label}` })

/** Shared by the public "List your property" page and the admin add/edit screens. */
export default function PropertyForm({ mode = 'public', defaultValues, agents = [], onSubmit, submitLabel = 'Submit', busy }) {
  const admin = mode === 'admin'
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { type: 'Apartment', purpose: 'Buy', beds: 2, baths: 2, parking: 1, amenities: [], images: [], furnishing: 'Semi-Furnished', propertyStatus: 'Ready to Move', featured: false, ...defaultValues },
  })
  const c = (e) => `input ${e ? 'input-error' : ''}`
  const rent = watch('purpose') === 'Rent'
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <section className="card space-y-4 p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Property details</h2>
        <Field label="Property title" error={errors.title}><input className={c(errors.title)} placeholder="e.g. 3 BHK apartment with lake view" {...register('title', { required: 'Enter a property title', minLength: { value: 8, message: 'Title should be at least 8 characters' } })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Property type"><select className="input" {...register('type')}>{propertyTypes.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Listing for"><select className="input" {...register('purpose')}><option value="Buy">Sale</option><option value="Rent">Rent</option></select></Field>
          <Field label={rent ? 'Monthly rent (₹)' : 'Price (₹)'} error={errors.price}><input type="number" className={c(errors.price)} {...register('price', { ...num('a price'), min: { value: 1, message: 'Price must be greater than 0' } })} /></Field>
          <Field label="Area (sq ft)" error={errors.area}><input type="number" className={c(errors.area)} {...register('area', { ...num('the area'), min: { value: 1, message: 'Area must be greater than 0' } })} /></Field>
          <Field label="Location / locality" error={errors.location}><input className={c(errors.location)} placeholder="e.g. New Town" {...register('location', { required: 'Enter the locality' })} /></Field>
          <Field label="City" error={errors.city}><input className={c(errors.city)} {...register('city', { required: 'Enter the city' })} /></Field>
          <Field label="Bedrooms" error={errors.beds}><input type="number" className={c(errors.beds)} {...register('beds', num('bedrooms'))} /></Field>
          <Field label="Bathrooms" error={errors.baths}><input type="number" className={c(errors.baths)} {...register('baths', num('bathrooms'))} /></Field>
          {admin && <>
            <Field label="Parking spaces" error={errors.parking}><input type="number" className={c(errors.parking)} {...register('parking', num('parking spaces'))} /></Field>
            <Field label="Furnishing"><select className="input" {...register('furnishing')}>{furnishingOptions.map((t) => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Property status"><select className="input" {...register('propertyStatus')}>{propertyStatuses.map((t) => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Assigned agent" error={errors.agentId}><select className={c(errors.agentId)} {...register('agentId', { required: 'Choose an agent' })}><option value="">Select agent</option>{agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>
          </>}
        </div>
        <Field label="Description" error={errors.description}><textarea rows={5} className={`${c(errors.description)} resize-none`} {...register('description', { required: 'Add a description', minLength: { value: 30, message: 'Describe the property in at least 30 characters' } })} /></Field>
        {admin && <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-[#267032]" {...register('featured')} />Show on the home page as featured</label>}
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Amenities</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {amenityOptions.map((a) => <label key={a} className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" value={a} className="h-4 w-4 accent-[#267032]" {...register('amenities')} />{a}</label>)}
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold">Photos</h2>
        <Controller name="images" control={control} rules={{ validate: (v) => v.length > 0 || 'Add at least one photo' }} render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} error={errors.images?.message} />} />
      </section>

      {!admin && (
        <section className="card space-y-4 p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Owner details</h2>
          <Field label="Owner name" error={errors.ownerName}><input className={c(errors.ownerName)} {...register('ownerName', rules.name)} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone number" error={errors.phone}><input type="tel" className={c(errors.phone)} {...register('phone', rules.phone)} /></Field>
            <Field label="Email" error={errors.email}><input type="email" className={c(errors.email)} {...register('email', rules.email)} /></Field>
          </div>
        </section>
      )}
      <div className="flex justify-end"><button className="btn-primary min-w-40" disabled={busy}>{busy ? 'Saving…' : submitLabel}</button></div>
    </form>
  )
}

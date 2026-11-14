import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import SingleImage from './SingleImage'
import Field from '../common/Field'
import ImageUploader from './ImageUploader'
import { rules } from './EnquiryForm'
import { propertyStatuses } from '../../data/misc'
import { useSite } from '../../context/SiteContext'
import { currencySymbol } from '../../utils/format'

const num = (label) => ({ required: `Enter ${label}`, min: { value: 0, message: 'Cannot be negative' }, valueAsNumber: true, validate: (v) => !Number.isNaN(v) || `Enter ${label}` })

/** Shared by the public "List your property" page and the admin add/edit screens. */
export default function PropertyForm({ mode = 'public', defaultValues, onSubmit, submitLabel = 'Submit', busy }) {
  const admin = mode === 'admin'
  const { site } = useSite()
  const { propertyTypes, furnishing: furnishingOptions, amenities: amenityOptions } = site.options
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { type: propertyTypes[0], purpose: 'Buy', beds: 2, baths: 2, parking: 1, amenities: [], images: [], rooms: [], floorPlan: '', furnishing: 'Semi-Furnished', propertyStatus: 'Ready to Move', featured: false, ...defaultValues },
  })
  const c = (e) => `input ${e ? 'input-error' : ''}`
  const rooms = useFieldArray({ control, name: 'rooms' })
  const rent = watch('purpose') === 'Rent'
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <section className="card space-y-4 p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Property details</h2>
        <Field label="Property title" error={errors.title}><input className={c(errors.title)} placeholder="e.g. 3 BHK apartment with lake view" {...register('title', { required: 'Enter a property title', minLength: { value: 8, message: 'Title should be at least 8 characters' } })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Property type"><select className="input" {...register('type')}>{propertyTypes.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Listing for"><select className="input" {...register('purpose')}><option value="Buy">Sale</option><option value="Rent">Rent</option></select></Field>
          <Field label={rent ? `Monthly rent (${currencySymbol()})` : `Price (${currencySymbol()})`} error={errors.price}><input type="number" className={c(errors.price)} {...register('price', { ...num('a price'), min: { value: 1, message: 'Price must be greater than 0' } })} /></Field>
          <Field label="Area (sq ft)" error={errors.area}><input type="number" className={c(errors.area)} {...register('area', { ...num('the area'), min: { value: 1, message: 'Area must be greater than 0' } })} /></Field>
          <Field label="Location / locality" error={errors.location}><input className={c(errors.location)} placeholder="e.g. New Town" {...register('location', { required: 'Enter the locality' })} /></Field>
          <Field label="City" error={errors.city}><input className={c(errors.city)} {...register('city', { required: 'Enter the city' })} /></Field>
          <Field label="Bedrooms" error={errors.beds}><input type="number" className={c(errors.beds)} {...register('beds', num('bedrooms'))} /></Field>
          <Field label="Bathrooms" error={errors.baths}><input type="number" className={c(errors.baths)} {...register('baths', num('bathrooms'))} /></Field>
          {admin && <>
            <Field label="Parking spaces" error={errors.parking}><input type="number" className={c(errors.parking)} {...register('parking', num('parking spaces'))} /></Field>
            <Field label="Furnishing"><select className="input" {...register('furnishing')}>{furnishingOptions.map((t) => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Property status"><select className="input" {...register('propertyStatus')}>{propertyStatuses.map((t) => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Latitude (optional)" error={errors.lat}><input type="number" step="any" className={c(errors.lat)} {...register('lat', { setValueAs: (v) => (v === '' || v == null ? undefined : Number(v)), validate: (v) => v === undefined || (v >= -90 && v <= 90) || 'Must be between -90 and 90' })} /></Field>
            <Field label="Longitude (optional)" error={errors.lng}><input type="number" step="any" className={c(errors.lng)} {...register('lng', { setValueAs: (v) => (v === '' || v == null ? undefined : Number(v)), validate: (v) => v === undefined || (v >= -180 && v <= 180) || 'Must be between -180 and 180' })} /></Field>
            <Field label="YouTube video link (optional)" error={errors.videoUrl} className="sm:col-span-2"><input className={c(errors.videoUrl)} placeholder="https://www.youtube.com/watch?v=…" {...register('videoUrl', { validate: (v) => !v || /^(https:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(v) || 'Use a YouTube link' })} /></Field>
          </>}
        </div>
        <Field label="Description" error={errors.description}><textarea rows={5} className={`${c(errors.description)} resize-none`} {...register('description', { required: 'Add a description', minLength: { value: 30, message: 'Describe the property in at least 30 characters' } })} /></Field>
        {admin && <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-accent" {...register('featured')} />Show on the home page as featured</label>}
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Amenities</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {amenityOptions.map((a) => <label key={a} className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" value={a} className="h-4 w-4 accent-accent" {...register('amenities')} />{a}</label>)}
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold">Photos</h2>
        <Controller name="images" control={control} rules={{ validate: (v) => v.length > 0 || 'Add at least one photo' }} render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} error={errors.images?.message} />} />
      </section>

      {admin && (
        <section className="card space-y-4 p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Floor plan</h2>
          <p className="text-sm text-muted">Optional. Shown on the property page. Leave both empty to hide the floor plan section.</p>
          <Controller name="floorPlan" control={control} render={({ field }) => <SingleImage label="Floor plan image" value={field.value} onChange={field.onChange} max={1800} hint="A clear drawing or PDF-to-image export. JPG, PNG or WebP." />} />
          <div>
            <span className="label">Room sizes</span>
            <div className="space-y-2">
              {rooms.fields.map((f, i) => (
                <div key={f.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <input className="input" aria-label={`Room ${i + 1} name`} placeholder="Living room" maxLength={40} {...register(`rooms.${i}.name`, { required: 'Enter the room name' })} />
                  <input className="input" aria-label={`Room ${i + 1} size`} placeholder="18 × 14 ft" maxLength={40} {...register(`rooms.${i}.size`)} />
                  <button type="button" className="btn-outline btn-sm hover:!text-red-600" onClick={() => rooms.remove(i)} aria-label={`Remove room ${i + 1}`}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            {errors.rooms && <p className="field-error" role="alert">Every room needs a name.</p>}
            {rooms.fields.length < 20 && <button type="button" className="btn-ghost btn-sm mt-2" onClick={() => rooms.append({ name: '', size: '' })}><Plus size={14} />Add room</button>}
          </div>
        </section>
      )}

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

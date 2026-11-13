import FormField from './FormField'
import { INDIAN_STATES } from '../../utils/constants'
import { rules } from '../../utils/validators'

/** Validation for an address object with optional key prefix (e.g. 'ship_'). */
export const validateAddress = (v, p = '') => ({
  [`${p}line1`]: rules.required('Address')(v[`${p}line1`]),
  [`${p}city`]: rules.required('City')(v[`${p}city`]),
  [`${p}state`]: rules.required('State')(v[`${p}state`]),
  [`${p}pincode`]: rules.pincode(v[`${p}pincode`] || ''),
})

export default function AddressFields({ form, prefix = '' }) {
  const f = (n) => form.field(`${prefix}${n}`)
  const e = (n) => form.errors[`${prefix}${n}`]
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField className="sm:col-span-2" label="Address line 1" required placeholder="House / flat no., street" autoComplete="address-line1" error={e('line1')} {...f('line1')} />
      <FormField className="sm:col-span-2" label="Address line 2" placeholder="Landmark, area (optional)" autoComplete="address-line2" error={e('line2')} {...f('line2')} />
      <FormField label="City" required autoComplete="address-level2" error={e('city')} {...f('city')} />
      <FormField label="State" required as="select" autoComplete="address-level1" error={e('state')} options={[{ value: '', label: 'Select state' }, ...INDIAN_STATES]} {...f('state')} />
      <FormField label="Pincode" required inputMode="numeric" maxLength={6} autoComplete="postal-code" error={e('pincode')} {...f('pincode')} />
    </div>
  )
}

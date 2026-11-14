import { Setting } from '../models/activity.js'
import { withDefaults } from '../config/siteDefaults.js'
import { HttpError } from './asyncHandler.js'

/** The owner-editable choice lists (property types, furnishing, amenities, visit times). */
export async function getOptions() {
  return withDefaults((await Setting.findOne({ key: 'site' }))?.value).options
}
export function mustBeOneOf(value, list, label) {
  if (value !== undefined && value !== '' && !list.includes(value)) throw new HttpError(400, `"${value}" is not an available ${label}`)
}

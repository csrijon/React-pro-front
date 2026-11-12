export const isEmail = (v = '') => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
export const isPhone = (v = '') => {
  const d = v.replace(/[\s-]/g, '')
  // only strip a +91 / 91 country code when there are extra digits (a 10-digit number may itself start with 91)
  const n = d.length > 10 ? d.replace(/^\+?91/, '') : d
  return /^[6-9]\d{9}$/.test(n)
}
export const isPincode = (v = '') => /^[1-9]\d{5}$/.test(v.trim())

export const rules = {
  required: (label) => (v) => (String(v ?? '').trim() ? '' : `${label} is required`),
  email: (v) => (isEmail(v) ? '' : 'Enter a valid email address'),
  phone: (v) => (isPhone(v) ? '' : 'Enter a valid 10-digit mobile number'),
  pincode: (v) => (isPincode(v) ? '' : 'Enter a valid 6-digit pincode'),
  min: (n, label = 'This field') => (v) => (String(v || '').length >= n ? '' : `${label} must be at least ${n} characters`),
  password: (v) => {
    if (!v) return 'Password is required'
    if (v.length < 8) return 'Use at least 8 characters'
    if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Include letters and numbers'
    return ''
  },
}

/** Run a list of validators for one field; returns first error message. */
export const run = (value, ...validators) => {
  for (const fn of validators) {
    const msg = fn(value)
    if (msg) return msg
  }
  return ''
}

import { useCallback, useState } from 'react'

/**
 * Minimal form helper.
 *   const form = useForm({ email: '' }, (v) => ({ email: rules.email(v.email) }))
 *   <input {...form.field('email')} />   form.errors.email   form.submit(onValid)
 * `validate` returns an object of field -> error message ('' when valid).
 */
export default function useForm(initial, validate) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const check = useCallback(
    (v) => {
      const e = validate ? validate(v) : {}
      return Object.fromEntries(Object.entries(e).filter(([, m]) => m))
    },
    [validate],
  )

  const setValue = (name, value) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value }
      if (touched[name]) setErrors(check(next))
      return next
    })
  }

  const field = (name) => ({
    name,
    value: values[name] ?? '',
    onChange: (e) => setValue(name, e.target.type === 'checkbox' ? e.target.checked : e.target.value),
    onBlur: () => {
      setTouched((t) => ({ ...t, [name]: true }))
      setErrors(check(values))
    },
  })

  const submit = (onValid) => async (e) => {
    e?.preventDefault()
    setFormError('')
    const found = check(values)
    setErrors(found)
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])))
    if (Object.keys(found).length) {
      // wait for React to render aria-invalid before moving focus to the first bad field
      setTimeout(() => document.querySelector('[aria-invalid="true"]')?.focus(), 0)
      return
    }
    setSubmitting(true)
    try {
      await onValid(values)
    } catch (err) {
      setFormError(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const reset = (next = initial) => {
    setValues(next)
    setErrors({})
    setTouched({})
    setFormError('')
  }

  return { values, setValues, setValue, errors, field, submit, submitting, formError, setFormError, reset }
}

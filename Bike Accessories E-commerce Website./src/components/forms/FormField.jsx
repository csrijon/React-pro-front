import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/**
 * Accessible field: label, input/select/textarea, error + hint.
 * Spread `form.field('name')` into it and pass `error={form.errors.name}`.
 */
export default function FormField({ label, error, hint, icon: Icon, type = 'text', as = 'input', options, className = '', children, ...rest }) {
  const id = useId()
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const base = `input ${Icon ? 'pl-11' : ''} ${isPassword ? 'pr-11' : ''} ${error ? 'input-error' : ''}`
  const aria = { 'aria-invalid': !!error, 'aria-describedby': error ? `${id}-err` : hint ? `${id}-hint` : undefined }

  let control
  if (as === 'textarea') control = <textarea id={id} rows={5} className={`${base} resize-y`} {...aria} {...rest} />
  else if (as === 'select')
    control = (
      <select id={id} className={base} {...aria} {...rest}>
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    )
  else control = <input id={id} type={isPassword && show ? 'text' : type} className={base} {...aria} {...rest} />

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
          {label}{rest.required && <span className="text-brand"> *</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />}
        {control}
        {isPassword && (
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-white">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error ? <p id={`${id}-err`} role="alert" className="mt-1 text-xs text-brand">{error}</p> : hint ? <p id={`${id}-hint`} className="mt-1 text-xs text-muted">{hint}</p> : null}
      {children}
    </div>
  )
}

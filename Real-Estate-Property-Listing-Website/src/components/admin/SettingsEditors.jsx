import { useState } from 'react'
import { useFieldArray } from 'react-hook-form'
import { ArrowUp, ArrowDown, Trash2, Plus, X, Eye, EyeOff } from 'lucide-react'

/** A list of short texts (property types, amenities, visit times…). Add with Enter, remove with ×. */
export function ChipList({ value = [], onChange, label, placeholder, validate, max = 40, hint, error }) {
  const [text, setText] = useState('')
  const [err, setErr] = useState('')
  const add = () => {
    const v = text.trim()
    if (!v) return
    const problem = validate?.(v) || (value.some((x) => x.toLowerCase() === v.toLowerCase()) && 'That one is already in the list') || (value.length >= max && `You can add up to ${max}`)
    if (problem) return setErr(problem)
    onChange([...value, v]); setText(''); setErr('')
  }
  return (
    <div>
      <span className="label">{label}</span>
      <ul className="mb-2 flex flex-wrap gap-2" aria-label={label}>
        {value.map((v) => (
          <li key={v} className="chip !py-1.5">{v}<button type="button" onClick={() => onChange(value.filter((x) => x !== v))} aria-label={`Remove ${v}`} className="rounded-full p-0.5 hover:bg-primary/10"><X size={12} /></button></li>
        ))}
        {value.length === 0 && <li className="text-sm text-muted">Nothing added yet.</li>}
      </ul>
      <div className="flex gap-2">
        <input className="input" value={text} placeholder={placeholder} aria-label={`Add to ${label}`} onChange={(e) => { setText(e.target.value); setErr('') }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }} />
        <button type="button" className="btn-outline" onClick={add}><Plus size={15} />Add</button>
      </div>
      {(err || error) && <p className="field-error" role="alert">{err || error}</p>}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  )
}

export const linkRule = (v) => /^\/(?!\/)[A-Za-z0-9\-._~!$&'()*+,;=:@%/?#]*$/.test(v) || (/^https:\/\//i.test(v) && URL.canParse(v)) || 'Use a page path like /about or a full link starting with https://'

/** Menu or footer links: label + destination, with reorder and remove. */
export function LinkList({ control, register, name, errors, min = 0, max = 8 }) {
  const { fields, append, remove, move } = useFieldArray({ control, name })
  const e = (i, k) => errors?.[i]?.[k]
  return (
    <div className="space-y-2">
      {fields.map((f, i) => (
        <div key={f.id} className="grid grid-cols-[1fr_1fr_auto] items-start gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
          <div><input className={`input ${e(i, 'label') ? 'input-error' : ''}`} aria-label={`Link ${i + 1} label`} placeholder="Label" maxLength={30} {...register(`${name}.${i}.label`, { required: 'Enter a label' })} />{e(i, 'label') && <p className="field-error">{e(i, 'label').message}</p>}</div>
          <div><input className={`input ${e(i, 'to') ? 'input-error' : ''}`} aria-label={`Link ${i + 1} address`} placeholder="/about or https://…" maxLength={300} {...register(`${name}.${i}.to`, { required: 'Enter where it goes', validate: linkRule })} />{e(i, 'to') && <p className="field-error">{e(i, 'to').message}</p>}</div>
          <div className="flex gap-1">
            <button type="button" className="btn-outline btn-sm !px-2" disabled={i === 0} onClick={() => move(i, i - 1)} aria-label={`Move link ${i + 1} up`}><ArrowUp size={14} /></button>
            <button type="button" className="btn-outline btn-sm !px-2" disabled={i === fields.length - 1} onClick={() => move(i, i + 1)} aria-label={`Move link ${i + 1} down`}><ArrowDown size={14} /></button>
            <button type="button" className="btn-outline btn-sm !px-2 hover:!text-red-600" disabled={fields.length <= min} onClick={() => remove(i)} aria-label={`Remove link ${i + 1}`}><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
      {fields.length < max && <button type="button" className="btn-ghost btn-sm" onClick={() => append({ label: '', to: '/' })}><Plus size={14} />Add link</button>}
    </div>
  )
}

const SECTION_LABELS = { featured: 'Featured properties', why: 'Why choose us cards', projects: 'Featured projects', testimonials: 'Client testimonials', cta: '“Have a property to sell or rent?” box' }
/** Reorder and show/hide the home page sections. */
export function SectionOrder({ value = [], onChange }) {
  const move = (i, d) => { const a = [...value]; [a[i], a[i + d]] = [a[i + d], a[i]]; onChange(a) }
  return (
    <ol className="space-y-2">
      {value.map((s, i) => (
        <li key={s.id} className={`flex items-center gap-3 rounded-xl border border-line bg-white px-3 py-2 text-sm ${s.visible ? '' : 'opacity-60'}`}>
          <span className="flex-1 font-medium">{SECTION_LABELS[s.id]}</span>
          <button type="button" className="btn-outline btn-sm !px-2" onClick={() => onChange(value.map((x, n) => (n === i ? { ...x, visible: !x.visible } : x)))} aria-pressed={s.visible} aria-label={`${s.visible ? 'Hide' : 'Show'} ${SECTION_LABELS[s.id]}`}>{s.visible ? <Eye size={14} /> : <EyeOff size={14} />}{s.visible ? 'Shown' : 'Hidden'}</button>
          <button type="button" className="btn-outline btn-sm !px-2" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${SECTION_LABELS[s.id]} up`}><ArrowUp size={14} /></button>
          <button type="button" className="btn-outline btn-sm !px-2" disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${SECTION_LABELS[s.id]} down`}><ArrowDown size={14} /></button>
        </li>
      ))}
    </ol>
  )
}

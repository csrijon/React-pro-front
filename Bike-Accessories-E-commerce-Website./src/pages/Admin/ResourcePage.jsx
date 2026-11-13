import { useCallback, useEffect, useState } from 'react'
import { Pencil, Plus, Search, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '../../components/common/Modal'
import FormField from '../../components/forms/FormField'
import LoadingButton from '../../components/forms/LoadingButton'
import { ErrorState } from '../../components/common/States'
import { Skeleton } from '../../components/common/Skeletons'
import { Card, PageTitle, Pager, ImageUploader, Label } from './ui'
import useFetch from '../../hooks/useFetch'
import useDebounce from '../../hooks/useDebounce'
import adminService from '../../services/adminService'

/* ---- how each field type travels between the API (JSON) and the form (strings) ---- */
const codec = {
  lines: { toForm: (v) => (v || []).join('\n'), fromForm: (v) => String(v || '').split('\n').map((s) => s.trim()).filter(Boolean) },
  csv: { toForm: (v) => (v || []).join(', '), fromForm: (v) => String(v || '').split(',').map((s) => s.trim()).filter(Boolean) },
  pairs: { // "Label: Value" per line
    toForm: (v) => (v || []).map((p) => `${p.label}: ${p.value}`).join('\n'),
    fromForm: (v) => String(v || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => { const i = l.indexOf(':'); return i > 0 ? { label: l.slice(0, i).trim(), value: l.slice(i + 1).trim() } : null }).filter(Boolean),
  },
  colors: { // "Name #hex" per line
    toForm: (v) => (v || []).map((c) => `${c.name} ${c.hex}`).join('\n'),
    fromForm: (v) => String(v || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => { const m = l.match(/^(.*?)\s*(#[0-9a-fA-F]{6})$/); return m && m[1] ? { name: m[1].trim(), hex: m[2] } : null }).filter(Boolean),
  },
  article: { // "## Heading" lines + paragraphs separated by blank lines
    toForm: (v) => (v || []).map(([t, x]) => (t === 'h' ? `## ${x}` : x)).join('\n\n'),
    fromForm: (v) => v,
  },
  date: { toForm: (v) => (v ? String(v).slice(0, 10) : ''), fromForm: (v) => v || null },
}

const initialValues = (fields, row) =>
  Object.fromEntries(fields.map((f) => {
    const raw = row ? row[f.name] : f.default
    if (f.type === 'checkbox') return [f.name, raw ?? false]
    if (f.type === 'images') return [f.name, raw || []]
    return [f.name, codec[f.type] ? codec[f.type].toForm(raw) : raw ?? '']
  }))

const toPayload = (fields, values) =>
  Object.fromEntries(fields.filter((f) => !f.readOnly).map((f) => [f.name, codec[f.type] ? codec[f.type].fromForm(values[f.name]) : values[f.name]]))

function Field({ f, values, set, error }) {
  const common = { label: f.label, required: f.required, hint: f.hint, error, className: f.wide ? 'sm:col-span-2' : '' }
  if (f.type === 'checkbox')
    return (
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-ink px-4 py-3 text-sm">
        <input type="checkbox" className="h-4 w-4 accent-[#EF252B]" checked={!!values[f.name]} onChange={(e) => set(f.name, e.target.checked)} />{f.label}
      </label>
    )
  if (f.type === 'images') return <div className="sm:col-span-2"><Label>{f.label}</Label><ImageUploader value={values[f.name]} onChange={(v) => set(f.name, v)} /></div>
  if (f.type === 'select') return <FormField {...common} as="select" options={f.options} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
  const multi = ['textarea', 'lines', 'pairs', 'colors', 'article'].includes(f.type)
  return (
    <FormField
      {...common} as={multi ? 'textarea' : 'input'} rows={f.rows || (f.type === 'article' ? 12 : 4)}
      type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : f.type === 'color' ? 'color' : 'text'}
      step={f.type === 'number' ? f.step || 'any' : undefined} min={f.type === 'number' ? 0 : undefined}
      placeholder={f.placeholder} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)}
    />
  )
}

/**
 * Config-driven admin screen: searchable/filterable table + create/edit modal + delete.
 * See configs.jsx for the definition of every resource.
 */
export default function ResourcePage({ config }) {
  const { title, text, resource, columns, fields = [], filters = [], canCreate = true, canEdit = true, canDelete = true, rowActions, detail, headerActions, searchPlaceholder, noun = 'item', deleteResource } = config
  const [q, setQ] = useState('')
  const dq = useDebounce(q, 350)
  const [page, setPage] = useState(1)
  const [filterVals, setFilterVals] = useState({})
  const [modal, setModal] = useState(null) // null | {row?: obj} | {view: obj}
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => setPage(1), [dq, filterVals])
  const params = { q: dq || undefined, page, limit: 15, ...filterVals }
  const { data, loading, error, reload } = useFetch(() => adminService.list(resource, params), [resource, JSON.stringify(params)])

  const open = (row) => { setValues(initialValues(fields, row)); setErrors({}); setModal({ row }) }
  const set = useCallback((k, v) => setValues((s) => ({ ...s, [k]: v })), [])

  const save = async (e) => {
    e.preventDefault()
    const missing = fields.filter((f) => f.required && !f.readOnly && !String(values[f.name] ?? '').trim())
    if (missing.length) return setErrors(Object.fromEntries(missing.map((f) => [f.name, `${f.label} is required`])))
    setSaving(true)
    try {
      const payload = toPayload(fields, values)
      modal.row ? await adminService.update(resource, modal.row.id, payload) : await adminService.create(resource, payload)
      toast.success(`${noun[0].toUpperCase() + noun.slice(1)} ${modal.row ? 'updated' : 'created'}`)
      setModal(null)
      reload()
    } catch (err) {
      toast.error(err.message)
      if (err.details) setErrors(err.details)
    } finally { setSaving(false) }
  }

  const remove = async (row) => {
    if (!window.confirm(`Delete this ${noun}? This cannot be undone.`)) return
    try { await adminService.remove(deleteResource || resource, row.id); toast.success('Deleted'); reload() } catch (err) { toast.error(err.message) }
  }

  return (
    <>
      <PageTitle title={title} text={text}>
        {headerActions?.(reload)}
        {canCreate && <button onClick={() => open(null)} className="btn-primary"><Plus size={16} /> Add {noun}</button>}
      </PageTitle>

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchPlaceholder || 'Search...'} aria-label="Search" className="input py-2.5 pl-10" />
          </div>
          {filters.map((f) => (
            <select key={f.key} aria-label={f.label} value={filterVals[f.key] || ''} onChange={(e) => setFilterVals((s) => ({ ...s, [f.key]: e.target.value || undefined }))} className="input w-auto py-2.5">
              <option value="">{f.label}</option>
              {f.options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
            </select>
          ))}
        </div>

        {error ? <div className="p-6"><ErrorState message={error.message} onRetry={reload} /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line bg-ink-700/50 text-xs uppercase tracking-wide text-muted">
                <tr>{columns.map((c) => <th key={c.label} className={`px-4 py-3 font-semibold ${c.className || ''}`}>{c.label}</th>)}<th className="px-4 py-3 text-right font-semibold">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {loading ? Array.from({ length: 6 }, (_, i) => <tr key={i}><td colSpan={columns.length + 1} className="px-4 py-3"><Skeleton className="h-8" /></td></tr>)
                  : !data.items.length ? <tr><td colSpan={columns.length + 1} className="px-4 py-14 text-center text-muted">{dq || Object.keys(filterVals).length ? 'Nothing matches your search.' : `No ${noun}s yet.`}</td></tr>
                  : data.items.map((row) => (
                    <tr key={row.id} className="transition hover:bg-ink-700/40">
                      {columns.map((c) => <td key={c.label} className={`px-4 py-3 align-middle ${c.className || ''}`}>{c.render ? c.render(row) : String(row[c.key] ?? '–')}</td>)}
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          {rowActions?.(row, reload)}
                          {detail && <button onClick={() => setModal({ view: row })} aria-label="View" title="View" className="rounded-lg p-2 text-muted hover:bg-ink-600 hover:text-white"><Eye size={16} /></button>}
                          {canEdit && fields.length > 0 && <button onClick={() => open(row)} aria-label="Edit" title="Edit" className="rounded-lg p-2 text-muted hover:bg-ink-600 hover:text-white"><Pencil size={16} /></button>}
                          {canDelete && <button onClick={() => remove(row)} aria-label="Delete" title="Delete" className="rounded-lg p-2 text-muted hover:bg-brand-soft hover:text-brand"><Trash2 size={16} /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
        {data && <Pager page={data.page} pages={data.pages} total={data.total} onChange={setPage} />}
      </Card>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.view ? `${noun[0].toUpperCase() + noun.slice(1)} details` : modal?.row ? `Edit ${noun}` : `Add ${noun}`} wide>
        {modal?.view && detail?.(modal.view)}
        {modal && !modal.view && (
          <form onSubmit={save} noValidate className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((f) => <Field key={f.name} f={f} values={values} set={set} error={errors[f.name]} />)}
            </div>
            <LoadingButton type="submit" loading={saving} loadingText="Saving..." className="btn-primary w-full">{modal.row ? 'Save changes' : `Create ${noun}`}</LoadingButton>
          </form>
        )}
      </Modal>
    </>
  )
}

import { useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Pencil, Trash2, Plus, FolderKanban } from 'lucide-react'
import { toast } from 'sonner'
import { useAsync } from '../../hooks/useAsync'
import { projectService } from '../../services/projectService'
import { formatBudget, currencySymbol } from '../../utils/format'
import { AdminHeader, SearchBox, Table, TableSkeleton, StatusBadge } from '../../components/admin/AdminUI'
import Drawer from '../../components/common/Drawer'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Field from '../../components/common/Field'
import ImageUploader from '../../components/forms/ImageUploader'
import { EmptyState, ErrorState } from '../../components/common/States'

const STATUS = ['Upcoming', 'Under Construction', 'Ready to Move']
const n = (l) => ({ required: `Enter ${l}`, valueAsNumber: true, min: { value: 0, message: 'Cannot be negative' } })

function ProjectForm({ project, onSaved, onClose }) {
  const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ defaultValues: { category: 'Residential', status: 'Upcoming', progress: 0, images: [], configurations: [], ...project, amenities: project?.amenities?.join(', ') || '' } })
  const cfg = useFieldArray({ control, name: 'configurations' })
  const c = (e) => `input ${e ? 'input-error' : ''}`
  const submit = async (d) => {
    const body = { ...d, units: +d.units, towers: +d.towers, priceFrom: +d.priceFrom, priceTo: +d.priceTo, progress: +d.progress, amenities: d.amenities.split(',').map((s) => s.trim()).filter(Boolean), configurations: (d.configurations || []).filter((r) => r.type?.trim()), rera: d.rera?.trim() || 'Applied', developer: d.developer }
    try { project ? await projectService.update(project.id, body) : await projectService.create(body); toast.success(project ? 'Project updated' : 'Project created'); onSaved() } catch (e) { toast.error(e.message) }
  }
  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <Field label="Project name" error={errors.name}><input className={c(errors.name)} {...register('name', { required: 'Enter the project name' })} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Developer" error={errors.developer}><input className={c(errors.developer)} {...register('developer', { required: 'Enter the developer' })} /></Field>
        <Field label="Location" error={errors.location}><input className={c(errors.location)} {...register('location', { required: 'Enter the location' })} /></Field>
        <Field label="Category"><select className="input" {...register('category')}><option>Residential</option><option>Commercial</option></select></Field>
        <Field label="Construction status"><select className="input" {...register('status')}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select></Field>
        <Field label={`Price from (${currencySymbol()})`} error={errors.priceFrom}><input type="number" className={c(errors.priceFrom)} {...register('priceFrom', n('a starting price'))} /></Field>
        <Field label={`Price to (${currencySymbol()})`} error={errors.priceTo}><input type="number" className={c(errors.priceTo)} {...register('priceTo', { ...n('a maximum price'), validate: (v) => v >= +watch('priceFrom') || 'Must be at least the starting price' })} /></Field>
        <Field label="Units" error={errors.units}><input type="number" className={c(errors.units)} {...register('units', n('number of units'))} /></Field>
        <Field label="Towers" error={errors.towers}><input type="number" className={c(errors.towers)} {...register('towers', n('number of towers'))} /></Field>
        <Field label="Possession" error={errors.possession}><input className={c(errors.possession)} placeholder="Dec 2028" {...register('possession', { required: 'Enter possession date' })} /></Field>
        <Field label={`Construction progress (${watch('progress')}%)`}><input type="range" min="0" max="100" className="w-full accent-accent" {...register('progress')} /></Field>
      </div>
      <Field label="RERA registration number"><input className="input" placeholder="Applied" {...register('rera')} /></Field>
      <div>
        <span className="label">Available configurations</span>
        <div className="space-y-2">
          {cfg.fields.map((f, i) => (
            <div key={f.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
              <input className="input" aria-label={`Configuration ${i + 1} type`} placeholder="2 BHK" maxLength={40} {...register(`configurations.${i}.type`)} />
              <input className="input" aria-label={`Configuration ${i + 1} area`} placeholder="980 – 1,120 sq ft" maxLength={60} {...register(`configurations.${i}.area`)} />
              <input className="input" aria-label={`Configuration ${i + 1} price`} placeholder="From 75 Lakh" maxLength={60} {...register(`configurations.${i}.price`)} />
              <button type="button" className="btn-outline btn-sm hover:!text-red-600" onClick={() => cfg.remove(i)} aria-label={`Remove configuration ${i + 1}`}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button type="button" className="btn-ghost btn-sm mt-2" onClick={() => cfg.append({ type: '', area: '', price: '' })}><Plus size={14} />Add configuration</button>
      </div>
      <Field label="Amenities (comma separated)"><input className="input" {...register('amenities')} /></Field>
      <Field label="Description" error={errors.description}><textarea rows={3} className={`${c(errors.description)} resize-none`} {...register('description', { required: 'Add a description' })} /></Field>
      <Field label="Project images" error={errors.images?.message}><Controller name="images" control={control} rules={{ validate: (v) => v.length > 0 || 'Add at least one image' }} render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} error={errors.images?.message} />} /></Field>
      <div className="flex justify-end gap-2"><button type="button" className="btn-outline" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save project'}</button></div>
    </form>
  )
}

export default function AdminProjects() {
  const { data, loading, error, reload } = useAsync(() => projectService.list(), [])
  const [q, setQ] = useState(''); const [edit, setEdit] = useState(null); const [del, setDel] = useState(null)
  const list = (data || []).filter((p) => !q || `${p.name} ${p.location}`.toLowerCase().includes(q.toLowerCase()))
  const setStatus = async (p, status) => { try { await projectService.update(p.id, { status, ...(status === 'Ready to Move' ? { progress: 100 } : {}) }); toast.success('Construction status updated'); reload() } catch (e) { toast.error(e.message) } }
  const remove = async () => { try { await projectService.remove(del.id); toast.success('Project deleted'); setDel(null); reload() } catch (e) { toast.error(e.message) } }
  return (
    <>
      <AdminHeader title="Projects" subtitle={`${data?.length ?? 0} projects`} action={<button className="btn-primary" onClick={() => setEdit({})}><Plus size={16} />Create project</button>} />
      <div className="mb-4"><SearchBox value={q} onChange={setQ} placeholder="Search projects" /></div>
      {loading ? <TableSkeleton /> : error ? <ErrorState error={error} onRetry={reload} /> : (
        <Table head={['Project', 'Price range', 'Units', 'Construction status', 'Actions']} empty={list.length === 0 && <div className="p-6"><EmptyState icon={FolderKanban} title="No projects found" /></div>}>
          {list.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={p.images[0]} alt="" className="h-12 w-16 rounded-lg object-cover" /><div><p className="font-medium">{p.name}</p><p className="text-xs text-muted">{p.location}</p></div></div></td>
              <td className="px-4 py-3">{formatBudget(p.priceFrom)} – {formatBudget(p.priceTo)}</td><td className="px-4 py-3">{p.units}</td>
              <td className="px-4 py-3"><select className="input w-auto py-1.5 text-xs" aria-label={`Status of ${p.name}`} value={p.status} onChange={(e) => setStatus(p, e.target.value)}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select></td>
              <td className="px-4 py-3"><div className="flex gap-1.5"><button className="btn-outline btn-sm" onClick={() => setEdit(p)} aria-label={`Edit ${p.name}`}><Pencil size={14} /></button><button className="btn-outline btn-sm hover:!border-red-300 hover:!text-red-600" onClick={() => setDel(p)} aria-label={`Delete ${p.name}`}><Trash2 size={14} /></button></div></td>
            </tr>
          ))}
        </Table>
      )}
      <Drawer open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Edit project' : 'Create project'} width="max-w-2xl">{edit && <ProjectForm project={edit.id ? edit : null} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); reload() }} />}</Drawer>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} title="Delete project?" message={`“${del?.name}” will be permanently removed. This cannot be undone.`} />
    </>
  )
}

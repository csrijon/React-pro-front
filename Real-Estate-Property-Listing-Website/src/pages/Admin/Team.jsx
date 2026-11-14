import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Tags, Users, X } from 'lucide-react'
import { toast } from 'sonner'
import { useAsync } from '../../hooks/useAsync'
import { teamService } from '../../services/teamService'
import { AdminHeader, TableSkeleton } from '../../components/admin/AdminUI'
import Drawer from '../../components/common/Drawer'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Field from '../../components/common/Field'
import SingleImage from '../../components/forms/SingleImage'
import { rules } from '../../components/forms/EnquiryForm'
import { EmptyState, ErrorState } from '../../components/common/States'

function Avatar({ m, size = 'h-14 w-14' }) {
  return m.photo ? <img src={m.photo} alt="" className={`${size} shrink-0 rounded-full object-cover`} /> : <span className={`${size} grid shrink-0 place-items-center rounded-full bg-primary text-lg font-semibold text-white`} aria-hidden>{m.name[0]}</span>
}

function MemberForm({ member, roles, onSaved, onManageRoles }) {
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { role: roles[0], visible: true, photo: '', email: '', phone: '', bio: '', ...member } })
  const c = (e) => `input ${e ? 'input-error' : ''}`
  const submit = async (d) => {
    const body = { name: d.name.trim(), role: d.role, photo: d.photo || '', email: (d.email || '').trim(), phone: (d.phone || '').trim(), bio: (d.bio || '').trim(), visible: !!d.visible }
    try { member ? await teamService.update(member.id, body) : await teamService.create(body); toast.success(member ? 'Team member updated' : 'Team member added'); onSaved() }
    catch (e) { toast.error(e.message || 'Could not save this team member.') }
  }
  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
      <Controller name="photo" control={control} render={({ field }) => <SingleImage label="Photo" value={field.value} onChange={field.onChange} wide={false} max={600} hint="A square headshot works best. Without one, their initial is shown." />} />
      <Field label="Full name" error={errors.name}><input className={c(errors.name)} maxLength={80} {...register('name', rules.name)} /></Field>
      <div>
        <div className="mb-1.5 flex items-center justify-between"><label className="label !mb-0" htmlFor="role">Role</label><button type="button" onClick={onManageRoles} className="text-xs font-medium text-accent hover:underline">Manage roles</button></div>
        <select id="role" className={c(errors.role)} {...register('role', { required: 'Choose a role' })}>{roles.map((r) => <option key={r}>{r}</option>)}</select>
        {errors.role && <p className="field-error">{errors.role.message}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email (optional)" error={errors.email}><input type="email" className={c(errors.email)} {...register('email', { pattern: { value: /^$|^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } })} /></Field>
        <Field label="Phone (optional)" error={errors.phone}><input type="tel" className={c(errors.phone)} {...register('phone', { pattern: { value: /^$|^[+\d][\d\s-]{7,14}$/, message: 'Enter a valid phone number' } })} /></Field>
      </div>
      <Field label="Short bio (optional)" error={errors.bio}><textarea rows={3} maxLength={600} className={`${c(errors.bio)} resize-none`} {...register('bio')} /></Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-accent" {...register('visible')} />Show on the About page</label>
      <div className="sticky bottom-0 -mx-5 flex justify-end border-t border-line bg-surface/95 px-5 py-3 backdrop-blur sm:-mx-6 sm:px-6"><button className="btn-primary min-w-36" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : member ? 'Save changes' : 'Add team member'}</button></div>
    </form>
  )
}

function RolesManager({ roles, members, onClose, onSaved }) {
  const [rows, setRows] = useState(roles.map((name) => ({ name, original: name })))
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const count = (role) => members.filter((m) => m.role === role).length
  const add = () => {
    const v = text.trim()
    if (!v) return
    if (v.length > 40) return toast.error('Role names can be up to 40 characters')
    if (rows.some((r) => r.name.toLowerCase() === v.toLowerCase())) return toast.error('That role already exists')
    if (rows.length >= 20) return toast.error('You can have up to 20 roles')
    setRows((r) => [...r, { name: v, original: null }]); setText('')
  }
  const save = async () => {
    const names = rows.map((r) => r.name.trim())
    if (names.some((n) => !n)) return toast.error('A role name cannot be empty')
    if (new Set(names.map((n) => n.toLowerCase())).size !== names.length) return toast.error('Role names must be different from each other')
    const renames = Object.fromEntries(rows.filter((r) => r.original && r.original !== r.name.trim()).map((r) => [r.original, r.name.trim()]))
    setBusy(true)
    try { await teamService.roles.save({ roles: names, renames }); toast.success('Roles saved'); onSaved() } catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">Create your own roles, such as “Sales Manager” or “Site Engineer”. Rename a role to update everyone who has it. A role can only be removed when nobody has it.</p>
      <ul className="space-y-2">
        {rows.map((r, i) => {
          const n = r.original ? count(r.original) : 0
          return (
            <li key={r.original ?? `new${i}`} className="flex items-center gap-2">
              <input className="input" value={r.name} maxLength={40} aria-label={`Role ${i + 1}`} onChange={(e) => setRows((x) => x.map((y, k) => (k === i ? { ...y, name: e.target.value } : y)))} />
              <span className="w-20 shrink-0 text-xs text-muted">{n} {n === 1 ? 'person' : 'people'}</span>
              <button type="button" className="btn-outline btn-sm !px-2 hover:!text-red-600 disabled:hover:!text-current" disabled={n > 0 || rows.length <= 1} title={n > 0 ? 'Move these people to another role first' : 'Remove role'} onClick={() => setRows((x) => x.filter((_, k) => k !== i))} aria-label={`Remove role ${r.name}`}><X size={14} /></button>
            </li>
          )
        })}
      </ul>
      <div className="flex gap-2">
        <input className="input" value={text} placeholder="New role, e.g. Site Engineer" aria-label="New role name" onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }} />
        <button type="button" className="btn-outline" onClick={add}><Plus size={15} />Add</button>
      </div>
      <div className="flex justify-end gap-2 border-t border-line pt-4"><button className="btn-outline" onClick={onClose}>Cancel</button><button className="btn-primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save roles'}</button></div>
    </div>
  )
}

export default function AdminTeam() {
  const { data, loading, error, reload } = useAsync(() => Promise.all([teamService.list({ all: true }), teamService.roles.get()]), [])
  const [panel, setPanel] = useState(null) // null | {} (add) | member (edit)
  const [rolesOpen, setRolesOpen] = useState(false)
  const [del, setDel] = useState(null)
  const [members, roles] = data || [[], []]

  const toggle = async (m) => { try { await teamService.update(m.id, { visible: !m.visible }); toast.success(m.visible ? 'Hidden from the About page' : 'Now shown on the About page'); reload() } catch (e) { toast.error(e.message) } }
  const move = async (i, d) => { const ids = members.map((m) => m.id); [ids[i], ids[i + d]] = [ids[i + d], ids[i]]; try { await teamService.reorder(ids); reload() } catch (e) { toast.error(e.message) } }
  const remove = async () => { try { await teamService.remove(del.id); toast.success('Team member removed'); setDel(null); reload() } catch (e) { toast.error(e.message) } }

  return (
    <>
      <AdminHeader title="Team" subtitle="The people shown in “Meet the team” on your About page. Create your own roles for them." action={
        <div className="flex flex-wrap gap-2"><button className="btn-outline" onClick={() => setRolesOpen(true)}><Tags size={16} />Manage roles</button><button className="btn-primary" onClick={() => setPanel({})} disabled={!data}><Plus size={16} />Add team member</button></div>} />
      {loading ? <TableSkeleton /> : error ? <ErrorState error={error} onRetry={reload} /> : members.length === 0 ? (
        <EmptyState icon={Users} title="No team members yet" text="Add the people who work with you. They appear on the About page." action={<button className="btn-primary" onClick={() => setPanel({})}>Add team member</button>} />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map((m, i) => (
            <li key={m.id} className={`card flex flex-col gap-3 p-5 ${m.visible ? '' : 'opacity-70'}`}>
              <div className="flex items-start gap-3"><Avatar m={m} /><div className="min-w-0 flex-1"><p className="truncate font-semibold">{m.name}</p><span className="chip mt-1">{m.role}</span>{!m.visible && <span className="ml-1.5 text-xs text-muted">Hidden</span>}</div></div>
              {m.bio && <p className="line-clamp-2 text-sm text-muted">{m.bio}</p>}
              {(m.phone || m.email) && <p className="truncate text-xs text-muted">{[m.phone, m.email].filter(Boolean).join(' · ')}</p>}
              <div className="mt-auto flex flex-wrap gap-1.5 border-t border-line pt-3">
                <button className="btn-outline btn-sm" onClick={() => setPanel(m)} aria-label={`Edit ${m.name}`}><Pencil size={14} />Edit</button>
                <button className="btn-outline btn-sm" onClick={() => toggle(m)} aria-label={`${m.visible ? 'Hide' : 'Show'} ${m.name}`}>{m.visible ? <EyeOff size={14} /> : <Eye size={14} />}{m.visible ? 'Hide' : 'Show'}</button>
                <button className="btn-outline btn-sm !px-2" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${m.name} up`}><ArrowUp size={14} /></button>
                <button className="btn-outline btn-sm !px-2" disabled={i === members.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${m.name} down`}><ArrowDown size={14} /></button>
                <button className="btn-outline btn-sm !px-2 hover:!border-red-300 hover:!text-red-600" onClick={() => setDel(m)} aria-label={`Remove ${m.name}`}><Trash2 size={14} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Drawer open={!!panel} onClose={() => setPanel(null)} title={panel?.id ? 'Edit team member' : 'Add team member'} subtitle={panel?.id ? panel.name : 'They will appear on your About page.'} width="max-w-xl">
        {panel && <MemberForm key={panel.id || 'new'} member={panel.id ? panel : null} roles={roles} onManageRoles={() => setRolesOpen(true)} onSaved={() => { setPanel(null); reload() }} />}
      </Drawer>
      <Drawer open={rolesOpen} onClose={() => setRolesOpen(false)} title="Team roles" subtitle="Create, rename or remove the roles you give your team." width="max-w-lg">
        {rolesOpen && <RolesManager roles={roles} members={members} onClose={() => setRolesOpen(false)} onSaved={() => { setRolesOpen(false); reload() }} />}
      </Drawer>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} confirmLabel="Remove" title="Remove team member?" message={`${del?.name} will be removed from your team and the About page.`} />
    </>
  )
}

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Pencil, Trash2, Plus, BadgeCheck, ListChecks, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useAsync } from '../../hooks/useAsync'
import { agentService } from '../../services/agentService'
import { propertyService } from '../../services/propertyService'
import { AdminHeader, SearchBox, Table, TableSkeleton, StatusBadge } from '../../components/admin/AdminUI'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Field from '../../components/common/Field'
import { rules } from '../../components/forms/EnquiryForm'
import { EmptyState, ErrorState } from '../../components/common/States'

function AgentForm({ agent, onSaved, onClose }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { verified: false, experience: 1, ...agent, languages: agent?.languages?.join(', ') || 'English' } })
  const c = (e) => `input ${e ? 'input-error' : ''}`
  const submit = async (d) => {
    const body = { ...d, experience: +d.experience, languages: d.languages.split(',').map((s) => s.trim()).filter(Boolean), whatsapp: d.phone.replace(/\D/g, ''), photo: d.photo || `https://i.pravatar.cc/200?u=${encodeURIComponent(d.email)}` }
    try { agent ? await agentService.update(agent.id, body) : await agentService.create(body); toast.success(agent ? 'Agent updated' : 'Agent added'); onSaved() } catch (e) { toast.error(e.message) }
  }
  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.name}><input className={c(errors.name)} {...register('name', rules.name)} /></Field>
        <Field label="Designation" error={errors.designation}><input className={c(errors.designation)} {...register('designation', { required: 'Enter a designation' })} /></Field>
        <Field label="Email" error={errors.email}><input type="email" className={c(errors.email)} {...register('email', rules.email)} /></Field>
        <Field label="Phone" error={errors.phone}><input className={c(errors.phone)} {...register('phone', rules.phone)} /></Field>
        <Field label="Location" error={errors.location}><input className={c(errors.location)} {...register('location', { required: 'Enter a location' })} /></Field>
        <Field label="Specialization" error={errors.specialization}><input className={c(errors.specialization)} {...register('specialization', { required: 'Enter a specialization' })} /></Field>
        <Field label="Experience (years)" error={errors.experience}><input type="number" className={c(errors.experience)} {...register('experience', { required: 'Enter years', min: { value: 0, message: 'Cannot be negative' } })} /></Field>
        <Field label="Languages (comma separated)"><input className="input" {...register('languages')} /></Field>
      </div>
      <Field label="Photo URL (optional)"><input className="input" placeholder="https://…" {...register('photo')} /></Field>
      <Field label="Biography" error={errors.bio}><textarea rows={3} className={`${c(errors.bio)} resize-none`} {...register('bio', { required: 'Add a short biography' })} /></Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-[#267032]" {...register('verified')} />Verified agent</label>
      <div className="flex justify-end gap-2"><button type="button" className="btn-outline" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save agent'}</button></div>
    </form>
  )
}

export default function AdminAgents() {
  const { data, loading, error, reload } = useAsync(() => Promise.all([agentService.list(), propertyService.list()]), [])
  const [q, setQ] = useState(''); const [edit, setEdit] = useState(null); const [del, setDel] = useState(null); const [listing, setListing] = useState(null)
  const [agents, props] = data || [[], []]
  const list = agents.filter((a) => !q || `${a.name} ${a.location}`.toLowerCase().includes(q.toLowerCase()))
  const verify = async (a) => { try { await agentService.update(a.id, { verified: !a.verified }); toast.success(a.verified ? 'Verification removed' : 'Agent verified'); reload() } catch (e) { toast.error(e.message) } }
  const remove = async () => { try { await agentService.remove(del.id); toast.success('Agent deleted'); setDel(null); reload() } catch (e) { toast.error(e.message) } }
  return (
    <>
      <AdminHeader title="Agents" subtitle={`${agents.length} agents`} action={<button className="btn-primary" onClick={() => setEdit({})}><Plus size={16} />Add agent</button>} />
      <div className="mb-4"><SearchBox value={q} onChange={setQ} placeholder="Search agents" /></div>
      {loading ? <TableSkeleton /> : error ? <ErrorState error={error} onRetry={reload} /> : (
        <Table head={['Agent', 'Location', 'Listings', 'Verification', 'Actions']} empty={list.length === 0 && <div className="p-6"><EmptyState icon={Users} title="No agents found" /></div>}>
          {list.map((a) => (
            <tr key={a.id}>
              <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={a.photo} alt="" className="h-10 w-10 rounded-full object-cover" /><div><p className="font-medium">{a.name}</p><p className="text-xs text-muted">{a.designation}</p></div></div></td>
              <td className="px-4 py-3">{a.location}</td>
              <td className="px-4 py-3"><button className="font-medium text-accent hover:underline" onClick={() => setListing(a)}>{props.filter((p) => p.agentId === a.id).length} properties</button></td>
              <td className="px-4 py-3"><StatusBadge status={a.verified ? 'Verified' : 'Unverified'} /></td>
              <td className="px-4 py-3"><div className="flex gap-1.5">
                <button className="btn-outline btn-sm" onClick={() => verify(a)} aria-label={a.verified ? `Unverify ${a.name}` : `Verify ${a.name}`}><BadgeCheck size={14} />{a.verified ? 'Unverify' : 'Verify'}</button>
                <button className="btn-outline btn-sm" onClick={() => setEdit(a)} aria-label={`Edit ${a.name}`}><Pencil size={14} /></button>
                <button className="btn-outline btn-sm hover:!border-red-300 hover:!text-red-600" onClick={() => setDel(a)} aria-label={`Delete ${a.name}`}><Trash2 size={14} /></button></div></td>
            </tr>
          ))}
        </Table>
      )}
      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Edit agent' : 'Add agent'} size="max-w-2xl">{edit && <AgentForm agent={edit.id ? edit : null} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); reload() }} />}</Modal>
      <Modal open={!!listing} onClose={() => setListing(null)} title={`${listing?.name}'s listings`}>
        {listing && (props.filter((p) => p.agentId === listing.id).length ? <ul className="divide-y divide-line">{props.filter((p) => p.agentId === listing.id).map((p) => <li key={p.id} className="flex items-center gap-3 py-3 text-sm"><ListChecks size={16} className="text-accent" /><span className="flex-1">{p.title}</span><span className="text-muted">{p.location}</span></li>)}</ul> : <p className="text-sm text-muted">No properties assigned. Assign this agent from a property's edit screen.</p>)}
      </Modal>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} title="Delete agent?" message={`${del?.name} will be removed. Their properties will need a new agent.`} />
    </>
  )
}

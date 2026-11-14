import { useState } from 'react'
import { useSite } from '../../context/SiteContext'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { submissionService } from '../../services/submissionService'
import { formatPrice } from '../../utils/format'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Trash2, Search } from 'lucide-react'
import { useSEO } from '../../utils/seo'
import { useAuth } from '../../context/AuthContext'
import { useAsync } from '../../hooks/useAsync'
import { authService } from '../../services/authService'
import { accountService } from '../../services/accountService'
import { formatDate } from '../../utils/format'
import PageHeader from '../../components/common/PageHeader'
import Field from '../../components/common/Field'
import { EmptyState } from '../../components/common/States'
import { StatusBadge } from '../../components/admin/AdminUI'

const TABS = ['Profile', 'My submissions', 'Saved searches', 'My enquiries', 'My visits']

function Profile() {
  const { user, update } = useAuth()
  const p = useForm({ defaultValues: { name: user.name, phone: user.phone || '' } })
  const pw = useForm()
  const saveProfile = async (d) => { try { update(await authService.updateProfile(d)); toast.success('Profile updated') } catch (e) { toast.error(e.message) } }
  const savePw = async (d) => { try { await authService.changePassword({ currentPassword: d.current, newPassword: d.next }); toast.success('Password changed'); pw.reset() } catch (e) { toast.error(e.message) } }
  const c = (e) => `input ${e ? 'input-error' : ''}`
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={p.handleSubmit(saveProfile)} noValidate className="card space-y-4 p-6"><h2 className="font-semibold">Profile</h2>
        <Field label="Email"><input className="input bg-slate-50" value={user.email} readOnly aria-readonly /></Field>
        <Field label="Full name" error={p.formState.errors.name}><input className={c(p.formState.errors.name)} {...p.register('name', { required: 'Enter your name', minLength: { value: 2, message: 'Name is too short' } })} /></Field>
        <Field label="Phone" error={p.formState.errors.phone}><input className={c(p.formState.errors.phone)} {...p.register('phone', { pattern: { value: /^$|^[+\d][\d\s-]{7,14}$/, message: 'Enter a valid phone number' } })} /></Field>
        <button className="btn-primary" disabled={p.formState.isSubmitting}>Save profile</button></form>
      <form onSubmit={pw.handleSubmit(savePw)} noValidate className="card space-y-4 p-6"><h2 className="font-semibold">Change password</h2>
        <Field label="Current password" error={pw.formState.errors.current}><input type="password" autoComplete="current-password" className={c(pw.formState.errors.current)} {...pw.register('current', { required: 'Enter your current password' })} /></Field>
        <Field label="New password" error={pw.formState.errors.next}><input type="password" autoComplete="new-password" className={c(pw.formState.errors.next)} {...pw.register('next', { required: 'Choose a new password', minLength: { value: 8, message: 'Use at least 8 characters' }, pattern: { value: /(?=.*\d)(?=.*[A-Za-z])/, message: 'Include letters and numbers' } })} /></Field>
        <button className="btn-outline" disabled={pw.formState.isSubmitting}>Update password</button></form>
    </div>
  )
}

function Searches() {
  const { data, reload } = useAsync(() => accountService.savedSearches.list(), [])
  const remove = async (id) => { await accountService.savedSearches.remove(id).catch((e) => toast.error(e.message)); reload() }
  if (data && data.length === 0) return <EmptyState icon={Search} title="No saved searches" text="Filter properties and choose “Save this search” to find them here." action={<Link to="/properties" className="btn-primary">Search properties</Link>} />
  return <ul className="space-y-3">{(data || []).map((s) => <li key={s.id} className="card flex items-center justify-between gap-3 p-4"><div><p className="font-medium">{s.name}</p><p className="text-xs text-muted">Saved {formatDate(s.createdAt)}</p></div><div className="flex gap-2"><Link to={`/properties?${s.query}`} className="btn-outline btn-sm">Run search</Link><button onClick={() => remove(s.id)} className="btn-outline btn-sm hover:!text-red-600" aria-label={`Delete ${s.name}`}><Trash2 size={14} /></button></div></li>)}</ul>
}

function Submissions() {
  const { site } = useSite()
  const { data, loading } = useAsync(() => submissionService.mine(), [])
  if (loading) return <div className="skeleton h-24" />
  if (!data?.length) return <EmptyState title="No submissions yet" text="Properties you submit for listing appear here with their review status." action={<Link to="/list-property" className="btn-primary">List a property</Link>} />
  return <ul className="space-y-3">{data.map((s) => <li key={s.id} className="card p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-center gap-3"><img src={s.images?.[0]} alt="" className="h-14 w-20 rounded-lg object-cover" /><div><p className="font-medium">{s.title}</p><p className="text-xs text-muted">{formatPrice(s.price, s.purpose)} · {s.location} · {s.reference} · {formatDate(s.createdAt)}</p></div></div><StatusBadge status={s.status === 'Pending' ? 'Pending review' : s.status} /></div>
    {s.status === 'Rejected' && s.adminNote && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"><strong>Why: </strong>{s.adminNote}</p>}
    {s.status === 'Approved' && <p className="mt-3 text-sm text-accent">Published on {site.company}.</p>}</li>)}</ul>
}

function Activity({ kind }) {
  const { data, loading } = useAsync(() => accountService.activity(), [])
  const list = data?.[kind === 'enq' ? 'inquiries' : 'appointments'] || []
  if (loading) return <div className="skeleton h-24" />
  if (!list.length) return <EmptyState title={kind === 'enq' ? 'No enquiries yet' : 'No visits booked'} text={kind === 'enq' ? 'Enquiries you send while logged in appear here.' : 'Visits you book while logged in appear here.'} action={<Link to="/properties" className="btn-primary">Browse properties</Link>} />
  return <ul className="space-y-3">{list.map((x) => <li key={x.id} className="card flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-medium">{x.property}</p><p className="text-xs text-muted">{kind === 'enq' ? formatDate(x.createdAt) : `${formatDate(x.date)} at ${x.time}`}</p></div><StatusBadge status={x.status} /></li>)}</ul>
}

export default function Account() {
  useSEO('My Account')
  const { user } = useAuth()
  const [sp] = useSearchParams()
  const [tab, setTab] = useState(sp.get('tab') === 'submissions' ? 'My submissions' : 'Profile')
  if (!user) return <Navigate to="/login" state={{ from: '/account' }} replace />
  return (
    <>
      <PageHeader title="My account" subtitle={`Signed in as ${user.email}`} />
      <div className="container-x py-8">
        <div className="mb-6 flex gap-2 overflow-x-auto" role="tablist">{TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${tab === t ? 'border-primary bg-primary text-white' : 'border-line bg-white'}`}>{t}</button>)}</div>
        {tab === 'Profile' && <Profile />}{tab === 'My submissions' && <Submissions />}{tab === 'Saved searches' && <Searches />}{tab === 'My enquiries' && <Activity kind="enq" />}{tab === 'My visits' && <Activity kind="visit" />}
      </div>
    </>
  )
}

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'
import Field from '../../components/common/Field'
import { AdminHeader } from '../../components/admin/AdminUI'

export default function AdminProfile() {
  const { user, update } = useAuth()
  const p = useForm({ defaultValues: { name: user.name, phone: user.phone || '' } })
  const pw = useForm()
  const saveProfile = async (d) => { try { update(await authService.updateProfile(d)); toast.success('Profile updated') } catch (e) { toast.error(e.message) } }
  const savePw = async (d) => { try { await authService.changePassword({ currentPassword: d.current, newPassword: d.next }); toast.success('Password changed'); pw.reset() } catch (e) { toast.error(e.message) } }
  const c = (e) => `input ${e ? 'input-error' : ''}`
  return (
    <>
      <AdminHeader title="My profile" subtitle="Manage your account details and password" />
      <div className="card mb-6 flex items-center gap-4 p-6">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-2xl font-semibold uppercase text-white">{user.name?.[0]}</span>
        <div><p className="text-lg font-semibold">{user.name}</p><p className="text-sm text-muted">{user.email}</p><span className="mt-1 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium capitalize text-slate-600">{user.role}</span></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={p.handleSubmit(saveProfile)} noValidate className="card space-y-4 p-6"><h2 className="font-semibold">Profile details</h2>
          <Field label="Email"><input className="input bg-slate-50" value={user.email} readOnly aria-readonly /></Field>
          <Field label="Full name" error={p.formState.errors.name}><input className={c(p.formState.errors.name)} {...p.register('name', { required: 'Enter your name', minLength: { value: 2, message: 'Name is too short' } })} /></Field>
          <Field label="Phone" error={p.formState.errors.phone}><input className={c(p.formState.errors.phone)} {...p.register('phone', { pattern: { value: /^$|^[+\d][\d\s-]{7,14}$/, message: 'Enter a valid phone number' } })} /></Field>
          <button className="btn-primary" disabled={p.formState.isSubmitting}>Save profile</button></form>
        <form onSubmit={pw.handleSubmit(savePw)} noValidate className="card space-y-4 p-6"><h2 className="font-semibold">Change password</h2>
          <Field label="Current password" error={pw.formState.errors.current}><input type="password" autoComplete="current-password" className={c(pw.formState.errors.current)} {...pw.register('current', { required: 'Enter your current password' })} /></Field>
          <Field label="New password" error={pw.formState.errors.next}><input type="password" autoComplete="new-password" className={c(pw.formState.errors.next)} {...pw.register('next', { required: 'Choose a new password', minLength: { value: 8, message: 'Use at least 8 characters' }, pattern: { value: /(?=.*\d)(?=.*[A-Za-z])/, message: 'Include letters and numbers' } })} /></Field>
          <button className="btn-outline" disabled={pw.formState.isSubmitting}>Update password</button></form>
      </div>
    </>
  )
}

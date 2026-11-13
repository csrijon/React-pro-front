import { Mail, Phone, User, Bike, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageHeading } from './OrderBits'
import FormField from '../../components/forms/FormField'
import LoadingButton from '../../components/forms/LoadingButton'
import { StrengthMeter } from '../Authentication/Register'
import { useAuth } from '../../context/AuthContext'
import TwoFactorPanel from '../../components/forms/TwoFactorPanel'
import authService from '../../services/authService'
import useForm from '../../hooks/useForm'
import userService from '../../services/userService'
import { rules } from '../../utils/validators'

export default function Profile() {
  const { user, updateProfile, adoptSession } = useAuth()
  const profile = useForm(
    { name: user.name, phone: user.phone || '', dob: user.dob || '', gender: user.gender || '', bike: user.bike || '' },
    (v) => ({ name: rules.required('Name')(v.name), phone: rules.phone(v.phone) }),
  )
  const pw = useForm({ currentPassword: '', newPassword: '', confirm: '' }, (v) => ({
    currentPassword: rules.required('Current password')(v.currentPassword),
    newPassword: rules.password(v.newPassword),
    confirm: v.confirm !== v.newPassword ? 'Passwords do not match' : rules.required('Confirm password')(v.confirm),
  }))

  const saveProfile = profile.submit(async (v) => { await updateProfile(v); toast.success('Profile updated') })
  const savePw = pw.submit(async (v) => { const r = await userService.changePassword({ currentPassword: v.currentPassword, newPassword: v.newPassword }); adoptSession(r); toast.success('Password changed. Other devices were signed out.'); pw.reset() })

  return (
    <>
      <PageHeading title="My Profile" text="Manage your personal information and security." />
      <form onSubmit={saveProfile} noValidate className="rounded-2xl border border-line bg-ink-800 p-5 sm:p-6">
        <h2 className="mb-5 text-lg font-bold">Personal information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Full name" icon={User} error={profile.errors.name} {...profile.field('name')} />
          <FormField label="Email" icon={Mail} value={user.email} readOnly disabled hint="Email cannot be changed" />
          <FormField label="Mobile number" icon={Phone} type="tel" error={profile.errors.phone} {...profile.field('phone')} />
          <FormField label="Date of birth" type="date" {...profile.field('dob')} />
          <FormField label="Gender" as="select" options={[{ value: '', label: 'Prefer not to say' }, 'Male', 'Female', 'Other']} {...profile.field('gender')} />
          <FormField label="Your bike" icon={Bike} placeholder="e.g. KTM Duke 390" {...profile.field('bike')} />
        </div>
        {profile.formError && <p role="alert" className="mt-4 text-sm text-brand-light">{profile.formError}</p>}
        <LoadingButton type="submit" loading={profile.submitting} loadingText="Saving..." className="btn-primary mt-6">Save Changes</LoadingButton>
      </form>

      <form onSubmit={savePw} noValidate className="mt-6 rounded-2xl border border-line bg-ink-800 p-5 sm:p-6">
        <h2 className="mb-5 text-lg font-bold">Change password</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField className="sm:col-span-2" label="Current password" type="password" icon={Lock} autoComplete="current-password" error={pw.errors.currentPassword} {...pw.field('currentPassword')} />
          <div><FormField label="New password" type="password" icon={Lock} autoComplete="new-password" error={pw.errors.newPassword} {...pw.field('newPassword')} /><StrengthMeter value={pw.values.newPassword} /></div>
          <FormField label="Confirm new password" type="password" icon={Lock} autoComplete="new-password" error={pw.errors.confirm} {...pw.field('confirm')} />
        </div>
        {pw.formError && <p role="alert" className="mt-4 text-sm text-brand-light">{pw.formError}</p>}
        <LoadingButton type="submit" loading={pw.submitting} loadingText="Updating..." className="btn-ghost mt-6">Update Password</LoadingButton>
      </form>

      <h2 className="mb-3 mt-8 text-xl font-bold">Security</h2>
      <TwoFactorPanel mandatory={user.role === 'admin'} />
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-ink-800 p-5">
        <div><h3 className="font-bold">Sign out of all other devices</h3><p className="text-sm text-muted">Use this if you signed in on a shared computer or suspect someone else has access.</p></div>
        <button className="btn-ghost" onClick={async () => { try { adoptSession(await authService.logoutAll()); toast.success('Signed out everywhere else') } catch (e) { toast.error(e.message) } }}>Sign out everywhere</button>
      </div>
    </>
  )
}

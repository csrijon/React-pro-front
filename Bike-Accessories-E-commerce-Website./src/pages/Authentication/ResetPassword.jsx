import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Lock, CheckCircle2, ArrowLeft, LinkIcon } from 'lucide-react'
import AuthShell from './AuthShell'
import { StrengthMeter } from './Register'
import FormField from '../../components/forms/FormField'
import LoadingButton from '../../components/forms/LoadingButton'
import authService from '../../services/authService'
import useForm from '../../hooks/useForm'
import usePageTitle from '../../hooks/usePageTitle'
import { rules } from '../../utils/validators'

export default function ResetPassword() {
  usePageTitle('Reset Password')
  const [sp] = useSearchParams()
  const token = sp.get('token')
  const [done, setDone] = useState(false)
  const form = useForm({ password: '', confirm: '' }, (v) => ({
    password: rules.password(v.password),
    confirm: v.confirm !== v.password ? 'Passwords do not match' : rules.required('Confirm password')(v.confirm),
  }))
  const onSubmit = form.submit(async (v) => { await authService.resetPassword(token, v.password); setDone(true) })

  const back = <Link to="/login" className="inline-flex items-center gap-1.5 font-semibold text-brand hover:underline"><ArrowLeft size={15} /> Back to sign in</Link>

  if (!token)
    return (
      <AuthShell photo="cruiser" title="Invalid reset link" subtitle="This password reset link is missing or malformed." footer={back}>
        <Link to="/forgot-password" className="btn-primary w-full"><LinkIcon size={16} /> Request a new link</Link>
      </AuthShell>
    )

  return (
    <AuthShell photo="cruiser" title={done ? 'Password updated' : 'Set a new password'} subtitle={done ? undefined : 'Choose a strong password you haven’t used before.'} footer={back}>
      {done ? (
        <div className="rounded-2xl border border-line bg-ink-800 p-6 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400"><CheckCircle2 size={28} /></span>
          <p className="text-sm text-muted">Your password has been changed. You can now sign in with your new password.</p>
          <Link to="/login" className="btn-primary mt-5 w-full">Sign In</Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div>
            <FormField label="New password" type="password" icon={Lock} autoComplete="new-password" error={form.errors.password} {...form.field('password')} />
            <StrengthMeter value={form.values.password} />
          </div>
          <FormField label="Confirm new password" type="password" icon={Lock} autoComplete="new-password" error={form.errors.confirm} {...form.field('confirm')} />
          {form.formError && <p role="alert" className="rounded-lg border border-brand/40 bg-brand-soft p-3 text-sm text-brand-light">{form.formError}</p>}
          <LoadingButton type="submit" loading={form.submitting} loadingText="Updating..." className="btn-primary w-full py-3.5">Update Password</LoadingButton>
        </form>
      )}
    </AuthShell>
  )
}

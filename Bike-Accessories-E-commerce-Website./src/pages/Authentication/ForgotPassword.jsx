import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, MailCheck } from 'lucide-react'
import AuthShell from './AuthShell'
import FormField from '../../components/forms/FormField'
import LoadingButton from '../../components/forms/LoadingButton'
import authService from '../../services/authService'
import useForm from '../../hooks/useForm'
import usePageTitle from '../../hooks/usePageTitle'
import { rules } from '../../utils/validators'
import { USE_MOCK } from '../../services/api'

export default function ForgotPassword() {
  usePageTitle('Forgot Password')
  const [sent, setSent] = useState(null)
  const form = useForm({ email: '' }, (v) => ({ email: rules.email(v.email) }))
  const onSubmit = form.submit(async (v) => setSent({ email: v.email, ...(await authService.forgotPassword(v.email)) }))

  return (
    <AuthShell photo="cruiser" title={sent ? 'Check your inbox' : 'Forgot password?'}
      subtitle={sent ? undefined : 'Enter the email linked to your account and we’ll send you a reset link.'}
      footer={<Link to="/login" className="inline-flex items-center gap-1.5 py-2 font-semibold text-brand hover:underline"><ArrowLeft size={15} /> Back to sign in</Link>}>
      {sent ? (
        <div className="rounded-2xl border border-line bg-ink-800 p-6 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400"><MailCheck size={28} /></span>
          <p className="text-sm text-muted">If an account exists for <b className="text-white">{sent.email}</b>, you’ll receive password reset instructions shortly.</p>
          {USE_MOCK && sent.devResetToken && (
            <Link to={`/reset-password?token=${sent.devResetToken}`} className="btn-primary mt-5 w-full">Open reset link (demo mode)</Link>
          )}
          <button onClick={() => setSent(null)} className="mt-4 text-sm font-medium text-muted hover:text-white">Use a different email</button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <FormField label="Email" type="email" icon={Mail} autoComplete="email" placeholder="you@example.com" error={form.errors.email} {...form.field('email')} />
          {form.formError && <p role="alert" className="rounded-lg border border-brand/40 bg-brand-soft p-3 text-sm text-brand-light">{form.formError}</p>}
          <LoadingButton type="submit" loading={form.submitting} loadingText="Sending..." className="btn-primary w-full py-3.5">Send Reset Link</LoadingButton>
        </form>
      )}
    </AuthShell>
  )
}

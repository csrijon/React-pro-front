import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthShell from './AuthShell'
import FormField from '../../components/forms/FormField'
import LoadingButton from '../../components/forms/LoadingButton'
import { useAuth } from '../../context/AuthContext'
import useForm from '../../hooks/useForm'
import usePageTitle from '../../hooks/usePageTitle'
import { rules } from '../../utils/validators'
import { USE_MOCK } from '../../services/api'
import { DEMO_USER } from '../../services/mock/mockAdapter'

export default function Login() {
  usePageTitle('Sign In')
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const from = state?.from || '/account'
  const form = useForm({ email: '', password: '' }, (v) => ({ email: rules.email(v.email), password: rules.required('Password')(v.password) }))

  if (isAuthenticated) return <Navigate to={from} replace />

  const onSubmit = form.submit(async (v) => {
    const user = await login(v)
    toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
    navigate(from, { replace: true })
  })

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to track orders, manage your wishlist and check out faster."
      footer={<>New to MotoGear? <Link to="/register" state={state} className="font-semibold text-brand hover:underline">Create an account</Link></>}>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormField label="Email" type="email" icon={Mail} autoComplete="email" placeholder="you@example.com" error={form.errors.email} {...form.field('email')} />
        <div>
          <FormField label="Password" type="password" icon={Lock} autoComplete="current-password" placeholder="Enter your password" error={form.errors.password} {...form.field('password')} />
          <div className="mt-2 text-right"><Link to="/forgot-password" className="text-xs font-medium text-muted hover:text-brand">Forgot password?</Link></div>
        </div>
        {form.formError && <p role="alert" className="rounded-lg border border-brand/40 bg-brand-soft p-3 text-sm text-brand">{form.formError}</p>}
        <LoadingButton type="submit" loading={form.submitting} loadingText="Signing in..." className="btn-primary w-full py-3.5">Sign In</LoadingButton>
      </form>
      {USE_MOCK && (
        <div className="mt-6 rounded-xl border border-line bg-ink-800 p-4 text-xs text-muted">
          <p className="mb-2 flex items-center gap-1.5 font-semibold text-white"><Info size={14} className="text-brand" /> Demo account (mock mode)</p>
          <p>{DEMO_USER.email} / {DEMO_USER.password}</p>
          <button type="button" onClick={() => form.setValues({ email: DEMO_USER.email, password: DEMO_USER.password })} className="mt-2 font-semibold text-brand hover:underline">Fill demo credentials</button>
        </div>
      )}
    </AuthShell>
  )
}

import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, Info, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthShell from './AuthShell'
import FormField from '../../components/forms/FormField'
import LoadingButton from '../../components/forms/LoadingButton'
import { useAuth } from '../../context/AuthContext'
import useForm from '../../hooks/useForm'
import usePageTitle from '../../hooks/usePageTitle'
import { rules } from '../../utils/validators'
import { USE_MOCK } from '../../services/api'
import { DEMO_USER } from '../../services/mock/demo'

export default function Login() {
  usePageTitle('Sign In')
  const { login, verifyTwoFactor, isAuthenticated, user: me } = useAuth()
  const [challenge, setChallenge] = useState(null) // set when the account needs a second factor
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const navigate = useNavigate()
  const { state } = useLocation()
  const from = state?.from || '/account'
  const form = useForm({ email: '', password: '' }, (v) => ({ email: rules.email(v.email), password: rules.required('Password')(v.password) }))

  if (isAuthenticated) return <Navigate to={state?.from || (user?.role === 'admin' ? '/admin' : '/account')} replace />

  const finish = (user) => {
    toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
    navigate(state?.from || (user.role === 'admin' ? '/admin' : '/account'), { replace: true })
  }
  const submitCode = async (e) => {
    e.preventDefault()
    setVerifying(true); setCodeError('')
    try { finish(await verifyTwoFactor(challenge, code.trim())) } catch (err) { setCodeError(err.message) } finally { setVerifying(false) }
  }

  const onSubmit = form.submit(async (v) => {
    const res = await login(v)
    if (res.requires2fa) { setChallenge(res.challenge); return }
    const user = res
    toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
    navigate(state?.from || (user.role === 'admin' ? '/admin' : '/account'), { replace: true })
  })

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to track orders, manage your wishlist and check out faster."
      footer={<>New to MotoGear? <Link to="/register" state={state} className="font-semibold text-brand hover:underline">Create an account</Link></>}>
      {state?.reason === 'checkout' && !challenge && <p className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">Please sign in or create an account to place your order. Your cart is saved.</p>}
      {challenge ? (
        <form onSubmit={submitCode} noValidate className="space-y-5">
          <p className="flex items-start gap-3 rounded-xl border border-line bg-ink-800 p-4 text-sm text-muted"><ShieldCheck className="mt-0.5 shrink-0 text-brand-light" size={20} />Enter the 6-digit code from your authenticator app. Lost your phone? Use one of your recovery codes instead.</p>
          <FormField label="Authentication code" autoComplete="one-time-code" inputMode="text" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} error={codeError} autoFocus />
          <LoadingButton type="submit" loading={verifying} loadingText="Verifying..." className="btn-primary w-full py-3.5">Verify and sign in</LoadingButton>
          <button type="button" onClick={() => { setChallenge(null); setCode(''); setCodeError('') }} className="w-full text-sm text-muted hover:text-white">Back</button>
        </form>
      ) : (
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormField label="Email" type="email" icon={Mail} autoComplete="email" placeholder="you@example.com" error={form.errors.email} {...form.field('email')} />
        <div>
          <FormField label="Password" type="password" icon={Lock} autoComplete="current-password" placeholder="Enter your password" error={form.errors.password} {...form.field('password')} />
          <div className="mt-2 text-right"><Link to="/forgot-password" className="text-xs font-medium text-muted hover:text-brand-light">Forgot password?</Link></div>
        </div>
        {form.formError && <p role="alert" className="rounded-lg border border-brand/40 bg-brand-soft p-3 text-sm text-brand-light">{form.formError}</p>}
        <LoadingButton type="submit" loading={form.submitting} loadingText="Signing in..." className="btn-primary w-full py-3.5">Sign In</LoadingButton>
      </form>
      )}
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

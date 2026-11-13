import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthShell from './AuthShell'
import FormField from '../../components/forms/FormField'
import LoadingButton from '../../components/forms/LoadingButton'
import { useAuth } from '../../context/AuthContext'
import useForm from '../../hooks/useForm'
import usePageTitle from '../../hooks/usePageTitle'
import { rules } from '../../utils/validators'

export function strength(pw = '') {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}
export function StrengthMeter({ value }) {
  const s = strength(value)
  const label = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][value ? s : 0]
  const color = ['bg-line', 'bg-brand-solid', 'bg-amber-500', 'bg-lime-500', 'bg-emerald-500'][value ? s : 0]
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1.5">{[1, 2, 3, 4].map((i) => <span key={i} className={`h-1 flex-1 rounded ${i <= s && value ? color : 'bg-line'}`} />)}</div>
      {value && <p className="mt-1 text-xs text-muted">Password strength: {label}</p>}
    </div>
  )
}

export default function Register() {
  usePageTitle('Create Account')
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const from = state?.from || '/account'
  const form = useForm({ name: '', email: '', phone: '', password: '', confirm: '', terms: false }, (v) => ({
    name: rules.required('Full name')(v.name) || rules.min(2, 'Name')(v.name.trim()),
    email: rules.email(v.email),
    phone: rules.phone(v.phone),
    password: rules.password(v.password),
    confirm: v.confirm !== v.password ? 'Passwords do not match' : rules.required('Confirm password')(v.confirm),
    terms: v.terms ? '' : 'You must accept the terms to continue',
  }))

  if (isAuthenticated) return <Navigate to={from} replace />

  const onSubmit = form.submit(async (v) => {
    const user = await register({ name: v.name, email: v.email, phone: v.phone, password: v.password })
    toast.success(`Welcome to MotoGear, ${user.name.split(' ')[0]}!`)
    navigate(from, { replace: true })
  })

  return (
    <AuthShell photo="sunsetRider" title="Create your account" subtitle="Join 50,000+ riders. It takes less than a minute."
      footer={<>Already have an account? <Link to="/login" state={state} className="font-semibold text-brand hover:underline">Sign in</Link></>}>
      {state?.reason === 'checkout' && <p className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">Create an account to place your order. Your cart is saved.</p>}
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormField label="Full name" icon={User} autoComplete="name" error={form.errors.name} {...form.field('name')} />
        <FormField label="Email" type="email" icon={Mail} autoComplete="email" error={form.errors.email} {...form.field('email')} />
        <FormField label="Mobile number" type="tel" icon={Phone} autoComplete="tel" placeholder="10-digit mobile" error={form.errors.phone} {...form.field('phone')} />
        <div>
          <FormField label="Password" type="password" icon={Lock} autoComplete="new-password" hint="At least 8 characters with letters and numbers" error={form.errors.password} {...form.field('password')} />
          <StrengthMeter value={form.values.password} />
        </div>
        <FormField label="Confirm password" type="password" icon={Lock} autoComplete="new-password" error={form.errors.confirm} {...form.field('confirm')} />
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#EF252B]" checked={form.values.terms} onChange={(e) => form.setValue('terms', e.target.checked)} aria-invalid={!!form.errors.terms} />
            <span>I agree to the <Link to="/terms" className="text-white underline">Terms &amp; Conditions</Link> and <Link to="/privacy-policy" className="text-white underline">Privacy Policy</Link></span>
          </label>
          {form.errors.terms && <p role="alert" className="mt-1 text-xs text-brand-light">{form.errors.terms}</p>}
        </div>
        {form.formError && <p role="alert" className="rounded-lg border border-brand/40 bg-brand-soft p-3 text-sm text-brand-light">{form.formError}</p>}
        <LoadingButton type="submit" loading={form.submitting} loadingText="Creating account..." className="btn-primary w-full py-3.5">Create Account</LoadingButton>
      </form>
    </AuthShell>
  )
}

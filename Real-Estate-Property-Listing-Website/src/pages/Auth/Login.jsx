import { useForm } from 'react-hook-form'
import { useSite } from '../../context/SiteContext'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useSEO } from '../../utils/seo'
import { useAuth } from '../../context/AuthContext'
import Field from '../../components/common/Field'
import { USE_MOCK } from '../../services/config'

export default function Login() {
  const { site, tx } = useSite()
  useSEO('Log in')
  const { login } = useAuth(); const nav = useNavigate(); const loc = useLocation()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const onSubmit = async (d) => {
    try { const u = await login(d); toast.success(`Welcome back, ${u.name}`); nav(loc.state?.from || (u.role === 'admin' ? '/admin' : '/'), { replace: true }) }
    catch (e) { toast.error(e.message || 'Could not log in. Check your details and try again.') }
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold">{tx(site.pages.login.title)}</h1><p className="mt-1 text-muted">{tx(site.pages.login.subtitle)}</p>
      {loc.state?.notice && <p className="mt-4 rounded-xl bg-primary-50 p-3 text-sm text-primary">{loc.state.notice}</p>}
      {USE_MOCK && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">Demo mode: no backend is connected, so sign-in is simulated and not secure. Use an email starting with <strong>admin@</strong> to preview the admin dashboard.</p>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        <Field label="Email" error={errors.email}><input type="email" autoComplete="email" className={`input ${errors.email ? 'input-error' : ''}`} {...register('email', { required: 'Please enter your email', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } })} /></Field>
        <Field label="Password" error={errors.password}><input type="password" autoComplete="current-password" className={`input ${errors.password ? 'input-error' : ''}`} {...register('password', { required: 'Please enter your password', minLength: { value: 6, message: 'At least 6 characters' } })} /></Field>
        <div className="text-right"><Link to="/forgot-password" className="text-sm font-medium text-accent hover:underline">Forgot password?</Link></div>
        <button className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting ? 'Logging in…' : 'Log in'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">New to {site.company}? <Link to="/register" className="font-semibold text-accent hover:underline">Create an account</Link></p>
    </div>
  )
}

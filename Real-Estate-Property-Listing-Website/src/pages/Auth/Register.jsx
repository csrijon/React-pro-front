import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useSEO } from '../../utils/seo'
import { useAuth } from '../../context/AuthContext'
import Field from '../../components/common/Field'
import { rules } from '../../components/forms/EnquiryForm'

export default function Register() {
  useSEO('Create account')
  const { register: signup } = useAuth(); const nav = useNavigate()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const onSubmit = async (d) => {
    try { await signup(d); toast.success('Account created'); nav('/') } catch (e) { toast.error(e.message || 'Could not create your account.') }
  }
  const c = (e) => `input ${e ? 'input-error' : ''}`
  return (
    <div>
      <h1 className="text-3xl font-semibold">Create account</h1><p className="mt-1 text-muted">Save properties and track your enquiries.</p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        <Field label="Full name" error={errors.name}><input className={c(errors.name)} autoComplete="name" {...register('name', rules.name)} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" error={errors.email}><input type="email" autoComplete="email" className={c(errors.email)} {...register('email', rules.email)} /></Field>
          <Field label="Phone" error={errors.phone}><input type="tel" autoComplete="tel" className={c(errors.phone)} {...register('phone', rules.phone)} /></Field>
        </div>
        <Field label="Password" error={errors.password}><input type="password" autoComplete="new-password" className={c(errors.password)} {...register('password', { required: 'Please choose a password', minLength: { value: 8, message: 'Use at least 8 characters' }, pattern: { value: /(?=.*\d)(?=.*[A-Za-z])/, message: 'Include letters and numbers' } })} /></Field>
        <Field label="Confirm password" error={errors.confirm}><input type="password" autoComplete="new-password" className={c(errors.confirm)} {...register('confirm', { required: 'Please confirm your password', validate: (v) => v === watch('password') || 'Passwords do not match' })} /></Field>
        <label className="flex items-start gap-2 text-sm text-muted"><input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#267032]" {...register('terms', { required: 'Please accept the terms to continue' })} />I agree to the terms of service and privacy policy.</label>
        {errors.terms && <p className="field-error">{errors.terms.message}</p>}
        <button className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting ? 'Creating…' : 'Create account'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">Already registered? <Link to="/login" className="font-semibold text-accent hover:underline">Log in</Link></p>
    </div>
  )
}

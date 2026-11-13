import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useSEO } from '../../utils/seo'
import { authService } from '../../services/authService'
import Field from '../../components/common/Field'

export default function ForgotPassword() {
  useSEO('Forgot password')
  const [sent, setSent] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const onSubmit = async ({ email }) => { try { await authService.forgotPassword(email); setSent(email) } catch (e) { toast.error(e.message || 'Could not send the reset link.') } }
  if (sent) return (
    <div className="text-center"><MailCheck size={44} className="mx-auto text-accent" /><h1 className="mt-4 text-2xl font-semibold">Check your inbox</h1>
      <p className="mt-2 text-muted">If an account exists for <strong className="text-ink">{sent}</strong>, a reset link is on its way.</p><Link to="/login" className="btn-primary mt-6">Back to log in</Link></div>
  )
  return (
    <div>
      <h1 className="text-3xl font-semibold">Reset your password</h1><p className="mt-1 text-muted">Enter your email and we'll send a reset link.</p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        <Field label="Email" error={errors.email}><input type="email" className={`input ${errors.email ? 'input-error' : ''}`} {...register('email', { required: 'Please enter your email', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } })} /></Field>
        <button className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send reset link'}</button>
      </form>
      <p className="mt-6 text-center text-sm"><Link to="/login" className="font-semibold text-accent hover:underline">Back to log in</Link></p>
    </div>
  )
}

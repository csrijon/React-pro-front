import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSEO } from '../../utils/seo'
import { authService } from '../../services/authService'
import Field from '../../components/common/Field'

export default function ResetPassword() {
  useSEO('Choose a new password')
  const [sp] = useSearchParams(); const nav = useNavigate(); const token = sp.get('token')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const onSubmit = async (d) => { try { await authService.resetPassword({ token, password: d.password }); toast.success('Password updated. Log in with your new password.'); nav('/login') } catch (e) { toast.error(e.message) } }
  if (!token) return <div className="text-center"><h1 className="text-2xl font-semibold">Reset link is missing</h1><p className="mt-2 text-muted">Request a new link to choose a password.</p><Link to="/forgot-password" className="btn-primary mt-6">Request a link</Link></div>
  return (
    <div>
      <h1 className="text-3xl font-semibold">Choose a new password</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        <Field label="New password" error={errors.password}><input type="password" autoComplete="new-password" className={`input ${errors.password ? 'input-error' : ''}`} {...register('password', { required: 'Choose a password', minLength: { value: 8, message: 'Use at least 8 characters' }, pattern: { value: /(?=.*\d)(?=.*[A-Za-z])/, message: 'Include letters and numbers' } })} /></Field>
        <Field label="Confirm password" error={errors.confirm}><input type="password" autoComplete="new-password" className={`input ${errors.confirm ? 'input-error' : ''}`} {...register('confirm', { required: 'Confirm your password', validate: (v) => v === watch('password') || 'Passwords do not match' })} /></Field>
        <button className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Update password'}</button>
      </form>
    </div>
  )
}

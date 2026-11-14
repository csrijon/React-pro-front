import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { preloadAdmin } from '../../routes/adminPages';
import { useAuth } from '../../context/AuthContext';
import { USE_MOCK } from '../../services/api/client';
import { ArchMark } from '../../components/common/Logo';
import Modal from '../../components/common/Modal';

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [forgot, setForgot] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { email: USE_MOCK ? 'admin@domusstudio.in' : '', password: '', remember: true } });
  useEffect(() => { document.body.style.backgroundColor = '#202321'; preloadAdmin(); return () => { document.body.style.backgroundColor = ''; }; }, []);
  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const onSubmit = async ({ email, password, remember }) => {
    setError('');
    try { await login({ email, password }, remember); navigate(location.state?.from || '/admin', { replace: true }); }
    catch (e) { setError(e.message); }
  };

  return (
    <div className="min-h-screen bg-charcoal text-cream grid place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8"><ArchMark className="h-9 w-8" /><span className="font-display text-3xl font-semibold">Domus Studio</span></div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="a-card p-6 space-y-4">
          <div><h1 className="font-sans text-lg font-semibold">Sign in to admin</h1>{USE_MOCK && <p className="text-xs text-cream/50 mt-1">Demo mode. Email is prefilled; password: <code className="text-sage">admin123</code></p>}</div>
          {error && <p role="alert" className="text-sm bg-red-950 border border-red-800 text-red-200 rounded px-3 py-2">{error}</p>}
          <div><label className="a-label" htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" className="a-input" {...register('email', { required: 'Enter your email.', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' } })} />
            {errors.email && <p className="a-err">{errors.email.message}</p>}</div>
          <div><label className="a-label" htmlFor="password">Password</label>
            <div className="relative"><input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" className="a-input pr-11" {...register('password', { required: 'Enter your password.', minLength: { value: 6, message: 'Password must be at least 6 characters.' } })} />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-0 top-0 h-[42px] w-11 grid place-items-center text-cream/60 hover:text-cream">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
            {errors.password && <p className="a-err">{errors.password.message}</p>}</div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-cream/70 min-h-[40px]"><input type="checkbox" className="accent-[#A7B49B] h-4 w-4" {...register('remember')} />Remember me</label>
            <button type="button" onClick={() => setForgot(true)} className="text-sage hover:underline">Forgot password?</button>
          </div>
          <button type="submit" disabled={isSubmitting} className="a-btn a-btn-primary w-full">{isSubmitting ? <><Loader2 size={16} className="animate-spin" />Signing in…</> : 'Sign in'}</button>
        </form>
        <p className="text-center mt-5 text-xs text-cream/40"><Link to="/" className="hover:text-cream">Back to website</Link></p>
      </div>
      <Modal open={forgot} onClose={() => setForgot(false)} title="Reset your password">
        <p className="text-sm text-cream/70">Password reset by email isn’t set up. Sign in and use Settings → Change password, or set <code className="text-sage">ADMIN_PASSWORD</code> in <code className="text-sage">.env</code> and recreate <code className="text-sage">server/data</code>.</p>
        <div className="mt-5 text-right"><button className="a-btn a-btn-primary" onClick={() => setForgot(false)}>Got it</button></div>
      </Modal>
    </div>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { inquiriesApi } from '../../services/api';
import { useSite } from '../../context/SiteContext';

const Field = ({ label, error, children }) => (
  <label className="block">
    <span className="text-xs font-semibold text-charcoal/70">{label}</span>
    {children}
    {error && <span role="alert" className="block mt-1 text-xs text-red-700">{error.message}</span>}
  </label>
);

export default function ContactForm({ defaultType = '' }) {
  const { site } = useSite();
  const PROJECT_TYPES = site.projectTypes; const BUDGETS = site.budgets;
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: { projectType: defaultType } });
  const [status, setStatus] = useState(null); // 'ok' | error string

  const onSubmit = async (data) => {
    setStatus(null);
    try { await inquiriesApi.submit(data); setStatus('ok'); reset(); }
    catch (e) { setStatus(e.message || 'Could not send your message. Please try again.'); }
  };

  if (status === 'ok') {
    return (
      <div className="bg-white p-10 text-center" role="status">
        <CheckCircle2 className="mx-auto text-forest" size={40} strokeWidth={1.2} />
        <h3 className="mt-4 font-display text-3xl">Message sent</h3>
        <p className="mt-2 text-sm text-charcoal/70">Thank you. A designer will reply within two working days.</p>
        <button className="btn btn-outline mt-6" onClick={() => setStatus(null)}>Send another message</button>
      </div>
    );
  }

  const f = (name) => `field ${errors[name] ? 'field-err' : ''}`;
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-white p-6 sm:p-9 grid gap-x-6 gap-y-5 sm:grid-cols-2">
      <div className="sm:col-span-2"><Field label="Full name" error={errors.name}>
        <input className={f('name')} autoComplete="name" {...register('name', { required: 'Enter your full name.', minLength: { value: 2, message: 'Name is too short.' } })} /></Field></div>
      <Field label="Email" error={errors.email}>
        <input type="email" className={f('email')} autoComplete="email" {...register('email', { required: 'Enter your email.', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' } })} /></Field>
      <Field label="Phone" error={errors.phone}>
        <input type="tel" className={f('phone')} autoComplete="tel" {...register('phone', { required: 'Enter your phone number.', pattern: { value: /^[+\d][\d\s-]{7,15}$/, message: 'Enter a valid phone number.' } })} /></Field>
      <Field label="Project type" error={errors.projectType}>
        <select className={f('projectType')} {...register('projectType', { required: 'Choose a project type.' })}>
          <option value="">Select…</option>{PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select></Field>
      <Field label="Location" error={errors.location}>
        <input className={f('location')} {...register('location', { required: 'Enter the project location.' })} /></Field>
      <Field label="Estimated budget" error={errors.budget}>
        <select className={f('budget')} {...register('budget')}><option value="">Select…</option>{BUDGETS.map((b) => <option key={b}>{b}</option>)}</select></Field>
      <Field label="Project area (sq. ft.)" error={errors.area}>
        <input inputMode="numeric" className={f('area')} {...register('area', { pattern: { value: /^\d*$/, message: 'Use numbers only.' } })} /></Field>
      <div className="sm:col-span-2"><Field label="Message" error={errors.message}>
        <textarea rows={4} className={f('message')} {...register('message', { required: 'Tell us a little about your project.', minLength: { value: 15, message: 'Please write at least 15 characters.' } })} /></Field></div>
      {typeof status === 'string' && status !== 'ok' && <p role="alert" className="sm:col-span-2 text-sm text-red-700 bg-red-50 px-3 py-2">{status}</p>}
      <button type="submit" disabled={isSubmitting} className="btn btn-primary sm:col-span-2 w-full">{isSubmitting ? 'Sending…' : 'Send message'}<ArrowUpRight size={15} /></button>
    </form>
  );
}

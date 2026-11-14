import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PageTitle from '../../components/admin/PageTitle';
import ImageUploader from '../../components/forms/ImageUploader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { settingsApi, authApi } from '../../services/api';
import { DEFAULT_THEME, THEME_FONTS } from '../../data/misc';

const Card = ({ title, children }) => <section className="a-card p-5 grid gap-4"><h2 className="font-sans text-sm font-semibold">{title}</h2>{children}</section>;
const url = { pattern: { value: /^(https?:\/\/.+)?$/, message: 'Enter a full URL starting with https://' } };

function PasswordForm() {
  const toast = useToast();
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm();
  const go = async ({ current, next }) => { try { await authApi.changePassword({ current, next }); toast.success('Password changed'); reset(); } catch (e) { toast.error(e.message); } };
  return (
    <form onSubmit={handleSubmit(go)} noValidate className="a-card p-5 grid gap-4">
      <h2 className="font-sans text-sm font-semibold">Change password</h2>
      <div><label className="a-label">Current password</label><input type="password" autoComplete="current-password" className="a-input" {...register('current', { required: 'Enter your current password.' })} />{errors.current && <p className="a-err">{errors.current.message}</p>}</div>
      <div><label className="a-label">New password</label><input type="password" autoComplete="new-password" className="a-input" {...register('next', { required: 'Enter a new password.', minLength: { value: 8, message: 'Use at least 8 characters.' } })} />{errors.next && <p className="a-err">{errors.next.message}</p>}</div>
      <div><label className="a-label">Confirm new password</label><input type="password" autoComplete="new-password" className="a-input" {...register('confirm', { validate: (v) => v === watch('next') || 'Passwords do not match.' })} />{errors.confirm && <p className="a-err">{errors.confirm.message}</p>}</div>
      <div><button className="a-btn a-btn-ghost" disabled={isSubmitting}>{isSubmitting ? 'Updating…' : 'Update password'}</button></div>
    </form>
  );
}

export default function Settings() {
  const { data, loading, error, reload } = useAsync(() => settingsApi.get(), []);
  const { updateUser } = useAuth(); const toast = useToast();
  const { register, control, handleSubmit, reset, setValue, formState: { errors, isSubmitting, isDirty } } = useForm();
  useEffect(() => { if (data) reset(data); }, [data, reset]);
  if (loading) return <LoadingSpinner dark />;
  if (error) return <ErrorState dark error={error} onRetry={reload} />;
  const save = async (v) => { try { await settingsApi.save(v); updateUser({ name: v.profile.name, email: v.profile.email }); reset(v); toast.success('Settings saved'); } catch (e) { toast.error(e.message); } };
  const Input = ({ name, label, opts, type = 'text' }) => <div><label className="a-label">{label}</label><input type={type} className="a-input" {...register(name, opts)} />{name.split('.').reduce((o, k) => o?.[k], errors) && <p className="a-err">{name.split('.').reduce((o, k) => o?.[k], errors).message}</p>}</div>;
  return (
    <>
      <PageTitle title="Settings" text="Profile, branding, contact details and SEO defaults." />
      <div className="grid xl:grid-cols-2 gap-4">
        <form onSubmit={handleSubmit(save)} noValidate className="space-y-4">
          <Card title="Admin profile">
            {Input({ name: 'profile.name', label: 'Name', opts: { required: 'Enter your name.' } })}
            {Input({ name: 'profile.email', label: 'Email', type: 'email', opts: { required: 'Enter your email.', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' } } })}
          </Card>
          <Card title="Website logo"><Controller name="logo" control={control} render={({ field }) => <ImageUploader compact value={field.value} onChange={field.onChange} aspect="3 / 1" label="Upload logo" />} /></Card>
          <Card title="Browser tab icon (favicon)"><Controller name="favicon" control={control} render={({ field }) => <ImageUploader compact value={field.value} onChange={field.onChange} aspect="1 / 1" label="Upload a square image (PNG)" />} /></Card>
          <Card title="Colours and fonts">
            <p className="text-xs text-cream/40 -mt-2">Applies to the public website only. The admin keeps its own look.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[['primary', 'Main colour (buttons, footer)'], ['background', 'Page background'], ['accent', 'Accent colour'], ['warm', 'Warm tone (soft panels)']].map(([k, label]) => (
                <div key={k}><label className="a-label" htmlFor={`theme-${k}`}>{label}</label>
                  <Controller name={`theme.${k}`} control={control} rules={{ pattern: { value: /^#[0-9a-fA-F]{6}$/, message: 'Use a hex colour like #173D2E.' } }}
                    render={({ field }) => (
                      <div className="flex gap-2">
                        <input id={`theme-${k}`} type="color" className="h-[42px] w-14 rounded-md border border-white/10 bg-charcoal-800 p-1 cursor-pointer" value={/^#[0-9a-fA-F]{6}$/.test(field.value || '') ? field.value : '#000000'} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                        <input className="a-input font-mono" aria-label={`${label} hex value`} value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
                      </div>)} />
                  {errors.theme?.[k] && <p className="a-err">{errors.theme[k].message}</p>}</div>
              ))}
              <div><label className="a-label">Heading font</label><select className="a-input" {...register('theme.headingFont')}>{THEME_FONTS.heading.map((f) => <option key={f}>{f}</option>)}</select></div>
              <div><label className="a-label">Body font</label><select className="a-input" {...register('theme.bodyFont')}>{THEME_FONTS.body.map((f) => <option key={f}>{f}</option>)}</select></div>
            </div>
            <div><button type="button" className="a-btn a-btn-ghost" onClick={() => setValue('theme', DEFAULT_THEME, { shouldDirty: true })}>Reset to original look</button></div>
          </Card>
          <Card title="Contact information">
            {Input({ name: 'contact.email', label: 'Email', opts: { required: 'Enter a contact email.' } })}
            {Input({ name: 'contact.phone', label: 'Phone' })}
            {Input({ name: 'contact.address', label: 'Address' })}
          </Card>
          <Card title="Social media links">
            {['instagram', 'facebook', 'pinterest', 'linkedin'].map((k) => <div key={k}>{Input({ name: `social.${k}`, label: k[0].toUpperCase() + k.slice(1), opts: url })}</div>)}
          </Card>
          <Card title="SEO defaults">
            {Input({ name: 'seo.title', label: 'Default title' })}
            <div><label className="a-label">Default description</label><textarea rows={3} className="a-input py-2" {...register('seo.description')} /></div>
          </Card>
          <button className="a-btn a-btn-primary" disabled={isSubmitting || !isDirty}>{isSubmitting ? 'Saving…' : 'Save settings'}</button>
        </form>
        <div className="xl:sticky xl:top-20 self-start"><PasswordForm /></div>
      </div>
    </>
  );
}

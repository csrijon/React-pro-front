import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import VideoField from '../../components/forms/VideoField';
import Drawer from '../../components/common/Drawer';
import ImageUploader from '../../components/forms/ImageUploader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext';
import { projectsApi } from '../../services/api';
import { pagesApi } from '../../services/api';
import { CATEGORIES } from '../../data/projects';
import { slugify } from '../../utils/helpers';

const EMPTY = { title: '', slug: '', shortDescription: '', description: '', concept: '', category: 'Residential', location: '', area: '', year: new Date().getFullYear(), duration: '', style: '', cover: '', gallery: [], videos: [], featured: false, seoTitle: '', seoDescription: '', status: 'draft', views: 0 };

const Field = ({ label, error, children, hint, className = '' }) => (
  <div className={className}><label className="a-label">{label}</label>{children}{hint && !error && <p className="text-[11px] text-cream/40 mt-1">{hint}</p>}{error && <p role="alert" className="a-err">{error.message}</p>}</div>
);

export default function ProjectEditor() {
  const { id } = useParams();
  const editing = !!id;
  const navigate = useNavigate(); const toast = useToast();
  const ctx = useOutletContext();
  const { data: pages } = useAsync(() => pagesApi.get(), []);
  const [open, setOpen] = useState(true); // closing animates out, then the route changes (onExited)
  const close = () => setOpen(false);
  const { data, loading, error } = useAsync(() => (editing ? projectsApi.get(id) : Promise.resolve(null)), [id]);
  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting, dirtyFields } } = useForm({ defaultValues: EMPTY });

  useEffect(() => { if (data) reset({ ...EMPTY, ...data }); }, [data, reset]);
  const { fields: vids, append: addVid, remove: delVid } = useFieldArray({ control, name: 'videos' });
  const title = watch('title');
  useEffect(() => { if (!editing && !dirtyFields.slug) setValue('slug', slugify(title || '')); }, [title, editing, dirtyFields.slug, setValue]);

  const save = (status) => handleSubmit(async (values) => {
    const payload = { ...values, status, area: Number(values.area) || 0, year: Number(values.year) || new Date().getFullYear(), slug: slugify(values.slug || values.title) };
    try {
      if (editing) await projectsApi.update(id, payload); else await projectsApi.create(payload);
      await ctx?.refresh?.();
      toast.success(status === 'published' ? 'Published' : 'Saved as draft');
      close();
    } catch (e) { toast.error(e.message); }
  }, () => document.querySelector('[data-drawer-body] [role=alert]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));

  const r = (n, o) => register(n, o);
  // Categories are managed in Pages → Site-wide; keep this project's current one selectable even if it was removed.
  const categories = [...new Set([...(pages?.site?.categories || CATEGORIES), data?.category].filter(Boolean))];
  const footer = !(editing && (loading || error)) && (
    <>
      <button type="button" className="a-btn a-btn-ghost" onClick={close}>Cancel</button>
      <button type="button" className="a-btn a-btn-ghost" disabled={isSubmitting} onClick={save('draft')}>Save as draft</button>
      <button type="button" className="a-btn a-btn-primary" disabled={isSubmitting} onClick={save('published')}>{isSubmitting ? 'Saving…' : 'Publish'}</button>
    </>
  );

  return (
    <Drawer open={open} onClose={close} onExited={() => navigate('/admin/projects')} size="xl" title={editing ? 'Edit project' : 'Add project'}
      subtitle="Fill in details, upload imagery and publish when ready." footer={footer}>
      <div data-drawer-body>
        {editing && loading && <LoadingSpinner dark />}
        {editing && error && <ErrorState dark error={error} />}
        {!(editing && (loading || error)) && (
          <form noValidate onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <section className="a-card p-5 grid sm:grid-cols-2 gap-4">
            <Field label="Project title" error={errors.title} className="sm:col-span-2"><input className="a-input" {...r('title', { required: 'Enter a project title.' })} /></Field>
            <Field label="Slug" error={errors.slug} hint="Used in the page URL." className="sm:col-span-2"><input className="a-input" {...r('slug', { pattern: { value: /^[a-z0-9-]*$/, message: 'Use lowercase letters, numbers and hyphens.' } })} /></Field>
            <Field label="Short description" error={errors.shortDescription} className="sm:col-span-2"><input className="a-input" {...r('shortDescription', { required: 'Add a one-line summary.', maxLength: { value: 160, message: 'Keep it under 160 characters.' } })} /></Field>
            <Field label="Full description" className="sm:col-span-2"><textarea rows={4} className="a-input py-2" {...r('description')} /></Field>
            <Field label="Design concept" className="sm:col-span-2"><textarea rows={4} className="a-input py-2" {...r('concept')} /></Field>
            <Field label="Category" error={errors.category}><select className="a-input" {...r('category', { required: true })}>{categories.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Location" error={errors.location}><input className="a-input" {...r('location', { required: 'Enter the location.' })} /></Field>
            <Field label="Area (sq. ft.)" error={errors.area}><input inputMode="numeric" className="a-input" {...r('area', { pattern: { value: /^\d*$/, message: 'Use numbers only.' } })} /></Field>
            <Field label="Project year" error={errors.year}><input inputMode="numeric" className="a-input" {...r('year', { min: { value: 1990, message: 'Enter a valid year.' }, max: { value: 2100, message: 'Enter a valid year.' } })} /></Field>
            <Field label="Duration"><input className="a-input" placeholder="e.g. 6 months" {...r('duration')} /></Field>
            <Field label="Design style"><input className="a-input" placeholder="e.g. Warm Modern" {...r('style')} /></Field>
          </section>
          <section className="a-card p-5"><h2 className="font-sans text-sm font-semibold mb-3">Cover image</h2>
            <Controller name="cover" control={control} rules={{ required: 'Upload a cover image.' }} render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} label="Drop cover image or browse" aspect="4 / 3" />} />
            {errors.cover && <p role="alert" className="a-err">{errors.cover.message}</p>}</section>
          <section className="a-card p-5"><h2 className="font-sans text-sm font-semibold mb-3">Gallery images</h2>
            <Controller name="gallery" control={control} render={({ field }) => <ImageUploader multiple value={field.value} onChange={field.onChange} label="Drag gallery images here or browse" />} /></section>
          <section className="a-card p-5 grid gap-4"><div><h2 className="font-sans text-sm font-semibold">Before &amp; after</h2><p className="text-xs text-cream/40 mt-0.5">Optional. Adds a comparison slider to the project page when both photos are set.</p></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="a-label">Before photo</label><Controller name="before" control={control} render={({ field }) => <ImageUploader compact value={field.value} onChange={field.onChange} aspect="16 / 10" label="Drop before photo" />} /></div>
              <div><label className="a-label">After photo</label><Controller name="after" control={control} render={({ field }) => <ImageUploader compact value={field.value} onChange={field.onChange} aspect="16 / 10" label="Drop after photo" />} /></div>
            </div></section>
          <section className="a-card p-5 grid gap-4"><div><h2 className="font-sans text-sm font-semibold">Work videos</h2><p className="text-xs text-cream/40 mt-0.5">Walkthroughs and project films shown on the project page.</p></div>
            {vids.map((v, i) => (
              <div key={v.id} className="border border-white/10 rounded-md p-3 grid gap-3">
                <Field label="Video title" error={errors.videos?.[i]?.title}><input className="a-input" placeholder="e.g. Walkthrough" {...register(`videos.${i}.title`)} /></Field>
                <div><label className="a-label">Video</label><Controller name={`videos.${i}.url`} control={control} rules={{ required: 'Add a video link or upload a file.' }} render={({ field }) => <VideoField value={field.value} onChange={field.onChange} error={errors.videos?.[i]?.url?.message} />} /></div>
                <div className="text-right"><button type="button" onClick={() => delVid(i)} className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 min-h-[36px]"><Trash2 size={14} />Remove video</button></div>
              </div>
            ))}
            <div><button type="button" className="a-btn a-btn-ghost" onClick={() => addVid({ title: '', url: '' })}><Plus size={15} />Add video</button></div></section>
          <section className="a-card p-5 space-y-4"><h2 className="font-sans text-sm font-semibold">Visibility</h2>
            <label className="flex items-center justify-between min-h-[40px] text-sm text-cream/80">Featured on homepage<input type="checkbox" className="h-5 w-5 accent-[#A7B49B]" {...register('featured')} /></label>
            <p className="text-xs text-cream/40">Use “Save as draft” to keep this project hidden, or “Publish” to show it on the website.</p></section>
          <section className="a-card p-5 grid gap-4"><h2 className="font-sans text-sm font-semibold">SEO</h2>
            <Field label="SEO title" hint="Recommended: under 60 characters."><input className="a-input" {...r('seoTitle')} /></Field>
            <Field label="SEO description" hint="Recommended: under 160 characters."><textarea rows={2} className="a-input py-2" {...r('seoDescription')} /></Field></section>
          </form>
        )}
      </div>
    </Drawer>
  );
}

import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import PageTitle from '../../components/admin/PageTitle';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import Drawer from '../../components/common/Drawer';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorState from '../../components/common/ErrorState';
import ImageUploader from '../../components/forms/ImageUploader';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext';
import { servicesApi } from '../../services/api';
import { slugify } from '../../utils/helpers';

const ICONS = ['Home', 'Building2', 'DraftingCompass', 'LayoutGrid', 'Armchair', 'Lamp', 'MessageCircle', 'Sparkles'];
const lines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean);

function ServiceForm({ item, onSave, onClose }) {
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: item ? { ...item, includes: item.includes.join('\n'), process: item.process.join('\n') } : { title: '', description: '', image: '', icon: 'Sparkles', status: 'published', includes: '', process: '' },
  });
  return (
    <form onSubmit={handleSubmit((v) => onSave({ ...v, includes: lines(v.includes), process: lines(v.process), slug: slugify(v.title) }))} noValidate className="space-y-4">
      <div><label className="a-label">Title</label><input className="a-input" {...register('title', { required: 'Enter a service title.' })} />{errors.title && <p className="a-err">{errors.title.message}</p>}</div>
      <div><label className="a-label">Description</label><textarea rows={3} className="a-input py-2" {...register('description', { required: 'Add a description.' })} />{errors.description && <p className="a-err">{errors.description.message}</p>}</div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="a-label">Icon</label><select className="a-input" {...register('icon')}>{ICONS.map((i) => <option key={i}>{i}</option>)}</select></div>
        <div><label className="a-label">Status</label><select className="a-input" {...register('status')}><option value="published">Published</option><option value="draft">Draft</option></select></div>
      </div>
      <div><label className="a-label">What’s included (one per line)</label><textarea rows={4} className="a-input py-2" {...register('includes')} /></div>
      <div><label className="a-label">Process steps (one per line)</label><textarea rows={3} className="a-input py-2" {...register('process')} /></div>
      <div><label className="a-label">Image</label><Controller name="image" control={control} render={({ field }) => <ImageUploader compact value={field.value} onChange={field.onChange} aspect="16 / 9" />} /></div>
      <div className="sticky bottom-0 -mx-5 -mb-5 mt-6 px-5 py-3 flex justify-end gap-2 bg-charcoal-800 border-t border-white/10"><button type="button" className="a-btn a-btn-ghost" onClick={onClose}>Cancel</button><button className="a-btn a-btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save service'}</button></div>
    </form>
  );
}

export default function AdminServices() {
  const { data, loading, error, reload, setData } = useAsync(() => servicesApi.list(), []);
  const [edit, setEdit] = useState(null); // null | 'new' | item
  const [del, setDel] = useState(null);
  const toast = useToast();
  const lastOpen = useRef(null); if (edit) lastOpen.current = edit; // keeps panel content while it slides out
  const rows = [...(data || [])].sort((a, b) => a.order - b.order);

  const save = async (v) => {
    try {
      if (edit === 'new') { const created = await servicesApi.create({ ...v, order: rows.length + 1 }); setData((d) => [...d, created]); }
      else { const u = await servicesApi.update(edit.id, v); setData((d) => d.map((x) => (x.id === edit.id ? u : x))); }
      toast.success('Service saved'); setEdit(null);
    } catch (e) { toast.error(e.message); }
  };
  const move = async (s, dir) => {
    const i = rows.findIndex((x) => x.id === s.id); const o = rows[i + dir]; if (!o) return;
    try { await Promise.all([servicesApi.update(s.id, { order: o.order }), servicesApi.update(o.id, { order: s.order })]); setData((d) => d.map((x) => (x.id === s.id ? { ...x, order: o.order } : x.id === o.id ? { ...x, order: s.order } : x))); }
    catch (e) { toast.error(e.message); }
  };
  const toggle = async (s) => { const st = s.status === 'published' ? 'draft' : 'published'; try { await servicesApi.update(s.id, { status: st }); setData((d) => d.map((x) => (x.id === s.id ? { ...x, status: st } : x))); toast.success(st === 'published' ? 'Published' : 'Moved to drafts'); } catch (e) { toast.error(e.message); } };
  const remove = async () => { try { await servicesApi.remove(del.id); setData((d) => d.filter((x) => x.id !== del.id)); toast.success('Service deleted'); } catch (e) { toast.error(e.message); } setDel(null); };

  const cols = [
    { key: 'order', header: 'Order', render: (s) => <div className="flex items-center gap-1"><span className="w-5 tabular-nums">{s.order}</span>
      <button aria-label="Move up" disabled={rows[0]?.id === s.id} onClick={() => move(s, -1)} className="p-1 text-cream/60 hover:text-cream disabled:opacity-25"><ArrowUp size={14} /></button>
      <button aria-label="Move down" disabled={rows.at(-1)?.id === s.id} onClick={() => move(s, 1)} className="p-1 text-cream/60 hover:text-cream disabled:opacity-25"><ArrowDown size={14} /></button></div> },
    { key: 'title', header: 'Service', render: (s) => <div className="flex items-center gap-3"><img src={s.image} alt="" className="h-10 w-14 rounded object-cover" loading="lazy" /><span className="font-semibold">{s.title}</span></div> },
    { key: 'description', header: 'Description', render: (s) => <span className="line-clamp-1 max-w-xs text-cream/60">{s.description}</span> },
    { key: 'status', header: 'Status', render: (s) => <button onClick={() => toggle(s)} title="Click to toggle" aria-label={`Toggle status of ${s.title}`}><StatusBadge status={s.status} /></button> },
    { key: 'a', header: <span className="sr-only">Actions</span>, className: 'text-right', render: (s) => <div className="flex justify-end">
      <button aria-label={`Edit ${s.title}`} onClick={() => setEdit(s)} className="p-2 text-cream/60 hover:text-cream"><Pencil size={16} /></button>
      <button aria-label={`Delete ${s.title}`} onClick={() => setDel(s)} className="p-2 text-cream/60 hover:text-red-400"><Trash2 size={16} /></button></div> },
  ];
  return (
    <>
      <PageTitle title="Services" text="Manage the services shown on your website."><button className="a-btn a-btn-primary" onClick={() => setEdit('new')}><Plus size={16} />Add service</button></PageTitle>
      {error ? <ErrorState dark error={error} onRetry={reload} /> : <DataTable columns={cols} rows={rows} loading={loading} />}
      <Drawer open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? 'Add service' : 'Edit service'} subtitle="Shown on the Services page when published.">{lastOpen.current && <ServiceForm key={lastOpen.current.id || 'new'} item={lastOpen.current === 'new' ? null : lastOpen.current} onSave={save} onClose={() => setEdit(null)} />}</Drawer>
      <ConfirmModal open={!!del} title="Delete service?" message={`“${del?.title}” will be removed from the website.`} onConfirm={remove} onClose={() => setDel(null)} />
    </>
  );
}

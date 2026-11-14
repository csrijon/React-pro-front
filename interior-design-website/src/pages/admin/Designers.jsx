import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageTitle from '../../components/admin/PageTitle';
import DataTable from '../../components/admin/DataTable';
import Drawer from '../../components/common/Drawer';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorState from '../../components/common/ErrorState';
import ImageUploader from '../../components/forms/ImageUploader';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext';
import { designersApi } from '../../services/api';
import { slugify } from '../../utils/helpers';

function DesignerForm({ item, onSave, onClose }) {
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: item ? { ...item, expertise: (item.expertise || []).join(', ') } : { name: '', designation: '', photo: '', bio: '', expertise: '', linkedin: '', instagram: '' },
  });
  const url = { pattern: { value: /^(https?:\/\/.+)?$/, message: 'Enter a full URL starting with https://' } };
  return (
    <form noValidate onSubmit={handleSubmit((v) => onSave({ ...v, slug: slugify(v.name), expertise: v.expertise.split(',').map((x) => x.trim()).filter(Boolean) }))} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="a-label">Name</label><input className="a-input" {...register('name', { required: 'Enter a name.' })} />{errors.name && <p className="a-err">{errors.name.message}</p>}</div>
        <div><label className="a-label">Designation</label><input className="a-input" {...register('designation', { required: 'Enter a designation.' })} />{errors.designation && <p className="a-err">{errors.designation.message}</p>}</div>
      </div>
      <div><label className="a-label">Biography</label><textarea rows={4} className="a-input py-2" {...register('bio', { required: 'Add a short biography.' })} />{errors.bio && <p className="a-err">{errors.bio.message}</p>}</div>
      <div><label className="a-label">Expertise (comma separated)</label><input className="a-input" placeholder="Residential, Lighting" {...register('expertise')} /></div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="a-label">LinkedIn URL</label><input className="a-input" {...register('linkedin', url)} />{errors.linkedin && <p className="a-err">{errors.linkedin.message}</p>}</div>
        <div><label className="a-label">Instagram URL</label><input className="a-input" {...register('instagram', url)} />{errors.instagram && <p className="a-err">{errors.instagram.message}</p>}</div>
      </div>
      <div><label className="a-label">Profile photo</label><Controller name="photo" control={control} rules={{ required: 'Upload a profile photo.' }} render={({ field }) => <ImageUploader compact value={field.value} onChange={field.onChange} aspect="4 / 3" />} />{errors.photo && <p className="a-err">{errors.photo.message}</p>}</div>
      <div className="sticky bottom-0 -mx-5 -mb-5 mt-6 px-5 py-3 flex justify-end gap-2 bg-charcoal-800 border-t border-white/10"><button type="button" className="a-btn a-btn-ghost" onClick={onClose}>Cancel</button><button className="a-btn a-btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save designer'}</button></div>
    </form>
  );
}

export default function AdminDesigners() {
  const { data, loading, error, reload, setData } = useAsync(() => designersApi.list(), []);
  const [edit, setEdit] = useState(null); const [del, setDel] = useState(null);
  const toast = useToast();
  const lastOpen = useRef(null); if (edit) lastOpen.current = edit; // keeps panel content while it slides out
  const save = async (v) => {
    try {
      if (edit === 'new') { const c = await designersApi.create(v); setData((d) => [...d, c]); }
      else { const u = await designersApi.update(edit.id, v); setData((d) => d.map((x) => (x.id === edit.id ? u : x))); }
      toast.success('Designer saved'); setEdit(null);
    } catch (e) { toast.error(e.message); }
  };
  const remove = async () => { try { await designersApi.remove(del.id); setData((d) => d.filter((x) => x.id !== del.id)); toast.success('Designer deleted'); } catch (e) { toast.error(e.message); } setDel(null); };
  const cols = [
    { key: 'name', header: 'Designer', render: (d) => <div className="flex items-center gap-3"><img src={d.photo} alt="" className="h-10 w-10 rounded-full object-cover" loading="lazy" /><div><p className="font-semibold">{d.name}</p><p className="text-xs text-cream/50">{d.designation}</p></div></div> },
    { key: 'expertise', header: 'Expertise', render: (d) => <div className="flex flex-wrap gap-1">{(d.expertise || []).map((e) => <span key={e} className="text-[11px] bg-white/5 rounded px-1.5 py-0.5">{e}</span>)}</div> },
    { key: 'a', header: <span className="sr-only">Actions</span>, className: 'text-right', render: (d) => <div className="flex justify-end">
      <button aria-label={`Edit ${d.name}`} onClick={() => setEdit(d)} className="p-2 text-cream/60 hover:text-cream"><Pencil size={16} /></button>
      <button aria-label={`Delete ${d.name}`} onClick={() => setDel(d)} className="p-2 text-cream/60 hover:text-red-400"><Trash2 size={16} /></button></div> },
  ];
  return (
    <>
      <PageTitle title="Designers" text="Manage your team profiles."><button className="a-btn a-btn-primary" onClick={() => setEdit('new')}><Plus size={16} />Add designer</button></PageTitle>
      {error ? <ErrorState dark error={error} onRetry={reload} /> : <DataTable columns={cols} rows={data || []} loading={loading} />}
      <Drawer open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? 'Add designer' : 'Edit designer'} subtitle="Shown on the Designers page.">{lastOpen.current && <DesignerForm key={lastOpen.current.id || 'new'} item={lastOpen.current === 'new' ? null : lastOpen.current} onSave={save} onClose={() => setEdit(null)} />}</Drawer>
      <ConfirmModal open={!!del} title="Delete designer?" message={`${del?.name}’s profile will be removed from the website.`} onConfirm={remove} onClose={() => setDel(null)} />
    </>
  );
}

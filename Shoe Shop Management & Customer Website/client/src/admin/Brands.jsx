import { useState } from 'react';
import { api } from '../lib/api.js';
import { useFetch, useToast } from '../lib/hooks.jsx';
import { BrandLogo, Empty, ErrorBox, Field, Spinner, Toggle, useConfirm } from '../components/ui.jsx';
import { uploadImage } from '../lib/upload.js';
import { FormModal } from './Categories.jsx';

export default function Brands() {
  const { data, error, loading, reload } = useFetch('/api/admin/brands');
  const toast = useToast();
  const confirm = useConfirm();
  const [edit, setEdit] = useState(null);
  const [err, setErr] = useState(null);
  const [up, setUp] = useState(false);

  const save = async () => {
    setErr(null);
    try {
      const body = { name: edit.name, logoUrl: edit.logoUrl || '', active: edit.active };
      if (edit.id) await api.put(`/api/admin/brands/${edit.id}`, body); else await api.post('/api/admin/brands', body);
      toast.success('Brand saved'); setEdit(null); reload();
    } catch (e) { setErr(e); }
  };
  const del = async (b) => {
    if (!(await confirm({ title: 'Delete brand?', message: `Delete “${b.name}”? Brands that still have products cannot be deleted; deactivate them instead.`, confirmLabel: 'Delete', danger: true }))) return;
    try { await api.del(`/api/admin/brands/${b.id}`); toast.success('Brand deleted'); reload(); } catch (e) { toast.error(e.message); }
  };
  const toggle = async (b, active) => {
    try { await api.put(`/api/admin/brands/${b.id}`, { name: b.name, logoUrl: b.logoUrl || '', active }); reload(); } catch (e) { toast.error(e.message); }
  };
  const onLogo = async (e) => {
    const file = e.target.files[0]; e.target.value = '';
    if (!file) return;
    setUp(true);
    try { setEdit((x) => ({ ...x, logoUrl: null })); const url = await uploadImage(file); setEdit((x) => ({ ...x, logoUrl: url })); } catch (ex) { toast.error(ex.message); } finally { setUp(false); }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;
  return (
    <>
      <div className="page-head"><h1>Brands</h1><button className="btn primary" onClick={() => { setErr(null); setEdit({ name: '', logoUrl: '', active: true }); }}>+ Add brand</button></div>
      {data.brands.length === 0 ? <Empty title="No brands yet">Add the brands your shop sells.</Empty> : (
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Logo</th><th>Brand</th><th className="num">Products</th><th>Active</th><th></th></tr></thead>
          <tbody>{data.brands.map((b) => (
            <tr key={b.id} className={b.active ? '' : 'inactive'}>
              <td><BrandLogo brand={b} size="sm" /></td>
              <td><strong>{b.name}</strong></td><td className="num">{b.productCount}</td>
              <td><Toggle checked={b.active} onChange={(v) => toggle(b, v)} /></td>
              <td className="actions-cell"><button className="btn sm" onClick={() => { setErr(null); setEdit(b); }}>Edit</button> <button className="btn sm danger-o" onClick={() => del(b)}>Delete</button></td>
            </tr>))}
          </tbody>
        </table></div>
      )}
      {edit && (
        <FormModal title={edit.id ? 'Edit brand' : 'Add brand'} onClose={() => setEdit(null)} onSubmit={save} err={err}>
          <Field label="Brand name" required error={err?.fields?.name}><input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} autoFocus /></Field>
          <Field label="Logo (optional)" error={err?.fields?.logoUrl}>
            <div className="logo-field">{edit.logoUrl && <img className="logo-thumb" src={edit.logoUrl} alt="" />}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={onLogo} disabled={up} />{edit.logoUrl && <button type="button" className="btn sm" onClick={() => setEdit({ ...edit, logoUrl: '' })}>Remove</button>}</div>
          </Field>
          <Toggle checked={edit.active} onChange={(v) => setEdit({ ...edit, active: v })} label="Active (products visible on the shop)" />
        </FormModal>
      )}
    </>
  );
}

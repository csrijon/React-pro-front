import { useState } from 'react';
import { GENDERS, api, genderLabel } from '../lib/api.js';
import { useFetch, useToast } from '../lib/hooks.jsx';
import { uploadImage } from '../lib/upload.js';
import { Empty, ErrorBox, Field, Modal, Spinner, Toggle, useConfirm, NumberInput } from '../components/ui.jsx';

export default function Categories() {
  const { data, error, loading, reload } = useFetch('/api/admin/categories');
  const toast = useToast();
  const confirm = useConfirm();
  const [edit, setEdit] = useState(null);   // category form
  const [sub, setSub] = useState(null);     // subcategory form
  const [err, setErr] = useState(null);
  const [mv, setMv] = useState(null);     // move-products dialog

  const save = async (kind, form, close) => {
    setErr(null);
    try {
      const base = kind === 'cat' ? '/api/admin/categories' : '/api/admin/subcategories';
      const body = kind === 'cat'
        ? { gender: form.gender, name: form.name, active: form.active, sortOrder: Number(form.sortOrder) || 0, imageUrl: form.imageUrl || '' }
        : { categoryId: form.categoryId, name: form.name, active: form.active };
      if (form.id) await api.put(`${base}/${form.id}`, body); else await api.post(base, body);
      toast.success('Saved'); close(null); reload();
    } catch (e) { setErr(e); }
  };
  const del = async (kind, row) => {
    const what = kind === 'cat' ? 'category' : 'subcategory';
    if (kind === 'cat' && row.productCount > 0) return setMv({ from: row, to: '', del: true });
    if (!(await confirm({ title: `Delete ${what}?`, message: `Delete “${row.name}”? ${kind === 'cat' ? 'Its subcategories will be deleted too.' : 'Products in it will stay but lose their subcategory.'}`, confirmLabel: 'Delete', danger: true }))) return;
    try { await api.del(`/api/admin/${kind === 'cat' ? 'categories' : 'subcategories'}/${row.id}`); toast.success('Deleted'); reload(); } catch (e) { toast.error(e.message); }
  };
  const toggle = async (c, active) => {
    try { await api.put(`/api/admin/categories/${c.id}`, { gender: c.gender, name: c.name, active, sortOrder: c.sortOrder, imageUrl: c.imageUrl || '' }); reload(); } catch (e) { toast.error(e.message); }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;

  return (
    <>
      <div className="page-head"><h1>Categories</h1><button className="btn primary" onClick={() => { setErr(null); setEdit({ gender: 'men', name: '', active: true, sortOrder: 0, imageUrl: '' }); }}>+ Add category</button></div>
      {GENDERS.map((g) => {
        const list = data.categories.filter((c) => c.gender === g.key);
        return (
          <section className="panel" key={g.key}>
            <h2>{g.label}</h2>
            {list.length === 0 ? <Empty title={`No ${g.label.toLowerCase()} categories`} /> : (
              <div className="table-wrap"><table className="table">
                <thead><tr><th>Name</th><th>Subcategories</th><th className="num">Products</th><th>Active</th><th></th></tr></thead>
                <tbody>{list.map((c) => (
                  <tr key={c.id} className={c.active ? '' : 'inactive'}>
                    <td><strong>{c.name}</strong><div className="small muted">/{c.slug}</div></td>
                    <td>{c.subcategories.map((s) => (
                      <span className="tag" key={s.id}>{s.name}{!s.active && ' (off)'} <button className="tag-btn" aria-label={`Edit ${s.name}`} onClick={() => { setErr(null); setSub(s); }}>✎</button><button className="tag-btn" aria-label={`Delete ${s.name}`} onClick={() => del('sub', s)}>✕</button></span>
                    ))} <button className="btn sm ghost" onClick={() => { setErr(null); setSub({ categoryId: c.id, name: '', active: true }); }}>+ Subcategory</button></td>
                    <td className="num">{c.productCount}</td>
                    <td><Toggle checked={c.active} onChange={(v) => toggle(c, v)} /></td>
                    <td className="actions-cell"><button className="btn sm" onClick={() => { setErr(null); setEdit(c); }}>Edit</button> <button className="btn sm danger-o" onClick={() => del('cat', c)}>{c.productCount > 0 ? 'Move / delete' : 'Delete'}</button></td>
                  </tr>))}
                </tbody>
              </table></div>
            )}
          </section>
        );
      })}

      {mv && (() => {
        const targets = data.categories.filter((c) => c.gender === mv.from.gender && c.id !== mv.from.id);
        const run = async () => {
          if (!mv.to) return toast.error('Choose a category to move the products to');
          try {
            const r = await api.post('/api/admin/categories/move-products', { fromCategoryId: mv.from.id, toCategoryId: Number(mv.to), deleteSource: mv.del });
            toast.success(`${r.moved} product${r.moved === 1 ? '' : 's'} moved${mv.del ? ` and “${mv.from.name}” deleted` : ''}`); setMv(null); reload();
          } catch (ex) { toast.error(ex.message); }
        };
        return (
          <FormModal title={`Move products out of “${mv.from.name}”`} onClose={() => setMv(null)} onSubmit={run} err={null}>
            <p>{mv.from.productCount} product{mv.from.productCount > 1 ? 's' : ''} will move (subcategory is cleared).</p>
            <Field label={`Move to (${genderLabel(mv.from.gender)} categories)`} required>
              <select value={mv.to} onChange={(e) => setMv({ ...mv, to: e.target.value })} autoFocus><option value="">Choose category…</option>{targets.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            </Field>
            <Toggle checked={mv.del} onChange={(v) => setMv({ ...mv, del: v })} label={`Delete “${mv.from.name}” afterwards`} />
          </FormModal>
        );
      })()}
      {edit && <FormModal title={edit.id ? `Edit ${genderLabel(edit.gender)} category` : 'Add category'} onClose={() => setEdit(null)} onSubmit={() => save('cat', edit, setEdit)} err={err}>
        <Field label="Gender" required error={err?.fields?.gender}><select value={edit.gender} onChange={(e) => setEdit({ ...edit, gender: e.target.value })}>{GENDERS.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}</select></Field>
        <Field label="Category name" required error={err?.fields?.name}><input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} autoFocus /></Field>
        <Field label="Category image" error={err?.fields?.imageUrl} hint="Optional. If none is set, a product photo from this category is shown automatically.">
          <div className="logo-field">
            {edit.imageUrl && <img className="logo-thumb" src={edit.imageUrl} alt="Category" />}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={async (e) => { const file = e.target.files[0]; e.target.value = ''; if (!file) return; try { setEdit({ ...edit, imageUrl: await uploadImage(file) }); } catch (ex) { toast.error(ex.message); } }} />
            {edit.imageUrl && <button type="button" className="btn sm" onClick={() => setEdit({ ...edit, imageUrl: '' })}>Remove</button>}
          </div>
        </Field>
        <Field label="Display order" hint="Lower numbers appear first"><NumberInput min="0" value={edit.sortOrder} onChange={(e) => setEdit({ ...edit, sortOrder: e.target.value })} /></Field>
        <Toggle checked={edit.active} onChange={(v) => setEdit({ ...edit, active: v })} label="Active" />
      </FormModal>}
      {sub && <FormModal title={sub.id ? 'Edit subcategory' : 'Add subcategory'} onClose={() => setSub(null)} onSubmit={() => save('sub', sub, setSub)} err={err}>
        <Field label="Subcategory name" required error={err?.fields?.name}><input value={sub.name} onChange={(e) => setSub({ ...sub, name: e.target.value })} autoFocus /></Field>
        <Toggle checked={sub.active} onChange={(v) => setSub({ ...sub, active: v })} label="Active" />
      </FormModal>}
    </>
  );
}

export function FormModal({ title, onClose, onSubmit, err, children }) {
  const [busy, setBusy] = useState(false);
  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={async (e) => { e.preventDefault(); setBusy(true); try { await onSubmit(); } finally { setBusy(false); } }} noValidate>
        {children}
        {err && !Object.keys(err.fields || {}).length && <div className="alert error" role="alert">{err.message}</div>}
        <div className="actions"><button type="button" className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button></div>
      </form>
    </Modal>
  );
}

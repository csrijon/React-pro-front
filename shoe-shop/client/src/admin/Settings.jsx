import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useFetch, useSettings, useToast } from '../lib/hooks.jsx';
import { ErrorBox, Field, Spinner, Toggle } from '../components/ui.jsx';
import { uploadImage } from '../lib/upload.js';

export default function Settings() {
  const { data, error, loading, reload } = useFetch('/api/admin/settings');
  const { reload: reloadPublic } = useSettings();
  const toast = useToast();
  const [f, setF] = useState(null);
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewBusy, setPreviewBusy] = useState(false);
  useEffect(() => { if (data) setF(data.settings); }, [data]);

  const loadPreview = async () => {
    setPreviewBusy(true);
    try { setPreview(await api.get(`/api/admin/products/global-discount/preview?percent=${Number(f.globalDiscountPercent) || 0}`)); }
    catch (ex) { toast.error(ex.message); } finally { setPreviewBusy(false); }
  };

  if (loading || !f) return error ? <ErrorBox error={error} onRetry={reload} /> : <Spinner />;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr({});
    try { await api.put('/api/admin/settings', { ...f, lowStockThreshold: Number(f.lowStockThreshold), reorderTarget: Number(f.reorderTarget) }); toast.success('Settings saved'); reloadPublic(); }
    catch (ex) { setErr(ex.fields || {}); toast.error(ex.message); } finally { setBusy(false); }
  }
  async function onLogo(e) {
    const file = e.target.files[0]; e.target.value = '';
    if (!file) return;
    try { setF({ ...f, logoUrl: await uploadImage(file) }); } catch (ex) { toast.error(ex.message); }
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="page-head"><h1>Settings</h1><button className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button></div>
      <section className="panel">
        <h2>Shop details</h2>
        <div className="form-grid">
          <Field label="Shop name" required error={err.shopName}><input value={f.shopName} onChange={set('shopName')} /></Field>
          <Field label="Phone number" error={err.phone}><input type="tel" value={f.phone} onChange={set('phone')} /></Field>
          <Field label="WhatsApp number" hint="Digits with country code, e.g. 919876543210" error={err.whatsapp}><input value={f.whatsapp} onChange={set('whatsapp')} /></Field>
        </div>
        <Field label="Address" error={err.address}><textarea rows={2} value={f.address} onChange={set('address')} /></Field>
        <Field label="Logo" error={err.logoUrl}>
          <div className="logo-field">{f.logoUrl && <img className="logo-thumb" src={f.logoUrl} alt="Current logo" />}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={onLogo} />{f.logoUrl && <button type="button" className="btn sm" onClick={() => setF({ ...f, logoUrl: '' })}>Remove</button>}</div>
        </Field>
      </section>
      <section className="panel">
        <h2>Social media</h2>
        <div className="form-grid">
          <Field label="Facebook URL" error={err.facebookUrl}><input type="url" placeholder="https://facebook.com/…" value={f.facebookUrl} onChange={set('facebookUrl')} /></Field>
          <Field label="Instagram URL" error={err.instagramUrl}><input type="url" placeholder="https://instagram.com/…" value={f.instagramUrl} onChange={set('instagramUrl')} /></Field>
          <Field label="YouTube URL" error={err.youtubeUrl}><input type="url" placeholder="https://youtube.com/…" value={f.youtubeUrl} onChange={set('youtubeUrl')} /></Field>
        </div>
        <p className="small muted">Only links you fill in are shown in the website footer.</p>
      </section>
      <section className="panel">
        <h2>Inventory &amp; wholesale pricing</h2>
        <div className="form-grid">
          <Field label="Low stock threshold" hint="A size or product with stock at or below this number is “Low stock”. 0 stock is always “Out of stock”." error={err.lowStockThreshold}>
            <input type="number" min="0" step="1" value={f.lowStockThreshold} onChange={set('lowStockThreshold')} />
          </Field>
          <Field label="Reorder up to (pairs)" hint="The reorder report suggests ordering enough to bring each low size back up to this quantity." error={err.reorderTarget}>
            <input type="number" min="1" step="1" value={f.reorderTarget} onChange={set('reorderTarget')} />
          </Field>
        </div>
        <Toggle checked={f.wholesaleEnabled} onChange={(v) => setF({ ...f, wholesaleEnabled: v })} label="Show wholesale prices to approved customers" />
        <p className="small muted">When off, wholesale prices are hidden from everyone except admins and the “Request Wholesale Price” prompts disappear.</p>
        <Field label="Message shown to visitors" error={err.wholesaleNote}><input value={f.wholesaleNote} onChange={set('wholesaleNote')} /></Field>
      </section>
      <section className="panel">
        <h2>Global retail discount</h2>
        <p className="small muted">Apply a shop-wide discount on MRP for products that do not already have their own retail price. Individually configured retail prices are never overwritten, and original MRP values stay unchanged.</p>
        <Toggle checked={f.globalDiscountEnabled} onChange={(v) => setF({ ...f, globalDiscountEnabled: v })} label="Enable a global discount on MRP" />
        <div className="form-grid" style={{ marginTop: 12 }}>
          <Field label="Discount (%)" hint="0–90%. Retail price = MRP × (1 − discount ÷ 100)." error={err.globalDiscountPercent}>
            <input type="number" min="0" max="90" step="0.01" value={f.globalDiscountPercent} onChange={set('globalDiscountPercent')} />
          </Field>
        </div>
        <div className="actions" style={{ justifyContent: 'flex-start' }}>
          <button type="button" className="btn" onClick={loadPreview} disabled={previewBusy}>{previewBusy ? 'Calculating…' : 'Preview affected products'}</button>
        </div>
        {preview && (
          <div className="discount-preview">
            <p className="small"><strong>{preview.affected}</strong> of {preview.total} active products would be discounted by {preview.percent}%. <strong>{preview.individual}</strong> have their own retail price and are left untouched.</p>
            {preview.sample.length > 0 && (
              <div className="table-wrap"><table className="table">
                <thead><tr><th>Product</th><th className="num">MRP</th><th className="num">New retail price</th></tr></thead>
                <tbody>{preview.sample.map((p) => <tr key={p.id}><td>{p.name}<div className="small muted">{p.sku}</div></td><td className="num">₹{p.mrp}</td><td className="num"><strong>₹{p.retail}</strong></td></tr>)}</tbody>
              </table></div>
            )}
            {preview.affected === 0 && <p className="small muted">No products would change with these settings.</p>}
          </div>
        )}
      </section>
    </form>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { GENDERS, api, inr } from '../lib/api.js';
import { useFetch, useToast } from '../lib/hooks.jsx';
import { uploadImage } from '../lib/upload.js';
import { ColorDot, ErrorBox, Field, Spinner, Toggle, useConfirm } from '../components/ui.jsx';
import ImageEditor from '../components/ImageEditor.jsx';

const blankSize = () => ({ size: '', quantity: '', mrp: '', retailPrice: '', wholesalePrice: '' });
const blankColor = () => ({ color: '', sizes: [blankSize()] });
const COLOR_SUGGESTIONS = ['Black', 'White', 'Brown', 'Tan', 'Navy', 'Blue', 'Red', 'Grey', 'Green', 'Pink', 'Beige', 'Gold'];
const round2 = (n) => Math.round(n * 100) / 100;
const num = (v) => (v === '' || v == null ? null : Number(v));

// "6-10" -> 6..10, "6,7,8" -> list, mixes allowed. Returns [] when it cannot be parsed.
function parseSizes(text) {
  const out = [];
  for (const part of text.split(/[,\s]+/).filter(Boolean)) {
    const m = part.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
    if (m) { for (let n = Number(m[1]); n <= Number(m[2]) && out.length < 40; n += 1) out.push(String(n)); } else out.push(part);
  }
  return [...new Set(out)];
}

export default function ProductForm() {
  const { id } = useParams();
  const editing = id && id !== 'new';
  const nav = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const { data: cats } = useFetch('/api/admin/categories');
  const { data: brands } = useFetch('/api/admin/brands');
  const existing = useFetch(editing ? `/api/admin/products/${id}` : null);

  const [f, setF] = useState({ name: '', modelNumber: '', brandId: '', gender: 'men', categoryId: '', subcategoryId: '', description: '', mrp: '', retailMode: 'mrp', discountPct: '10', retailPrice: '', wsDiscountPct: '', wholesalePrice: '', costPrice: '', featured: false, active: true });
  const [variants, setVariants] = useState([blankColor()]);
  const [images, setImages] = useState([]);
  const [imageColors, setImageColors] = useState([]);
  const [errs, setErrs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bulk, setBulk] = useState({});
  const [editingImg, setEditingImg] = useState(null); // { url, index }

  useEffect(() => {
    const p = existing.data?.product;
    if (!p) return;
    const mode = p.retailPriceInput != null ? 'direct' : 'mrp';
    setF({
      name: p.name, modelNumber: p.sku, brandId: String(p.brand.id), gender: p.gender, categoryId: String(p.category.id),
      subcategoryId: p.subcategory ? String(p.subcategory.id) : '', description: p.description, mrp: String(p.mrp),
      retailMode: mode, discountPct: '10', retailPrice: p.retailPriceInput != null ? String(p.retailPriceInput) : '',
      wsDiscountPct: '', wholesalePrice: p.wholesalePrice != null ? String(p.wholesalePrice) : '',
      costPrice: p.costPrice != null ? String(p.costPrice) : '', featured: p.featured, active: p.active,
    });
    setVariants(p.variants.map((v) => ({ color: v.color, sizes: v.sizes.map((s) => ({ size: s.size, quantity: String(s.quantity), mrp: s.mrpOverride != null ? String(s.mrpOverride) : '', retailPrice: s.retailOverride != null ? String(s.retailOverride) : '', wholesalePrice: s.wholesalePriceOverride != null ? String(s.wholesalePriceOverride) : '' })) })));
    setImages(p.images);
    setImageColors(p.variants ? p.variants.map((v) => v.color || '') : []);
  }, [existing.data]);

  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const genderCats = useMemo(() => (cats?.categories || []).filter((c) => c.gender === f.gender), [cats, f.gender]);
  const category = genderCats.find((c) => String(c.id) === f.categoryId);

  const updColor = (ci, patch) => setVariants((v) => v.map((c, i) => (i === ci ? { ...c, ...patch } : c)));
  const updSize = (ci, si, patch) => setVariants((v) => v.map((c, i) => (i === ci ? { ...c, sizes: c.sizes.map((s, j) => (j === si ? { ...s, ...patch } : s)) } : c)));
  const addSize = (ci) => updColor(ci, { sizes: [...variants[ci].sizes, blankSize()] });
  const delSize = (ci, si) => updColor(ci, { sizes: variants[ci].sizes.filter((_, j) => j !== si) });
  const addBulk = (ci) => {
    const list = parseSizes(bulk[ci] || '');
    if (!list.length) return;
    const have = new Set(variants[ci].sizes.map((s) => s.size.trim().toLowerCase()));
    const kept = variants[ci].sizes.filter((s) => s.size.trim() || s.quantity !== '');
    updColor(ci, { sizes: [...kept, ...list.filter((s) => !have.has(s.toLowerCase())).map((size) => ({ ...blankSize(), size }))] });
    setBulk((b) => ({ ...b, [ci]: '' }));
  };
  const copySizesToAll = (ci) => setVariants((v) => v.map((c, i) => (i === ci ? c : { ...c, sizes: v[ci].sizes.map((s) => ({ ...s, quantity: '' })) })));

  // Retail selling price: MRP (no discount) | percentage off MRP | a fixed amount.
  const mrpN = Number(f.mrp);
  const computedRetail = (() => {
    if (!Number.isFinite(mrpN) || mrpN < 0) return null;
    if (f.retailMode === 'percent') { const p = Number(f.discountPct); return Number.isFinite(p) && p >= 0 && p <= 90 ? round2(mrpN * (1 - p / 100)) : null; }
    if (f.retailMode === 'direct') { const v = Number(f.retailPrice); return Number.isFinite(v) && v >= 0 ? round2(v) : null; }
    return null;
  })();
  const retailOut = f.retailMode === 'mrp' ? null : computedRetail;

  const margin = f.costPrice !== '' && Number(f.wholesalePrice) > 0 && f.wholesalePrice !== '' ? Math.round(((Number(f.wholesalePrice) - Number(f.costPrice)) / Number(f.wholesalePrice)) * 1000) / 10 : null;
  const colorTotal = (c) => c.sizes.reduce((a, s) => a + (parseInt(s.quantity, 10) || 0), 0);
  const total = variants.reduce((a, c) => a + colorTotal(c), 0);

  async function onFiles(e) {
    const files = [...e.target.files];
    e.target.value = '';
    if (!files.length) return;
    if (images.length + files.length > 10) return toast.error('A product can have at most 10 images');
    // Preview locally first so the admin sees the photo before it leaves the browser, then swap in
    // the server URLs once the upload succeeded (cleaned up again if it did not).
    const previews = files.map((x) => URL.createObjectURL(x));
    setImages((i) => [...i, ...previews]);
    setImageColors((c) => [...c, ...previews.map(() => '')]);
    const fd = new FormData();
    files.forEach((x) => fd.append('files', x));
    setUploading(true);
    try { const { urls } = await api.post('/api/admin/upload', fd); setImages((i) => [...i.slice(0, i.length - previews.length), ...urls]); } catch (ex) { toast.error("Upload failed: " + ex.message + " — retry by selecting again."); setImages((i) => i.filter((u) => !previews.includes(u))); } finally { setUploading(false); }
  }

  async function saveEditedImage(blob) {
    try {
      const file = new File([blob], 'edited.jpg', { type: 'image/jpeg' });
      const url = await uploadImage(file);
      setImages((arr) => arr.map((u, i) => (i === editingImg.index ? url : u)));
      setEditingImg(null);
      toast.success('Image updated');
    } catch (ex) { toast.error(ex.message); }
  }

  function clientValidate() {
    const e = [];
    if (!f.modelNumber.trim()) e.push('Model number is required');
    if (editing && f.name.trim().length < 2) e.push('Product name is required');
    if (!f.brandId) e.push('Select a brand');
    if (!f.categoryId) e.push('Select a category');
    if (f.mrp === '' || Number(f.mrp) < 0) e.push('Enter a valid MRP');
    if (f.retailMode === 'percent' && (f.discountPct === '' || Number(f.discountPct) < 0 || Number(f.discountPct) > 90)) e.push('Discount must be between 0 and 90%');
    if (f.retailMode === 'direct' && (f.retailPrice === '' || Number(f.retailPrice) < 0)) e.push('Enter a valid retail price');
    if (retailOut != null && f.mrp !== '' && retailOut > Number(f.mrp)) e.push('Retail price cannot exceed MRP');
    if (f.wholesalePrice !== '' && Number(f.wholesalePrice) > Number(f.mrp)) e.push('Wholesale price cannot exceed MRP');
    const seen = new Set();
    variants.forEach((c, ci) => {
      const label = c.color.trim() || `Colour ${ci + 1}`;
      if (!c.color.trim()) e.push(`Colour ${ci + 1}: colour name is required`);
      if (seen.has(c.color.trim().toLowerCase()) && c.color.trim()) e.push(`Colour "${c.color}" is listed twice`);
      seen.add(c.color.trim().toLowerCase());
      if (!c.sizes.length) e.push(`${label}: add at least one size`);
      const ss = new Set();
      c.sizes.forEach((s) => {
        if (!s.size.trim()) e.push(`${label}: every row needs a size`);
        else if (ss.has(s.size.trim().toLowerCase())) e.push(`${label}: size ${s.size} is listed twice`);
        ss.add(s.size.trim().toLowerCase());
        if (s.quantity === '' || !/^\d+$/.test(String(s.quantity))) e.push(`${label} size ${s.size || '?'}: enter stock as a whole number (0 or more)`);
        if (s.mrp !== '' && s.wholesalePrice !== '' && Number(s.wholesalePrice) > Number(s.mrp)) e.push(`${label} size ${s.size}: wholesale price cannot exceed MRP`);
        if (s.mrp !== '' && s.retailPrice !== '' && Number(s.retailPrice) > Number(s.mrp)) e.push(`${label} size ${s.size}: retail price cannot exceed MRP`);
      });
    });
    return e;
  }

  async function submit(ev) {
    ev.preventDefault();
    const e = clientValidate();
    setErrs(e);
    if (e.length) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const body = {
      name: f.name.trim(), modelNumber: f.modelNumber.trim(), sku: f.modelNumber.trim(), brandId: Number(f.brandId), categoryId: Number(f.categoryId), subcategoryId: f.subcategoryId ? Number(f.subcategoryId) : null,
      description: f.description, mrp: Number(f.mrp), retailPrice: retailOut, wholesalePrice: num(f.wholesalePrice), costPrice: num(f.costPrice), featured: f.featured, active: f.active, images, imageColors,
      variants: variants.map((c) => ({ color: c.color.trim(), sizes: c.sizes.map((s) => ({ size: s.size.trim(), quantity: Number(s.quantity), mrp: num(s.mrp), retailPrice: num(s.retailPrice), wholesalePrice: num(s.wholesalePrice) })) })),
    };
    setBusy(true);
    try {
      if (editing) await api.put(`/api/admin/products/${id}`, body); else await api.post('/api/admin/products', body);
      toast.success(editing ? 'Product updated' : 'Product created');
      nav('/admin/products');
    } catch (ex) { setErrs([ex.message]); window.scrollTo({ top: 0, behavior: 'smooth' }); } finally { setBusy(false); }
  }

  async function removeColor(ci) {
    if (variants.length === 1) return toast.error('A product needs at least one colour');
    if (colorTotal(variants[ci]) > 0 && !(await confirm({ title: 'Remove colour?', message: `Remove ${variants[ci].color || 'this colour'} and its ${colorTotal(variants[ci])} pairs of stock from this form? Changes apply when you save.`, confirmLabel: 'Remove', danger: true }))) return;
    setVariants((v) => v.filter((_, i) => i !== ci));
  }

  if (editing && existing.loading) return <Spinner />;
  if (editing && existing.error) return <ErrorBox error={existing.error} onRetry={existing.reload} />;

  return (
    <form onSubmit={submit} noValidate className="product-form">
      <div className="page-head"><h1>{editing ? 'Edit product' : 'Add product'}</h1><Link className="btn" to="/admin/products">Cancel</Link></div>
      {errs.length > 0 && <div className="alert error" role="alert"><strong>Please fix the following:</strong><ul>{errs.slice(0, 8).map((m, i) => <li key={i}>{m}</li>)}</ul></div>}

      <section className="panel">
        <h2>Basic details</h2>
        <div className="form-grid">
          <Field label="Model number" required hint="The main identifier for this product (also used as the SKU).">
            <input value={f.modelNumber} onChange={set('modelNumber')} maxLength={60} placeholder="e.g. PAR-SP-101" />
          </Field>
          <Field label="Brand" required>
            <select value={f.brandId} onChange={set('brandId')}><option value="">Select brand</option>{(brands?.brands || []).map((b) => <option key={b.id} value={b.id}>{b.name}{b.active ? '' : ' (inactive)'}</option>)}</select>
          </Field>
          <Field label="Gender" required>
            <select value={f.gender} onChange={(e) => setF((x) => ({ ...x, gender: e.target.value, categoryId: '', subcategoryId: '' }))}>{GENDERS.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}</select>
          </Field>
          <Field label="Category" required hint={genderCats.length ? undefined : 'No categories for this gender yet. Create one under Categories.'}>
            <select value={f.categoryId} onChange={(e) => setF((x) => ({ ...x, categoryId: e.target.value, subcategoryId: '' }))}><option value="">Select category</option>{genderCats.map((c) => <option key={c.id} value={c.id}>{c.name}{c.active ? '' : ' (inactive)'}</option>)}</select>
          </Field>
          <Field label="Subcategory (optional)">
            <select value={f.subcategoryId} onChange={set('subcategoryId')} disabled={!category?.subcategories.length}><option value="">None</option>{(category?.subcategories || []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
          </Field>
        </div>
        <Field label="Description"><textarea rows={4} value={f.description} onChange={set('description')} maxLength={5000} /></Field>
        <div className="toggles"><Toggle checked={f.featured} onChange={(v) => setF({ ...f, featured: v })} label="Show in the featured section" /><Toggle checked={f.active} onChange={(v) => setF({ ...f, active: v })} label="Active (visible to customers)" /></div>
      </section>

      <section className="panel">
        <h2>Pricing</h2>
        <div className="pricing-grid">
          <Field label="MRP (₹)" required><input type="number" min="0" step="0.01" inputMode="decimal" value={f.mrp} onChange={set('mrp')} /></Field>
          <Field label="Purchase cost per pair (₹)" hint={margin == null ? 'What you pay the supplier. Only admins see this.' : <span className={margin < 0 ? 'minus' : 'plus'}>Margin at wholesale: {margin}% ({margin < 0 ? 'loss' : 'profit'} ₹{Math.abs(Number(f.wholesalePrice) - Number(f.costPrice)).toLocaleString('en-IN')} per pair)</span>}>
            <input type="number" min="0" step="0.01" inputMode="decimal" value={f.costPrice} onChange={set('costPrice')} />
          </Field>
        </div>

        <fieldset className="price-block">
          <legend>Retail selling price</legend>
          <div className="seg mode-seg" role="radiogroup" aria-label="Retail pricing method">
            <button type="button" className={f.retailMode === 'mrp' ? 'on' : ''} onClick={() => setF({ ...f, retailMode: 'mrp' })}>Same as MRP</button>
            <button type="button" className={f.retailMode === 'percent' ? 'on' : ''} onClick={() => setF({ ...f, retailMode: 'percent' })}>% Discount</button>
            <button type="button" className={f.retailMode === 'direct' ? 'on' : ''} onClick={() => setF({ ...f, retailMode: 'direct' })}>Fixed price</button>
          </div>
          <div className="pricing-grid">
            {f.retailMode === 'percent' && (
              <Field label="Discount on MRP (%)" hint="Retail = MRP × (1 − discount ÷ 100)"><input type="number" min="0" max="90" step="0.01" inputMode="decimal" value={f.discountPct} onChange={set('discountPct')} /></Field>
            )}
            {f.retailMode === 'direct' && (
              <Field label="Retail price (₹)"><input type="number" min="0" step="0.01" inputMode="decimal" value={f.retailPrice} onChange={set('retailPrice')} /></Field>
            )}
          </div>
          <p className="price-preview">
            <span>MRP <strong>{f.mrp === '' ? '—' : inr(Number(f.mrp))}</strong></span>
            <span>Discount <strong>{retailOut == null || !mrpN ? '0%' : `${Math.round((1 - retailOut / mrpN) * 100)}%`}</strong></span>
            <span className="final">Retail price <strong>{retailOut == null ? (f.mrp === '' ? '—' : inr(Number(f.mrp))) : inr(retailOut)}</strong></span>
          </p>
        </fieldset>

        <fieldset className="price-block">
          <legend>Wholesale price <span className="muted small">(approved shop owners only)</span></legend>
          <div className="pricing-grid">
            <Field label="Wholesale price (₹)" hint="Default for all sizes. Leave blank if not sold wholesale."><input type="number" min="0" step="0.01" inputMode="decimal" value={f.wholesalePrice} onChange={(e) => setF({ ...f, wholesalePrice: e.target.value })} /></Field>
            <Field label="or discount on MRP (%)" hint="Type a percentage to fill the wholesale price."><input type="number" min="0" max="90" step="0.01" inputMode="decimal" value={f.wsDiscountPct} onChange={(e) => { const pct = e.target.value; setF((x) => ({ ...x, wsDiscountPct: pct, wholesalePrice: pct !== '' && Number.isFinite(Number(x.mrp)) ? String(round2(Number(x.mrp) * (1 - Math.min(90, Math.max(0, Number(pct))) / 100))) : x.wholesalePrice })); }} /></Field>
          </div>
          <p className="price-preview"><span className="final">Wholesale price <strong>{f.wholesalePrice === '' ? 'Not set' : inr(Number(f.wholesalePrice))}</strong></span></p>
        </fieldset>
      </section>

      <section className="panel">
        <h2>Images</h2>
        <div className="img-row">
          {images.map((u, i) => (
            <div key={u} className="img-tile"><img src={u} alt={`Product ${i + 1}`} />
              {i === 0 && <span className="badge featured">Main</span>}
              <div style={{padding:'6px'}}>
                <select value={imageColors[i] || ''} onChange={e => setImageColors(a => { const n=[...a]; n[i]=e.target.value; return n; })} className="btn sm" style={{fontSize:'12px',padding:'4px 6px'}}>
                  <option value="">No color</option>
                  {variants.map((v,vi) => <option key={vi} value={v.color}>{v.color}</option>)}
                </select>
              </div>
              <div className="img-actions">
                <button type="button" className="btn sm" onClick={() => setEditingImg({ url: u, index: i })}>Edit &amp; crop</button>
                {i > 0 && <button type="button" className="btn sm" onClick={() => setImages((a) => [u, ...a.filter((x) => x !== u)])}>Make main</button>}
                <button type="button" className="btn sm danger-o" onClick={() => { const idx = images.indexOf(u); setImages(a => a.filter((_,j)=>j!==idx)); setImageColors(a => a.filter((_,j)=>j!==idx)); }}>Remove</button>
              </div>
            </div>
          ))}
          <label className="img-add">{uploading ? 'Uploading…' : '+ Add images'}<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onFiles} disabled={uploading} hidden /></label>
        </div>
        <p className="small muted">Add 2–3 photos. JPG, PNG or WebP up to 5 MB each. The first image is the main image. Use “Edit &amp; crop” to rotate, crop and adjust brightness.</p>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Colours, sizes &amp; stock</h2><div className="total-pill">Total stock: <strong>{total}</strong> pairs</div></div>
        <p className="small muted">Stock is tracked per colour and size. Totals are calculated automatically. Per-size MRP / wholesale price are optional and override the product price. Size ranges like 6-9, 11×13 or 4×5 can be added in bulk.</p>
        <datalist id="colors">{COLOR_SUGGESTIONS.map((c) => <option key={c} value={c} />)}</datalist>
        {variants.map((c, ci) => (
          <div className="variant" key={ci}>
            <div className="variant-head">
              <ColorDot name={c.color} />
              <input list="colors" placeholder="Colour (e.g. Black)" value={c.color} onChange={(e) => updColor(ci, { color: e.target.value })} aria-label={`Colour ${ci + 1} name`} maxLength={40} />
              <span className="subtotal">{colorTotal(c)} pairs</span>
              <button type="button" className="btn sm danger-o" onClick={() => removeColor(ci)}>Remove colour</button>
            </div>
            <div className="size-table">
              <div className="size-row head"><span>Size</span><span>Stock</span><span>MRP (opt.)</span><span>Wholesale (opt.)</span><span /></div>
              {c.sizes.map((s, si) => (
                <div className="size-row" key={si}>
                  <input placeholder="e.g. 8" value={s.size} onChange={(e) => updSize(ci, si, { size: e.target.value })} aria-label="Size" maxLength={10} />
                  <input type="number" min="0" step="1" inputMode="numeric" placeholder="0" value={s.quantity} onChange={(e) => updSize(ci, si, { quantity: e.target.value })} aria-label="Stock quantity" />
                  <input type="number" min="0" step="0.01" inputMode="decimal" value={s.mrp} onChange={(e) => updSize(ci, si, { mrp: e.target.value })} aria-label="Optional MRP" />
                  <input type="number" min="0" step="0.01" inputMode="decimal" value={s.wholesalePrice} onChange={(e) => updSize(ci, si, { wholesalePrice: e.target.value })} aria-label="Optional wholesale price" />
                  <button type="button" className="icon-btn" aria-label="Remove size" onClick={() => delSize(ci, si)} disabled={c.sizes.length === 1}>✕</button>
                </div>
              ))}
            </div>
            <div className="variant-foot">
              <button type="button" className="btn sm" onClick={() => addSize(ci)}>+ Add another size</button>
              <span className="bulk"><input placeholder="Bulk: 6-9, 11×13, 4×5" value={bulk[ci] || ''} onChange={(e) => setBulk({ ...bulk, [ci]: e.target.value })} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBulk(ci); } }} aria-label="Bulk add sizes" /><button type="button" className="btn sm" onClick={() => addBulk(ci)}>Add sizes</button></span>
              {variants.length > 1 && <button type="button" className="btn sm ghost" onClick={() => copySizesToAll(ci)}>Use these sizes for all colours</button>}
            </div>
          </div>
        ))}
        <button type="button" className="btn" onClick={() => setVariants([...variants, { color: '', sizes: variants[0].sizes.length > 1 ? variants[0].sizes.map((s) => ({ ...blankSize(), size: s.size })) : [blankSize()] }])}>+ Add another colour</button>
      </section>

      <div className="form-actions"><button className="btn primary" disabled={busy || uploading}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Create product'}</button><Link className="btn" to="/admin/products">Cancel</Link></div>

      {editingImg && <ImageEditor src={editingImg.url} onCancel={() => setEditingImg(null)} onSave={saveEditedImage} />}
    </form>
  );
}

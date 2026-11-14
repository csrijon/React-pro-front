import { useRef, useState } from 'react';
import { UploadCloud, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { uploadImage } from '../../services/api';

/**
 * value: string (single) | string[] (multiple).
 * Files are uploaded through mediaApi (real backend: POST /media multipart; mock mode: data URL)
 * and the returned URL is stored in the form value.
 */
const readFile = (file) => uploadImage(file);

export default function ImageUploader({ value, onChange, multiple = false, label = 'Drag images here or browse', aspect = '16 / 10', compact = false }) {
  const input = useRef(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const items = multiple ? (value || []) : (value ? [value] : []);

  const add = async (fileList) => {
    const files = [...fileList].filter((f) => f.type.startsWith('image/'));
    if (files.length !== fileList.length) setError('Only image files are supported (JPG, PNG, WebP). Convert HEIC photos to JPG first.'); else setError('');
    if (!files.length) return;
    setBusy(true);
    try {
      const urls = await Promise.all((multiple ? files : files.slice(0, 1)).map(readFile));
      onChange(multiple ? [...items, ...urls] : urls[0]);
    } catch (e) { setError(e.message || 'Could not upload that image. Try another file.'); }
    setBusy(false);
  };
  const setItems = (next) => onChange(multiple ? next : next[0] || '');
  const move = (i, d) => { const n = [...items]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; setItems(n); };

  const [dragIdx, setDragIdx] = useState(null);
  const drop = (to) => { if (dragIdx === null || dragIdx === to) return; const n = [...items]; const [m] = n.splice(dragIdx, 1); n.splice(to, 0, m); setItems(n); setDragIdx(null); };

  return (
    <div>
      <div role="button" tabIndex={0} onClick={() => input.current?.click()} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); if (e.dataTransfer.files.length) add(e.dataTransfer.files); }}
        className={`cursor-pointer border border-dashed rounded-md text-center transition-colors ${compact ? 'p-4' : 'p-8'} ${over ? 'border-sage bg-sage/10' : 'border-white/20 hover:border-white/40 bg-charcoal-800'}`}>
        <UploadCloud className="mx-auto text-sage" size={compact ? 22 : 28} strokeWidth={1.4} />
        <p className="mt-2 text-sm text-cream/80">{busy ? 'Processing…' : label}</p>
        <p className="text-xs text-cream/40 mt-0.5">PNG, JPG or WebP</p>
        <input ref={input} type="file" accept="image/*" multiple={multiple} hidden onChange={(e) => { add(e.target.files); e.target.value = ''; }} />
      </div>
      {error && <p role="alert" className="a-err">{error}</p>}
      {items.length > 0 && (
        <ul className={`mt-3 grid gap-3 ${multiple ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
          {items.map((src, i) => (
            <li key={`${i}-${src.slice(-24)}`} draggable={multiple} onDragStart={() => setDragIdx(i)} onDragOver={(e) => multiple && e.preventDefault()} onDrop={(e) => { e.stopPropagation(); drop(i); }}
              className="group relative rounded overflow-hidden border border-white/10 bg-charcoal-800" style={{ aspectRatio: aspect }}>
              <img src={src} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
              <button type="button" onClick={() => setItems(items.filter((_, k) => k !== i))} aria-label="Remove image" className="absolute top-1.5 right-1.5 h-7 w-7 grid place-items-center rounded-full bg-black/70 text-white hover:bg-red-700"><X size={14} /></button>
              {multiple && items.length > 1 && (
                <div className="absolute bottom-1.5 left-1.5 flex gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier" className="h-7 w-7 grid place-items-center rounded bg-black/70 text-white disabled:opacity-30"><ChevronLeft size={14} /></button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move later" className="h-7 w-7 grid place-items-center rounded bg-black/70 text-white disabled:opacity-30"><ChevronRight size={14} /></button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

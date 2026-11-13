import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { toast } from 'sonner'
import { validateFiles, fileToDataUrl, MAX_FILES, MAX_MB } from '../../utils/images'

export default function ImageUploader({ value, onChange, error }) {
  const ref = useRef(null)
  const [busy, setBusy] = useState(false)
  const add = async (fileList) => {
    const { ok, errors } = validateFiles([...fileList], value.length)
    errors.forEach((e) => toast.error(e))
    if (!ok.length) return
    setBusy(true)
    try { onChange([...value, ...(await Promise.all(ok.map((f) => fileToDataUrl(f))))]) } catch (e) { toast.error(e.message) } finally { setBusy(false); if (ref.current) ref.current.value = '' }
  }
  return (
    <div>
      <button type="button" onClick={() => ref.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); add(e.dataTransfer.files) }}
        className={`flex w-full flex-col items-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition hover:border-accent hover:bg-accent-50/40 ${error ? 'border-red-300' : 'border-line'}`}>
        <ImagePlus className="text-accent" size={28} /><span className="mt-2 text-sm font-medium">{busy ? 'Processing…' : 'Click or drag images here'}</span>
        <span className="text-xs text-muted">JPG, PNG or WebP · up to {MAX_FILES} images · {MAX_MB} MB each</span>
      </button>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => add(e.target.files)} aria-label="Upload property images" />
      {error && <p className="field-error" role="alert">{error}</p>}
      {value.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((src, i) => (
            <li key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-line">
              <img src={src} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">Cover</span>}
              <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label={`Remove image ${i + 1}`} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white"><X size={13} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

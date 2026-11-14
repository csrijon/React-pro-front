import { useRef, useState } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { validateFiles } from '../../utils/images'
import { uploadImages } from '../../services/uploadService'

/** Upload / replace / remove one image (logo, hero, about photo). Empty value means "use the built-in default". */
export default function SingleImage({ value, onChange, label, hint, png = false, max = 1600, fallback, wide = true }) {
  const ref = useRef(null)
  const [busy, setBusy] = useState(false)
  const pick = async (files) => {
    const { ok, errors } = validateFiles([...files].slice(0, 1), 0)
    errors.forEach((e) => toast.error(e))
    if (!ok.length) return
    setBusy(true)
    try { const [url] = await uploadImages(ok, { max, png }); onChange(url) } catch (e) { toast.error(e.message) } finally { setBusy(false); if (ref.current) ref.current.value = '' }
  }
  const shown = value || fallback
  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-wrap items-center gap-4">
        <div className={`grid shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#fff_0%_50%)] bg-[length:16px_16px] ${wide ? 'h-24 w-40' : 'h-20 w-32'}`}>
          {shown ? <img src={shown} alt={`${label} preview`} className="h-full w-full object-contain" /> : <ImagePlus className="text-muted" />}
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-outline btn-sm" onClick={() => ref.current?.click()} disabled={busy}>{busy ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}</button>
            {value && <button type="button" className="btn-ghost btn-sm !text-red-600" onClick={() => onChange('')}><Trash2 size={14} />{fallback ? 'Use default' : 'Remove'}</button>}
          </div>
          {hint && <p className="text-xs text-muted">{hint}</p>}
        </div>
      </div>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => pick(e.target.files)} aria-label={`Upload ${label}`} />
    </div>
  )
}

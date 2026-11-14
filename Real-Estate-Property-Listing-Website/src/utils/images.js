// Reads image files, validates them and downsizes to compact JPEG data URLs (demo-safe for localStorage).
export const MAX_FILES = 8
export const MAX_MB = 5

export function validateFiles(files, existing = 0) {
  const errors = []
  const ok = []
  for (const f of files) {
    if (!/^image\/(jpe?g|png|webp)$/.test(f.type)) errors.push(`${f.name}: only JPG, PNG or WebP images are allowed`)
    else if (f.size > MAX_MB * 1024 * 1024) errors.push(`${f.name}: larger than ${MAX_MB} MB`)
    else if (existing + ok.length >= MAX_FILES) errors.push(`You can upload up to ${MAX_FILES} images`)
    else ok.push(f)
  }
  return { ok, errors }
}

export function fileToDataUrl(file, max = 1000, type = 'image/jpeg') {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL(type, 0.75))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`${file.name} could not be read`)) }
    img.src = url
  })
}

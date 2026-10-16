// Helpers for loading product images efficiently.
//
// Product photos live in a public Supabase Storage bucket. Supabase exposes an on-the-fly
// transformation endpoint that returns a correctly sized, compressed copy of an object and
// caches it at the edge (unlike the raw objects, which are served with "cache-control: no-cache").
// We rewrite storage URLs at render time so the browser downloads a thumbnail instead of the
// full-resolution original, without changing anything stored in the database.

const STORAGE_RE = /^(https:\/\/[^/]+)\/storage\/v1\/object\/public\/(.+)$/;

export const isSupabaseStorage = (url) => typeof url === 'string' && STORAGE_RE.test(url);

// `format=webp` is honoured by Supabase's transform endpoint and cuts bytes ~35% at the same
// quality; the <img> onError fallback in ShoeImage reloads the original if it is ever rejected.
export function optimizedImage(url, { width, quality = 70, format = 'webp' } = {}) {
  if (!url) return url;
  const m = STORAGE_RE.exec(url);
  if (!m) return url;
  const params = new URLSearchParams();
  if (width) params.set('width', String(width));
  if (quality) params.set('quality', String(quality));
  if (format) params.set('format', format);
  const q = params.toString();
  return `${m[1]}/storage/v1/render/image/public/${m[2]}${q ? `?${q}` : ''}`;
}

export function optimizedSrcSet(url, widths = [320, 480, 640, 960], quality = 70, format = 'webp') {
  if (!isSupabaseStorage(url)) return undefined;
  return widths.map((w) => `${optimizedImage(url, { width: w, quality, format })} ${w}w`).join(', ');
}

// Helpers for loading product images efficiently.
//
// Product photos live in a public Supabase Storage bucket. Supabase exposes an on-the-fly
// transformation endpoint that returns a correctly sized, compressed copy of an object and
// caches it at the edge (unlike the raw objects, which are served with "cache-control: no-cache").
// We rewrite storage URLs at render time so the browser downloads a thumbnail instead of the
// full-resolution original, without changing anything stored in the database.

const OBJECT_PATH = '/storage/v1/object/public/';

export const isSupabaseStorage = (url) => {
  if (typeof url !== 'string') return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.pathname.includes(OBJECT_PATH);
  } catch {
    return false;
  }
};

// `format=webp` is honoured by Supabase's transform endpoint and cuts bytes at the same
// quality; the <img> onError fallback in ShoeImage reloads the original if it is ever rejected.
// Query strings already present on the stored URL (for example a version token) are preserved.
export function optimizedImage(url, { width, quality = 70, format = 'webp' } = {}) {
  if (!url) return url;
  let u;
  try { u = new URL(url); } catch { return url; }
  const at = u.pathname.indexOf(OBJECT_PATH);
  if (at < 0) return url;
  const objectPath = u.pathname.slice(at + OBJECT_PATH.length);
  if (!objectPath) return url;
  if (width) u.searchParams.set('width', String(width));
  if (quality) u.searchParams.set('quality', String(quality));
  if (format) u.searchParams.set('format', format);
  const q = u.searchParams.toString();
  return `${u.origin}/storage/v1/render/image/public/${objectPath}${q ? `?${q}` : ''}`;
}

export function optimizedSrcSet(url, widths = [320, 480, 640, 960], quality = 70, format = 'webp') {
  if (!isSupabaseStorage(url)) return undefined;
  return widths.map((w) => `${optimizedImage(url, { width: w, quality, format })} ${w}w`).join(', ');
}

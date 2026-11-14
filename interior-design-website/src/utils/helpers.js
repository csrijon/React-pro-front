export const slugify = (s = '') => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export const uid = (p = 'id') => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
export const timeAgo = (d) => {
  const m = Math.round((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 60) return `${Math.max(m, 1)} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} hr ago`;
  return `${Math.round(m / 1440)} day ago`.replace(/^(\d+) day/, (_, n) => `${n} day${n > 1 ? 's' : ''}`);
};
export const fmtSize = (b) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1e3)} KB`);
export const cx = (...a) => a.filter(Boolean).join(' ');

// Read a File as a downscaled data URL so mock data fits in localStorage.
export const fileToDataUrl = (file, max = 1400, quality = 0.8) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const c = document.createElement('canvas');
        c.width = Math.round(image.width * scale);
        c.height = Math.round(image.height * scale);
        c.getContext('2d').drawImage(image, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

/**
 * Shrinks large photos before upload (max 2400px, JPEG) so camera/phone images of 10 MB+ upload fast
 * and stay within server limits. Small files, GIFs and SVGs are returned unchanged.
 */
export const compressImage = (file, max = 2400, quality = 0.86) =>
  new Promise((resolve) => {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 1.5e6) return resolve(file);
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    image.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, max / Math.max(image.width, image.height));
      const c = document.createElement('canvas');
      c.width = Math.round(image.width * scale); c.height = Math.round(image.height * scale);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); // flatten transparency for JPEG
      ctx.drawImage(image, 0, 0, c.width, c.height);
      c.toBlob((blob) => resolve(blob && blob.size < file.size ? new File([blob], `${file.name.replace(/\.\w+$/, '')}.jpg`, { type: 'image/jpeg' }) : file), 'image/jpeg', quality);
    };
    image.src = url;
  });

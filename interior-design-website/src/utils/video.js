export const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i;
export const isVideoFile = (nameOrUrl = '') => VIDEO_EXT.test(nameOrUrl);

/** Returns an iframe embed URL for YouTube / Vimeo links, or null for direct files. */
export function toEmbed(url = '') {
  try {
    const u = new URL(url, 'http://x');
    const h = u.hostname.replace(/^www\./, '');
    if (h === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (h.endsWith('youtube.com')) {
      const id = u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop();
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
    }
    if (h === 'vimeo.com') { const id = u.pathname.split('/').filter(Boolean)[0]; if (/^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`; }
    if (h === 'player.vimeo.com') return url;
  } catch { /* not a URL */ }
  return null;
}

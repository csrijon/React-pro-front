// Responsive image helpers shared by the React app and the server (which preloads the hero image).
const UNSPLASH = /images\.unsplash\.com/;
const WIDTHS = [400, 800, 1200, 1600];

/** srcset for Unsplash-hosted images (other URLs, e.g. uploads, are returned as undefined). */
export function responsiveSrcSet(url) {
  if (!url || !UNSPLASH.test(url)) return undefined;
  const orig = Number(/[?&]w=(\d+)/.exec(url)?.[1]) || 1600;
  const widths = [...new Set([...WIDTHS.filter((w) => w < orig), orig])];
  return widths.map((w) => `${url.replace(/([?&])w=\d+/, `$1w=${w}`)} ${w}w`).join(', ');
}

export const HERO_SIZES = '(min-width: 560px) 520px, 100vw';

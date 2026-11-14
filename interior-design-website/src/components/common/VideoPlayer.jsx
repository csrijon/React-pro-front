import { toEmbed } from '../../utils/video';

/** Plays YouTube/Vimeo links in an iframe, or an uploaded/direct video file natively. */
export default function VideoPlayer({ url, poster, title = 'Video', className = '' }) {
  if (!url) return null;
  const embed = toEmbed(url);
  return (
    <div className={`relative w-full bg-charcoal ${className}`} style={{ aspectRatio: '16 / 9' }}>
      {embed ? (
        <iframe src={embed} title={title} loading="lazy" className="absolute inset-0 h-full w-full" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      ) : (
        <video src={url} poster={poster || undefined} controls playsInline preload="metadata" className="absolute inset-0 h-full w-full object-contain" aria-label={title} />
      )}
    </div>
  );
}

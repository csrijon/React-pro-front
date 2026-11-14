import { useState } from 'react';
import { responsiveSrcSet } from '../../utils/imageUrl';

const DEFAULT_SIZES = '(min-width: 1024px) 50vw, 100vw';

/** Lazy, responsive image with a soft placeholder and graceful fallback. Use eager + priority for the hero. */
export default function SmartImage({ src, alt = '', className = '', imgClass = '', ratio, eager = false, priority = false, sizes = DEFAULT_SIZES, style }) {
  const [state, setState] = useState('loading');
  const srcSet = responsiveSrcSet(src);
  return (
    <div className={`relative overflow-hidden bg-beige/40 ${className}`} style={{ aspectRatio: ratio, ...style }}>
      {src && state !== 'error' && (
        <img srcSet={srcSet} sizes={srcSet ? sizes : undefined} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async"
          {...(priority ? { fetchpriority: 'high' } : {})}
          onLoad={() => setState('ok')} onError={() => setState('error')}
          className={`h-full w-full object-cover transition-opacity duration-700 ${state === 'ok' ? 'opacity-100' : 'opacity-0'} ${imgClass}`} />
      )}
      {(state === 'error' || !src) && <div className="absolute inset-0 bg-gradient-to-br from-beige to-sage/60" aria-hidden="true" />}
    </div>
  );
}

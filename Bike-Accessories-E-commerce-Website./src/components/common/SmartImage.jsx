import { useState } from 'react'
import { photo, photoSrcSet } from '../../utils/images'
import Logo from './Logo'

/**
 * <img> with a graceful dark fallback so a failed CDN request never leaves a broken-image icon.
 * - photoKey (built-in Unsplash photo): gets a responsive srcset; pass `sizes` describing the rendered width.
 * - src (admin-uploaded image URL): used as-is.
 * - priority: use ONLY for the LCP image of a page (eager + fetchpriority=high); everything else lazy-loads.
 */
export default function SmartImage({ src, photoKey, w = 1200, sizes = '100vw', alt = '', className = '', imgClassName = '', priority = false }) {
  const [failed, setFailed] = useState(false)
  const url = src || (photoKey ? photo(photoKey, Math.min(w, 800)) : null)
  const srcSet = !src && photoKey ? photoSrcSet(photoKey, w) : undefined
  return (
    <div className={`${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative'} overflow-hidden bg-ink-700 ${className}`}>
      {!failed && url ? (
        <img
          src={url}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-600 to-ink opacity-90" aria-label={alt} role="img">
          <Logo size="sm" />
        </div>
      )}
    </div>
  )
}

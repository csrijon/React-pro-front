import { useState } from 'react'
import { photo } from '../../utils/images'
import Logo from './Logo'

/**
 * <img> with a graceful dark fallback so a failed CDN request never leaves a broken-image icon.
 * Pass `src` or a photo key from utils/images (e.g. photoKey="ducati").
 */
export default function SmartImage({ src, photoKey, w = 1200, alt = '', className = '', imgClassName = '', priority = false }) {
  const [failed, setFailed] = useState(false)
  const url = src || (photoKey ? photo(photoKey, w) : null)
  return (
    <div className={`${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative'} overflow-hidden bg-ink-700 ${className}`}>
      {!failed && url ? (
        <img
          src={url}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
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

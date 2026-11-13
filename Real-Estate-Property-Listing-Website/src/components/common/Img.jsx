import { useState } from 'react'

const FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#e8f1ed"/><path d="M300 330l100-80 100 80v110H300z" fill="#b6d0c4"/></svg>')

export default function Img({ src, alt = '', className = '', eager = false, ...rest }) {
  const [bad, setBad] = useState(false)
  return <img src={bad ? FALLBACK : src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setBad(true)} className={className} {...rest} />
}

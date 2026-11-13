import { useEffect, useRef, useState } from 'react'

/**
 * Mounts its children when the placeholder comes within `margin` of the viewport (or after 6 s as a safety net).
 * Below-the-fold sections therefore don't fetch data, render DOM or compete with the hero for bandwidth during load.
 * `minHeight` reserves space so nothing jumps when the content arrives.
 */
export default function LazySection({ children, minHeight = 480, margin = '700px', className = '' }) {
  const ref = useRef(null)
  const [show, setShow] = useState(typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (show || !ref.current) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShow(true); io.disconnect() } }, { rootMargin: `${margin} 0px` })
    io.observe(ref.current)
    // Safety net: if the browser never delivers intersection events (blocked/throttled), show the content anyway
    const fallback = setTimeout(() => setShow(true), 6000)
    return () => { io.disconnect(); clearTimeout(fallback) }
  }, [show, margin])

  return show ? children : <div ref={ref} className={className} style={{ minHeight }} aria-hidden="true" />
}

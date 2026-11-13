import { useEffect, useRef, useState } from 'react'

/** Scroll-reveal using IntersectionObserver + CSS transitions (no JavaScript animation library needed). Runs once. */
export default function Reveal({ children, delay = 0, y = 24, className = '', as: Tag = 'div', ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (shown || !ref.current) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }, { rootMargin: '0px 0px -60px 0px' })
    io.observe(ref.current)
    const fallback = setTimeout(() => setShown(true), 5000) // never leave content invisible if intersection events are blocked
    return () => { io.disconnect(); clearTimeout(fallback) }
  }, [shown])

  return (
    <Tag
      ref={ref}
      className={`${className} transition duration-500 ease-out motion-reduce:transition-none ${shown ? 'opacity-100' : 'opacity-0'}`}
      style={{ transform: shown ? undefined : `translateY(${y}px)`, transitionDelay: shown ? `${delay}s` : undefined }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

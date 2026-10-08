import { useEffect, useRef, useState } from 'react';

// Adds the "in" state once the element scrolls into view (once only). Shows immediately where IntersectionObserver is missing.
export function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return undefined;
    if (!('IntersectionObserver' in window)) { setShown(true); return undefined; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShown(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);
  return [ref, shown];
}

export function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const [ref, shown] = useReveal();
  return <Tag ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} {...rest}>{children}</Tag>;
}

// Scroll progress bar, "scrolled" header state and back-to-top button — driven by one passive listener.
export function ScrollEffects() {
  const bar = useRef(null);
  const [top, setTop] = useState(false);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      document.documentElement.classList.toggle('scrolled', y > 8);
      setTop(y > 600);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div className="scroll-progress" aria-hidden="true"><div ref={bar} /></div>
      <button type="button" className={`to-top ${top ? 'show' : ''}`} aria-label="Back to top" tabIndex={top ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
    </>
  );
}

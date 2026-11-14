import { m, useReducedMotion } from 'framer-motion';

/** Scroll-triggered reveal. Use sparingly. `clip` gives an upward image-wipe. */
export default function Reveal({ children, delay = 0, y = 24, clip = false, className = '', as = 'div' }) {
  const reduce = useReducedMotion();
  const Tag = m[as];
  if (reduce) return <Tag className={className}>{children}</Tag>;
  const hidden = clip ? { clipPath: 'inset(100% 0 0 0)', opacity: 1 } : { opacity: 0, y };
  const shown = clip ? { clipPath: 'inset(0% 0 0 0)', opacity: 1 } : { opacity: 1, y: 0 };
  return (
    <Tag className={className} initial={hidden} whileInView={shown} viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: clip ? 1 : 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </Tag>
  );
}

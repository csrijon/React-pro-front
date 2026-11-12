import { motion } from 'framer-motion'

/** Scroll-reveal wrapper. Runs once, subtle by default. */
export default function Reveal({ children, delay = 0, y = 24, className = '', as = 'div', ...rest }) {
  const Tag = motion[as] || motion.div
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  )
}

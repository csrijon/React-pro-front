import { motion } from 'framer-motion'

export default function Reveal({ children, delay = 0, className = '', y = 16 }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}

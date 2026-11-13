import { motion } from 'framer-motion'
export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="border-b border-line bg-white">
      <div className="container-x py-8 sm:py-10">
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-semibold sm:text-4xl">{title}</motion.h1>
        {subtitle && <p className="mt-2 max-w-2xl text-muted">{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}

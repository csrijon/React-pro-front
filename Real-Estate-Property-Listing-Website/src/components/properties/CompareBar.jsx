import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { GitCompareArrows, X } from 'lucide-react'
import { useCompare } from '../../context/CompareContext'

export default function CompareBar() {
  const { ids, clear } = useCompare()
  return (
    <AnimatePresence>
      {ids.length > 0 && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} className="fixed inset-x-3 bottom-3 z-[55] mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl bg-primary px-4 py-3 text-white shadow-lift">
          <span className="flex items-center gap-2 text-sm"><GitCompareArrows size={18} />{ids.length} selected</span>
          <div className="flex items-center gap-2">
            <Link to="/compare" className={`btn btn-sm bg-white text-primary ${ids.length < 2 ? 'pointer-events-none opacity-50' : ''}`} aria-disabled={ids.length < 2}>{ids.length < 2 ? 'Pick one more' : 'Compare'}</Link>
            <button onClick={clear} className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Clear comparison"><X size={16} /></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

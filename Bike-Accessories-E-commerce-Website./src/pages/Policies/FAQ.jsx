import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, m as motion } from 'framer-motion'
import { Plus, Search, Headset } from 'lucide-react'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import { EmptyState, ErrorState } from '../../components/common/States'
import { Skeleton } from '../../components/common/Skeletons'
import useFetch from '../../hooks/useFetch'
import usePageTitle from '../../hooks/usePageTitle'
import contentService from '../../services/contentService'

export default function FAQ() {
  usePageTitle('FAQs')
  const { data, loading, error, reload } = useFetch(() => contentService.faqs(), [])
  const [open, setOpen] = useState(0)
  const [q, setQ] = useState('')
  const list = (data || []).filter((f) => (f.q + f.a).toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <div className="container-x max-w-4xl py-8 sm:py-12">
      <Breadcrumbs className="mb-6" items={[{ label: 'FAQs' }]} />
      <div className="mb-8 text-center">
        <p className="eyebrow">Help centre</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">Frequently Asked <span className="text-brand">Questions</span></h1>
        <div className="relative mx-auto mt-6 max-w-xl"><Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><input value={q} onChange={(e) => { setQ(e.target.value); setOpen(null) }} placeholder="Search questions..." aria-label="Search FAQs" className="input py-3.5 pl-12" /></div>
      </div>

      {loading ? <div className="space-y-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}</div>
        : error ? <ErrorState message={error.message} onRetry={reload} />
        : !list.length ? <EmptyState title="No matching questions" text="Try different keywords or contact our support team." action="Contact Support" to="/contact" />
        : (
          <ul className="space-y-3">
            {list.map((f, i) => {
              const isOpen = open === i || q.trim().length > 1
              return (
                <li key={f.q} className={`overflow-hidden rounded-2xl border bg-ink-800 transition ${isOpen ? 'border-brand/60' : 'border-line'}`}>
                  <h2>
                    <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold">
                      {f.q}
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${isOpen ? 'rotate-45 bg-brand-solid' : 'bg-ink-600'}`}><Plus size={16} /></span>
                    </button>
                  </h2>
                  <AnimatePresence initial={false}>
                    {isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden"><p className="px-5 pb-5 leading-relaxed text-muted">{f.a}</p></motion.div>}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        )}

      <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-line bg-gradient-to-br from-ink-700 to-ink-800 p-8 text-center sm:flex-row sm:text-left">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-solid"><Headset size={26} /></span>
        <div className="flex-1"><h2 className="text-lg font-bold">Still need help?</h2><p className="text-sm text-muted">Our rider support team is happy to help with sizing, orders and returns.</p></div>
        <Link to="/contact" className="btn-primary">Contact Us</Link>
      </div>
    </div>
  )
}

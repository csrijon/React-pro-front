import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSEO } from '../../utils/seo'
import { useAsync } from '../../hooks/useAsync'
import { contentService } from '../../services/contentService'
import PageHeader from '../../components/common/PageHeader'
import { ErrorState } from '../../components/common/States'

export default function Faq() {
  useSEO('Frequently Asked Questions', 'Answers about listings, visits, accounts and the buying and renting process on EstateHub.')
  const { data, loading, error, reload } = useAsync(() => contentService.faqs(), [])
  const [open, setOpen] = useState(0)
  return (
    <>
      <PageHeader title="Frequently asked questions" subtitle="Quick answers to common questions." />
      <div className="container-x max-w-3xl py-8">
        {error && <ErrorState error={error} onRetry={reload} />}
        {loading && <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-16" />)}</div>}
        <div className="space-y-3">{(data || []).map((f, i) => (
          <div key={f.q} className="card overflow-hidden">
            <button className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{f.q}<ChevronDown size={18} className={`shrink-0 transition ${open === i ? 'rotate-180' : ''}`} /></button>
            {open === i && <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{f.a}</p>}
          </div>))}</div>
        <p className="mt-8 text-center text-sm text-muted">Still need help? <Link to="/contact" className="font-semibold text-accent hover:underline">Contact us</Link></p>
      </div>
    </>
  )
}

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useSEO } from '../../utils/seo'
import { useAsync } from '../../hooks/useAsync'
import { projectService } from '../../services/projectService'
import ProjectCard from '../../components/projects/ProjectCard'
import { CardSkeleton, EmptyState, ErrorState } from '../../components/common/States'
import Img from '../../components/common/Img'
import { PROJECTS_HERO } from '../../data/images'

const FILTERS = [['All', () => true], ['Residential', (p) => p.category === 'Residential'], ['Commercial', (p) => p.category === 'Commercial'], ['Ready to Move', (p) => p.status === 'Ready to Move'], ['Under Construction', (p) => p.status === 'Under Construction'], ['Upcoming', (p) => p.status === 'Upcoming']]

export default function Projects() {
  useSEO('Projects', 'Explore ongoing, ready-to-move and upcoming residential and commercial real estate projects from trusted developers.')
  const [tab, setTab] = useState('All')
  const { data, loading, error, reload } = useAsync(() => projectService.list(), [])
  const list = useMemo(() => (data || []).filter(FILTERS.find(([n]) => n === tab)[1]), [data, tab])
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <Img src={PROJECTS_HERO} alt="" eager className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/90 to-primary/30" />
        <div className="container-x py-16 sm:py-24">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl font-heading text-3xl font-semibold leading-tight !text-white sm:text-5xl">Ongoing &amp; upcoming real estate projects</motion.h1>
          <p className="mt-4 max-w-lg text-white/85">Explore premium residential and commercial projects from trusted developers.</p>
        </div>
      </section>
      <div className="container-x py-8">
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Project filters">
          {FILTERS.map(([n]) => <button key={n} role="tab" aria-selected={tab === n} onClick={() => setTab(n)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${tab === n ? 'border-primary bg-primary text-white' : 'border-line bg-white hover:border-primary'}`}>{n}</button>)}
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading && <CardSkeleton />}
          {!loading && !error && list.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
        {error && <ErrorState error={error} onRetry={reload} />}
        {!loading && !error && list.length === 0 && <EmptyState title="No projects in this category" text="Try another filter to see more projects." action={<button className="btn-primary" onClick={() => setTab('All')}>Show all projects</button>} />}
      </div>
    </>
  )
}

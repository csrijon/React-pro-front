import { useMemo, useState } from 'react';
import PageHeader from '../../components/public/PageHeader';
import ProjectGallery from '../../components/public/ProjectGallery';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import CtaBand from '../../components/public/CtaBand';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { projectsApi } from '../../services/api';
import { useSite } from '../../context/SiteContext';

const PAGE = 6;

export default function Projects() {
  const { pages, site } = useSite();
  const pp = pages.projectsPage;
  useDocumentMeta(pp.seoTitle || 'Projects', pp.seoDescription);
  const { data, loading, error, reload } = useAsync(() => projectsApi.list(), []);
  const [cat, setCat] = useState('All');
  const [visible, setVisible] = useState(PAGE);

  // Categories come from the admin; any category still used by a project is kept so nothing becomes unreachable.
  const FILTERS = useMemo(() => ['All', ...new Set([...site.categories, ...(data || []).filter((p) => p.status === 'published').map((p) => p.category).filter(Boolean)])], [site.categories, data]);
  const list = useMemo(() => (data || []).filter((p) => p.status === 'published' && (cat === 'All' || p.category === cat)), [data, cat]);

  return (
    <>
      <PageHeader title={pp.heading} text={pp.text} />
      <div className="shell">
        <div className="flex flex-wrap gap-2 pb-10" role="tablist" aria-label="Filter projects by category">
          {FILTERS.map((f) => (
            <button key={f} role="tab" aria-selected={cat === f} onClick={() => { setCat(f); setVisible(PAGE); }}
              className={`px-5 min-h-[42px] text-sm font-semibold border transition-colors ${cat === f ? 'bg-forest text-cream border-forest' : 'border-forest/25 text-forest hover:border-forest'}`}>{f}</button>
          ))}
        </div>
        {loading && <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">{[1.25, 1, 1.4, 1, 1.2, 1.1].map((r, i) => <div key={i} className="skeleton mb-8 break-inside-avoid" style={{ aspectRatio: `1 / ${r}` }} />)}</div>}
        {error && <ErrorState error={error} onRetry={reload} />}
        {!loading && !error && (list.length === 0
          ? <EmptyState title="No projects in this category yet" text="Try another category to see more of our work." />
          : <ProjectGallery projects={list.slice(0, visible)} />)}
        {list.length > visible && (
          <div className="text-center pb-20"><button className="btn btn-outline" onClick={() => setVisible((v) => v + PAGE)}>Load more projects</button></div>
        )}
        <div className="pb-16" />
      </div>
      <CtaBand />
    </>
  );
}

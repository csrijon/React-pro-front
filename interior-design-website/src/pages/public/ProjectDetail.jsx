import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import Reveal from '../../components/common/Reveal';
import SmartImage from '../../components/common/SmartImage';
import ErrorState from '../../components/common/ErrorState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProjectCard from '../../components/public/ProjectCard';
import CtaBand from '../../components/public/CtaBand';
import VideoPlayer from '../../components/common/VideoPlayer';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { projectsApi, trackApi } from '../../services/api';
import { useSite } from '../../context/SiteContext';

function BeforeAfter({ before, after }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative select-none overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
      <img src={after} alt="After renovation" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={before} alt="Before renovation" className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="absolute inset-y-0 w-0.5 bg-cream" style={{ left: `${pos}%` }} />
      <span className="absolute left-3 top-3 bg-charcoal/70 text-cream text-xs px-2 py-1">Before</span>
      <span className="absolute right-3 top-3 bg-forest text-cream text-xs px-2 py-1">After</span>
      <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(+e.target.value)} aria-label="Compare before and after" className="absolute inset-0 h-full w-full opacity-0 cursor-ew-resize" />
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: p, loading, error, reload } = useAsync(() => projectsApi.get(slug), [slug]);
  const { data: related } = useAsync(() => (p ? projectsApi.related(p) : Promise.resolve([])), [p?.id]);
  const pp = useSite().pages.projectsPage;
  useEffect(() => { if (p?.id) trackApi.projectView(p.id); }, [p?.id]);
  useDocumentMeta(p?.seoTitle || p?.title, p?.seoDescription || p?.shortDescription);

  if (loading) return <LoadingSpinner label="Loading project" className="min-h-[60vh]" />;
  if (error || !p) return (
    <div className="shell py-24"><ErrorState error={error?.status === 404 ? { message: 'We couldn’t find that project.' } : error} onRetry={error?.status === 404 ? undefined : reload} />
      <div className="text-center"><Button to="/projects" variant="outline">Back to projects</Button></div></div>
  );

  const info = [['Category', p.category], ['Area', `${Number(p.area).toLocaleString()} sq. ft.`], ['Location', p.location], ['Year', p.year], ['Duration', p.duration], ['Design style', p.style]];
  return (
    <>
      <div className="shell pt-8"><Link to="/projects" className="inline-flex items-center gap-1 text-sm text-charcoal/70 hover:text-forest"><ChevronLeft size={16} />Projects</Link></div>
      <section className="shell py-8 grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
        <Reveal clip className="lg:col-span-8"><SmartImage src={p.cover} alt={p.title} ratio="16 / 11" eager /></Reveal>
        <div className="lg:col-span-4">
          <h1 className="display-lg">{p.title}</h1>
          <dl className="mt-8 divide-y divide-forest/15 border-y border-forest/15 text-sm">
            {info.map(([k, v]) => <div key={k} className="flex justify-between py-3"><dt className="text-charcoal/60">{k}</dt><dd className="font-semibold text-right">{v}</dd></div>)}
          </dl>
          <Button to="/contact" arrow className="mt-6">Start a similar project</Button>
        </div>
      </section>

      <section className="shell py-14 lg:py-20 grid lg:grid-cols-12 gap-10">
        <Reveal className="lg:col-span-5"><h2 className="display-md">Overview</h2><p className="mt-5 text-charcoal/75 leading-relaxed">{p.description}</p></Reveal>
        <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8"><h2 className="display-md">Design concept</h2><p className="mt-5 text-charcoal/75 leading-relaxed">{p.concept}</p></Reveal>
      </section>

      {p.gallery?.length > 0 && (
        <section className="shell pb-16 grid gap-4 md:grid-cols-2" aria-label="Gallery">
          {p.gallery.map((g, i) => (
            <Reveal key={g + i} className={i % 3 === 0 ? 'md:col-span-2' : ''}><SmartImage src={g} alt={`${p.title} — view ${i + 1}`} ratio={i % 3 === 0 ? '21 / 9' : '4 / 3'} /></Reveal>
          ))}
        </section>
      )}

      {p.videos?.filter((v) => v.url).length > 0 && (
        <section className="shell pb-16" aria-label="Project films"><h2 className="display-md mb-6">Project films</h2>
          <div className="grid gap-8 md:grid-cols-2">{p.videos.filter((v) => v.url).map((v, i) => <figure key={v.url + i} className={p.videos.length === 1 ? 'md:col-span-2' : ''}><VideoPlayer url={v.url} poster={p.cover} title={v.title || `${p.title} film`} />{v.title && <figcaption className="mt-2 text-sm text-charcoal/70">{v.title}</figcaption>}</figure>)}</div></section>
      )}

      {p.before && p.after && (
        <section className="shell pb-20"><h2 className="display-md mb-6">Before &amp; after</h2><BeforeAfter before={p.before} after={p.after} /></section>
      )}

      {related?.length > 0 && (
        <section className="bg-cream-200"><div className="shell py-16">
          <h2 className="display-md mb-8">Related projects</h2>
          <div className="grid sm:grid-cols-3 gap-8">{related.map((r) => <ProjectCard key={r.id} project={r} ratio="4 / 5" />)}</div>
        </div></section>
      )}
      <CtaBand heading={pp.detailCtaHeading.replace('{title}', p.title)} text={pp.detailCtaText} />
    </>
  );
}

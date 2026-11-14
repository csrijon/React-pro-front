import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Linkedin, Instagram } from 'lucide-react';
import SmartImage from '../../components/common/SmartImage';
import ErrorState from '../../components/common/ErrorState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import ProjectCard from '../../components/public/ProjectCard';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { designersApi, projectsApi } from '../../services/api';

export default function DesignerDetail() {
  const { slug } = useParams();
  const { data: d, loading, error } = useAsync(() => designersApi.get(slug), [slug]);
  const { data: projects } = useAsync(() => projectsApi.list(), []);
  useDocumentMeta(d ? `${d.name}, ${d.designation}` : 'Designer', d?.bio);
  if (loading) return <LoadingSpinner className="min-h-[60vh]" />;
  if (error || !d) return <div className="shell py-24 text-center"><ErrorState error={{ message: 'We couldn’t find that designer.' }} /><Button to="/designers" variant="outline">All designers</Button></div>;
  const work = (projects || []).filter((p) => p.status === 'published').slice(0, 3);
  return (
    <>
      <div className="shell pt-8"><Link to="/designers" className="inline-flex items-center gap-1 text-sm text-charcoal/70 hover:text-forest"><ChevronLeft size={16} />Designers</Link></div>
      <section className="shell py-10 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-5"><div className="arch overflow-hidden"><SmartImage src={d.photo} alt={d.name} ratio="4 / 5" eager /></div></div>
        <div className="lg:col-span-7">
          <p className="text-forest text-sm">{d.designation}</p>
          <h1 className="display-xl mt-2">{d.name}</h1>
          <p className="mt-6 max-w-xl text-lg text-charcoal/75">{d.bio}</p>
          <h2 className="font-sans text-sm font-semibold mt-8">Expertise</h2>
          <div className="mt-3 flex flex-wrap gap-2">{(d.expertise || []).map((e) => <span key={e} className="border border-forest/30 px-3 py-1 text-sm text-forest">{e}</span>)}</div>
          <div className="mt-8 flex gap-4 text-forest">
            {d.linkedin && <a href={d.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a>}
            {d.instagram && <a href={d.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>}
          </div>
        </div>
      </section>
      <section className="shell py-16"><h2 className="display-md mb-8">Recent studio work</h2>
        <div className="grid sm:grid-cols-3 gap-8">{work.map((p) => <ProjectCard key={p.id} project={p} />)}</div></section>
    </>
  );
}

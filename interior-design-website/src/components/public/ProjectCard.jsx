import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SmartImage from '../common/SmartImage';

export default function ProjectCard({ project, ratio = '4 / 5', arch = false, className = '', sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw' }) {
  return (
    <Link to={`/projects/${project.slug}`} className={`group block ${className}`}>
      <div className={`relative overflow-hidden ${arch ? 'arch' : ''}`}>
        <SmartImage src={project.cover} alt={project.title} ratio={ratio} sizes={sizes} imgClass="transition-transform duration-[900ms] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/20 transition-colors duration-500" />
        <span className="absolute right-3 bottom-3 h-10 w-10 grid place-items-center bg-cream text-forest translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"><ArrowUpRight size={16} /></span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl leading-tight">{project.title}</h3>
        <span className="text-xs text-charcoal/60 whitespace-nowrap">{project.location}</span>
      </div>
      <p className="text-xs text-forest/80 mt-0.5">{project.category}</p>
    </Link>
  );
}

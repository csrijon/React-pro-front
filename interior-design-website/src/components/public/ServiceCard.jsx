import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getServiceIcon } from '../../utils/icons';

export default function ServiceCard({ service, active = false }) {
  const Icon = getServiceIcon(service.icon);
  return (
    <Link to={`/services#${service.slug}`} className={`group flex flex-col justify-between min-h-[220px] p-6 transition-colors duration-300 ${active ? 'bg-forest text-cream' : 'bg-white/60 hover:bg-forest hover:text-cream'}`}>
      <Icon size={30} strokeWidth={1.2} />
      <div>
        <h3 className="font-sans text-[15px] font-semibold leading-snug">{service.title}</h3>
        <p className="mt-2 text-xs opacity-70 line-clamp-2">{service.description}</p>
        <ArrowRight size={16} className="mt-4 transition-transform group-hover:translate-x-1.5" />
      </div>
    </Link>
  );
}

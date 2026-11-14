import { Link } from 'react-router-dom';
import { Linkedin, Instagram } from 'lucide-react';
import SmartImage from '../common/SmartImage';

export default function DesignerCard({ designer: d }) {
  return (
    <article className="group">
      <Link to={`/designers/${d.slug}`} className="block overflow-hidden">
        <SmartImage src={d.photo} alt={d.name} ratio="4 / 5" imgClass="grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
      </Link>
      <div className="mt-4">
        <h3 className="font-display text-2xl"><Link to={`/designers/${d.slug}`} className="link-u">{d.name}</Link></h3>
        <p className="text-sm text-forest/80">{d.designation}</p>
        <p className="mt-2 text-sm text-charcoal/70 line-clamp-3">{d.bio}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">{(d.expertise || []).map((e) => <span key={e} className="text-xs border border-forest/25 px-2 py-0.5 text-forest">{e}</span>)}</div>
        <div className="mt-3 flex gap-3 text-forest">
          {d.linkedin && <a href={d.linkedin} target="_blank" rel="noreferrer" aria-label={`${d.name} on LinkedIn`}><Linkedin size={16} /></a>}
          {d.instagram && <a href={d.instagram} target="_blank" rel="noreferrer" aria-label={`${d.name} on Instagram`}><Instagram size={16} /></a>}
        </div>
      </div>
    </article>
  );
}

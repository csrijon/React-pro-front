import { Link } from 'react-router-dom';
import { useHasSite, useSite } from '../../context/SiteContext';

export function ArchMark({ className = 'h-9 w-8' }) {
  return (
    <svg viewBox="0 0 32 36" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 35V15a13 13 0 0 1 26 0v20" />
      <path d="M9 35V16a7 7 0 0 1 14 0v19" />
    </svg>
  );
}

export default function Logo({ to = '/', light = false, sub = 'Studio' }) {
  const hasSite = useHasSite();
  const { settings } = useSite();
  if (hasSite && settings.logo) {
    return <Link to={to} aria-label="Domus Studio home" className="inline-flex"><img src={settings.logo} alt="Domus Studio" className="h-10 w-auto max-w-[180px] object-contain" /></Link>;
  }
  return (
    <Link to={to} className={`inline-flex items-center gap-2.5 ${light ? 'text-cream' : 'text-forest'}`} aria-label="Domus Studio home">
      <ArchMark />
      <span className="leading-none">
        <span className="block font-display text-[1.55rem] font-semibold">Domus</span>
        <span className="block font-sans text-[0.8rem] tracking-wide -mt-0.5">{sub}</span>
      </span>
    </Link>
  );
}

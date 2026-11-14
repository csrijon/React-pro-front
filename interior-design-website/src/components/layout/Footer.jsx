import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '../common/Logo';
import { useNav } from './Navbar';
import { useSite } from '../../context/SiteContext';

export default function Footer() {
  const { settings: s, pages, site } = useSite();
  const NAV = useNav();
  const c = { ...s.contact, ...Object.fromEntries(['email', 'phone', 'address'].filter((k) => pages.contact?.[k]).map((k) => [k, pages.contact[k]])) };
  const soc = s.social || {};
  return (
    <footer className="bg-forest text-cream/85">
      <div className="shell py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo light />
          <p className="mt-6 max-w-sm font-display text-2xl leading-snug text-cream">{site.footerTagline}</p>
        </div>
        <div className="md:col-span-3">
          <h3 className="font-sans text-sm font-semibold text-sage">{site.footerExploreHeading}</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map((n) => <li key={n.to}><Link className="link-u" to={n.to}>{n.label}</Link></li>)}
          </ul>
        </div>
        <div className="md:col-span-4">
          <h3 className="font-sans text-sm font-semibold text-sage">{site.footerStudioHeading}</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3"><Mail size={16} className="mt-0.5 shrink-0 text-sage" /><a className="link-u" href={`mailto:${c.email}`}>{c.email}</a></li>
            <li className="flex gap-3"><Phone size={16} className="mt-0.5 shrink-0 text-sage" /><a className="link-u" href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a></li>
            <li className="flex gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-sage" />{c.address}</li>
          </ul>
          <div className="mt-6 flex gap-2">
            {[[Instagram, soc.instagram, 'Instagram'], [Facebook, soc.facebook, 'Facebook'], [Linkedin, soc.linkedin, 'LinkedIn']].filter(([, href]) => href).map(([Icon, href, label]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="h-10 w-10 grid place-items-center border border-cream/25 hover:bg-cream hover:text-forest transition-colors"><Icon size={16} /></a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-cream/15">
        <div className="shell py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-cream/60">
          <span>© {new Date().getFullYear()} {site.copyright}</span>
          <Link to="/admin" className="hover:text-cream">Admin sign in</Link>
        </div>
      </div>
    </footer>
  );
}

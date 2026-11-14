import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';
import ContactForm from '../../components/forms/ContactForm';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useSite } from '../../context/SiteContext';

export default function Contact() {
  const [params] = useSearchParams();
  const { pages, settings: s } = useSite();
  const c = pages.contact;
  useDocumentMeta(c.seoTitle || 'Contact', c.seoDescription);
  const email = c.email || s.contact?.email || '';
  const phone = c.phone || s.contact?.phone || '';
  const address = c.address || s.contact?.address || '';
  const social = s.social || {};
  // Map: an admin-provided embed link (or pasted <iframe> code), otherwise an automatic map of the address.
  const pasted = (c.mapUrl || '').match(/src="([^"]+)"/)?.[1] || (c.mapUrl || '').trim();
  const mapSrc = /^https:\/\//.test(pasted) ? pasted : `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const svc = params.get('service');
  const preset = svc?.toLowerCase().includes('commercial') ? 'Commercial' : svc?.toLowerCase().includes('consult') ? 'Consultation' : svc ? 'Residential' : '';
  return (
    <section className="grid lg:grid-cols-2 min-h-[calc(100vh-76px)]">
      <div className="bg-cream-200 px-5 sm:px-12 lg:px-16 py-14 lg:py-20 flex flex-col">
        <p className="text-sm text-forest">Contact</p>
        <h1 className="display-lg mt-3">{c.heading}</h1>
        <p className="mt-5 max-w-md text-charcoal/75">{c.text}</p>
        <ul className="mt-10 space-y-5">
          <li className="flex gap-4"><Phone className="text-forest shrink-0" size={20} strokeWidth={1.4} /><a href={`tel:${phone.replace(/\s/g, '')}`} className="link-u">{phone}</a></li>
          <li className="flex gap-4"><Mail className="text-forest shrink-0" size={20} strokeWidth={1.4} /><a href={`mailto:${email}`} className="link-u">{email}</a></li>
          <li className="flex gap-4"><MapPin className="text-forest shrink-0" size={20} strokeWidth={1.4} />{address}</li>
        </ul>
        <div className="mt-8 flex gap-2">
          {[[Instagram, social.instagram, 'Instagram'], [Facebook, social.facebook, 'Facebook'], [Linkedin, social.linkedin, 'LinkedIn']].filter(([, h]) => h).map(([I, h, l]) => (
            <a key={l} href={h} target="_blank" rel="noreferrer" aria-label={l} className="h-11 w-11 grid place-items-center border border-forest/30 text-forest hover:bg-forest hover:text-cream transition-colors"><I size={17} /></a>
          ))}
        </div>
        {c.showMap !== false && address && (
          <div className="mt-10 flex-1 min-h-[260px] relative overflow-hidden border border-forest/20 bg-cream-200">
            <iframe title={`Map of ${address}`} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" />
          </div>
        )}
      </div>
      <div className="px-5 sm:px-12 lg:px-16 py-14 lg:py-20">
        <h2 className="display-md mb-6">{c.formHeading}</h2>
        <ContactForm defaultType={preset} />
      </div>
    </section>
  );
}

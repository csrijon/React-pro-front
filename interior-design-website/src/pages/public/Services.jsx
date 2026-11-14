import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import { getServiceIcon } from '../../utils/icons';
import PageHeader from '../../components/public/PageHeader';
import Reveal from '../../components/common/Reveal';
import SmartImage from '../../components/common/SmartImage';
import Button from '../../components/common/Button';
import ErrorState from '../../components/common/ErrorState';
import CtaBand from '../../components/public/CtaBand';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { servicesApi } from '../../services/api';
import { useSite } from '../../context/SiteContext';

export default function Services() {
  const sp = useSite().pages.servicesPage;
  useDocumentMeta(sp.seoTitle || 'Services', sp.seoDescription);
  const { data, loading, error, reload } = useAsync(() => servicesApi.list(), []);
  const { hash } = useLocation();
  const list = (data || []).filter((s) => s.status === 'published').sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (hash && list.length) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash, list.length]);

  return (
    <>
      <PageHeader title={sp.heading} text={sp.text} />
      {loading && <div className="shell space-y-10 pb-20">{[1, 2].map((i) => <div key={i} className="skeleton h-80" />)}</div>}
      {error && <ErrorState error={error} onRetry={reload} />}
      <div className="shell pb-20 space-y-20 lg:space-y-28">
        {list.map((s, i) => {
          const Icon = getServiceIcon(s.icon);
          return (
            <article key={s.id} id={s.slug} className="grid lg:grid-cols-12 gap-8 lg:gap-14 scroll-mt-28">
              <Reveal clip className={`lg:col-span-6 ${i % 2 ? 'lg:order-2' : ''}`}><div className={i % 2 ? '' : 'arch overflow-hidden'}><SmartImage src={s.image} alt={s.title} ratio="4 / 4.4" /></div></Reveal>
              <div className={`lg:col-span-6 flex flex-col justify-center ${i % 2 ? 'lg:order-1' : ''}`}>
                <Icon size={30} strokeWidth={1.2} className="text-forest" />
                <h2 className="display-lg mt-4">{s.title}</h2>
                <p className="mt-4 text-charcoal/75 max-w-lg">{s.description}</p>
                <div className="mt-8 grid sm:grid-cols-2 gap-8">
                  <div><h3 className="font-sans text-sm font-semibold">What’s included</h3>
                    <ul className="mt-3 space-y-2 text-sm text-charcoal/75">{s.includes.map((x) => <li key={x} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0 text-forest" />{x}</li>)}</ul></div>
                  <div><h3 className="font-sans text-sm font-semibold">How it works</h3>
                    <ol className="mt-3 space-y-2 text-sm text-charcoal/75">{s.process.map((x, n) => <li key={x} className="flex gap-3"><span className="font-display text-lg text-forest leading-none w-4">{n + 1}</span>{x}</li>)}</ol></div>
                </div>
                <div><Button to={`/contact?service=${encodeURIComponent(s.title)}`} arrow className="mt-8">Request a consultation</Button></div>
              </div>
            </article>
          );
        })}
      </div>
      <CtaBand />
    </>
  );
}

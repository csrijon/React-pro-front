import { Link } from 'react-router-dom';
import { Target, Eye, Home, Gem, Leaf } from 'lucide-react';
import PageHeader from '../../components/public/PageHeader';
import Reveal from '../../components/common/Reveal';
import SmartImage from '../../components/common/SmartImage';
import CtaBand from '../../components/public/CtaBand';
import CountUp from '../../components/public/CountUp';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { designersApi } from '../../services/api';
import { useSite } from '../../context/SiteContext';

export default function About() {
  const { pages } = useSite();
  const { data: team } = useAsync(() => designersApi.list(), []);
  const a = pages.about;
  const { philosophy = [], stats = [] } = a;
  const values = a.values || []; const processSteps = a.process || [];
  useDocumentMeta(a.seoTitle || 'About', a.seoDescription);
  const icons = [Home, Gem, Leaf];
  return (
    <>
      <PageHeader title={a.heading} text={a.intro} />
      <section className="shell pb-20 grid lg:grid-cols-12 gap-10 items-center">
        <Reveal clip className="lg:col-span-6"><div className="arch overflow-hidden"><SmartImage src={a.image} alt="Studio dining space" ratio="4 / 4.6" eager /></div></Reveal>
        <Reveal className="lg:col-span-6 lg:pl-10">
          <h2 className="display-md">{a.storyHeading}</h2>
          <p className="mt-5 text-charcoal/75 leading-relaxed max-w-lg">{a.story}</p>
          <ul className="mt-8 divide-y divide-forest/15 border-y border-forest/15 max-w-sm">
            {values.map((v, i) => { const I = icons[i]; return <li key={v} className="flex items-center gap-3 py-3 text-sm font-semibold"><I size={18} strokeWidth={1.4} className="text-forest" />{v}</li>; })}
          </ul>
        </Reveal>
      </section>

      <section className="bg-cream-200"><div className="shell py-16 grid md:grid-cols-2 gap-10">
        <Reveal><Target className="text-forest" strokeWidth={1.2} /><h2 className="display-md mt-3">{a.missionHeading}</h2><p className="mt-3 text-charcoal/75">{a.mission}</p></Reveal>
        <Reveal delay={0.1}><Eye className="text-forest" strokeWidth={1.2} /><h2 className="display-md mt-3">{a.visionHeading}</h2><p className="mt-3 text-charcoal/75">{a.vision}</p></Reveal>
      </div></section>

      <section className="shell py-20">
        <h2 className="display-lg mb-10">{a.philosophyHeading}</h2>
        <div className="grid md:grid-cols-3 gap-8">{philosophy.map((p, i) => <Reveal key={p.title} delay={i * 0.08}><h3 className="font-display text-2xl border-t border-forest pt-4">{p.title}</h3><p className="mt-2 text-charcoal/70">{p.text}</p></Reveal>)}</div>
      </section>

      <section className="bg-forest text-cream"><div className="shell py-20">
        <h2 className="display-lg mb-12">{a.processHeading}</h2>
        <ol className="grid md:grid-cols-4 gap-8">
          {processSteps.map((s, i) => <li key={s.title} className="border-t border-cream/30 pt-4"><span className="font-display text-4xl text-sage">{i + 1}</span><h3 className="font-display text-2xl mt-2">{s.title}</h3><p className="mt-2 text-sm text-cream/70">{s.text}</p></li>)}
        </ol>
      </div></section>

      <section className="shell py-16 grid grid-cols-3 text-center divide-x divide-forest/15">
        {stats.map((s) => <div key={s.label} className="px-2"><p className="font-display text-4xl sm:text-6xl text-forest"><CountUp to={Number(s.value) || 0} />{s.suffix}</p><p className="text-xs sm:text-sm text-charcoal/70">{s.label}</p></div>)}
      </section>

      <section className="shell pb-20">
        <div className="flex items-end justify-between mb-8"><h2 className="display-md">{a.teamHeading}</h2><Link to="/designers" className="link-u text-sm font-semibold text-forest">{a.teamLink}</Link></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(team || []).map((d) => <Link to={`/designers/${d.slug}`} key={d.id} className="group block"><SmartImage src={d.photo} alt={d.name} ratio="4 / 5" imgClass="group-hover:scale-105 transition-transform duration-700" /><p className="mt-2 font-semibold text-sm">{d.name}</p><p className="text-xs text-charcoal/60">{d.designation}</p></Link>)}
        </div>
      </section>
      <CtaBand />
    </>
  );
}

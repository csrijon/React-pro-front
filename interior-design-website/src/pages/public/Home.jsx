import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Instagram, Quote } from 'lucide-react';
import Button from '../../components/common/Button';
import Reveal from '../../components/common/Reveal';
import SmartImage from '../../components/common/SmartImage';
import ProjectCard from '../../components/public/ProjectCard';
import ServiceCard from '../../components/public/ServiceCard';
import CtaBand from '../../components/public/CtaBand';
import VideoPlayer from '../../components/common/VideoPlayer';
import CountUp from '../../components/public/CountUp';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { projectsApi, servicesApi } from '../../services/api';
import { useSite } from '../../context/SiteContext';
import { HERO_SIZES } from '../../utils/imageUrl';

const line = { hidden: { y: '110%' }, show: (i) => ({ y: 0, transition: { duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] } }) };

export default function Home() {
  const reduce = useReducedMotion();
  const { pages, settings } = useSite();
  const { data: projects } = useAsync(() => projectsApi.list(), []);
  const { data: services } = useAsync(() => servicesApi.list(), []);
  const home = pages.home;
  const { featuredIn = [], stats = [], testimonials = [], philosophy = [], social = [] } = home;
  useDocumentMeta(home?.seoTitle || 'Domus Studio — Interior Design Studio', home?.seoDescription);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const parallax = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '12%']);

  const featured = (projects || []).filter((p) => p.status === 'published' && p.featured).slice(0, 4);
  const svc = (services || []).filter((s) => s.status === 'published').sort((a, b) => a.order - b.order).slice(0, 4);
  const heading = (home?.heroHeading || 'Spaces That Reflect Your Story').split(' ');
  const lines = [heading.slice(0, 1).join(' '), heading.slice(1, 3).join(' '), heading.slice(3).join(' ')].filter(Boolean);

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="shell grid lg:grid-cols-12 gap-10 lg:gap-6 pt-10 pb-16 lg:pt-16 lg:pb-24 items-center">
          <div className="lg:col-span-6 relative z-10 order-2 lg:order-1">
            <p className="flex items-center gap-3 text-sm text-charcoal/70"><span className="h-px w-8 bg-charcoal" />{home.eyebrow}</p>
            <h1 className="display-xl mt-6" aria-label={home?.heroHeading || 'Spaces That Reflect Your Story'}>
              {lines.map((l, i) => (
                <span key={l} className="block overflow-hidden pb-[0.14em] -mb-[0.1em]" aria-hidden="true">
                  <m.span className="block" variants={line} custom={i} initial={reduce ? 'show' : 'hidden'} animate="show">{l}</m.span>
                </span>
              ))}
            </h1>
            <p className="mt-7 max-w-md text-lg text-charcoal/75">{home?.heroText || 'Bespoke interior design solutions for homes, offices and lifestyle spaces.'}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button to="/projects" arrow>{home.primaryButton}</Button>
              <Button to="/contact" variant="outline">{home.secondaryButton}</Button>
            </div>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2 relative">
            <m.div style={{ y: parallax }} className="arch overflow-hidden mx-auto max-w-[520px] lg:max-w-none lg:ml-auto lg:w-[88%]">
              <SmartImage src={home.heroImage} alt="Warm modern living room with timber slats and a circular pendant" ratio="4 / 5.2" eager priority sizes={HERO_SIZES} />
            </m.div>
            <m.div initial={reduce ? false : { opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.8 }}
              className="hidden sm:block absolute -left-2 lg:-left-10 bottom-10 w-40 lg:w-52 border-[8px] border-cream">
              <SmartImage src={home.heroImage2} alt="" ratio="1 / 1" sizes="208px" />
            </m.div>
          </div>
        </div>
        <div className="shell pb-10 flex flex-wrap items-center gap-x-12 gap-y-4">
          <span className="text-sm text-charcoal/60">{home.featuredLabel}</span>
          {featuredIn.map((f) => <span key={f} className="font-display text-2xl text-charcoal/55">{f}</span>)}
        </div>
      </section>

      {/* Intro */}
      <section className="bg-forest text-cream">
        <div className="shell py-20 lg:py-28 grid lg:grid-cols-12 gap-12 items-center">
          <Reveal className="lg:col-span-5">
            <h2 className="display-lg">{home.introHeading}</h2>
            <p className="mt-6 max-w-md text-cream/75">{home.introText}</p>
            <Link to="/about" className="link-u mt-6 text-sm font-semibold">{home.introLink}</Link>
          </Reveal>
          <div className="lg:col-span-7 grid grid-cols-3 divide-x divide-cream/20">
            {stats.map((s) => (
              <div key={s.label} className="px-3 sm:px-8 text-center lg:text-left">
                <p className="font-display text-4xl sm:text-6xl"><CountUp to={Number(s.value) || 0} />{s.suffix}</p>
                <p className="mt-1 text-xs sm:text-sm text-cream/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="shell py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <Reveal><h2 className="display-lg">{home.projectsHeading}</h2></Reveal>
          <Link to="/projects" className="link-u text-sm font-semibold text-forest">{home.projectsLink}</Link>
        </div>
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 lg:gap-x-10">
          {featured.map((p, i) => {
            const layout = ['col-span-12 md:col-span-7', 'col-span-12 md:col-span-5 md:mt-24', 'col-span-12 md:col-span-5', 'col-span-12 md:col-span-7 md:mt-16'][i];
            const ratio = ['16 / 11', '4 / 5', '4 / 5', '16 / 11'][i];
            return <Reveal key={p.id} delay={i % 2 ? 0.1 : 0} className={layout}><ProjectCard project={p} ratio={ratio} arch={i === 1} sizes={layout.includes('md:col-span-7') ? '(min-width: 768px) 58vw, 100vw' : '(min-width: 768px) 42vw, 100vw'} /></Reveal>;
          })}
        </div>
      </section>

      {/* Services */}
      <section className="bg-cream-200">
        <div className="shell py-20 lg:py-28 grid lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-4">
            <h2 className="display-lg">{home.servicesHeading}</h2>
            <p className="mt-5 text-charcoal/70 max-w-sm">{home.servicesText}</p>
            <Button to="/services" variant="outline" className="mt-7">{home.servicesButton}</Button>
          </Reveal>
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-3">
            {svc.map((s, i) => <Reveal key={s.id} delay={i * 0.06}><ServiceCard service={s} active={i === 0} /></Reveal>)}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="shell py-20 lg:py-28 grid lg:grid-cols-12 gap-12 items-center">
        <Reveal clip className="lg:col-span-5 order-2 lg:order-1"><div className="arch overflow-hidden"><SmartImage src={home.philosophyImage} alt="Dining room with pendant lights" ratio="4 / 5" /></div></Reveal>
        <div className="lg:col-span-7 lg:pl-10 order-1 lg:order-2">
          <Reveal><h2 className="display-lg">{home.philosophyHeading}</h2></Reveal>
          <div className="mt-10 divide-y divide-forest/15 border-y border-forest/15">
            {philosophy.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} className="py-6 grid sm:grid-cols-[200px_1fr] gap-2 sm:gap-8">
                <h3 className="font-display text-2xl">{p.title}</h3><p className="text-charcoal/70">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {home.showreel?.url && (
        <section className="bg-forest text-cream"><div className="shell py-20 lg:py-24 grid lg:grid-cols-12 gap-10 items-center">
          <Reveal className="lg:col-span-4"><h2 className="display-lg">{home.showreel.heading}</h2><p className="mt-5 text-cream/75 max-w-sm">{home.showreel.text}</p></Reveal>
          <Reveal delay={0.1} className="lg:col-span-8"><VideoPlayer url={home.showreel.url} poster={home.showreel.poster} title={home.showreel.heading} /></Reveal>
        </div></section>
      )}

      {/* Testimonials */}
      <section className="bg-beige/40">
        <div className="shell py-20 lg:py-28">
          <Reveal><h2 className="display-md mb-12">{home.testimonialsHeading}</h2></Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.1}>
                <figure className="h-full flex flex-col">
                  <Quote size={26} strokeWidth={1.2} className="text-forest" />
                  <blockquote className="mt-4 font-display text-2xl leading-snug flex-1">{t.quote}</blockquote>
                  <figcaption className="mt-6 text-sm"><span className="font-semibold">{t.name}</span><span className="block text-charcoal/60">{t.role}</span></figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Social */}
      <section className="shell py-20">
        <div className="flex items-end justify-between mb-8 gap-4">
          <h2 className="display-md">{home.instagramHeading}</h2>
          {settings.social?.instagram && <a href={settings.social.instagram} target="_blank" rel="noreferrer" className="link-u inline-flex items-center gap-2 text-sm font-semibold text-forest"><Instagram size={16} />{home.instagramHandle}</a>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {social.map((s, i) => <a key={s + i} href={settings.social?.instagram || undefined} target="_blank" rel="noreferrer" className="block overflow-hidden group" aria-label={`Instagram post ${i + 1}`}><SmartImage src={s} ratio="1 / 1" imgClass="group-hover:scale-110 transition-transform duration-700" /></a>)}
        </div>
      </section>

      <CtaBand heading={home?.ctaHeading} text={home?.ctaText} />
    </>
  );
}

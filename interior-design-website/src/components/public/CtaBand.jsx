import Button from '../common/Button';
import Reveal from '../common/Reveal';
import { useSite } from '../../context/SiteContext';

export default function CtaBand({ heading, text, to = '/contact', label }) {
  const { pages, site } = useSite();
  heading = heading ?? pages.home.ctaHeading; text = text ?? pages.home.ctaText; label = label ?? site.ctaLabel;
  return (
    <section className="bg-forest text-cream">
      <div className="shell py-20 lg:py-28 grid gap-8 lg:grid-cols-12 items-end">
        <Reveal className="lg:col-span-8"><h2 className="display-lg max-w-3xl">{heading}</h2></Reveal>
        <Reveal delay={0.1} className="lg:col-span-4 lg:pb-2">
          <p className="text-cream/75 max-w-sm">{text}</p>
          <Button to={to} variant="light" arrow className="mt-6">{label}</Button>
        </Reveal>
      </div>
    </section>
  );
}

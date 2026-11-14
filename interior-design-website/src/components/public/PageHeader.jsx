import { m, useReducedMotion } from 'framer-motion';

export default function PageHeader({ title, text, kicker }) {
  const reduce = useReducedMotion();
  const a = (d) => (reduce ? {} : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] } });
  return (
    <section className="shell pt-14 pb-10 lg:pt-20 lg:pb-14">
      {kicker && <m.p {...a(0)} className="text-sm text-forest mb-4">{kicker}</m.p>}
      <m.h1 {...a(0.05)} className="display-xl max-w-4xl">{title}</m.h1>
      {text && <m.p {...a(0.15)} className="mt-6 max-w-xl text-lg text-charcoal/70">{text}</m.p>}
    </section>
  );
}

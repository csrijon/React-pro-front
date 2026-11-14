import { m, useReducedMotion } from 'framer-motion';
import ProjectCard from './ProjectCard';

const RATIOS = ['4 / 5', '1 / 1', '3 / 4', '5 / 4', '4 / 6', '1 / 1'];

/** Masonry via CSS columns with varied aspect ratios and a staggered entrance. */
export default function ProjectGallery({ projects }) {
  const reduce = useReducedMotion();
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 lg:gap-8">
      {projects.map((p, i) => (
        <m.div key={p.id} className="break-inside-avoid mb-8 lg:mb-10"
          initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}>
          <ProjectCard project={p} ratio={RATIOS[i % RATIOS.length]} />
        </m.div>
      ))}
    </div>
  );
}

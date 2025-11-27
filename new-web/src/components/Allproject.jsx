import React, { useTransition } from 'react'
import ProjectCard from './ProjectCard'
import { completeApps, smallProjects } from '../data/projectsData'
import "./Allpro.css"
import { motion } from 'framer-motion';


const textanimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.15 } }
}

const Allproject = () => {
  return (
    <div className="portfolio-container">
      <div className="top-project-section">
        <motion.h1
          variants={textanimation}
          initial="hidden"
          whileInView="show"
          transition={{ delay: 0.12 }}
        ><span>/</span>projects</motion.h1>
        <motion.p variants={textanimation}
          initial="hidden"
          whileInView="show"
          transition={{ delay: 0.12 }} >list of my project</motion.p>
      </div>
      <section className="project-section">
        <motion.h2 variants={textanimation}
          initial="hidden"
          whileInView="show"
          transition={{ delay: 0.24 }}
          id="complete-apps">Full Stack-Projects</motion.h2>
        <div className="projects-grid">
          {completeApps.map((project, i) => (
            <ProjectCard index={i} key={project.title} project={project} />
          ))}
        </div>
      </section>

      <section className="project-section">
        <h2 id="small-projects">Frontend-projects</h2>
        <div className="projects-grid">
          {smallProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Allproject

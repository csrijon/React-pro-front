import React from 'react'
import ProjectCard from './ProjectCard'
import { completeApps, smallProjects } from '../data/projectsData'
import "./Allpro.css"

const Allproject = () => {
   return (
    <div className="portfolio-container">
      <h1>/projects</h1>

      <section className="project-section">
        <h2 id="complete-apps">#complete-apps</h2>
        <div className="projects-grid">
          {completeApps.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>

      <section className="project-section">
        <h2 id="small-projects">#small-projects</h2>
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

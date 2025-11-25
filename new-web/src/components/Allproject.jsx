import React from 'react'
import ProjectCard from './ProjectCard'
import { completeApps, smallProjects } from '../data/projectsData'
import "./Allpro.css"


const Allproject = () => {
   return (
    <div className="portfolio-container">
      <div className="top-project-section">
        <h1><span>/</span>projects</h1>
      <p>list of my project</p>
      </div>
      <section className="project-section">
        <h2 id="complete-apps">Full Stack-Projects</h2>
        <div className="projects-grid">
          {completeApps.map((project,i) => (
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

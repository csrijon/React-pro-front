import React from 'react';


const ProjectCard = ({ project }) => {
  return (
    <div 
    className="project-cards">
      {project.image && <img src={project.image} alt={`${project.title} preview`} className="project-image" />}
      <div className="project-content">
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-buttons">
          {project.buttons.map((button) => (
            <a key={button.text} href={button.link} target="_blank" rel="noopener noreferrer">
              {button.text} &lt;~&gt;
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
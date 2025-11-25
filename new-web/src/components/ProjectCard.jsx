import React from 'react';
import { motion } from "framer-motion";

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      className="project-cards"
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.3, zoom: "zoomOut" }}

      // Hover effect (same as ProjectSection)
      whileHover={{
        scale: 1.2,
        y: -10,
        boxShadow: "0px 15px 35px rgba(199, 120, 221, 0.45)",
        transition: { duration: 0.3, delay: 0 }
      }}
    >
      {project.image && (
        <img
          src={project.image}
          alt={`${project.title} preview`}
          className="project-image"
        />
      )}

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
            <a
              key={button.text}
              href={button.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {button.text} &lt;~&gt;
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;

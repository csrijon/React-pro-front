import React from 'react';
import { motion } from "framer-motion";

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      className="project-cards"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 90, delay: index * 0.12 }}
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

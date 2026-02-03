import React from 'react';
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      className="project-cards"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.12 }}
      whileHover={{
        y: -10,
        scale: 1.06,
        rotate: 0.5,
        boxShadow: "0px 25px 50px rgba(0,0,0,0.2)",
        transition: {
          type: "spring",
          stiffness: 250,
          damping: 18
        }
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

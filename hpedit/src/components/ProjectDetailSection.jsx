import React from 'react';
// eslint-disable-next-line no-unused-vars 
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { projectsData } from '../data.js';
import './ProjectDetailSection.css';


const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const zoomOut = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};


const ProjectDetailSection = () => {
  const { projectId } = useParams();

  const project = projectsData.find(p => p.id == projectId);

  if (!project) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Project Not Found</h2>
        <Link to="/">Go back to Homepage</Link>
      </div>
    );
  }

  return (
    <section className="project-detail-container">
      <motion.div
        className="project-content"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={fadeInUp}>{project.title}</motion.h1>

        <motion.div variants={fadeInUp} className="details-grid">
          <div className="details-group">
            <p className="detail-label">Location</p>
            <p className="detail-value">{project.location}</p>
          </div>
          <div className="details-group">
            <p className="detail-label">Project type</p>
            <p className="detail-value">{project.projectType}</p>
          </div>
          <div className="details-group">
            <p className="detail-label">Status</p>
            <p className="detail-value">{project.status}</p>
          </div>
          <div className="details-group">
            <p className="detail-label">Year</p>
            <p className="detail-value">{project.year}</p>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="details-group">
          <p className="detail-label">Details</p>
          <p className="detail-value">
            {project.details}
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="project-image-gallery"
        variants={zoomOut}
        initial="hidden"
        animate="visible"
      >
        <div className="gallery-item">
          <img src={project.image} alt={project.title} />
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectDetailSection;

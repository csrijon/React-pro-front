import React from 'react';
// eslint-disable-next-line no-unused-vars 
import { motion } from 'framer-motion';
import { useNavigate } from "react-router";
import './ProductsSection.css';
import { projectsData } from '../data.js'; 

// Animation variants for the main heading
const headingVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 }
  },
};

// Stagger container for the grid
const gridVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.2,
    },
  },
};

// Animation variants for each product card
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};

const ProductsSection = () => {
  let navigate = useNavigate();
  const showedtalis = () => {
     navigate("/explore");
  }

  const showProjectDetails = (projectId) => {
    navigate(`/project/${projectId}`);
  }

  return (
    <section id='product' className="products-section-container">
      <motion.h2
        className="products-main-heading"
        variants={headingVariants}
        initial="hidden"
        whileInView="visible" 
        viewport={{ once: true, amount: 0.5 }} 
      >
        <span className="heading-number">03</span> Our Products
      </motion.h2>

      <motion.div
        className="product-cards-grid"
        variants={gridVariants}
        initial="hidden"
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }} 
      >
  
        {projectsData.map((project) => (
          <motion.div
            key={project.id}
            className="product-card"
            variants={cardVariants}
            whileHover={{ y: -10, scale: 1.03, transition: { duration: 0.3 } }}
          >
            <div className="product-image-wrapper">
              <motion.img
                src={project.image}
                alt={project.title}
                className="product-card-image"
                initial={{ scale: 1.15 }}
                whileHover={{ scale: 1.0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
            <p className="product-pre-title">{project.preTitle}</p>
            <h3 className="product-title">{project.title}</h3>
            <button onClick={() => showProjectDetails(project.id)}  className="explore-btn">
               {project.linkText} <span className="arrow">→</span>
            </button>
          </motion.div>
        ))}
      </motion.div>

      <div className="view-all-container">
        <button onClick={showedtalis} className="view-all-btn">
          View All <span className="arrow">→</span>
        </button>
      </div>
    </section>
  );
};

export default ProductsSection;

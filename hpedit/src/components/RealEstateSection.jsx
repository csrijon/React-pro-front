import React, { useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars 
import { motion, useInView, useAnimation } from 'framer-motion';
import './RealEstateSection.css';

const RealEstateSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 75 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, y: 75, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <motion.section
      className="real-estate-section"
      ref={ref}
      initial="hidden"
      animate={mainControls}
      variants={containerVariants}
    >
      <div className="real-estate-content">
        <div className="real-estate-details">
          <motion.h3 variants={textVariants}>
            REAL ESTATE
            <br />
            PROJECT DESIGN
          </motion.h3>
          <motion.p variants={textVariants}>
            WE PROVIDE INTERIOR DESIGN SERVICES FOR REAL ESTATE PROJECTS, INCLUDING RESIDENTIAL AND COMMERCIAL DEVELOPMENTS. WE COLLABORATE WITH ARCHITECTS, DEVELOPERS, AND OTHER INDUSTRY PROFESSIONALS TO CREATE INTERIOR DESIGNS THAT ENHANCE THE ARCHITECTURE AND MAXIMIZE THE APPEAL AND FUNCTIONALITY OF EACH PROPERTY.
          </motion.p>
          <motion.button className="learn-more-btn" variants={textVariants}>
            LEARN MORE →
          </motion.button>
        </div>
        <div className="real-estate-image">
          <motion.img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto-format&fit=crop&w=1470&q=80"
            alt="Interior design with teal sofa"
            variants={imageVariants}
          />
        </div>
      </div>
    </motion.section>
  );
};

export default RealEstateSection;
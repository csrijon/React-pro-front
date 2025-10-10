import React, { useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars 
import { motion, useInView, useAnimation } from 'framer-motion';
import './ServicesSection.css';

const ServicesSection = () => {
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
      id='services'
      initial="hidden"
      variants={containerVariants}
      ref={ref}
      className="services-section"
      animate={mainControls}
    >
      <motion.div className="services-header" variants={textVariants}>
        <div className="services-number">02</div>
        <h2>OUR SERVICES</h2>
      </motion.div>

      <div className="services-content">
        <div className="service-details">
          <motion.h3 variants={textVariants}>INTERIOR DESIGN</motion.h3>
          <motion.p variants={textVariants}>
            OUR TEAM OF INTERIOR DESIGN EXPERTS WORKS CLOSELY WITH CLIENTS TO CREATE UNIQUE AND PERSONALIZED LIVING SPACES. WE FOCUS ON FUNCTIONALITY AND AESTHETICS, ENSURING THAT EACH SPACE IS OPTIMALLY DESIGNED TO SUIT OUR CLIENTS' LIFESTYLES AND PREFERENCES.
          </motion.p>
          <motion.button className="learn-more-btn" variants={textVariants}>
            LEARN MORE →
          </motion.button>
        </div>
        <div className="service-image">
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

export default ServicesSection;
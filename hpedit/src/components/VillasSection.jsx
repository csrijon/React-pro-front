import React, { useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars 
import { motion, useInView, useAnimation } from 'framer-motion';
import './VillasSection.css';

const VillasSection = () => {
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

  // ছবির জন্য "Zoom In" ভ্যারিয়েন্ট (পরিবর্তিত)
  const imageVariants = {
    hidden: { opacity: 0, y: 75, scale: 0.8 }, // পরিবর্তন: 1.2 থেকে 0.8 করা হয়েছে
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <motion.section
      className="villas-section-container"
      ref={ref}
      initial="hidden"
      animate={mainControls}
      variants={containerVariants}
    >
      <div className="villas-image-wrapper">
        <motion.img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto-format&fit=crop&w=1470&q=80"
          alt="Modern living room with blue sofa"
          className="villa-image"
          variants={imageVariants}
        />
      </div>
      <div className="villas-content-wrapper">
        <motion.h3 className="villas-heading" variants={textVariants}>
          Villas
          <br />
          and Apartments
        </motion.h3>
        <motion.p className="villas-description" variants={textVariants}>
          We offer interior design solutions for private villas and luxury
          apartments, ensuring that each space reflects the style and personality
          of the homeowners. From material and finish selection to space planning
          and lighting, we take care of every detail to create a welcoming and
          luxurious environment.
        </motion.p>
        <motion.button className="learn-more-btn" variants={textVariants}>
          Learn More <span className="arrow">→</span>
        </motion.button>
      </div>
    </motion.section>
  );
};

export default VillasSection;
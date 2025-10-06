import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import './AboutSection.css';

const AboutSection = () => {
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

  // টেক্সটের জন্য "Fade in up" ভ্যারিয়েন্ট
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
    <motion.section initial="hidden" variants={containerVariants} ref={ref} className="about-section" animate={mainControls}>
      <motion.div className="about-header" variants={textVariants}>
        <div className="about-number">01</div>
        <h2>ABOUT OTTO</h2>
      </motion.div>

      <div className="about-content">
        <div className="about-image-left">
          <motion.img
            src="https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto-format&fit=crop&w=1000&q=80"
            alt="Modern living room with blue sofa"
            variants={imageVariants}
          />
        </div>

        <div className="about-text-and-image-right">
          <motion.p className="about-description" variants={textVariants}>
            AT OTTO, WE OFFER A WIDE RANGE OF INTERIOR DESIGN AND CUSTOM FURNITURE MANUFACTURING SERVICES TO MEET THE NEEDS AND EXPECTATIONS OF OUR CLIENTS.
          </motion.p>
          <div className="about-image-right">
            <motion.img
              src="https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%D&auto-format&fit=crop&w=1000&q=80"
              alt="Modern living room with blue sofa"
              variants={imageVariants}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
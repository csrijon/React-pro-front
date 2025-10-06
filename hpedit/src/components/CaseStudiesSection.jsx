import React, { useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars 
import { motion, useInView, useAnimation } from 'framer-motion';
import './CaseStudiesSection.css';

// Data for your case study cards with image links from royalty-free sources
const caseStudies = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Modern living room
    title: 'INTERIOR DESIGN',
    linkText: 'VIEW CASE STUDY',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/9944675/pexels-photo-9944675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Outdoor furniture
    title: 'CUSTOM FURNITURE',
    linkText: 'VIEW CASE STUDY',
  },
  // You can add more case studies here if you wish, and the grid will adjust
];

const CaseStudiesSection = () => {
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
      className="case-studies-section-container"
      ref={ref}
      initial="hidden"
      animate={mainControls}
      variants={containerVariants}
    >
      <motion.h2 className="case-studies-main-heading" variants={textVariants}>
        <span className="heading-number">04</span> Case Studies
      </motion.h2>

      <div className="case-study-cards-grid">
        {caseStudies.map((study) => (
          <motion.div key={study.id} className="case-study-card" variants={textVariants}>
            <div className="case-study-image-wrapper">
              <motion.img
                src={study.image}
                alt={study.title}
                className="case-study-card-image"
                variants={imageVariants}
              />
            </div>
            <h3 className="case-study-title">{study.title}</h3>
            <button className="view-case-study-btn">
              {study.linkText} <span className="arrow">→</span>
            </button>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default CaseStudiesSection;
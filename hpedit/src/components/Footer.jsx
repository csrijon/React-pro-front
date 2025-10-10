import React from 'react';
// eslint-disable-next-line no-unused-vars 
import { motion } from 'framer-motion'; 
import './Footer.css';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

// 2. Define animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const zoomOut = {
  hidden: { opacity: 0, scale: 1.2 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    // Add motion to the main container to detect when it's in view
    <motion.footer 
      className="footer-section-container"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // Animation triggers when 20% is visible, and only once
    >
      <div className="footer-header">
        <motion.h2 variants={fadeInUp} className="footer-main-title">
          CONTACT US
        </motion.h2>
        <motion.div variants={zoomOut} className="footer-contact-button">
          <ArrowForwardIcon />
        </motion.div>
      </div>

      {/* Apply stagger animation to the grid */}
      <motion.div variants={staggerContainer} className="footer-links-grid">
        {/* Each column will fade in up one by one */}
        <motion.div variants={fadeInUp} className="footer-column">
          <h4 className="footer-column-title">QUICK LINKS</h4>
          <ul>
            <li><a href="#home">HOME</a></li>
            <li><a href="#services">SERVICES</a></li>
            <li><a href="#products">PRODUCTS</a></li>
            <li><a href="#portfolio">PORTFOLIO</a></li>
            <li><a href="#about">ABOUT</a></li>
          </ul>
        </motion.div>

        <motion.div variants={fadeInUp} className="footer-column">
          <h4 className="footer-column-title">FOLLOW US</h4>
          <ul>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FACEBOOK</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">INSTAGRAM</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">TWITTER</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LINKEDIN</a></li>
          </ul>
        </motion.div>

        <motion.div variants={fadeInUp} className="footer-column">
          <h4 className="footer-column-title">NEWSLETTER</h4>
          <div className="newsletter-input-wrapper">
            <input type="email" placeholder="ENTER YOUR INFO" className="newsletter-input" />
            <button className="newsletter-submit-button">
              <ArrowForwardIcon fontSize="small" />
            </button>
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={fadeInUp} className="footer-bottom">
        <button onClick={scrollToTop} className="back-to-top-button">
          <ArrowUpwardIcon />
        </button>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
import './AboutMe.css';
import Aboutme from '../ui/Aboutme';
import Aboutmeimage from '../ui/Aboutmeimage';
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';


const AboutMe = () => {
  return (
    <section id='about' className="about-me-container">
      <div className="about-me-content">
        <motion.h2
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="about-me-heading">
          <span className="accent-text">#</span>about-me
        </motion.h2>
        <Aboutme />
      </div>
      <Aboutmeimage />
    </section>
  );
};

export default AboutMe;
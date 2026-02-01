import React from "react";
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import "./Experience.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const Experience = () => {
  return (
    <section className="Experience-section">
      <motion.h1
        className="Conatact-heading"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <span>/</span>Experience
      </motion.h1>

      <motion.div
        className="middle-main"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        // viewport={{ once: true }}
      >
        {/* Software Developer */}
        <motion.div className="timeline-item" variants={itemVariants}>
          <span className="line"></span>
          <h3 className="ex-heading"><span>#</span>Software Developer</h3>

          <div className="detalis-contain">
            <p>Esplanade, Kolkata, West Bengal</p>
            <p>Nov 2025 - Ongoing</p>
          </div>

          <ul>
            {[
              "Developing responsive websites using HTML, CSS, JavaScript, and React.js with clean, reusable, and scalable components.",
              "Building cross-platform mobile applications using React Native with smooth UI and optimized performance.",
              "Implementing backend APIs using Node.js and Express.js.",
              "Managing data, authentication, and databases using MongoDB.",
              "Working directly with the CTO and partners in a startup environment.",
              "Handling live client projects and delivering production-ready solutions."
            ].map((item, index) => (
              <motion.li key={index} variants={itemVariants}>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Web Developer Internship */}
        <motion.div className="timeline-item" variants={itemVariants}>
          <h3 className="ex-heading"><span>#</span>Web Developer Internship</h3>

          <div className="detalis-contain">
            <p>Saltlake Sector-V, Kolkata, West Bengal</p>
            <p>Sep 2024 - Nov 2024</p>
          </div>

          <ul>
            {[
              "Developed a restaurant website using HTML, CSS, JavaScript, and PHP.",
              "Designed responsive and user-friendly web pages.",
              "Implemented dynamic features using JavaScript and PHP.",
              "Maintained the website from design to deployment."
            ].map((item, index) => (
              <motion.li key={index} variants={itemVariants}>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* React Internship */}
        <motion.div className="timeline-item" variants={itemVariants}>
          <h3 className="ex-heading"><span>#</span>React.js Developer Internship</h3>

          <div className="detalis-contain">
            <p>Esplanade, Kolkata, West Bengal</p>
            <p>Aug 2025 - Sep 2025</p>
          </div>

          <ul>
            {[
              "Built a responsive and modern website using React.js.",
              "Created reusable components with clean code structure.",
              "Implemented smooth animations using Framer Motion.",
              "Designed product sections for kitchens, furniture, bedrooms, and luxury bathrooms."
            ].map((item, index) => (
              <motion.li key={index} variants={itemVariants}>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Experience;
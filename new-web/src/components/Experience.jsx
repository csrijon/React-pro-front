import React from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import "./Experience.css";

// Parent animation for each timeline item
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

// Animation for individual elements (li, headings, etc.)
const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const Experience = () => {
  return (
    <section className="Experience-section">
      {/* Heading */}
      <motion.h1
        className="Conatact-heading"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <span>/</span>Experience
      </motion.h1>

      <div className="middle-main">

        {/* ================= Software Developer ================= */}
        <motion.div
          className="timeline-item"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span className="line"></span>

          <motion.h3 className="ex-heading" variants={itemVariants}>
            <span>#</span>Software Developer
          </motion.h3>

          <motion.div className="detalis-contain" variants={itemVariants}>
            <p>Esplanade, Kolkata, West Bengal</p>
            <p>Nov 2025 – Ongoing</p>
          </motion.div>

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

        {/* ================= Web Developer Internship ================= */}
        <motion.div
          className="timeline-item"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h3 className="ex-heading" variants={itemVariants}>
            <span>#</span>Web Developer Internship
          </motion.h3>

          <motion.div className="detalis-contain" variants={itemVariants}>
            <p>Saltlake Sector-V, Kolkata, West Bengal</p>
            <p>Sep 2024 – Nov 2024</p>
          </motion.div>

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

        {/* ================= React Internship ================= */}
        <motion.div
          className="timeline-item"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h3 className="ex-heading" variants={itemVariants}>
            <span>#</span>React.js Developer Internship
          </motion.h3>

          <motion.div className="detalis-contain" variants={itemVariants}>
            <p>Esplanade, Kolkata, West Bengal</p>
            <p>Aug 2025 – Sep 2025</p>
          </motion.div>

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

      </div>
    </section>
  );
};

export default Experience;
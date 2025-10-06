import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  // ছবির অ্যানিমেশন
  const imageVariants = {
    hidden: { scale: 0.2, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: [0.25, 1, 0.5, 1],
        delay: 0.2, // 👇 শুধু এই লাইনটি যোগ করা হয়েছে
      },
    },
  };

  // লেখার অ্যানিমেশন
  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut', delay: 1 },
    },
  };

  return (
    <section className="hero-section">
      <motion.div
        className="hero-background-image"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto-format&fit=crop&w=2127&q=80')`,
        }}
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      />
      <motion.div className="hero-content" variants={textVariants} initial="hidden" animate="visible">
        <h1>
          ADD THE GREATEST
          <br />
          <span className="light-text">JOY OF </span>
          <span className="outline-container">
            <span className="outline-text">LIVING</span>
          </span>
        </h1>
      </motion.div>
    </section>
  );
};

export default Hero;
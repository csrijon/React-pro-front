import React from 'react';
import { motion } from 'framer-motion'; // Framer Motion import করা হয়েছে
import './Header.css';

const Header = () => {
  // কন্টেইনারের জন্য ভ্যারিয়েন্ট
  const headerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        staggerChildren: 0.1, // প্রতিটি চাইল্ড এলিমেন্ট 0.1 সেকেন্ড পর পর অ্যানিমেট হবে
      },
    },
  };

  // প্রতিটি আইটেমের জন্য "Fade in down" ভ্যারিয়েন্ট
  const itemVariants = {
    hidden: { opacity: 0, y: -50 }, // শুরু হবে অদৃশ্য এবং ৫০ পিক্সেল উপরে
    visible: {
      opacity: 1,
      y: 0, // নিজের জায়গায় এসে শেষ হবে
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.header
      className="header"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.nav className="nav-left" variants={itemVariants}>
        <ul>
          <li><a href="#home">HOME</a></li>
          <li><a href="#services">SERVICES</a></li>
          <li><a href="#products">PRODUCTS</a></li>
        </ul>
      </motion.nav>

      <motion.div className="logo" variants={itemVariants}>
        OTO
      </motion.div>

      <div className="nav-right">
        <motion.nav variants={itemVariants}>
          <ul>
            <li><a href="#portfolio">PORTFOLIO</a></li>
            <li><a href="#about">ABOUT</a></li>
          </ul>
        </motion.nav>
        {/* WOW ক্লাসগুলো সরিয়ে দেওয়া হয়েছে যাতে Framer Motion এর সাথে conflict না করে */}
        <motion.button className="contact-btn" variants={itemVariants}>
          CONTACT US
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;
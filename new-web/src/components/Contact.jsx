import React from 'react';
import './Contact.css';
import { FaDiscord } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import DotGrid from './DotGrid';
import Contacttop from '../ui/Contacttop';
import { motion } from "framer-motion";

const Contact = () => {

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.section 
      className="contact-container"
      variants={container}
      initial="hidden"
      whileInView="visible"
    >
      <motion.div variants={item}>
        <Contacttop icon="#" />
      </motion.div>

      <motion.div variants={item} className="contact-box">
        <p className="contact-box-title">Message me here</p>

        <motion.div variants={item} className="contact-item">
          <FaDiscord className="contact-icon" />
          <span>!Elias#3519</span>
        </motion.div>

        <motion.div variants={item} className="contact-item">
          <MdEmail className="contact-icon" />
          <span>csrijon92@gmail.com</span>
        </motion.div>
      </motion.div>

      <motion.div variants={item} className="dot-boxes">
        <DotGrid length={16} />
      </motion.div>
    </motion.section>
  );
};

export default Contact;

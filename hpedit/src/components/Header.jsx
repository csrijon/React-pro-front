import React, { useState, useRef } from 'react';
// eslint-disable-next-line no-unused-vars 
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const about = useRef(null);
  const services = useRef(null);
  const products = useRef(null);

  const scrollsmooth = (sectionRef) => {
    sectionRef.current.scrollintoView({ behavior: 'smooth' })
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const mobileMenuVariants = {
    closed: { y: '-100%', transition: { duration: 0.5, ease: 'easeOut' } },
    open: { y: '0%', transition: { duration: 0.5, ease: 'easeIn' } },
  };

  const listVariants = {
    open: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
    closed: {},
  };

  const listItemVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    closed: { opacity: 0, y: 20 },
  };

  return (
    <>
      <motion.header
        className="header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* 1. Added a wrapper div for easy hiding on mobile */}
        <div className="desktop-nav-group">
          <motion.nav className="nav-left" variants={itemVariants} initial="hidden" animate="visible">
            <ul>
              <li><a href="#home">HOME</a></li>
              <li><a onClick={()=>scrollsmooth(services)} href="#services">SERVICES</a></li>
              <li><a onClick={()=>scrollsmooth(products)} href="#product">PRODUCTS</a></li>
            </ul>
          </motion.nav>
        </div>

        <motion.div className="logo" variants={itemVariants} initial="hidden" animate="visible">
          OTO
        </motion.div>

        {/* 2. Added a wrapper div for easy hiding on mobile */}
        <div className="desktop-nav-group">
          <div className="nav-right">
            <motion.nav variants={itemVariants} initial="hidden" animate="visible">
              <ul>
                <li><a href="#portfolio">PORTFOLIO</a></li>
                <li><a onClick={()=>scrollsmooth(about)}href="#about">ABOUT</a></li>
              </ul>
            </motion.nav>
            <motion.button className="contact-btn" variants={itemVariants} initial="hidden" animate="visible">
              CONTACT US
            </motion.button>
          </div>
        </div>

        {/* --- Mobile Menu Icon --- */}
        <motion.button className="menu-icon-btn" onClick={() => setIsOpen(!isOpen)} >
          <motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path d="M4 6H20" stroke="black" strokeWidth="2" strokeLinecap="round" variants={{ open: { rotate: 45, y: 5 }, closed: { rotate: 0, y: 0 } }} animate={isOpen ? "open" : "closed"} />
            <motion.path d="M4 12H20" stroke="black" strokeWidth="2" strokeLinecap="round" variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }} animate={isOpen ? "open" : "closed"} transition={{ duration: 0.1 }} />
            <motion.path d="M4 18H20" stroke="black" strokeWidth="2" strokeLinecap="round" variants={{ open: { rotate: -45, y: -7 }, closed: { rotate: 0, y: 0 } }} animate={isOpen ? "open" : "closed"} />
          </motion.svg>
        </motion.button>
      </motion.header>

      {/* --- Mobile Navigation Menu --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div className="mobile-nav" variants={mobileMenuVariants} initial="closed" animate="open" exit="closed">
            <motion.ul variants={listVariants}>
              <motion.li variants={listItemVariants}><a href="#home" onClick={() => setIsOpen(false)}>HOME</a></motion.li>
              <motion.li variants={listItemVariants}><a href="#services" onClick={() => setIsOpen(false)}>SERVICES</a></motion.li>
              <motion.li variants={listItemVariants}><a href="#products" onClick={() => setIsOpen(false)}>PRODUCTS</a></motion.li>
              <motion.li variants={listItemVariants}><a href="#portfolio" onClick={() => setIsOpen(false)}>PORTFOLIO</a></motion.li>
              <motion.li variants={listItemVariants}><a href="#about" onClick={() => setIsOpen(false)}>ABOUT</a></motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
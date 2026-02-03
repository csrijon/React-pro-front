import React, { useState } from 'react';
import logo from "../assets/Logo.svg"
import '../components/Header.css';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { NavLink } from 'react-router-dom';
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 20 } }
  };

  return (

    <header>
      <div className="left">
        <img src={logo} alt="logo" />
        <h4>Srijon</h4>
      </div>
      {/* Desktop Navigation */}
      <motion.ul
        className="nav-links desktop-nav"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.li variants={item}><span>#</span><NavLink to="/">home</NavLink></motion.li>
        <motion.li variants={item}><span>#</span><NavLink to="/allprojects">works</NavLink></motion.li>
        <motion.li variants={item}><span>#</span><NavLink to="/aboutme">about-me</NavLink></motion.li>
        <motion.li variants={item}><span>#</span><NavLink to="/experience">experience</NavLink></motion.li>
        <motion.li variants={item}><span>#</span><NavLink to="/contact">contact</NavLink></motion.li>
      </motion.ul>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${isOpen ? 'is-open' : 'is-off'}`}>
        <ul className="nav-links">
          <li><span>#</span><NavLink onClick={() => setIsOpen(false)} to="/">home</ NavLink></li>
          <li><span>#</span><NavLink onClick={() => setIsOpen(false)} to="/allprojects">works</NavLink></li>
          <li><span>#</span><NavLink onClick={() => setIsOpen(false)} to="/aboutme">about-me</NavLink></li>
          <li><span>#</span><NavLink onClick={() => setIsOpen(false)} to="/experience">experience</NavLink></li>
          <li><span>#</span><NavLink onClick={() => setIsOpen(false)} to="/contact">contact</NavLink></li>
        </ul>
      </nav>

      {/* Hamburger Button */}
      <button className='menu-btn' onClick={toggleMenu}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>
    </header>
  );
};

export default Header;

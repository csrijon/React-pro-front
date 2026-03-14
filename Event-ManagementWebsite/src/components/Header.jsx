/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "../css/Header.css";
import { NavLink } from "react-router";
import images from "../assets/1-removebg-preview.svg"
import { motion } from "framer-motion"

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: -60 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 15 } },
    exit: { opacity: 0, y: -60, transition: { duration: 0.3 } }
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">

          <motion.div className="left">
            <NavLink to="/" >
              <motion.img loading="lazy" initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }}
                src={images} alt="logo" />
            </NavLink>
          </motion.div>
          {/* Hamburger */}
          <div
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span class="material-symbols-outlined">
              {menuOpen ? "close" : "menu_open"}
            </span>
          </div>

          {/* Menu */}
          <div className={`right ${menuOpen ? "show" : ""}`}>
            <motion.ul variants={container} initial="hidden" animate="show">
              <motion.li variants={item}   ><NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink></motion.li>
              <motion.li variants={item}   ><NavLink to="/venu" onClick={() => setMenuOpen(false)}>Venue</NavLink></motion.li>
              <motion.li variants={item}   ><NavLink to="/Suppliers" onClick={() => setMenuOpen(false)}>Suppliers</NavLink></motion.li>
              <motion.li variants={item}    ><NavLink to="/About" onClick={() => setMenuOpen(false)}>About</NavLink></motion.li>
              <motion.li variants={item}    ><NavLink to="/Media" onClick={() => setMenuOpen(false)}>Media</NavLink></motion.li>
              <motion.li variants={item}    ><NavLink to="/Contact" onClick={() => setMenuOpen(false)}>Contact</NavLink></motion.li>
              <motion.li variants={item}    ><NavLink to="/PastCategory" onClick={() => setMenuOpen(false)}>Past Category</NavLink></motion.li>
            </motion.ul>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;

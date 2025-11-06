import React, { useState } from 'react';
import logo from "../assets/Logo.svg"
import '../components/Header.css';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header>
      <div className="left">
        <img src={logo} alt="logo" />
        <h4>Srijon</h4>
      </div>

      {/* Desktop Navigation */}
      <ul className="nav-links desktop-nav">
        <li><span>#</span><NavLink to="/">home</NavLink></li>
        <li><span>#</span><NavLink to="/allprojects">works</NavLink></li>
        <li><span>#</span><NavLink to="/aboutme">about-me</NavLink></li>
        <li><span>#</span><NavLink to="/contact">contact</NavLink></li>
        <li><span>#</span><NavLink to="/chatme">chat-me</NavLink></li>
      </ul>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${isOpen ? 'is-open' : 'is-off'}`}>
        <ul className="nav-links">
          <li><span>#</span><NavLink onClick={() => setIsOpen(false)} to="/">home</ NavLink></li>
          <li><span>#</span><NavLink onClick={() => setIsOpen(false)} to="/allprojects">works</NavLink></li>
          <li><span>#</span><NavLink onClick={() => setIsOpen(false)} to="/aboutme">about-me</NavLink></li>
          <li><span>#</span><NavLink  onClick={()=>setIsOpen(false)} to="/contact">contact</NavLink></li>
          <li><span>#</span><NavLink onClick={()=>setIsOpen(false)} to="/chatme">chat-me</NavLink></li>
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

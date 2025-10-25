import React, { useState } from 'react';
import logo from "../assets/Logo.png";
import '../components/Header.css';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

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
        <li><span>#</span><a href="">home</a></li>
        <li><span>#</span><a href="">works</a></li>
        <li><span>#</span><a href="#about">about-me</a></li>
        <li><span>#</span><a href="">contact</a></li>
        <li><span>#</span><a href="">chat-me</a></li>
      </ul>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${isOpen ? 'is-open' : 'is-off'}`}>
        <ul className="nav-links">
          <li><span>#</span><a  href="">home</a></li>
          <li><span>#</span><a href="">works</a></li>
          <li><span>#</span><a onClick={()=>setIsOpen(false)}  href="#about">about-me</a></li>
          <li><span>#</span><a href="">contact</a></li>
          <li><span>#</span><a href="">chat-me</a></li>
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

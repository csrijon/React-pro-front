// src/components/Header.js
import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav-left">
        <ul>
          <li><a href="#home">HOME</a></li>
          <li><a href="#services">SERVICES</a></li>
          <li><a href="#products">PRODUCTS</a></li>
        </ul>
      </nav>
      <div className="logo">OTO</div>
      <div className="nav-right">
        <nav>
          <ul>
            <li><a href="#portfolio">PORTFOLIO</a></li>
            <li><a href="#about">ABOUT</a></li>
          </ul>
        </nav>
        <button className="contact-btn">CONTACT US</button>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import './Footer.css';
// 1. Import FaArrowRight instead of BsArrowRight
import { FaArrowRight } from 'react-icons/fa'; 
import { BsArrowUp } from 'react-icons/bs';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer-section-container">
      <div className="footer-header">
        <h2 className="footer-main-title">CONTACT US</h2>
        {/* <button className="footer-contact-button"> */}
          {/* 2. Use the new icon here */}
          <FaArrowRight />
        {/* </button> */}
      </div>

      {/* ...rest of your code remains the same... */}

      <div className="footer-links-grid">
        <div className="footer-column">
          <h4 className="footer-column-title">QUICK LINKS</h4>
          <ul>
            <li><a href="#home">HOME</a></li>
            <li><a href="#services">SERVICES</a></li>
            <li><a href="#products">PRODUCTS</a></li>
            <li><a href="#portfolio">PORTFOLIO</a></li>
            <li><a href="#about">ABOUT</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-column-title">FOLLOW US</h4>
          <ul>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FACEBOOK</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">INSTAGRAM</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">TWITTER</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LINKEDIN</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-column-title">NEWSLETTER</h4>
          <div className="newsletter-input-wrapper">
            <input type="email" placeholder="ENTER YOUR INFO" className="newsletter-input" />
            <button className="newsletter-submit-button">→</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <button onClick={scrollToTop} className="back-to-top-button">
          <BsArrowUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import './Footer.css';
// Importing icons from react-icons
import { FaGithub, FaFigma, FaDiscord } from 'react-icons/fa';
// Using a generic icon for the logo as a placeholder
import logo from "../assets/Logo.svg"

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-info">
            <div className="footer-title">
              {/* <FiCode className="footer-logo-icon" />`   */}
              <img src= {logo} alt="" />
              <span className="footer-name">Srijon</span>
              <a href="mailto:elias@elias-dev.ml" className="footer-email">
                csrijon92@gmal.com
              </a>
            </div>
            <p className="footer-description">
              Full-Stack Web Developer And App Developer
            </p>
          </div>

          <div className="footer-media">
            <h3 className="media-title">Media</h3>
            <div className="social-icons">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
              <a href="https://figma.com" target="_blank" rel="noopener noreferrer">
                <FaFigma />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                <FaDiscord />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© Copyright 2025. Made by Srijon</p>
      </div>
    </footer>
  );
};

export default Footer;
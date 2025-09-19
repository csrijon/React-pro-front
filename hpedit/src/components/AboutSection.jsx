// src/components/AboutSection.js
import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-header">
        <div className="about-number">01</div>
        <h2>ABOUT OTTO</h2>
      </div>

      <div className="about-content">
        <div className="about-image-left">
          {/* Replace with your image path or a placeholder */}
          <img src="https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Modern living room with blue sofa" />
        </div>

        <div className="about-text-and-image-right">
          <p className="about-description">
            AT OTTO, WE OFFER A WIDE RANGE OF INTERIOR DESIGN AND CUSTOM FURNITURE MANUFACTURING SERVICES TO MEET THE NEEDS AND EXPECTATIONS OF OUR CLIENTS.
          </p>
          <div className="about-image-right">
            {/* Replace with your image path or a placeholder */}
             <img src="https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Modern living room with blue sofa" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
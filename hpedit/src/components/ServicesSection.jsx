// src/components/ServicesSection.js
import React from 'react';
import './ServicesSection.css';

const ServicesSection = () => {
  return (
    <section className="services-section">
      <div className="services-header">
        <div className="services-number">02</div>
        <h2>OUR SERVICES</h2>
      </div>

      <div className="services-content">
        <div className="service-details">
          <h3>INTERIOR DESIGN</h3>
          <p>
            OUR TEAM OF INTERIOR DESIGN EXPERTS WORKS CLOSELY WITH CLIENTS TO CREATE UNIQUE AND PERSONALIZED LIVING SPACES. WE FOCUS ON FUNCTIONALITY AND AESTHETICS, ENSURING THAT EACH SPACE IS OPTIMALLY DESIGNED TO SUIT OUR CLIENTS' LIFESTYLES AND PREFERENCES.
          </p>
          <button className="learn-more-btn">
            LEARN MORE →
          </button>
        </div>
        <div className="service-image">
          {/* Replace with your image path or a placeholder */}
          <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Interior design with teal sofa" />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
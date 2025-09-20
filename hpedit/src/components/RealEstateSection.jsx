// src/components/RealEstateSection.js
import React from 'react';
import './RealEstateSection.css';

const RealEstateSection = () => {
  return (
    <section className="real-estate-section">
      <div className="real-estate-content">
        <div className="real-estate-details">
          <h3>
            REAL ESTATE
            <br />
            PROJECT DESIGN
          </h3>
          <p>
            WE PROVIDE INTERIOR DESIGN SERVICES FOR REAL ESTATE PROJECTS, INCLUDING RESIDENTIAL AND COMMERCIAL DEVELOPMENTS. WE COLLABORATE WITH ARCHITECTS, DEVELOPERS, AND OTHER INDUSTRY PROFESSIONALS TO CREATE INTERIOR DESIGNS THAT ENHANCE THE ARCHITECTURE AND MAXIMIZE THE APPEAL AND FUNCTIONALITY OF EACH PROPERTY.
          </p>
          <button className="learn-more-btn">
            LEARN MORE →
          </button>
        </div>
        <div className="real-estate-image">
          {/* Replace with your image path or a placeholder */}
          <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Interior design with teal sofa" />
        </div>
      </div>
    </section>
  );
};

export default RealEstateSection;
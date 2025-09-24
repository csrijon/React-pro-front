import React from 'react';
import './VillasSection.css';

const VillasSection = () => {
  return (
    <section className="villas-section-container">
      <div className="villas-image-wrapper">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          alt="Modern living room with blue sofa"
          className="villa-image"
        />
      </div>
      <div className="villas-content-wrapper">
        <h2 className="villas-heading">
          <span className="heading-line"></span>
          Villas
          <br />
          and Apartments
        </h2>
        <p className="villas-description">
          We offer interior design solutions for private villas and luxury
          apartments, ensuring that each space reflects the style and personality
          of the homeowners. From material and finish selection to space planning
          and lighting, we take care of every detail to create a welcoming and
          luxurious environment.
        </p>
        <button className="learn-more-btn">
          Learn More <span className="arrow">→</span>
        </button>
      </div>
    </section>
  );
};

export default VillasSection;
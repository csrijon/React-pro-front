// src/components/Hero.js
import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section wow animate_animated animate_bounceIn ">
      <div className="hero-content">
        <h1>
          ADD THE GREATEST
          <br />
          <span className="light-text">JOY OF </span>
          <span className="outline-container">
            <span className="outline-text">LIVING</span>
          </span>
        </h1>
      </div>
    </section>
  );
};

export default Hero;
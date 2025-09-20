// src/components/CustomFurnitureSection.js
import React from 'react';
import './CustomFurnitureSection.css';

const CustomFurnitureSection = () => {
  return (
    <section className="custom-furniture-section">
      <div className="custom-furniture-content">
        <div className="custom-furniture-image">
          {/* Replace with your image path or a placeholder */}
            <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Interior design with teal sofa" />
        </div>
        <div className="custom-furniture-details">
          <h3>CUSTOM FURNITURE</h3>
          <p>
            WE CREATE CUSTOM-MADE FURNITURE, DESIGNED SPECIFICALLY TO FIT THE SPACE AND STYLE OF EACH PROJECT. OUR SKILLED CRAFTSMEN HANDLE THE MANUFACTURING OF EACH PIECE USING THE HIGHEST QUALITY MATERIALS AND CUTTING-EDGE FABRICATION TECHNIQUES, ENSURING DURABILITY AND EXCEPTIONAL AESTHETICS.
          </p>
          <button className="learn-more-btn">
            LEARN MORE →
          </button>
        </div>
      </div>
    </section>
  );
};

export default CustomFurnitureSection;
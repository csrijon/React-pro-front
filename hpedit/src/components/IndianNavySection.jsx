import React from 'react';
import './IndianNavySection.css'; // For styling

// Import your images (replace with actual paths)
import image1 from '../assets/react.svg';
import image2 from '../assets/react.svg';
import image3 from '../assets/react.svg';
import image4 from '../assets/react.svg';

const IndianNavySection = () => {
  const images = [image1, image2, image3, image4];

  return (
    <div className="indian-navy-section-container">
      <div className="indian-navy-content">
        <h1>Indian Navy</h1>

        <div className="details-group">
          <p className="detail-label">Location</p>
          <p className="detail-value">Kolkata</p>
        </div>

        <div className="details-group">
          <p className="detail-label">Project type</p>
          <p className="detail-value">Commercial</p>
        </div>

        <div className="details-group">
          <p className="detail-label">Status</p>
          <p className="detail-value">Completed</p>
        </div>

        <div className="details-group">
          <p className="detail-label">Year</p>
          <p className="detail-value">2024</p>
        </div>

        <div className="details-group">
          <p className="detail-label">Details</p>
          <p className="detail-value">
            ABN Designz Studio had the privilege of designing key interior spaces for the most senior
            officer of the Indian Navy in Kolkata. The brief emphasized a clean, contemporary aesthetic
            with a strong sense of authority and elegance. We designed a modern reception area and a
            dignified officer's room, combining sharp lines, premium materials, and subtle naval-inspired
            elements. Additionally, we completed the officer's dining hall, ensuring a refined ambiance
            that reflected both prestige and functionality for formal dining and interactions.
          </p>
        </div>
      </div>

      <div className="indian-navy-image-gallery">
        {images.map((img, index) => (
          <img key={index} src={img} alt={`Indian Navy Interior ${index + 1}`} className="gallery-image" />
        ))}
      </div>
    </div>
  );
};

export default IndianNavySection;
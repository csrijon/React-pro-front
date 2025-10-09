import React from 'react';
import './ProjectDetailSection.css';

// --- IMPORTANT ---
// Replace these placeholder paths with the actual paths to your four images.
// You can put your images in an 'assets' folder inside 'src'.
// For example: import image1 from '../assets/navy-interior-1.jpg';
import image1 from '../assets/image 1.jpg';
import image2 from '../assets/image 1.jpg';
import image3 from '../assets/image 1.jpg';
import image4 from '../assets/image 1.jpg';

const ProjectDetailSection = () => {
  // An array makes it easy to manage the images
  const projectImages = [image1, image2, image3, image4];

  return (
    <section className="project-detail-container">
      {/* ===== Text Content ===== */}
      <div className="project-content">
        <h1>Indian Navy</h1>
        
        <div className="details-grid">
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

      {/* ===== Image Gallery ===== */}
      <div className="project-image-gallery">
        {projectImages.map((src, index) => (
          <div key={index} className="gallery-item">
            <img src={src} alt={`Indian Navy Project Image ${index + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectDetailSection;
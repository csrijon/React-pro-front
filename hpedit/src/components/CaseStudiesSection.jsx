import React from 'react';
import './CaseStudiesSection.css';

// Data for your case study cards with image links from royalty-free sources
const caseStudies = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Modern living room
    title: 'INTERIOR DESIGN',
    linkText: 'VIEW CASE STUDY',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/9944675/pexels-photo-9944675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Outdoor furniture
    title: 'CUSTOM FURNITURE',
    linkText: 'VIEW CASE STUDY',
  },
  // You can add more case studies here if you wish, and the grid will adjust
];

const CaseStudiesSection = () => {
  return (
    <section className="case-studies-section-container">
      <h2 className="case-studies-main-heading">
        <span className="heading-number">04</span> Case Studies
      </h2>

      <div className="case-study-cards-grid">
        {caseStudies.map((study) => (
          <div key={study.id} className="case-study-card">
            <div className="case-study-image-wrapper">
              <img src={study.image} alt={study.title} className="case-study-card-image" />
            </div>
            <h3 className="case-study-title">{study.title}</h3>
            <button className="view-case-study-btn">
              {study.linkText} <span className="arrow">→</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CaseStudiesSection;
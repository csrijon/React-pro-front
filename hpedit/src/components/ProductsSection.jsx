import React from 'react';
import './ProductsSection.css';

// Data for your product cards with Google image search links
const products = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/3144580/pexels-photo-3144580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    preTitle: 'EXQUISITE',
    title: 'KITCHENS',
    linkText: 'EXPLORE THE COLLECTION',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/6588923/pexels-photo-6588923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    preTitle: 'PERFECT MATCH',
    title: 'FITTED FURNITURE',
    linkText: 'EXPLORE THE COLLECTION',
  },
  {
    id: 3, // Added this card
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    preTitle: 'COMFORT & STYLE',
    title: 'BEDROOM DESIGNS',
    linkText: 'VIEW SOLUTIONS',
  },
  {
    id: 4, // Added this card
    image: 'https://images.pexels.com/photos/3754438/pexels-photo-3754438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    preTitle: 'LUXURY RETREAT',
    title: 'BATHROOMS',
    linkText: 'DISCOVER MORE',
  },
];

const ProductsSection = () => {
  return (
    <section className="products-section-container">
      <h2 className="products-main-heading">
        <span className="heading-number">03</span> Our Products
      </h2>

      <div className="product-cards-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-wrapper">
              <img src={product.image} alt={product.title} className="product-card-image" />
            </div>
            <p className="product-pre-title">{product.preTitle}</p>
            <h3 className="product-title">{product.title}</h3>
            <button className="explore-btn">
              {product.linkText} <span className="arrow">→</span>
            </button>
          </div>
        ))}
      </div>

      {/* --- নতুন বাটন এখানে যোগ করা হয়েছে --- */}
      <div className="view-all-container">
        <button className="view-all-btn">
          View All <span className="arrow">→</span>
        </button>
      </div>
      
    </section>
  );
};

export default ProductsSection;
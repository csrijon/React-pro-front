import React from 'react';
import { motion } from 'framer-motion';
// import { useNavigate } from "react-router";
import './ProductsSection.css';

// Data for your product cards
const products = [
  
  { id: 1, image: 'https://images.pexels.com/photos/3144580/pexels-photo-3144580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', preTitle: 'EXQUISITE', title: 'KITCHENS', linkText: 'EXPLORE THE COLLECTION' },
  { id: 2, image: 'https://images.pexels.com/photos/6588923/pexels-photo-6588923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', preTitle: 'PERFECT MATCH', title: 'FITTED FURNITURE', linkText: 'EXPLORE THE COLLECTION' },
  { id: 3, image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', preTitle: 'COMFORT & STYLE', title: 'BEDROOM DESIGNS', linkText: 'VIEW SOLUTIONS' },
  { id: 4, image: 'https://images.pexels.com/photos/3754438/pexels-photo-3754438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', preTitle: 'LUXURY RETREAT', title: 'BATHROOMS', linkText: 'DISCOVER MORE' },
];

// Animation variants for the main heading
const headingVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 }
  },
};

// Stagger container for the grid
const gridVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.2,
    },
  },
};

// Animation variants for each product card
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};

const ProductsSection = () => {
  //  let navigate = useNavigate()
  // const showedtalis = ()=>{
  //    navigate("/explore")
  //  }
  return (
    <section className="products-section-container">
      <motion.h2
        className="products-main-heading"
        variants={headingVariants}
        initial="hidden"
        whileInView="visible" 
        viewport={{ once: true, amount: 0.5 }} 
      >
        <span className="heading-number">03</span> Our Products
      </motion.h2>

      <motion.div
        className="product-cards-grid"
        variants={gridVariants}
        initial="hidden"
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }} 
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="product-card"
            variants={cardVariants}
            whileHover={{ y: -10, scale: 1.03, transition: { duration: 0.3 } }}
          >
            <div className="product-image-wrapper">
              <motion.img
                src={product.image}
                alt={product.title}
                className="product-card-image"
                initial={{ scale: 1.15 }}
                whileHover={{ scale: 1.0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
            <p className="product-pre-title">{product.preTitle}</p>
            <h3 className="product-title">{product.title}</h3>
            <button   className="explore-btn">
              {product.linkText} <span className="arrow">→</span>
            </button>
          </motion.div>
        ))}
      </motion.div>

      <div className="view-all-container">
        <button className="view-all-btn">
          View All <span className="arrow">→</span>
        </button>
      </div>
    </section>
  );
};

export default ProductsSection;
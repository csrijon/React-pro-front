// src/App.js
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import './App.css';
import ServicesSection from './components/ServicesSection';
import CustomFurnitureSection from './components/CustomFurnitureSection';
import RealEstateSection from './components/RealEstateSection';
import VillasSection from './components/VillasSection';
import ProductsSection from './components/ProductsSection';
import CaseStudiesSection from './components/CaseStudiesSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-container">
      <Header />
      <Hero />
      <AboutSection />
      <ServicesSection />
      <CustomFurnitureSection />
      <RealEstateSection />
      <VillasSection />
      <ProductsSection/>
      <CaseStudiesSection />
      <Footer />
    </div>
  );
}

export default App;
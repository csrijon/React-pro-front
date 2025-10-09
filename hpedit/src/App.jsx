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
import IndianNavySection from './components/IndianNavySection';

function App() {
  // Main container-er class name change kora hoyeche.
  // Prottekta component-ke ekta <section> tag diye ghire deya hoyeche.
  return (
    <div className="scroll-snap-container">
      {/* Header ke scrollable area'r baire rakha hoyeche jate eta fixed thake */}
      <Header />

      {/* Prottekta full-page component ekta scroll-section */}
      <section className="scroll-section">
        <Hero />
      </section>
      <section className="scroll-section">
        <AboutSection />
      </section>
      <section className="scroll-section">
        <ServicesSection />
      </section>
      <section className="scroll-section">
        <CustomFurnitureSection />
      </section>
      <section className="scroll-section">
        <RealEstateSection />
      </section>
      <section className="scroll-section">
        <VillasSection />
      </section>
      <section className="scroll-section">
        <ProductsSection />
      </section>
      <section className="scroll-section">
        <CaseStudiesSection />
      </section>
      <section className="scroll-section">
        <Footer />
      </section>
      <section className="scroll-section">
<IndianNavySection/>
      </section>
    </div>
  );
}

export default App;


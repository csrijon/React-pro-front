import React from "react";
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import CustomFurnitureSection from './components/CustomFurnitureSection';
import RealEstateSection from './components/RealEstateSection';
import VillasSection from './components/VillasSection';
import ProductsSection from './components/ProductsSection';
import CaseStudiesSection from './components/CaseStudiesSection';
import ProjectDetailSection from "./components/ProjectDetailSection";
import Footer from './components/Footer';
import ScrollToTop from './ScrollToTop.jsx';
import './App.css';

const Root = ({ pageName }) => {
  console.log("Root কম্পোনেন্টে যে prop এসেছে:", pageName);

  return (
    
    <div className="scroll-snap-container">
      <ScrollToTop />
      <Header />

      {pageName === "explore" ? (
        // ✅ Only these will show when URL = /explore
        <>
          <section className="scroll-section">
            <ProjectDetailSection />
          </section>
          <Footer />
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
    
  );
};

export default Root;

import React from "react";
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
import ProjectDetailSection from "./components/ProjectDetailSection";

const Root = ({pageName}) => {
    console.log('Root কম্পোনেন্টে যে prop এসেছে:', pageName);
  return (
    <div className="scroll-snap-container">
      <Header />
      {/* Prottekta full-page component ekta scroll-section */}
      <section className="scroll-section">
        {pageName === 'explore'? <ProjectDetailSection/> : <Hero />}
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
    </div>
  )
}

export default Root

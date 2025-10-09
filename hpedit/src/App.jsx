import React from 'react';
// import Header from './components/Header';
// import Hero from './components/Hero';
// import AboutSection from './components/AboutSection';
// import './App.css';
// import ServicesSection from './components/ServicesSection';
// import CustomFurnitureSection from './components/CustomFurnitureSection';
// import RealEstateSection from './components/RealEstateSection';
// import VillasSection from './components/VillasSection';
// import ProductsSection from './components/ProductsSection';
// import CaseStudiesSection from './components/CaseStudiesSection';
// import Footer from './components/Footer';
// import IndianNavySection from './components/ProjectDetailSection';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Root from './Root';
function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element:<Root pageName= "home" />
    },
    {
      path: "/explore",
      element: <Root pageName= 'explore'/>
    },
  ]);
  // Main container-er class name change kora hoyeche.
  // Prottekta component-ke ekta <section> tag diye ghire deya hoyeche.
  return (
   <RouterProvider router={router}/>
  );
}

export default App;


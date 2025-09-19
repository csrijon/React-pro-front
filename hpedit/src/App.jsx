// src/App.js
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <Hero />
      <AboutSection/>
    </div>
  );
}

export default App;
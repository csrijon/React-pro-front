import React from "react";
import "../css/HeroSection.css";
import screenshotIcon from "../assets/screenshot.png"; 
import videoIcon from "../assets/video.png";
import codeIcon from "../assets/code.png";

const HeroSection = () => {
  return (
    <section className="hero-container">
      <div className="hero-content">
        <h1>
          Build Your UI with <br /> <span>AI in Seconds</span>
        </h1>
        <p>
          Upload screenshots, write prompts, and let our AI generate the code
          for you.
        </p>

        <button className="hero-btn">Get Started</button>

        <div className="hero-steps">
          <div className="step-box">
            <img src={screenshotIcon} alt="Screenshot" />
            <p>Screenshot</p>
          </div>

          <span className="arrow">→</span>

          <div className="step-box">
            <img src={videoIcon} alt="Prompt & Video" />
            <p>Prompt & Video</p>
          </div>

          <span className="arrow">→</span>

          <div className="step-box">
            <img src={codeIcon} alt="Code & Preview" />
            <p>Code & Preview</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

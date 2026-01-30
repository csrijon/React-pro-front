
import React from "react";
import "../css/FirstAboutSection.css";
import firstimages from "../assets/fifthimages.jpg"

const FirstAboutSection = () => {
  return (
    <section className="about-wrapper">
      {/* Top content */}
      <div className="about-content">
        {/* Left text */}
        <div className="about-text">
          <h3>About Us</h3>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>

        {/* Right image */}
        <div className="about-image">
          <img
            src={firstimages}
            alt="about"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="about-stats">
        <div className="stat">
          <h2>10,000</h2>
          <p>Wedding Vendors</p>
        </div>

        <div className="stat">
          <h2>20,000</h2>
          <p>Annual Weddings</p>
        </div>

        <div className="stat">
          <h2>1,000</h2>
          <p>Wedding Venues</p>
        </div>

        <div className="stat">
          <h2>1.5 M</h2>
          <p>Monthly Followers</p>
        </div>
      </div>
    </section>
  );
};

export default FirstAboutSection;
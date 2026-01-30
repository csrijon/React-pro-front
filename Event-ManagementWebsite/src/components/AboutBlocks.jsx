import React from "react";
import "../css/AboutBlocks.css";
import fifthimages from "../assets/fifthimages.jpg"

const AboutBlocks = () => {
  return (
    <section className="about-blocks">
      {/* Block 1 */}
      <div className="about-row">
        <div className="about-image">
          <img
            src={fifthimages}
            alt="what we offer"
          />
        </div>

        <div className="about-text">
          <h3>What We Offer?</h3>
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
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      {/* Block 2 */}
      <div className="about-row reverse">
          <div className="about-image">
          <img
            src={fifthimages}
            alt="who we are"
          />
        </div>
        <div className="about-text">
          <h3>Who We Are?</h3>
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
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

      </div>
    </section>
  );
};

export default AboutBlocks;
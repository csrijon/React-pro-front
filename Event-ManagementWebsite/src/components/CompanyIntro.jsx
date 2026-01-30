import React from "react";
import "../css/CompanyIntro.css";

const CompanyIntro = () => {
  return (
    <div className="company-intro">
      <h2 className="company-title">We are &lt;Company Name&gt;</h2>

      <p className="company-text">
        We bring <br />
        <span className="highlight">dream weddings</span> <br />
        to life!
      </p>
    </div>
  );
};

export default CompanyIntro;
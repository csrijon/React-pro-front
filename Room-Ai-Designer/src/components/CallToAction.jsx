import React from "react";
import "../css/CallToAction.css";
import { NavLink } from "react-router-dom";

const CallToAction = () => {
  return (
    <div className="cta-wrapper">
      <h2 className="cta-title">Ready to reimagine your space?</h2>
      <NavLink to="/Scaner" className="cta-btn">Start Designing Now</NavLink>
    </div>
  );
};

export default CallToAction;

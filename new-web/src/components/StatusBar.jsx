import React from "react";
import "./StatusBar.css"; 

const StatusBar = () => {
  return (
    <div className="status-bar">
      <span className="status-icon"></span>
      <span className="status-text">
        Currently working on <strong>Portfolio</strong>
      </span>
    </div>
  );
};

export default StatusBar;

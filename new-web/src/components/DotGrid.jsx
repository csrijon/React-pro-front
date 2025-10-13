import React from 'react';
import './DotGrid.css'; 

const DotGrid = ({length}) => {
  const dots = Array.from({ length });

  return (
    <div className="grid-container">
      {dots.map((_, index) => (
        <div key={index} className="dot"></div>
      ))}
    </div>
  );
};

export default DotGrid;
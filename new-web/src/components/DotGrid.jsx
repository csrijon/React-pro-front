import React from 'react';
import './DotGrid.css'; // CSS ফাইলটি ইম্পোর্ট করা হচ্ছে

const DotGrid = () => {
  // 4x4 = 16 টি ডট তৈরি করার জন্য একটি array তৈরি করা হচ্ছে
  const dots = Array.from({ length: 8 });

  return (
    <div className="grid-container">
      {dots.map((_, index) => (
        <div key={index} className="dot"></div>
      ))}
    </div>
  );
};

export default DotGrid;
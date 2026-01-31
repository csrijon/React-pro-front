import React from "react";
import "../css/suppliers.css";

import photographer from "../assets/firstimage.webp";


const categories = [
  { title: "PHOTOGRAPHER / VIDEOGRAPHER", img: photographer },
  { title: "DECORATORS", img: photographer },
  { title: "VENUE PLANNERS", img: photographer },
  { title: "CHOREOGRAPHERS", img: photographer },
  { title: "DESIGNERS", img: photographer },
  { title: "MAKEUP ARTIST", img: photographer },
  { title: "BAR SERVICES", img: photographer },
];

const SuppliersCategories = () => {
  return (
    <div className="suppliers-container">
      <div className="container">
      <h4 className="suppliers-title">Suppliers Categories</h4>

      <div className="suppliers-grid">
        {categories.map((item, index) => (
          <div className="supplier-card" key={index}>
            <div className="supplier-circle">
              <img src={item.img} alt={item.title} />
            </div>
            <p className="supplier-text">{item.title}</p>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default SuppliersCategories;
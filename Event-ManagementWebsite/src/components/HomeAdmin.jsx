import React, { useState } from "react";
import "../css/HomeAdmin.css";

const HomeAdmin = () => {
  const [categories] = useState(["Wedding", "Birthday", "Corporate"]);
  const [locations] = useState(["Delhi", "Mumbai", "Bangalore"]);

  return (
    <div className="admin-wrapper">
      {/* HEADER */}
      <div className="admin-header">
        <h2>Hero Section</h2>
        <button className="save-btn">Save Changes</button>
      </div>

      {/* GRID */}
      <div className="admin-grid">
        {/* HERO TEXT */}
        <div className="admin-card">
          <h3>Hero Text</h3>

          <div className="field">
            <label>Heading</label>
            <input defaultValue="Our Wedding Venues" />
          </div>

          <div className="field">
            <label>Sub Heading</label>
            <input defaultValue="Find your perfect place" />
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="admin-card">
          <h3>Categories</h3>

          <div className="add-row">
            <input placeholder="Add category" />
            <button>Add</button>
          </div>

          <div className="pill-group">
            {categories.map((c, i) => (
              <span className="pill" key={i}>
                {c} <button>×</button>
              </span>
            ))}
          </div>
        </div>

        {/* LOCATIONS */}
        <div className="admin-card">
          <h3>Locations</h3>

          <div className="add-row">
            <input placeholder="Add location" />
            <button>Add</button>
          </div>

          <div className="pill-group">
            {locations.map((l, i) => (
              <span className="pill" key={i}>
                {l} <button>×</button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
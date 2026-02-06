import React, { useState } from "react";
import "../css/HomeAdmin.css";

const HomeAdmin = () => {
  const [categories] = useState(["Wedding", "Birthday", "Corporate"]);
  const [locations] = useState(["Delhi", "Mumbai", "Bangalore"]);

  return (
    <div className="admin-wrapper">
      {/* ================= HERO SECTION ================= */}
      <div className="admin-header">
        <h2>Hero Section</h2>
        <button className="save-btn">Save Changes</button>
      </div>

      <div className="admin-grid">
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

      {/* ================= BROWSE BY CATEGORY ================= */}
      <div className="admin-header">
        <h2>Browse by Category</h2>
      </div>

      <div className="admin-card">
        <h3>Add Category Card</h3>

        <div className="add-row">
          <input placeholder="Category name" />
          <label className="upload-btn">
            Upload Image
            <input type="file" hidden />
          </label>
          <button>Add</button>
        </div>

        <div className="card-list">
          <div className="card-item">
            <img src="/placeholder.jpg" alt="cat" />
            <input defaultValue="Wedding" />
            <div className="actions">
              <label className="icon-btn">
                Change Image
                <input type="file" hidden />
              </label>
              <button className="remove-btn">×</button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= POPULAR VENUE ================= */}
      <div className="admin-header">
        <h2>Popular Venue</h2>
      </div>

      <div className="admin-card">
        <h3>Add Venue Card</h3>

        <div className="add-row">
          <input placeholder="Venue name / City" />
          <label className="upload-btn">
            Upload Image
            <input type="file" hidden />
          </label>
          <button>Add</button>
        </div>

        <div className="card-list">
          <div className="card-item">
            <img src="/placeholder.jpg" alt="venue" />
            <input defaultValue="Dubai" />
            <div className="actions">
              <label className="icon-btn">
                Change Image
                <input type="file" hidden />
              </label>
              <button className="remove-btn">×</button>
            </div>
          </div>
        </div>
      </div>
      {/* ================= FEATURED VIDEOS ================= */}
      <div className="admin-header">
        <h2>Featured Videos</h2>
      </div>

      <div className="admin-card">
        <h3>Add Featured Video</h3>

        <div className="add-row">
          <input placeholder="Video title" />
          <input placeholder="Short description" />

          <label className="upload-btn">
            Upload Thumbnail
            <input type="file" hidden />
          </label>

          <button>Add</button>
        </div>

        <div className="card-list">
          {/* CARD 1 */}
          <div className="card-item">
            <img src="/placeholder.jpg" alt="video" />

            <div className="card-fields">
              <input defaultValue="Wedding Highlights Dubai" />
              <textarea rows="2" defaultValue="Beautiful wedding moments..." />
            </div>

            <div className="actions">
              <label className="icon-btn">
                Change Image
                <input type="file" hidden />
              </label>
              <button className="remove-btn">×</button>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="card-item">
            <img src="/placeholder.jpg" alt="video" />

            <div className="card-fields">
              <input defaultValue="Luxury Venue Tour" />
              <textarea rows="2" defaultValue="Explore premium venues..." />
            </div>

            <div className="actions">
              <label className="icon-btn">
                Change Image
                <input type="file" hidden />
              </label>
              <button className="remove-btn">×</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;

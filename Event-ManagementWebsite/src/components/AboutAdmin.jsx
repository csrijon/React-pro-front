import React from "react";
import "../css/AboutAdmin.css";

const AboutAdmin = () => {
  return (
    <div className="admin-wrapper">
      {/* HEADER */}
      <div className="admin-header">
        <h2>About Page Content</h2>
        <button className="save-btn">Save Changes</button>
      </div>

      {/* ================= MAIN ABOUT SECTION ================= */}
      <div className="admin-card">
        <h3>Main About Section</h3>

        <div className="form-group">
          <label>Section Title</label>
          <input type="text" placeholder="About Us" />
        </div>

        <div className="form-group">
          <label>Paragraph 1</label>
          <textarea rows="4" placeholder="First paragraph..." />
        </div>

        <div className="form-group">
          <label>Paragraph 2</label>
          <textarea rows="4" placeholder="Second paragraph..." />
        </div>

        <label className="upload-btn">
          Upload Main Image
          <input type="file" hidden />
        </label>
      </div>

      {/* ================= STATS ================= */}
      <div className="admin-card">
        <h3>Statistics</h3>

        <div className="stats-grid">
          <div className="stat-item">
            <input type="text" placeholder="10,000" />
            <input type="text" placeholder="Wedding Vendors" />
          </div>

          <div className="stat-item">
            <input type="text" placeholder="20,000" />
            <input type="text" placeholder="Annual Weddings" />
          </div>

          <div className="stat-item">
            <input type="text" placeholder="1,000" />
            <input type="text" placeholder="Wedding Venues" />
          </div>

          <div className="stat-item">
            <input type="text" placeholder="1.5 M" />
            <input type="text" placeholder="Monthly Followers" />
          </div>
        </div>
      </div>

      {/* ================= BLOCK 1 ================= */}
      <div className="admin-card">
        <h3>Block 1 – What We Offer</h3>

        <div className="form-group">
          <label>Title</label>
          <input type="text" placeholder="What We Offer?" />
        </div>

        <div className="form-group">
          <label>Paragraph 1</label>
          <textarea rows="4" />
        </div>

        <div className="form-group">
          <label>Paragraph 2</label>
          <textarea rows="4" />
        </div>

        <label className="upload-btn">
          Upload Block Image
          <input type="file" hidden />
        </label>
      </div>

      {/* ================= BLOCK 2 ================= */}
      <div className="admin-card">
        <h3>Block 2 – Who We Are</h3>

        <div className="form-group">
          <label>Title</label>
          <input type="text" placeholder="Who We Are?" />
        </div>

        <div className="form-group">
          <label>Paragraph 1</label>
          <textarea rows="4" />
        </div>

        <div className="form-group">
          <label>Paragraph 2</label>
          <textarea rows="4" />
        </div>

        <label className="upload-btn">
          Upload Block Image
          <input type="file" hidden />
        </label>
      </div>
    </div>
  );
};

export default AboutAdmin;

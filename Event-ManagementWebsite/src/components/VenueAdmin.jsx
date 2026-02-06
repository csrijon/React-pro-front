import React from "react";
import "../css/VenueAdmin.css";

const VenueAdmin = () => {
  return (
    <div className="admin-wrapper">
      {/* HEADER */}
      <div className="admin-header">
        <h2>Venue Section</h2>
        <button className="save-btn">Save Changes</button>
      </div>

      {/* SECTION SETTINGS */}
      <div className="admin-card">
        <h3>Section Settings</h3>

        <div className="form-group">
          <label>Section Title</label>
          <input type="text" placeholder="e.g. Wedding Venues in UAE" />
        </div>

        <div className="form-group">
          <label>Total Cards (How many venues to show)</label>
          <input type="number" placeholder="e.g. 6" />
        </div>

        <div className="form-group">
          <label>Section Count Number</label>
          <input type="text" placeholder="e.g. 06" />
        </div>
      </div>

      {/* CITY & CARD DATA */}
      <div className="admin-card">
        <h3>Venue Cards</h3>

        {/* ADD NEW CARD */}
        <div className="add-row">
          <input type="text" placeholder="City / Venue Name" />

          <label className="upload-btn">
            Upload Image
            <input type="file" hidden />
          </label>

          <button>Add</button>
        </div>

        {/* EXISTING CARDS */}
        <div className="venue-admin-list">
          <div className="venue-admin-item">
            <img src="/placeholder.jpg" alt="venue" />

            <input
              type="text"
              defaultValue="ABU DHABI"
              className="venue-input"
            />

            <div className="actions">
              <label className="icon-btn">
                Change Image
                <input type="file" hidden />
              </label>
              <button className="remove-btn">×</button>
            </div>
          </div>

          <div className="venue-admin-item">
            <img src="/placeholder.jpg" alt="venue" />

            <input
              type="text"
              defaultValue="AL AIN"
              className="venue-input"
            />

            <div className="actions">
              <label className="icon-btn">
                Change Image
                <input type="file" hidden />
              </label>
              <button className="remove-btn">×</button>
            </div>
          </div>

          <div className="venue-admin-item">
            <img src="/placeholder.jpg" alt="venue" />

            <input
              type="text"
              defaultValue="DUBAI"
              className="venue-input"
            />

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

export default VenueAdmin;

import React from "react";
import "../css/MediaAdmin.css";

const MediaAdmin = () => {
  return (
    <div className="admin-wrapper">
      {/* HEADER */}
      <div className="admin-header">
        <h2>Media Section</h2>
        <button className="save-btn">Save Changes</button>
      </div>

      {/* SECTION SETTINGS */}
      <div className="admin-card">
        <h3>Section Settings</h3>

        <div className="form-group">
          <label>Section Title</label>
          <input type="text" placeholder="Latest Media" />
        </div>

        <div className="form-group">
          <label>Total Count Number</label>
          <input type="text" placeholder="23" />
        </div>
      </div>

      {/* ADD NEW MEDIA */}
      <div className="admin-card">
        <h3>Add New Media Card</h3>

        <div className="add-row">
          <input type="text" placeholder="Heading" />
          <input type="text" placeholder="Short description" />

          <label className="upload-btn">
            Upload Image
            <input type="file" hidden />
          </label>

          <button>Add</button>
        </div>
      </div>

      {/* EXISTING MEDIA LIST */}
      <div className="admin-card">
        <h3>Media Cards</h3>

        <div className="media-admin-list">
          {/* CARD 1 */}
          <div className="media-admin-item">
            <img src="/placeholder.jpg" alt="media" />

            <div className="media-fields">
              <input type="text" defaultValue="Media Heading 1" />
              <textarea rows="3" defaultValue="Short media description..." />
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
          <div className="media-admin-item">
            <img src="/placeholder.jpg" alt="media" />

            <div className="media-fields">
              <input type="text" defaultValue="Media Heading 2" />
              <textarea rows="3" defaultValue="Short media description..." />
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

export default MediaAdmin;

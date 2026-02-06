import React, { useState } from "react";
import "../css/SuppliersAdmin.css";

const SuppliersAdmin = () => {
  const [categories, setCategories] = useState([
    { title: "PHOTOGRAPHER / VIDEOGRAPHER", img: "/placeholder.jpg" },
    { title: "DECORATORS", img: "/placeholder.jpg" },
    { title: "VENUE PLANNERS", img: "/placeholder.jpg" },
    { title: "CHOREOGRAPHERS", img: "/placeholder.jpg" },
    { title: "DESIGNERS", img: "/placeholder.jpg" },
    { title: "MAKEUP ARTIST", img: "/placeholder.jpg" },
    { title: "BAR SERVICES", img: "/placeholder.jpg" },
  ]);

  const [newCategory, setNewCategory] = useState("");

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h2>Suppliers Categories</h2>
        <button className="save-btn">Save Changes</button>
      </div>

      <div className="admin-card">
        <h3>Manage Categories</h3>

        {/* ADD NEW CATEGORY */}
        <div className="add-row">
          <input
            type="text"
            placeholder="Add new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />

          <label className="upload-btn">
            Upload Image
            <input type="file" hidden />
          </label>

          <button>Add</button>
        </div>

        {/* EXISTING LIST */}
        <div className="category-list">
          {categories.map((cat, index) => (
            <div className="category-item" key={index}>
              {/* IMAGE */}
              <img src={cat.img} alt={cat.title} />

              {/* NAME EDIT */}
              <input
                type="text"
                className="category-input"
                defaultValue={cat.title}
              />

              {/* IMAGE CHANGE */}
              <div className="actions">
                <label className="icon-btn">
                  Change Image
                  <input type="file" hidden />
                </label>

                <button className="remove-btn">×</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuppliersAdmin;

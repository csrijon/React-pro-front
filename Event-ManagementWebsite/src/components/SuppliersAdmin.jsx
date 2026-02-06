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
  const [Image, setNewImage] = useState("");

  const addhandeler =async()=>{
    console.log("add handeler is working")
  try {
    const formData = new FormData();
    formData.append("newCategory", newCategory);
    formData.append("Image", Image);
      let response = await fetch("http://localhost:3000/supplyers",{
      method:"POST",
      body:formData

    })
    let data = await response.json()
    console.log(data)
  } catch (error) {
    console.log(error)
  }
  }

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
            onChange={(e) => {
              let categoryname = e.target.value;
              setNewCategory(categoryname);
              console.log(e.target.value);
            }}
          />

          <label className="upload-btn">
            Upload Image
            <input type="file" hidden accept="image/*" onChange={(e) => {
              let imagefile = e.target.files[0];
              setNewImage(imagefile);
              console.log(imagefile);
            }} />
          </label>

          <button onClick={addhandeler} >Add</button>
        </div>

        {/* EXISTING LIST */}
        <div className="category-list">
          {categories.map((cat, index) => (
            <div className="category-item" key={index}>
              {/* IMAGE */}
              <img src={cat.img} alt={cat.title}
              />
              {/* NAME EDIT */}
              <input
                type="text"
                className="category-input"
                defaultValue={cat.title}
                onChange={(e) => {
                  const updatedCategories = [...categories];
                  updatedCategories[index].title = e.target.value;
                  setCategories(updatedCategories);
                  console.log(e.target.value);
                }}
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

import React, { useState } from "react";
import "../css/SuppliersAdmin.css";

const SuppliersAdmin = () => {

  const [newCategory, setNewCategory] = useState("");
  const [Image, setNewImage] = useState("");

  const addhandeler = async () => {
    console.log("add handeler is working")
    try {
      const formData = new FormData();
      formData.append("newCategory", newCategory);
      formData.append("Image", Image);
      let response = await fetch("http://localhost:3000/supplyers", {
        method: "POST",
        body: formData

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

    </div>
  );
};

export default SuppliersAdmin;

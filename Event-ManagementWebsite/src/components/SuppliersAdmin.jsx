import React, { useState } from "react";
import "../css/SuppliersAdmin.css";

const SuppliersAdmin = () => {

  const [newCategory, setNewCategory] = useState("");
  const [Image, setNewImage] = useState("");
  const [designername, setdesignername] = useState("");
  const [location, setlocation] = useState("")
  const [images, setimages] = useState("")

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

  let trandingchange = async () => {
    try {

      if (!designername || !location || !images) {
        alert("All fields required")
        return
      }

      let formdata = new FormData()
      formdata.append("designername", designername)
      formdata.append("location", location)
      formdata.append("images", images)

      const response = await fetch("http://localhost:3000/trending", {
        method: "POST",
        body: formdata
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const resdata = await response.json()
      console.log(resdata)

    } catch (error) {
      console.log(error, "server is not working")
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

      <div className="card-list-section">

        <h3 className="section-title">Trending Designers</h3>

        {/* CARD 1 */}
        <div className="admin-card">

          {/* <div className="admin-card-image">
      <img src="/placeholder.jpg" alt="preview" />
    </div> */}

          <div className="admin-card-fields">

            <input
              value={designername}
              onChange={(e) => setdesignername(e.target.value)}
              type="text"
              placeholder="Edit Designer Name"
            />

            <input
              value={location}
              onChange={(e) => setlocation(e.target.value)}

              type="text"
              placeholder="Edit Description / Location"
            />

            <label className="upload-btn">
              Change Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setimages(e.target.files[0])}
              />
            </label>

            <div className="admin-card-actions">
              <button onClick={trandingchange} className="update-btn">Update</button>
              <button className="delete-btn">Delete</button>
            </div>

          </div>

        </div>


        <h3 className="section-title second">Popular Photographers / Videographers</h3>

        {/* CARD 2 */}
        <div className="admin-card">

          {/* <div className="admin-card-image">
      <img src="/placeholder.jpg" alt="preview" />
    </div> */}

          <div className="admin-card-fields">

            <input
              type="text"
              placeholder="Edit Photographer/Videographer Name"
            />

            <input
              type="text"
              placeholder="Edit Description / Location"
            />

            <label className="upload-btn">
              Change Image
              <input
                type="file"
                hidden
                accept="image/*"
              />
            </label>

            <div className="admin-card-actions">
              <button className="update-btn">Update</button>
              <button className="delete-btn">Delete</button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SuppliersAdmin;

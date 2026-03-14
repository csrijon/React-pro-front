import React, { useState } from "react";
import "../css/HomeAdmin.css";

const HomeAdmin = () => {
  const [locations] = useState(["Delhi", "Mumbai", "Bangalore"]);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoimage, setVideoImage] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);

  let handleAddVideo = async () => {
    try {
      const formData = new FormData();
      formData.append("title", videoTitle);

      formData.append("videoimage", videoimage);

      let response = await fetch("http://localhost:3000/featuredvideo", {
        method: "POST",
        body: formData
      });
      let data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

  let handelcategoryadd = async () => {
    try {
      const formData = new FormData();
      formData.append("categoryName", categoryName);
      formData.append("categoryImage", categoryImage);

      let response = await fetch("http://localhost:3000/addcategory", {
        method: "POST",
        body: formData
      });

      let data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="admin-wrappers">
      {/* ================= HERO SECTION ================= */}
      <div className="admin-headers">
        <h2>Hero Section</h2>
        <button className="save-btns">Save Changes</button>
      </div>

      <div className="fields">

        <div className="admin-cards">
          <h3>Locations</h3>

          <div className="add-rows">
            <input placeholder="Add location" />
            <button>Add</button>
          </div>

          <div className="pill-groups">
            {locations.map((l, i) => (
              <span className="pills" key={i}>
                {l} <button>×</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================= BROWSE BY CATEGORY ================= */}
      <div className="admin-headers">
        <h2>Browse by Category</h2>
      </div>

      <div className="admin-cards">
        <h3>Add Category Card</h3>

        <div className="add-rows">
          <input placeholder="Category name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
          <label className="upload-btns">
            Upload Image
            <input type="file" accept="image/*" onChange={(e) => setCategoryImage(e.target.files[0])} hidden />
          </label>
          <button onClick={handelcategoryadd}>Add</button>
        </div>

        <div className="card-lists">
        </div>
      </div>

      {/* ================= POPULAR VENUE ================= */}
      <div className="admin-headers">
        <h2>Popular Venue</h2>
      </div>

      <div className="admin-cards">
        <h3>Add Venue Card</h3>

        <div className="add-rows">
          <input placeholder="Venue name / City" />
          <label className="upload-btns">
            Upload Image
            <input type="file" hidden />
          </label>
          <button>Add</button>
        </div>

        <div className="card-lists">
          <div className="card-items">
            <img loading="lazy" src="/placeholder.jpg" alt="venue" />
            <input defaultValue="Dubai" />
            <div className="actions">
              <label className="icon-btn">
                Change Image
                <input type="file" hidden />
              </label>
              <button className="remove-btns">×</button>
            </div>
          </div>
        </div>
      </div>
      {/* ================= FEATURED VIDEOS ================= */}
      <div className="admin-headers">
        <h2>Featured Videos</h2>
      </div>

      <div className="admin-cards">
        <h3>Add Featured Video</h3>

        <div className="add-row">
          <input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Video title" />
          <input placeholder="Short description" />

          <label className="upload-btns">
            Upload Thumbnail
            <input type="file" onChange={(e) => setVideoImage(e.target.files[0])} accept="image/*" hidden />
          </label>

          <button onClick={handleAddVideo}>Add</button>
        </div>

        <div className="card-lists">

          <div className="card-items">
          </div>

          {/* CARD 2 */}
          <div className="card-items">
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;

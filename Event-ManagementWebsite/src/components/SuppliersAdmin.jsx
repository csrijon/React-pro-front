import React, { useState } from "react";
import "../css/SuppliersAdmin.css";

const SuppliersAdmin = () => {

  const [newCategory, setNewCategory] = useState("");
  const [Image, setNewImage] = useState("");
  const [designername, setdesignername] = useState("");
  const [location, setlocation] = useState("")
  const [images, setimages] = useState("")
  const [popular, setpopular] = useState("")
  const [poplocation, setpoplocation] = useState("")
  const [popimage, setpopimages] = useState("")
  const [videoname, setvideoname] = useState("")
  const [videolocation, setvideolocation] = useState("")
  const [videoimage, setvideoimage] = useState("")


  const handelvideophotographer = async () => {
    try {
      const formdata = new FormData()
      formdata.append("videoname", videoname)
      formdata.append("videolocation", videolocation)
      formdata.append("videoimage", videoimage)

      let response = await fetch("http://localhost:3000/videophotographer", {
        method: "POST",
        body: formdata
      })

      let data = await response.json()
      console.log(data)
    } catch (error) {
      console.log(error, "video photographer handeler is not working")
    }

    console.log("video photographer handeler is working")
  }

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

  let popularchange = async () => {
    try {
      const formdata = new FormData()
      formdata.append("popular", popular)
      formdata.append("poplocation", poplocation)
      formdata.append("popimage", popimage)

      let popresponse = await fetch("http://localhost:3000/popvenue", {
        method: "POST",
        body: formdata
      })
      let popdata = await popresponse.json()
      console.log(popdata)
    } catch (error) {
      console.log(error, "data sending process is not working")
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

        <div className="admin-card">

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


        <h3 className="section-title second">Popular venue</h3>

        <div className="admin-card">

          <div className="admin-card-fields">

            <input
              type="text"
              value={popular}
              placeholder="Edit Photographer/Videographer Name"
              onChange={(e) => setpopular(e.target.value)}
            />

            <input
              value={poplocation}
              type="text"
              placeholder="Edit Description / Location"
              onChange={(e) => setpoplocation(e.target.value)}
            />

            <label className="upload-btn">
              Change Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setpopimages(e.target.files[0])}
              />
            </label>

            <div className="admin-card-actions">
              <button onClick={popularchange} className="update-btn">Update</button>
              <button className="delete-btn">Delete</button>
            </div>

          </div>

        </div>


        {/* NEW SECTION */}
        <h3 className="section-title second">Popular Video & Photographer</h3>

        <div className="admin-card">

          <div className="admin-card-fields">

            <input
              type="text"
              placeholder="Edit Video/Photographer Name"
              value={videoname}
              onChange={(e) => setvideoname(e.target.value)}
            />

            <input
              type="text"
              placeholder="Edit Description / Location"
              value={videolocation}
              onChange={(e) => setvideolocation(e.target.value)}
            />

            <label className="upload-btn">
              Change Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setvideoimage(e.target.files[0])}
              />
            </label>

            <div className="admin-card-actions">
              <button onClick={handelvideophotographer} className="update-btn">Update</button>
              <button className="delete-btn">Delete</button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SuppliersAdmin;
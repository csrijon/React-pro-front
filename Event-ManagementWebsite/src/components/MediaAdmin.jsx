import React, { useState } from "react";
import "../css/MediaAdmin.css";

const MediaAdmin = () => {

  const [heading, setheading] = useState("")
  const [discreption, setdiscreption] = useState("")
  const [image, setimage] = useState("")

  const Addmediabutton = async () => {

    try {
      const formdata = new FormData()
      formdata.append("heading", heading)
      formdata.append("discreption", discreption)
      formdata.append("image", image)
      let response = await fetch("http://localhost:3000/Addmedia", {
        method: "PUT",
        body: formdata
      })
      let resdata = await response.json()
      setheading("")
      setdiscreption("")
      console.log(resdata)
    } catch (error) {
      console.log(error, "this the error reason i dont know")
    }
  }
  return (
    <div className="admin-wrapper">
      {/* HEADER */}
      <div className="admin-header">
        <h2>Media Section</h2>
        <button className="save-btn">Save Changes</button>
      </div>

      {/* SECTION SETTINGS */}
      {/* <div className="admin-card">
        <h3>Section Settings</h3>

        <div className="form-group">
          <label>Section Title</label>
          <input type="text" placeholder="Latest Media" />
        </div>

        <div className="form-group">
          <label>Total Count Number</label>
          <input type="text" placeholder="23" />
        </div>
      </div> */}

      {/* ADD NEW MEDIA */}
      <div className="admin-card">
        <h3>Add New Media Card</h3>

        <div className="add-row">
          <input value={heading} onChange={(e) => setheading(e.target.value)
          } type="text" placeholder="Heading" />
          <input type="text" value={discreption} onChange={(e) => setdiscreption(e.target.value)} placeholder="Short description" />

          <label className="upload-btn">
            Upload Image
            <input accept="image/*" onChange={(e) => setimage(e.target.files[0])} type="file" hidden />
          </label>

          <button onClick={Addmediabutton} >Add</button>
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

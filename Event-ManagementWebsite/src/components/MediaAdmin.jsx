import React, { useState, useEffect } from "react";
import "../css/MediaAdmin.css";

const MediaAdmin = () => {

  const [heading, setheading] = useState("")
  const [discreption, setdiscreption] = useState("")
  const [image, setimage] = useState("")
  const [mediadata, setmediadata] = useState([])

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
  let removemedia = async (id) => {
    let removemedia = await fetch(`http://localhost:3000/mediadelete/${id}`,{
      method:"DELETE"
    })
    let mediares = await removemedia.json()
    let mediafilterdata = mediadata.filter(item=>item._id !==id)
    setmediadata(mediafilterdata)
    console.log(mediares)
  }

  useEffect(() => {
    let getmediadata = async () => {
      let getmediadata = await fetch("http://localhost:3000/fetchmedia")
      let mediaresponse = await getmediadata.json()
      setmediadata(mediaresponse)
      console.log(mediaresponse)
    }
    getmediadata()
  }, [])


  return (
   <div className="mediaX-wrapper">

  {/* HEADER */}
  <div className="mediaX-header">
    <h2>Media Section</h2>
    <button className="mediaX-saveBtn">Save Changes</button>
  </div>

  {/* ADD NEW MEDIA */}
  <div className="mediaX-card">
    <h3>Add New Media Card</h3>

    <div className="mediaX-addRow">
      <input
        value={heading}
        onChange={(e) => setheading(e.target.value)}
        type="text"
        placeholder="Heading"
      />

      <input
        type="text"
        value={discreption}
        onChange={(e) => setdiscreption(e.target.value)}
        placeholder="Short description"
      />

      <label className="mediaX-upload">
        Upload Image
        <input
          accept="image/*"
          onChange={(e) => setimage(e.target.files[0])}
          type="file"
          hidden
        />
      </label>

      <button onClick={Addmediabutton}>Add</button>
    </div>
  </div>

  {/* EXISTING MEDIA LIST */}
  <div className="mediaX-card">
    <h3>Media Cards</h3>

    <div className="mediaX-list">
      {
        mediadata.map((item, index) => (
          <div key={index} className="mediaX-item">

            <img loading="lazy" src={item.image} alt="media" />

            <div className="mediaX-fields">
              <p>{item.heading}</p>
              <p>{item.discreption}</p>
            </div>

            <div className="mediaX-actions">
              <button
                onClick={() => removemedia(item._id)}
                className="mediaX-removeBtn"
              >
                ×
              </button>
            </div>

          </div>
        ))
      }
    </div>

  </div>

</div>
  );
};

export default MediaAdmin;

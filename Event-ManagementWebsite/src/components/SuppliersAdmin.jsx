import React, { useState, useEffect } from "react";
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
  const [supplydata, setsupplydata] = useState([])
  const [trenddata, settrenddata] = useState([])
  const [populardata, setpopulardata] = useState([])
  const [photovideo, setphotovideo] = useState([])

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

  let deletesupplycard = async (id) => {
    console.log(id)
    let senddelete = await fetch(`http://localhost:3000/deletesupply/${id}`, {
      method: "DELETE"
    })
    let responsedelete = await senddelete.json()
    let filterdelete = supplydata.filter((item) => item._id !== id)
    setsupplydata(filterdelete)
    console.log(responsedelete)
  }
  let removetrendcard = async (id) => {
    let removetrend = await fetch(`http://localhost:3000/apitrending/${id}`, {
      method: "DELETE"
    })
    let removetrendresponse = await removetrend.json()
    let filtertrenddata = trenddata.filter(item => item._id !== id)
    settrenddata(filtertrenddata)
    console.log(removetrendresponse)
  }
  let removepopularcard = async (id) => {
    let removeidsend = await fetch(`http://localhost:3000/removepopular/${id}`, {
      method: "DELETE"
    })
    let getremoveid = await removeidsend.json()
    let filterpopulardata = populardata.filter(item => item._id !== id)
    setpopulardata(filterpopulardata)
    console.log(getremoveid)
  }
  let removephotovideo = async (id) => {
    let removepv = await fetch(`http://localhost:3000/pvdeleted/${id}`,{
      method:"DELETE"
    })
    let pvresponse = await removepv.json()
    let pvfilter = photovideo.filter(item=>item._id!==id)
    setphotovideo(pvfilter)
    console.log(pvresponse)
  }

  useEffect(() => {
    let fetchsupplydata = async () => {
      let getsupplydata = await fetch("http://localhost:3000/supplyers")
      let resgetsupplydata = await getsupplydata.json()
      setsupplydata(resgetsupplydata)
    }
    fetchsupplydata()

    let fetchtrenddata = async () => {
      let getrenddata = await fetch("http://localhost:3000/api/fetchtreding")
      let responsetrend = await getrenddata.json()
      settrenddata(responsetrend)
      console.log(responsetrend)
    }
    fetchtrenddata()

    let fetchpopulardata = async () => {
      let getpopulardata = await fetch("http://localhost:3000/api/fetchvenu")
      let getresponse = await getpopulardata.json()
      setpopulardata(getresponse)
      console.log(getresponse)
    }
    fetchpopulardata()

    let fetchphotovideo = async () => {
      let getphotovideo = await fetch("http://localhost:3000/apivideophotographer")
      let photovideoresponse = await getphotovideo.json()
      setphotovideo(photovideoresponse)
      console.log(photovideoresponse)
    }
    fetchphotovideo()
  }, [])


  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h2>Suppliers Categories</h2>
      </div>
      <div className="admin-category">
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
        <div className="card-container">
          {
            supplydata.map((item, index) => (
              <div key={index} className="card">

                {/* Remove Button */}
                <button onClick={() => deletesupplycard(item._id)} className="remove-btnes">×</button>

                <img src={item.Image} alt="category" />
                <h3>{item.title}</h3>

              </div>
            ))
          }


        </div>

      </div>

      <div className="card-list-section">

        <h3 className="section-titles">Trending Designers</h3>

        <div className="admin-card-trend">

          {/* Top Form */}
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
              <button onClick={trandingchange} className="update-btn">
                Add
              </button>
            </div>

          </div>

          {/* 👇 Cards Row (Add button er niche) */}
          <div className="admin-card-display">

            {
              trenddata.map((item, index) => (
                <div key={index} className="card">

                  <button onClick={() => removetrendcard(item._id)} className="remove-btnes">×</button>

                  <img src={item.image} alt="designer" />
                  <h3>{item.designername}</h3>
                  <p>{item.location}</p>

                </div>
              ))
            }

          </div>

        </div>


        <h3 className="section-title second">Popular venue</h3>
        <div className="admin-card-popular">

          {/* Form Section */}
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
              <button onClick={popularchange} className="update-btn">
                ADD
              </button>
            </div>

          </div>

          {/* 👇 Cards Section (ADD button er niche) */}
          <div className="admin-card-display">

            {
              populardata.map((item, index) => (
                <div key={index} className="card">

                  {/* Remove Button */}
                  <button onClick={() => removepopularcard(item._id)} className="remove-btnes">×</button>

                  <img src={item.image} alt="popular" />
                  <h3>{item.venuename}</h3>
                  <p>{item.location}</p>

                </div>
              ))
            }

          </div>

        </div>


        {/* NEW SECTION */}
        <h3 className="section-title second">Popular Video & Photographer</h3>

        <div className="admin-card-imgesvideo">

          {/* Form Section */}
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
              <button onClick={handelvideophotographer} className="update-btn">
                ADD
              </button>
            </div>

          </div>

          {/* 👇 Cards Section */}
          <div className="admin-card-display">

            {
              photovideo.map((item, index) => (
                <div key={index} className="card">

                  {/* Remove Button */}
                  <button onClick={() => removephotovideo(item._id)} className="remove-btnes">×</button>

                  <img src={item.videoimage} alt="video" />
                  <h3>{item.videoname}</h3>
                  <p>{item.videolocation}</p>

                </div>
              ))
            }

          </div>

        </div>

      </div>

    </div>
  );
};

export default SuppliersAdmin;
import React, { useState, useEffect } from "react";
import "../css/HomeAdmin.css";
// import data from "../Latestdata"

const HomeAdmin = () => {

  const [videoTitle, setVideoTitle] = useState("");
  const [videoimage, setVideoImage] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [response, setresponse] = useState([])
  // const [indexs,setindexes] = useState(0)

  let handleAddVideo = async () => {
    try {
      const formData = new FormData();
      formData.append("title", videoTitle);

      formData.append("videoimage", videoimage);

      let response = await fetch("https://react-pro-front.onrender.com/featuredvideo", {
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

      let response = await fetch("https://react-pro-front.onrender.com/addcategory", {
        method: "POST",
        body: formData
      });

      let data = await response.json();
      alert("data add successfully")
      console.log(data);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };
 let handeldelete = async (id) => {
  try {
    console.log(id)
    let rsponseid = await fetch(`https://react-pro-front.onrender.com/deletecategory/${id}`, {
      method: "DELETE"
    });

    let delresponse = await rsponseid.json();
    console.log(delresponse);
      let filternewdata = response.filter(item=>
        item._id!==id
      )
      setresponse(filternewdata)
      alert("data delete successfully")

  } catch (error) {
    console.log("data is not fetch", error);
  }
};


  useEffect(() => {
    let showinguidata = async () => {
      try {
        let res = await fetch("https://react-pro-front.onrender.com/api/fetbrowcategory")
        let resdatas = await res.json()
        // console.log(resdatas)
        setresponse(resdatas)
      } catch (error) {
        console.log("data is missing", error)
      }
    }
    showinguidata()
  }, [])


  return (
    <div className="admin-wrapper-hero">

      {/* ================= Feature Categories ================= */}
      <div className="admin-header-hero">
        <h2>Browse by Category</h2>
      </div>

      <div className="admin-card-hero">
        <h3>Add Category Card</h3>

        <div className="add-row-hero">
          <input placeholder="Category name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
          <label className="upload-btns-hero">
            Upload Image
            <input type="file" accept="image/*" onChange={(e) => setCategoryImage(e.target.files[0])} hidden />
          </label>
          <button onClick={handelcategoryadd}>Add</button>
        </div>

        <div className="card-list-hero">
          <div className="admin-card-lists-hero">
            {response.map((cat, _id) => (
              <div className="admin-card-item-hero" key={_id}>

                <button onClick={()=>handeldelete(cat._id)} className="admin-delete-btn-hero">
                  ✕
                </button>

                <img className="admin-card-img-hero" src={cat.Image} alt="category" />
                <p className="admin-card-text-hero">{cat.title}</p>

              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ================= FEATURED VIDEOS ================= */}
      <div className="admin-header-hero">
        <h2>Featured Videos</h2>
      </div>

      <div className="admin-card-hero">
        <h3>Add Featured Video</h3>

        <div className="add-row-hero">
          <input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Video title" />
          <input placeholder="Short description" />

          <label className="upload-btns-hero">
            Upload Thumbnail
            <input type="file" onChange={(e) => setVideoImage(e.target.files[0])} accept="image/*" hidden />
          </label>

          <button onClick={handleAddVideo}>Add</button>
        </div>

        <div className="card-list-hero">

          <div className="card-items-hero">
          </div>

          {/* CARD 2 */}
          <div className="card-items-hero">
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;

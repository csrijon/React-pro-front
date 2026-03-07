import React, { useState } from "react";
import "../css/AboutAdmin.css";

const AboutAdmin = () => {

  // ===== MAIN ABOUT STATE =====
  const [title, setTitle] = useState("");
  const [para1, setPara1] = useState("");
  const [para2, setPara2] = useState("");
  const [mainImage, setMainImage] = useState(null);

  let handleMainAdd = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("para1", para1);
      formData.append("para2", para2);
      formData.append("mainImage", mainImage);

      let response = await fetch("http://localhost:3000/addaboutmain", {
        method: "POST",
        body: formData

      });
      let data = await response.json();
      console.log(data);
    }
    catch (error) {
      console.error("Error adding main about section:", error);
    }
  }
  // ===== STATS STATE =====
  const [stats, setStats] = useState([
    { number: "", label: "" },
    { number: "", label: "" },
    { number: "", label: "" },
    { number: "", label: "" }
  ]);

    const handleStatsAdd =async () => {
    // console.log("Stats:", stats);
    try {
      let response = await fetch("http://localhost:3000/addaboutstats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ stats })
      });
      let data = await response.json();
      console.log(data);

    } catch (error) {
      console.error("Error adding stats:", error);
    }
  };

  // ===== BLOCK 1 =====
  const [block1Title, setBlock1Title] = useState("");
  const [block1Para1, setBlock1Para1] = useState("");
  const [block1Para2, setBlock1Para2] = useState("");
  const [block1Image, setBlock1Image] = useState(null);

  // ===== BLOCK 2 =====
  const [block2Title, setBlock2Title] = useState("");
  const [block2Para1, setBlock2Para1] = useState("");
  const [block2Para2, setBlock2Para2] = useState("");
  const [block2Image, setBlock2Image] = useState(null);


  // ===== HANDLERS =====




  const handleBlock1Add = () => {
    console.log("Block1:", block1Title, block1Para1, block1Para2, block1Image);
  };

  const handleBlock2Add = () => {
    console.log("Block2:", block2Title, block2Para1, block2Para2, block2Image);
  };

  const handleStatsChange = (index, field, value) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };

  return (
    <div className="admin-wrapper">

      {/* HEADER */}
      <div className="admin-header">
        <h2>About Page Content</h2>
      </div>

      {/* ================= MAIN ABOUT SECTION ================= */}
      <div className="admin-card">

        <h3>Main About Section</h3>

        <div className="form-group">
          <label>Section Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Paragraph 1</label>
          <textarea
            rows="4"
            value={para1}
            onChange={(e) => setPara1(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Paragraph 2</label>
          <textarea
            rows="4"
            value={para2}
            onChange={(e) => setPara2(e.target.value)}
          />
        </div>

        <label className="upload-btn">
          Upload Main Image
          <input
            type="file"
            hidden
            onChange={(e) => setMainImage(e.target.files[0])}
          />
        </label>

        <button className="save-btn" onClick={handleMainAdd}>
          Add Main Section
        </button>

      </div>


      {/* ================= STATS ================= */}
      <div className="admin-card">

        <h3>Statistics</h3>

        <div className="stats-grid">

          {stats.map((item, index) => (
            <div className="stat-item" key={index}>

              <input
                type="text"
                placeholder="Number"
                value={item.number}
                onChange={(e) =>
                  handleStatsChange(index, "number", e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Label"
                value={item.label}
                onChange={(e) =>
                  handleStatsChange(index, "label", e.target.value)
                }
              />

            </div>
          ))}

        </div>

        <button className="save-btn" onClick={handleStatsAdd}>
          Add Statistics
        </button>

      </div>


      {/* ================= BLOCK 1 ================= */}
      <div className="admin-card">

        <h3>Block 1 – What We Offer</h3>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={block1Title}
            onChange={(e) => setBlock1Title(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Paragraph 1</label>
          <textarea
            rows="4"
            value={block1Para1}
            onChange={(e) => setBlock1Para1(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Paragraph 2</label>
          <textarea
            rows="4"
            value={block1Para2}
            onChange={(e) => setBlock1Para2(e.target.value)}
          />
        </div>

        <label className="upload-btn">
          Upload Block Image
          <input
            type="file"
            hidden
            onChange={(e) => setBlock1Image(e.target.files[0])}
          />
        </label>

        <button className="save-btn" onClick={handleBlock1Add}>
          Add Block 1
        </button>

      </div>


      {/* ================= BLOCK 2 ================= */}
      <div className="admin-card">

        <h3>Block 2 – Who We Are</h3>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={block2Title}
            onChange={(e) => setBlock2Title(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Paragraph 1</label>
          <textarea
            rows="4"
            value={block2Para1}
            onChange={(e) => setBlock2Para1(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Paragraph 2</label>
          <textarea
            rows="4"
            value={block2Para2}
            onChange={(e) => setBlock2Para2(e.target.value)}
          />
        </div>

        <label className="upload-btn">
          Upload Block Image
          <input
            type="file"
            hidden
            onChange={(e) => setBlock2Image(e.target.files[0])}
          />
        </label>

        <button className="save-btn" onClick={handleBlock2Add}>
          Add Block 2
        </button>

      </div>

    </div>
  );
};

export default AboutAdmin;
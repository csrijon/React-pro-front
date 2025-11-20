import React, { useState } from "react";
import "../css/VisionStep.css";

// MUI Icons
import WeekendIcon from "@mui/icons-material/Weekend";      // Living room
import BedIcon from "@mui/icons-material/Bed";              // Bedroom
import RestaurantIcon from "@mui/icons-material/Restaurant"; // Dining room
import EditIcon from "@mui/icons-material/Edit";

export default function VisionStep() {
  const [selectedTab, setSelectedTab] = useState("living");
  const [selectedType, setSelectedType] = useState("Minimalist");
  const [role, setRole] = useState("homeowner");

  const roomTabs = [
    { id: "living", label: "Living Room", icon: <WeekendIcon /> },
    { id: "bed", label: "Bedroom", icon: <BedIcon /> },
    { id: "dining", label: "Dining Room", icon: <RestaurantIcon /> },
  ];

  const roomTypes = ["Minimalist", "Luxury", "Industrial", "Modern"];

  return (
    <section className="vision-section">
      <div className="vision-container">
        {/* top row */}
        <div className="vision-header">
          <div>
            <p className="vision-step">Step 3/4</p>
            <h1 className="vision-title">Tell Us Your Vision</h1>

            <div className="vision-tabs">
              {roomTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={
                    "vision-tab" +
                    (selectedTab === tab.id ? " vision-tab-active" : "")
                  }
                  onClick={() => setSelectedTab(tab.id)}
                >
                  <div className="vision-tab-icon">{tab.icon}</div>
                  <p>{tab.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* preview image */}
          <div className="vision-preview-box">
            <img
              src="https://images.pexels.com/photos/6585741/pexels-photo-6585741.jpeg"
              alt="Preview"
            />
          </div>
        </div>

        {/* bottom content */}
        <div className="vision-content-card">
          <div className="vision-grid">
            {/* LEFT SIDE */}
            <div className="vision-left">
              <div className="vision-row">
                {/* room type */}
                <div className="vision-field">
                  <p className="vision-label">What type a room this?</p>
                  <div className="vision-select-toggle">
                    <button
                      className={
                        "vision-toggle-button" +
                        (role === "homeowner" ? " active" : "")
                      }
                      onClick={() => setRole("homeowner")}
                    >
                      Decorator & Hoteler
                    </button>
                    <button
                      className={
                        "vision-toggle-button" +
                        (role === "decorator" ? " active" : "")
                      }
                      onClick={() => setRole("decorator")}
                    >
                      A rouge
                    </button>
                  </div>
                </div>

                {/* style & budget */}
                <div className="vision-field">
                  <p className="vision-label">Choose a style & budget</p>

                  <div className="vision-input-box">
                    <select className="vision-input-select">
                      <option>$5,000 – $51,000</option>
                    </select>
                    <EditIcon className="edit-icon" />
                  </div>

                  <div className="vision-input-box">
                    <select className="vision-input-select">
                      <option>$5,000 – $51,000</option>
                    </select>
                    <EditIcon className="edit-icon" />
                  </div>
                </div>
              </div>

              {/* room types pills */}
              <div className="vision-types">
                {roomTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={
                      "vision-type-pill" +
                      (selectedType === type ? " active-pill" : "")
                    }
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Pick colors & materials */}
              <p className="vision-label">Pick colors & materials</p>

              <div className="vision-colors-row">
                <div className="vision-color-image">
                  <img
                    src="https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg"
                    alt="color"
                  />
                </div>

                <div className="vision-color-palette">
                  <span className="color-box c1"></span>
                  <span className="color-box c2"></span>
                  <span className="color-box c3"></span>
                  <span className="color-box c4"></span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="vision-right">
              <div className="vision-prompt-area">
                <h4>AI Prompt Preview</h4>
                <p>
                  Lorem ipsum odor amet, consectetuer adipiscing elit. Tincidunt
                  nisl lorem cras nulla malesuada maximus torquent sed. Sed
                  fermentum est...
                </p>
              </div>

              <div className="vision-field">
                <p className="vision-label">Favorite Brands</p>
                <input
                  type="text"
                  placeholder="Your favorite brand..."
                  className="vision-input-text"
                />
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="vision-btn-row">
            <button className="vision-btn-primary">Generate Designs</button>
          </div>
        </div>
      </div>
    </section>
  );
}

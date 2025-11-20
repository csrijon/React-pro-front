import React from "react";
import "../css/VisionFooter.css";

// MUI Icons
import BrushIcon from "@mui/icons-material/Brush";
import HotelIcon from "@mui/icons-material/Hotel";
import FactoryIcon from "@mui/icons-material/Factory";
import EditIcon from "@mui/icons-material/Edit";

const VisionFooter = () => {
    return (
        <section className="vision-footer-section">

            <div className="left-section">
                <p className="section-title">What type a room this?</p>

                <div className="tag-row">
                    <div className="green-tag"></div>
                    <p className="tag-text">Boeroxre Foritger</p>
                    <button className="blue-small-btn">A tinapu</button>
                </div>

                <div className="room-style-grid">
                    <div className="style-card">
                        <BrushIcon className="style-icon" />
                        <span>Minimalist</span>
                    </div>

                    <div className="style-card">
                        <HotelIcon className="style-icon" />
                        <span>Luxury</span>
                    </div>

                    <div className="style-card">
                        <HotelIcon className="style-icon" />
                        <span>Luxury</span>
                    </div>

                    <div className="style-card">
                        <FactoryIcon className="style-icon" />
                        <span>Industrial</span>
                    </div>
                </div>

                <p className="section-title" style={{ marginTop: "30px" }}>
                    Pick colors & materials
                </p>
            </div>

            {/* <div className="right-section">
                <p className="section-title">Choose a style & budget</p>

                <div className="input-row">
                    <input className="input-class" type="text" defaultValue="$5,000 - $51,000" />
                    <EditIcon className="edit-icon" />
                </div>

                <div className="input-row">
                    <input className="input-class" type="text" defaultValue="$5,000 - $51,000" />
                    <EditIcon className="edit-icon" />
                </div> */}

                <div className="color-dot-row">
                    <span className="dot black"></span>
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot blue"></span>
                    <span className="dot grey"></span>
                    <span className="dot lightgrey"></span>
                    <span className="dot white"></span>
                </div>
            {/* </div> */}

        </section>
    );
};

export default VisionFooter;

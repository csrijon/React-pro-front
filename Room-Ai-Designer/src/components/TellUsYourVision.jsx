import React from "react";
import "../css/TellUsYourVision.css";;
import previewImg from "../assets/heroimage.png";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import HotelIcon from "@mui/icons-material/Hotel";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import VisionFooter from "../components/VisionFooter.jsx";
import Visionimage from "./VisionImage.jsx";

const TellUsYourVision = () => {
  return (
    <>
    <section className="vision-section">
<div className="vision-container">
    <div className="vision-left">
        <h2>Tell Us Your Vision</h2>

        <div className="room-card-container">
          <div className="room-card">
            <MeetingRoomIcon className="room-icon" />
            <span>Living Room</span>
          </div>

          <div className="room-card">
            <HotelIcon className="room-icon" />
            <span>Bedroom</span>
          </div>

          <div className="room-card">
            <RestaurantIcon className="room-icon" />
            <span>Dining Room</span>
          </div>
        </div>
      </div>

      <div className="vision-right">
        <div className="vision-preview-box">
          <img src={previewImg} alt="Room Preview" className="preview-image" />
        </div>
      </div>
</div>
    </section>
    <div className="vision-footer-box">
    <VisionFooter/>
    <Visionimage/>
</div>
</>
  );
};

export default TellUsYourVision;

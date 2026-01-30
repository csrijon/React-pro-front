import React from "react";
import fifthimages from "../assets/fifthimages.jpg"

const VenueCard = ({ city }) => {
  return (
    <div className="venue-card">
      <div className="venue-image">
        <img
          src={fifthimages}
          alt="venue"
        />
        <span className="explore-btn">Explore</span>
      </div>

      <p className="venue-title">
        LOREM IPSUM RESORT, <strong>{city}</strong>
      </p>

      <p className="venue-rating">
        ★★★★★ <span>(22)</span>
      </p>

      <p className="venue-guests">Upto 500 Guests</p>
    </div>
  );
};

export default VenueCard;
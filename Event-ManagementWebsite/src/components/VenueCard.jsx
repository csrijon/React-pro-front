import React from "react";
import fifthimages from "../assets/fifthimages.jpg"

const VenueCard = ({city}) => {
 
  return (
    <div className="venue-card">
      <div className="venue-image">
        <img
      src={fifthimages} alt="hello"
        />
        <span className="explore-btn">Explore</span>
      </div>

      <p className="venue-title">
       hello <strong>goa</strong>
      </p>

      <p className="venue-rating">
        ★★★★★ <span>3.5</span>
      </p>

      <p className="venue-guests">Upto {city} Guests</p>
    </div>
  );
};

export default VenueCard;
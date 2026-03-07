import React from "react";

const VenueCard = ({city, designernames, image}) => {
 
  return (
    <div className="venue-card">
      <div className="venue-image">
        <img
      src={image} alt={designernames}
        />
        <span className="explore-btn">Explore</span>
      </div>

      <p className="venue-title">
        <strong>{designernames}</strong>
      </p>

      <p className="venue-rating">
        ★★★★★ <span>3.5</span>
      </p>

      <p className="venue-guests">Upto {city} Guests</p>
    </div>
  );
};

export default VenueCard;
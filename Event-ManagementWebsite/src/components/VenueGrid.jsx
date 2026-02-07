import React, { useState, useEffect } from "react";
import Topsection from "../ui/Topsection";
import "../css/venue.css";

const VenueGrid = ({ title, number}) => {
  const [venueinfo, setvenueinfo] = useState([]);

  useEffect(() => {
    const venudata = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/venue");
        const data = await response.json();
        console.log(data);
        setvenueinfo(data);
      } catch (error) {
        console.log(error);
      }
    };

    venudata();
  }, []);

  return (
    <section className="wedding-section">
      <div className="container">
        <Topsection title={title} number={number} />

        <div className="venue-grid">
          {venueinfo.map((item) => (
            <div className="venue-card" key={item._id}>
              <div className="venue-image">
                <img
                  src={item.image}
                  alt={item.venueTitle}
                />
                <span className="explore-btn">Explore</span>
              </div>

              <p className="venue-title">
                {item.venueTitle} <strong>{item.location}</strong>
              </p>

              <p className="venue-rating">⭐ {item.rating}</p>

              <p className="venue-guests">
                Upto {item.guests} Guests
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VenueGrid;

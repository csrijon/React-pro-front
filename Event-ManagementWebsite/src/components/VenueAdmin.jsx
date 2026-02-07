import React, { useState } from "react";
import "../css/VenueAdmin.css";

const VenueAdmin = () => {
  const [venueTitle, setVenueTitle] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [guests, setGuests] = useState("");
  const [image, setImage] = useState(null);

  const handleAddVenue = async () => {
    try {
      const formdata = new FormData();
      formdata.append("venueTitle", venueTitle);
      formdata.append("location", location);
      formdata.append("rating", rating);
      formdata.append("guests", guests);
      formdata.append("image", image);

      let response = await fetch("http://localhost:3000/venueadd", {
        method: "POST",
        body: formdata
      })
      let data = await response.json()
      console.log(data)

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="admin-wrapper">
      {/* HEADER */}
      <div className="admin-header">
        <h2>Venue Section</h2>
      </div>

      {/* ADD VENUE UI */}
      <div className="admin-card">
        <h3>Add Venue</h3>

        <div className="add-row">
          <input type="text" placeholder="Venue Title" value={venueTitle} onChange={(e) => { setVenueTitle(e.target.value); console.log(e.target.value) }} />
          <input type="text" placeholder="Location (e.g. Dubai, UAE)" value={location} onChange={(e) => { setLocation(e.target.value) }} />
          <input type="number" placeholder="Rating (e.g. 4.5)" value={rating} onChange={(e) => { setRating(e.target.value) }} />
          <input type="text" placeholder="Guests (e.g. 300–500)" value={guests} onChange={(e) => { setGuests(e.target.value) }} />

          <label className="upload-btn">
            Upload Image
            <input type="file" accept="image/*" hidden onChange={(e) => {
              let imageinput = e.target.files[0];
              console.log(imageinput);
              setImage(imageinput);
            }} />
          </label>

          <button onClick={handleAddVenue}>Add</button>
        </div>
      </div>

      {/* VENUE LIST UI */}
      <div className="admin-card">
        <h3>Venues List</h3>

        <div className="venue-admin-list">
          <div className="venue-admin-item">
            <img src="/placeholder.jpg" alt="venue" />
            <div className="venue-info">
              <p className="venue-title">Grand Palace</p>
              <p className="venue-location">📍 Dubai, UAE</p>
              <p className="venue-rating">⭐ 4.8</p>
              <p className="venue-guests">👥 400–600 Guests</p>
            </div>

            <button className="remove-btn">×</button>
          </div>

          <div className="venue-admin-item">
            <img src="/placeholder.jpg" alt="venue" />

            <div className="venue-info">
              <p className="venue-title">Royal Garden</p>
              <p className="venue-location">📍 Abu Dhabi</p>
              <p className="venue-rating">⭐ 4.5</p>
              <p className="venue-guests">👥 250–400 Guests</p>
            </div>

            <button className="remove-btn">×</button>
          </div>

          <div className="venue-admin-item">
            <img src="/placeholder.jpg" alt="venue" />

            <div className="venue-info">
              <p className="venue-title">City View Hall</p>
              <p className="venue-location">📍 Al Ain</p>
              <p className="venue-rating">⭐ 4.2</p>
              <p className="venue-guests">👥 150–300 Guests</p>
            </div>

            <button className="remove-btn">×</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueAdmin;

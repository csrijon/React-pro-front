import React, { useState, useEffect } from "react";
import "../css/VenueAdmin.css";

const VenueAdmin = () => {
  const [venueTitle, setVenueTitle] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [guests, setGuests] = useState("");
  const [image, setImage] = useState(null);
  const [updateadddata, setupdateadddata] = useState([])

  const handleAddVenue = async () => {
    try {
      const formdata = new FormData();
      formdata.append("venueTitle", venueTitle);
      formdata.append("location", location);
      formdata.append("rating", rating);
      formdata.append("guests", guests);
      formdata.append("image", image);

      let response = await fetch("https://backend-ofevent.onrender.com/venueadd", {
        method: "POST",
        body: formdata
      })
      let data = await response.json()
      console.log(data)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    let getpopulardata = async () => {
      let getdata = await fetch("https://backend-ofevent.onrender.com/api/venue")
      let getresponse = await getdata.json()
      setupdateadddata(getresponse)
      console.log(getresponse)
    }

    getpopulardata()
  }, [])


  return (
    <div className="admin-wrapper-venue">
      {/* HEADER */}
      <div className="admin-header-venue">
        <h2>Venue Section</h2>
      </div>

      {/* ADD VENUE UI */}
      <div className="admin-card-venue">
        <h3>Add Venue</h3>

        <div className="add-row-venue">
          <input type="text" placeholder="Venue Title" value={venueTitle} onChange={(e) => { setVenueTitle(e.target.value); console.log(e.target.value) }} />
          <input type="text" placeholder="Location (e.g. Dubai, UAE)" value={location} onChange={(e) => { setLocation(e.target.value) }} />
          <input type="number" placeholder="Rating (e.g. 4.5)" value={rating} onChange={(e) => { setRating(e.target.value) }} />
          <input type="text" placeholder="Guests (e.g. 300–500)" value={guests} onChange={(e) => { setGuests(e.target.value) }} />

          <label className="upload-btn-venue">
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
      <div className="admin-card-venue">
        <h3>Venues List</h3>

        <div className="venue-admin-list">
          {
            updateadddata.map((item, index) => (
              <div key={index} className="venue-admin-item">
                <img loading="lazy" src={item.image} alt="venue" />

                <div className="venue-info">
                  <p className="venue-title">{item.venueTitle}</p>
                  <p className="venue-location">📍 {item.location}</p>
                  <p className="venue-rating">⭐ {item.rating}</p>
                  <p className="venue-guests">👥 {item.guests} Guests</p>
                </div>

                <button className="remove-btn-venue">×</button>
              </div>
            ))

          }
        </div>
      </div>
    </div>
  );
};

export default VenueAdmin;

import React from "react";
import "../css/filterBar.css";

const FilterBar = () => {
  return (
    <div className="filter-container">
      <div className="container filter-inner ">
      <select className="filter-select">
        <option>No. of Guests</option>
      </select>

      <select className="filter-select">
        <option>Venue Type</option>
      </select>

      <select className="filter-select">
        <option>Space Preference</option>
      </select>

      <select className="filter-select">
        <option>Rating</option>
      </select>

      <button className="search-btn">Search</button>
      </div>
    </div>
  );
};

export default FilterBar;
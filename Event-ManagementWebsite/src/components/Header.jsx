import React from "react";
import "../css/Header.css";
import { NavLink } from "react-router";

const Header = () => {
  return (
    <header className="header">
      <div className="container">   
        <div className="header-inner">
          <div className="left">
            <p>Kites Event</p>
          </div>

          <div className="right">
            <ul>
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/venu">Venue</NavLink></li>
              <li><NavLink to="/Suppliers">Suppliers</NavLink></li>
              <li><NavLink to="/About">About</NavLink></li>
              <li><NavLink to="/Media">Media</NavLink></li>
              <li><NavLink to="/Contact">Contact</NavLink></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
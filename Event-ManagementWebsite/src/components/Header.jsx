import React, { useState } from "react";
import "../css/Header.css";
import { NavLink } from "react-router";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">

          <div className="left">
            <p>Kites Event</p>
          </div>

          {/* Hamburger */}
          <div
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Menu */}
          <div className={`right ${menuOpen ? "show" : ""}`}>
            <ul>
              <li><NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink></li>
              <li><NavLink to="/venu" onClick={() => setMenuOpen(false)}>Venue</NavLink></li>
              <li><NavLink to="/Suppliers" onClick={() => setMenuOpen(false)}>Suppliers</NavLink></li>
              <li><NavLink to="/About" onClick={() => setMenuOpen(false)}>About</NavLink></li>
              <li><NavLink to="/Media" onClick={() => setMenuOpen(false)}>Media</NavLink></li>
              <li><NavLink to="/Contact" onClick={() => setMenuOpen(false)}>Contact</NavLink></li>
            </ul>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;

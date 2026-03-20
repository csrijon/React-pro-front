import "../css/Sidebar.css";
import { NavLink } from "react-router";
import { useState } from "react";

const Sidebar = () => {

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ☰ Menu Button (mobile) */}
      <button className="menu-btn" onClick={() => setOpen(!open)}>
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "active" : ""}`}>
        <h2 className="logo">Dashboard</h2>

        <nav>
          <NavLink to="/admin">Dashboard</NavLink>
          <NavLink to="/admin/home">Home</NavLink>
          <NavLink to="/admin/venu">Venues</NavLink>
          <NavLink to="/admin/supply">Suppliers</NavLink>
          <NavLink to="/admin/aboutadmin">About</NavLink>
          <NavLink to="/admin/mediaadmin">Media</NavLink>
          <NavLink to="/admin/contactadmin">Contact</NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
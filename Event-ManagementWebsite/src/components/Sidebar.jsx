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
          <NavLink onClick={() => setOpen(false)} to="/admin">Dashboard</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/admin/home">Home</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/admin/venu">Venues</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/admin/supply">Suppliers</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/admin/aboutadmin">About</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/admin/mediaadmin">Media</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/admin/contactadmin">Contact</NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
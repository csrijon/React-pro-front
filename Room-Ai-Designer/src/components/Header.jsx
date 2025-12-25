import { useState } from "react";
import ListIcon from '@mui/icons-material/List';
import CloseIcon from '@mui/icons-material/Close';
import { NavLink } from "react-router-dom";
import logo from "../assets/logoweb.png"
import "../css/Header.css";

const Header = () => {
    const [openMenu, setOpenMenu] = useState(false);

    const onclickbutton =() => {
      alert("Button Clicked")
    }

    return (
        <header className="header" >
            <div className="header-container">

                <div className="left-Header">
                    <img src={logo} alt="" />
                    <h2 className="header-title">
                        RoomAI <span>Designer</span>
                    </h2>
                </div>

                {/* MOBILE TOGGLE BUTTON */}
                <button 
                    className="mobile-toggle" 
                    onClick={() => setOpenMenu(!openMenu)}>
                    {openMenu?<CloseIcon/>:<ListIcon/>}
                </button>

                <nav className={`header-nav ${openMenu ? "show" : ""}`} >
                    <ul>
                        
                        <li><NavLink  className="nav-link" to="/">Home</NavLink></li>
                        <li><NavLink  className="nav-link" to="/roomsence">My Rooms</NavLink></li>
                        <li><NavLink  className="nav-link" to="/reviewspace">RoomSpace</NavLink></li>
                        <li><NavLink  className="nav-link" to="/dream">About</NavLink></li>
                        <li><NavLink  className="nav-link" to="/contact">Support</NavLink></li>
                        <li><NavLink  className="nav-link" to="/subscription">Upgrade Now</NavLink></li>
                    </ul>
                    <button className="add-btn" onClick={onclickbutton} >Add New</button>
                </nav>

            </div>
        </header>
    )
}

export default Header;

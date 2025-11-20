import { useState } from "react";
import ListIcon from '@mui/icons-material/List';
import CloseIcon from '@mui/icons-material/Close';
import { NavLink } from "react-router-dom";
import "../css/Header.css";

const Header = () => {
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <header className="header" >
            <div className="header-container">

                <div className="left-Header">
                    <img src="" alt="" />
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
                        <li><NavLink to="/roomsence">My Rooms</NavLink></li>
                        <li><NavLink to="/dream">About</NavLink></li>
                        <li><NavLink to="/contact">Support</NavLink></li>
                    </ul>
                    <button className="add-btn" >Add New</button>
                </nav>

            </div>
        </header>
    )
}

export default Header;

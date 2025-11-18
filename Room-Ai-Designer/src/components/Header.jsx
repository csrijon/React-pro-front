import React from "react";
import "../css/Header.css";

const Header = () => {
    return (
        <header className="header" >
            <div className="header-container">
                <div className="left-Header">
                    <img src="" alt="" />
                    <h2 className="header-title">
                        RoomAI <span>Designer</span>
                    </h2>
                </div>
                <nav className="header-nav" >
                    <ul>
                        <li><a href="">My Rooms</a></li>
                        <li><a href="">About</a></li>
                        <li><a href="">Support</a></li>
                    </ul>
                    <button className="add-btn" >Add New</button>
                </nav>
            </div>
        </header>
    )
}

export default Header;
import React from "react";
import "../css/Header.css";

const Header =()=>{
    return(
        <header className="header"> 
            <div className="left">
                <p>Kites Event</p>
            </div>
            <div className="right">
                    <ul>
                        <li><a href="">Home</a></li>
                        <li><a href="">About</a></li>
                        <li><a href="">Events</a></li>
                        <li><a href="">Gallery</a></li>
                        <li><a href="">Contact</a></li>
                    </ul>
            </div>
        </header>
    )
}
export default Header;
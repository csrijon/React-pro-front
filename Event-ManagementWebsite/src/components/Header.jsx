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
                        <li><a href="">Venu</a></li>
                        <li><a href="">Suppliers </a></li>
                        <li><a href="">About</a></li>
                        <li><a href="">Media</a></li>
                        <li><a href="">Contact</a></li>
                    </ul>
            </div>
        </header>
    )
}
export default Header;
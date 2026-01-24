import React from "react";
import "../css/HeroSection.css";
import Button from "../ui/Button.jsx";

const Herosection = () => {
    return (
        <section className="hero-section">
            <div className="first-part">
                <h3>Your Wedding,<span>Your Way</span></h3>
            </div>
            <div className="second-part">
                <select name="category" className="category-select" defaultValue="">
                    <option value="" disabled selected>
                        Select Category
                    </option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="anniversary">Anniversary</option>
                </select>

                <select name="location" className="location-select">
                    <option value="" disabled selected>
                        Select Location
                    </option>
                    <option value="delhi">Delhi</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="chennai">Chennai</option>
                </select>
                <Button />
            </div>

        </section>
    )
}

export default Herosection;
import React from "react";
import FilterBar from "./FilterBar.jsx";
import "../css/EventHero.css"

const Eventherosection = () => {
    return (
        <section className="event-hero">
            <div className="hero-overlay">
                <h1>Find Your Perfect Event</h1>
                <p>Discover amazing venues and unforgettable experiences</p>
                <FilterBar />
            </div>
        </section>
    )
}

export default Eventherosection
import React from "react";
import VenueCard from "./VenueCard";
import Topsection from "../ui/Topsection";
import "../css/venue.css";

const VenueGrid = ({title,number}) => {
    const cities = ["ABU DHABI", "AL AIN", "DUBAI"];

    return (
        <section className="wedding-section" >
            <Topsection title={title} number={number} />
            <div className="venue-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                    <VenueCard key={index} city={cities[index % 3]} />
                ))}
            </div>
        </section>

    );
};

export default VenueGrid;
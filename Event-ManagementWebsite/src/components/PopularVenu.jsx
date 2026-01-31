
import React from "react";
import VenueCard from "./VenueCard.jsx";
import Topsection from "../ui/Topsection";
import "../css/venue.css"
import Countiing from "../ui/Counting.jsx"
const cities = ["ABU DHABI", "AL AIN", "DUBAI"]

const PopularVenu = ({title,number}) => {
    return (
        <section className="Popular-section" >
            <div className="container">
            <Topsection title={title} number={number } />
            <div className="venue-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                    <VenueCard key={index} city={cities[index % 3]} />
                ))}
            </div>
            <Countiing/>
            </div>
        </section>
    )
}

export default PopularVenu
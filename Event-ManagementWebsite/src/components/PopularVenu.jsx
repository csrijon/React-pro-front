
import React, { useEffect,useState } from "react";
import VenueCard from "./VenueCard.jsx";
import Topsection from "../ui/Topsection";
import "../css/venue.css"
import Countiing from "../ui/Counting.jsx"
// const cities = ["ABU DHABI", "AL AIN", "DUBAI"]

const PopularVenu = ({ title, number }) => {
    const [popularVenues, setPopularVenues] = useState([])

  useEffect(() => {
    let fetchpopularvenue = async () => {
        try {
            let response = await fetch("http://localhost:3000/api/fetchvenu")
            let data = await response.json()
            console.log(data)
           setPopularVenues(data)
        }
        catch (error) {
            console.log(error, "popular venue route is not working")
        }
    }
    fetchpopularvenue()
}, [])

    return (
        <section className="Popular-section" >
            <div className="container">
                <Topsection title={title} number={number} />
                <div className="venue-grid">
                    {popularVenues.map((venue, index) => (
                        <VenueCard  designernames={venue.venuename}  image={venue.image} key={index} city={venue.location} />
                    ))}
                </div>
                <Countiing />
            </div>
        </section>
    )
}

export default PopularVenu
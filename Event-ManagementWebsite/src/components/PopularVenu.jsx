/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import VenueCard from "./VenueCard.jsx";
import Topsection from "../ui/Topsection";
import "../css/venue.css"
import Countiing from "../ui/Counting.jsx"
import { motion } from "framer-motion";

const PopularVenu = ({ title }) => {
    const [popularVenues, setPopularVenues] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.18,
                delayChildren: 0.2
            }
        }
    }


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
            } finally {
                setIsLoading(false)
            }
        }
        fetchpopularvenue()
    }, [])

    return (
        <section className="Popular-section" >
            <div className="container">
                <Topsection title={title} number={popularVenues.length} />
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <motion.div variants={container} initial="hidden" whileInView="show" className="venue-grid">
                        {popularVenues.map((venue, index) => (
                            <VenueCard designernames={venue.venuename} image={venue.image} key={index} city={venue.location} />
                        ))}
                    </motion.div>
                )
                }
                <Countiing />
            </div>
        </section>
    )
}

export default PopularVenu
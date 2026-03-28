/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import VenueCard from "../components/VenueCard.jsx"
import {motion} from "framer-motion"

const Popularallcards = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [alldata,setalldata] =useState("")

    useEffect(() => {
        const fetchallpopularcards = async () => {
            let response = await fetch("https://backendof-event.onrender.com/api/fetchvenu")
            let data = await response.json()
            setalldata(data)
            console.log(data)
            setIsLoading(false)
        }
        fetchallpopularcards()
    }, [])

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

    return (
        <section className="Allpopularcard-section" >
            <div className="container">
                <h2 className="sectionpopu-text" >Popular Venue</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <motion.div variants={container} initial="hidden" whileInView="show" className="venue-grid">
                        {alldata.map((venue, index) => (
                            <VenueCard designernames={venue.venuename} image={venue.image} key={index} city={venue.location} />
                        ))}
                    </motion.div>
                )
                }
            </div>
        </section>
    )
}
export default Popularallcards;
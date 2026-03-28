/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import VenueCard from "./VenueCard.jsx";
import Topsection from "../ui/Topsection";
import "../css/venue.css"
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";

const PopularVenu = ({ title }) => {
    const [popularVenues, setPopularVenues] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [open,setopen] = useState(false)
    const [currentindex,setindex] =useState(0)

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
                let response = await fetch("https://backend-ofevent.onrender.com/api/fetchvenu")
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
        <section className="Popular-section"  >
            <div className="container">
                <Topsection title={title} number={popularVenues.length} path="/Allcardpopu"/>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <motion.div variants={container} initial="hidden" whileInView="show" className="venue-grid">
                        {popularVenues.map((venue, index) => (
                            <VenueCard  onClick={()=>{setopen(true)
                                setindex(index)}
                            } designernames={venue.venuename} image={venue.image} key={index} city={venue.location} />
                        ))}
                    </motion.div>
                )
                }
                <Lightbox
                open={open}
                close={()=>setopen(false)}
                slides={popularVenues.map(item=>({
                    src:item.image,
                    title:item.venuename,
                    description: item.location
                }))}
                index={currentindex}
                plugins={[Captions]}
                />
            </div>
        </section>
    )
}

export default PopularVenu
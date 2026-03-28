/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from "react"
import VenueCard from "./VenueCard";
import {motion} from "framer-motion"

const Alltrendingcards = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [gettrend,settrend] =useState("")

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    }

    useEffect(() => {
        const fetchtrendingdataall = async () => {
            let response = await fetch("https://backendof-event.onrender.com/api/fetchtreding")
            let data = await response.json()
            settrend(data)
            console.log(data)
            setIsLoading(false)
        }
        fetchtrendingdataall()
    },[])


    return (
        <section className="trendsection-allcards" >
            <div className="container">
                <h2 className="Trend-text" >Trending Designers</h2>
                {
                    isLoading ?
                        <p>Loading...</p> :
                        <motion.div className="venue-grid" variants={container} initial="hidden" whileInView="show">
                            {gettrend.map((designer, index) => (
                                <VenueCard key={index} designernames={designer.designername} image={designer.image} city={designer.location} />
                            ))}
                        </motion.div>
                }
            </div>
        </section>
    )
}

export default Alltrendingcards;
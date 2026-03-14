/* eslint-disable no-unused-vars */
import Topsection from "../ui/Topsection"
import { useEffect, useState } from "react"
import VenueCard from "./VenueCard"
import "../css/venue.css"
import { motion } from "framer-motion"

const TrendingDesigners = ({ title }) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const [trendingdata, settrendingdata] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchTrendingDesigners = async () => {
            try {
                let response = await fetch("http://localhost:3000/api/fetchtreding")
                let data = await response.json()
                settrendingdata(data)
                console.log(data)
            } catch (error) {
                console.log(error, "trending route is not working")
            } finally {
                setIsLoading(false)
            }
        }
        fetchTrendingDesigners()
    }, [])
    return (
        <section className="Trending-Designerssection" >
            <div className="container">
                <Topsection title={title} number={trendingdata.length} />
                {
                    isLoading ?
                        <p>Loading...</p> :
                        <motion.div className="venue-grid" variants={container} initial="hidden" whileInView="show">
                            {trendingdata.map((designer, index) => (
                                <VenueCard key={index} designernames={designer.designername} image={designer.image} city={designer.location} />
                            ))}
                        </motion.div>
                }
            </div>
        </section>
    )
}
export default TrendingDesigners
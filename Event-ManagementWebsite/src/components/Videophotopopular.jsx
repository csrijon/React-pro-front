/* eslint-disable no-unused-vars */
import Topsection from "../ui/Topsection";
import VenueCard from "./VenueCard";
import "../css/venue.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";


const Videophotopopular = ({ title }) => {

    const [videophotographerdata, setvideophotographerdata] = useState([])
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
        const fetchvideophotographer = async () => {
            try {

                let response = await fetch("https://backendof-event.onrender.com/apivideophotographer")
                let data = await response.json()
                setvideophotographerdata(data)
                console.log(data)
            }
            catch (error) {
                console.log(error, "video photographer route is not working")
            } finally {
                setIsLoading(false)
            }
        }
        fetchvideophotographer()
    }, [])

    return (
        <section className="video-photosection" >
            <div className="container">
                <Topsection title={title} number={videophotographerdata.length} path="/Allphotovideo" />
                {isLoading ?
                    <p>Loading...</p> :
                    <motion.div variants={container} initial="hidden" whileInView="show" className="venue-grid">
                        {videophotographerdata.map((data, index) => (
                            <VenueCard key={index} designernames={data.videoname} image={data.videoimage} city={data.videolocation} />
                        ))}
                    </motion.div>
                }
            </div>
        </section>
    )
}

export default Videophotopopular;
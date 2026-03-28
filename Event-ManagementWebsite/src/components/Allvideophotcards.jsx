/* eslint-disable no-unused-vars */
import React,{useState,useEffect} from "react";
import VenueCard from "./VenueCard";
import {motion} from "framer-motion"

const Allvideophotcards = () => {

     const [isLoading, setIsLoading] = useState(true)
     const [datas,setdatas] =useState([])
    
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

        useEffect(()=>{
            const fetchallpopuvidecards = async ()=>{
                 let response = await fetch("https://backendof-event.onrender.com/apivideophotographer")
                let data = await response.json()
                setdatas(data)
                console.log(data)
                setIsLoading(false)
            }
            fetchallpopuvidecards()
        },[])

    return (
        <section className="section-both" >
            <div className="container">
                <h2 className="text-both" >Popular Photographers / Videographers</h2>
                {isLoading ?
                    <p>Loading...</p> :
                    <motion.div variants={container} initial="hidden" whileInView="show" className="venue-grid">
                        {datas.map((data, index) => (
                            <VenueCard key={index} designernames={data.videoname} image={data.videoimage} city={data.videolocation} />
                        ))}
                    </motion.div>
                }
            </div>
        </section>
    )
}

export default Allvideophotcards
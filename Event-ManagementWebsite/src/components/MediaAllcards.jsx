/* eslint-disable no-unused-vars */
import React,{useState,useEffect} from "react";
import {motion} from "framer-motion"

const MediaAllcards = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [getdata,setgetdata] =useState("")
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
    const cardAnimation = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.92
        },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 130,
                damping: 12
            }
        }
    }

    useEffect(()=>{
        const fetchallmediacards= async ()=>{
             let fetchmedia = await fetch("http://localhost:3000/fetchmedia")
                let res = await fetchmedia.json()
                setgetdata(res)
                console.log(res)
                setIsLoading(false)
        }
        fetchallmediacards()
    },[])

    return (
        <section className="Mediaallcards-section" >
            <div className="container">
                <h2 className="mediacard-text" >Latest Media</h2>
                {
                    isLoading ?
                        <p>Loading...</p> :
                        <motion.div variants={container} initial="hidden" whileInView="show" className="media-card-section">
                            {
                                getdata.map((item) => (
                                    <motion.div
                                        variants={cardAnimation}
                                        className="info-card"
                                        key={item.id}
                                    >
                                        <motion.div className="info-image">
                                            <img loading="lazy" src={item.image} alt="card" />
                                        </motion.div>

                                        <motion.div className="info-content">
                                            <motion.h4>{item.heading}</motion.h4>
                                            <motion.p>
                                                {item.discreption}
                                            </motion.p>
                                            <motion.a href="#" className="read-more">Read More</motion.a>
                                        </motion.div>
                                    </motion.div>
                                ))
                            }

                        </motion.div>
                }
            </div>
        </section>
    )
}

export default MediaAllcards
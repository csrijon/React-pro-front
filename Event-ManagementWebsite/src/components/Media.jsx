/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import Topsection from "../ui/Topsection"
import "../css/Media.css"
import { motion } from "framer-motion"

const Media = () => {

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

    const [mediainfo, setmediainfo] = useState([])

    useEffect(() => {
        let getresponse = async () => {
            try {
                let fetchmedia = await fetch("http://localhost:3000/fetchmedia")
                let res = await fetchmedia.json()
                setmediainfo(res)
                console.log(res)
            } catch (error) {
                console.log(error)
            }finally{
                setIsLoading(false)
            }
        }
        getresponse()
    }, [])

    return (
        <section className="Mediasection" >
            <div className="container">
                <Topsection title="Latest Media" number={mediainfo.length} />
                {
                    isLoading ?
                        <p>Loading...</p>:
                        <motion.div variants={container} initial="hidden" whileInView="show" className="media-card-section">
                    {
                        mediainfo.map((item) => (
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
export default Media
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"

const Weddingcardsall = () => {

    const [getweddingdata, setweddingdata] = useState([])

    useEffect(() => {
        const fetchallweddingcard = async () => {
            const response = await fetch("http://localhost:3000/api/venue");
            const data = await response.json();
            setweddingdata(data)
            console.log(data);
        }
        fetchallweddingcard()
    })


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

    return (
        <section className="weddingsection-allcards" >
            <div className="container">
                <h2 className="wedding-text" >Wedding Venue</h2>
                <motion.div variants={container} initial="hidden" viewport={{ once: true }} animate="show" className="venue-grid">
                    {getweddingdata.map((item) => (
                        <motion.div variants={cardAnimation} className="venue-card" key={item._id}>
                            <motion.div className="venue-image">
                                <motion.img
                                    loading="lazy"
                                    src={item.image}
                                    alt={item.venueTitle}
                                />
                                <motion.span className="explore-btn">Explore</motion.span>
                            </motion.div>

                            <motion.p className="venue-title">
                                {item.venueTitle} <strong>{item.location}</strong>
                            </motion.p>

                            <motion.p className="venue-rating">⭐ {item.rating}</motion.p>

                            <motion.p className="venue-guests">
                                Upto {item.guests} Guests
                            </motion.p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default Weddingcardsall
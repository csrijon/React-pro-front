/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"
import "../css/Category.css";
import { motion } from "framer-motion";


const Featurescategoryall = () => {

    const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const cardAnimation = {
        hidden: { opacity: 0, y: 40 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 14
            }
        }

    }
    const [data, setData] = useState([])

    useEffect(() => {
        const alldatafetch = async () => {
            let response = await fetch("http://localhost:3000/api/fetbrowcategory")
            let result = await response.json()
            setData(result)
        }

        alldatafetch()
    }, [])

    return (
        <section className="feature-category">
            <div className="container">
                <h2 className="section-title">Feature Categories</h2>

                <motion.div variants={container} initial="hidden" animate="show" className="Bottom-section">
                    {
                        data.map((item, index) => (
                            <motion.div whileHover={{ scale: 1.05, y: -10 }} transition={{ type: "spring", stiffness: 200 }} variants={cardAnimation} className="cards" key={index}>
                                <motion.img loading="lazy" src={item.Image} alt="card-images" />
                                <p className="card-title">{item.title}</p>
                            </motion.div>
                        ))
                    }
                </motion.div>
            </div>
        </section>
    )
}

export default Featurescategoryall
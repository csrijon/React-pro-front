import React from "react";
import "../css/HeroSection.css";
import Button from "../ui/Button.jsx";
import { motion } from "framer-motion";

const Herosection = ({ heading, subheading }) => {
    const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 12
            }
        }
    }
    return (
        <section className="hero-section">
            <motion.div className="first-part" >
                <motion.h3 initial={{ opacity: 0, scale: 0.5 }} animate={{
                    opacity: 1, scale: 1, transition
                        : { type: "spring", stiffness: 100 }
                }} >{heading}<span>{subheading}</span></motion.h3>
            </motion.div>
            <motion.div
                className="second-part"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <motion.select
                    variants={item}
                    whileHover={{ scale: 1.03 }}
                    whileFocus={{ scale: 1.03 }}
                    name="category"
                    className="category-select"
                    defaultValue=""
                >
                    <option value="" disabled>
                        Select Category
                    </option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="anniversary">Anniversary</option>
                </motion.select>

                <motion.select
                    variants={item}
                    whileHover={{ scale: 1.03 }}
                    whileFocus={{ scale: 1.03 }}
                    name="location"
                    className="location-select"
                    defaultValue=""
                >
                    <option value="" disabled>
                        Select Location
                    </option>
                    <option value="delhi">Delhi</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="chennai">Chennai</option>
                </motion.select>

                <motion.div
                    variants={item}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button />
                </motion.div>
            </motion.div>

        </section>
    )
}

export default Herosection;
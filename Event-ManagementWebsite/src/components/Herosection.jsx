/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "../css/HeroSection.css";
import Button from "../ui/Button.jsx";
import { motion } from "framer-motion";

const Herosection = ({ heading, subheading, setSearchResults }) => {
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
    const [iscategorySelected, setcategorySelected] = useState("");
    const [islocationSelected, setlocationSelected] = useState("");
   

    let searchclciked = async () => {
        try {
            console.log(iscategorySelected, islocationSelected)
            let response = await fetch(`https://react-pro-front.onrender.com/search?category=${iscategorySelected}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            let resdata = await response.json();
            console.log(resdata)
            setSearchResults(resdata);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    }
    return (
        <section className="hero-section">
        <motion.div
  className="first-part"
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
>
  <motion.h3
    className="hero-title"
    initial={{ opacity: 0, scale: 0.7 }}
    animate={{
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 120 }
    }}
  >
    {heading}
    <span>{subheading}</span>
  </motion.h3>

  <motion.p
    className="hero-subtext"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
  >
    Celebrate life’s most beautiful moments with elegance and style.
    Discover venues, connect with trusted vendors, and plan your perfect event😍.
  </motion.p>
</motion.div>
            {/* <motion.div
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
                   
                    value={iscategorySelected}
                    onChange={(e) => { setcategorySelected(e.target.value.trim())
                         console.log("Selected category:", e.target.value.trim());
                     }}
                >
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Corporate">Corporate Event</option>
                    <option value="Aniversary">Anniversary</option>
                </motion.select>

                <motion.select
                    variants={item}
                    whileHover={{ scale: 1.03 }}
                    whileFocus={{ scale: 1.03 }}
                    name="location"
                    className="location-select"
        
                    value={islocationSelected}
                    onChange={(e) => {
                        const location = e.target.value;
                        setlocationSelected(location);
                        console.log(location);
                    }} >
                   
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
                    <Button onClick={searchclciked} />
                </motion.div>
            </motion.div> */}

        </section>
    )
}

export default Herosection;
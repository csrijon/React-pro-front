/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Topsection from "../ui/Topsection";
import "../css/venue.css";
import { motion } from "framer-motion";

const VenueGrid = ({ title }) => {

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

  const [venueinfo, setvenueinfo] = useState([]);

  useEffect(() => {
    const venudata = async () => {
      try {
        const response = await fetch("https://react-pro-front.onrender.com/api/venue");
        const data = await response.json();
        console.log(data);
        setvenueinfo(data);
      } catch (error) {
        console.log(error);
      }
    };

    venudata();
  }, []);

  return (
    <section className="wedding-section">
      <div className="container">
        <Topsection title={title} number={venueinfo.length} path="/Allcardwedding" />

        <motion.div variants={container} initial="hidden" viewport={{ once: true }} animate="show" className="venue-grid">
          {venueinfo.slice(0,6).map((item) => (
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
  );
};

export default VenueGrid;

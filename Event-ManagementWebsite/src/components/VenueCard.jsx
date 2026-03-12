import React from "react";
import { motion } from "framer-motion"

const VenueCard = ({ city, designernames, image }) => {
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
    <motion.div className="venue-card" variants={cardAnimation} >
      <div className="venue-image">
        <motion.img
          whileHover={{ scale: 1.15, zIndex: 10 }} src={image} alt={designernames}
        />
        <span className="explore-btn">Explore</span>
      </div>

      <p className="venue-title">
        <strong>{designernames}</strong>
      </p>

      <p className="venue-rating">
        ★★★★★ <span>3.5</span>
      </p>

      <p className="venue-guests">Upto {city} Guests</p>
    </motion.div>
  );
};

export default VenueCard;
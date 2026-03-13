/* eslint-disable no-unused-vars */
import React from "react";
import "../css/filterBar.css";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
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
};

const FilterBar = () => {
  return (
    <motion.div
      className="filter-container"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <motion.div
        className="container filter-inner"
        variants={container}
      >
        <motion.select
          className="filter-select"
          variants={item}
          whileHover={{ scale: 1.04 }}
        >
          <option>No. of Guests</option>
        </motion.select>

        <motion.select
          className="filter-select"
          variants={item}
          whileHover={{ scale: 1.04 }}
        >
          <option>Venue Type</option>
        </motion.select>

        <motion.select
          className="filter-select"
          variants={item}
          whileHover={{ scale: 1.04 }}
        >
          <option>Space Preference</option>
        </motion.select>

        <motion.select
          className="filter-select"
          variants={item}
          whileHover={{ scale: 1.04 }}
        >
          <option>Rating</option>
        </motion.select>

        <motion.button
          className="search-btn"
          variants={item}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          Search
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default FilterBar;
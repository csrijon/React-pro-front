import React from "react";
import "./StatusBar.css";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const StatusBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0, backgroundColor: "#1f2227" }}
      transition={{ duration: 0.5, ease: "easeInOut", delay: 1 }}
      className="status-bar">
      <motion.span
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 1.3 }}
        className="status-icon"></motion.span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 1.5 }}
        className="status-text">
        Currently working on <strong>Portfolio</strong>
      </motion.span>
    </motion.div>
  );
};

export default StatusBar;

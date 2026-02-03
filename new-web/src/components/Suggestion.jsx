import React, { useState } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion"; 
import "./Suggestion.css";

const Suggestion = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email, message });
    setName("");
    setEmail("");
    setMessage("");
  };

  // Animation Settings
  const inputAnim = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0,transition: { type: "spring", stiffness: 100, damping: 20 } },
    focus: { scale: 1.05, borderColor: "#c778dd", boxShadow: "0px 0px 8px rgba(98,0,234,0.3)" }
  };

  return (
    <motion.div 
      className="suggestion-box"
      // Entrance Animation: Slides down from top
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <h2>Give me your suggestion</h2>

      <form onSubmit={handleSubmit} className="suggestion-form">
        
        {/* Name Input */}
        <motion.input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          
          // Animation Props
          variants={inputAnim}
          initial="hidden"
          animate="visible"
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }} // Staggered delay
          whileFocus="focus" // The "Inout" animation
        />

        {/* Email Input */}
        <motion.input
          type="email"
          placeholder="Enter your gmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          
          variants={inputAnim}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          whileFocus="focus"
        />

        {/* Message Input */}
        <motion.textarea
          placeholder="Write your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          
          variants={inputAnim}
          initial="hidden"
          animate="visible"
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
          whileFocus="focus"
        />

        {/* Button Animation */}
        <motion.button 
          type="submit"
          whileHover={{ scale: 1.1, }}
          whileTap={{ scale: 0.9 }}
        >
          Submit
        </motion.button>

      </form>
    </motion.div>
  );
};

export default Suggestion;
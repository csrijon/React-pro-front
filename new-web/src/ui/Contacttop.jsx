import React from "react"
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion"

const Contacttop = (props) => {
  return (
    <motion.div
      className="contact-content"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <motion.h2
        className="contact-heading"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <span className="accent-text">{props.icon}</span> contacts
      </motion.h2>

      <motion.p
        className="contact-description"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        viewport={{ once: true }}
      >
        I'm interested in freelance opportunities. However, if you have other
        requests or questions, don't hesitate to contact me.
      </motion.p>
    </motion.div>
  )
}

export default Contacttop

import React from 'react'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
/* eslint-disable no-unused-vars */
import { motion, scale } from "framer-motion"
import "./Fixed.css"


const icon1 = {
  hidden: { x: 50, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 150, damping: 20, }
  },
  Hover: { rotate: 5, scale: 1.2 }
}

const icon2 = {
  hidden: { x: 50, opacity: 0,scale:0.8 },
  show: {
    x: 0,
    opacity: 1,
 scale:1,
    transition: { type: "spring", stiffness: 150, damping: 20, delay: 0.2 }
  },
  hover: { scale: 1.2, rotate: -5}
}

const icon3 = {
  hidden: { x: 50, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 150, damping: 20, delay: 0.4 }
  },
  Hover: { rotate: 5, scale: 1.2 }
}


const Fixed = () => {
  return (
    <section className='fixed-container' >
      <motion.div
        className="linne"></motion.div>
      <motion.div
        className="social-icon">
        <motion.a variants={icon1} initial="hidden" whileInView="show" whileHover="Hover" ><LinkedInIcon /></motion.a>
        <motion.a variants={icon2} initial="hidden" whileInView="show" whileHover="hover" ><GitHubIcon /></motion.a>
        <motion.a variants={icon3} initial="hidden" whileInView="show" whileHover="Hover" >
          <InstagramIcon /></motion.a>
      </motion.div>
    </section>
  )
}

export default Fixed

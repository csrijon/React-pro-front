import React from 'react'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import { motion } from "framer-motion"
import "./Fixed.css"

const Fixed = () => {
  return (
    <section className='fixed-container' >
      <motion.div 
     className="linne"></motion.div>
      <motion.div
        className="social-icon">
        <motion.a initial={{x:-50}} whileInView={{x:0}} href=""><LinkedInIcon /></motion.a>
        <motion.a initial={{x:50}} whileInView={{x:0}} href=""><GitHubIcon /></motion.a>
        <motion.a initial={{}} href=""><InstagramIcon /></motion.a>
      </motion.div>
    </section>
  )
}

export default Fixed

import React from 'react'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import { motion } from "framer-motion"
import "./Fixed.css"


const aniationvarient = {
  hidden: { x: 50 },
  show: { x: 0, transition: { duration: 0.6,} }
}
// const secendanimation={
//   hidden:{ x: -50},
//   show:{x:0,transition:{duration:0.6,}}
// }

const Fixed = () => {
  return (
    <section className='fixed-container' >
      <motion.div
        className="linne"></motion.div>
      <motion.div
        className="social-icon">
        <motion.a
         variants={aniationvarient}
         initial="hidden"
         whileInView="show"
        //  whileHover={{rotateX:10}}
          href=""><LinkedInIcon /></motion.a>
        <motion.a
          variants={aniationvarient}
          initial="hidden"
          whileInView="show"
          href=""><GitHubIcon /></motion.a>
        <motion.a 
        variants={aniationvarient}
        initial="hidden"
        whileInView="show"
        href=""><InstagramIcon /></motion.a>
      </motion.div>
    </section>
  )
}

export default Fixed

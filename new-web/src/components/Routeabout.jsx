import React from 'react'
import './Routeabout.css'
import "../ui/Aboutme.jsx"
import AboutMe from '../ui/Aboutme.jsx'
import Aboutmeimage from '../ui/Aboutmeimage.jsx'
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import './AboutMe.css';


const textsani={
  hidden:{opacity:0,x:-20},
  show:{opacity:1,x:0,transition:{
    duration:0.5
  }}
}

const Routeabout = () => {
    return (
        <section className="about-section-route">
            <motion.h1 
            variants={textsani}
            initial="hidden"
            whileInView="show"
            className="section-title-route">
                <span className="slash-route">/</span>about-me
            </motion.h1>
            <motion.p 
             variants={textsani}
             initial="hidden"
             whileInView="show"
            className="subtitle-route">Who am i?</motion.p>
            <div className="about-route-content"> 
                <AboutMe />
                <Aboutmeimage />
            </div>
        </section>
    )
}

export default Routeabout

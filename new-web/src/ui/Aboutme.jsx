import React from "react";
import './Aboutpart.css';
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const Aboutme = () => {

    const containeritem = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.16,
            }
        }
    }
    const item = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1, y: 0,

            transition: { duration: 0.6, ease: "easeOut" }
        },
    }
    return (
        <motion.div
            variants={containeritem}
            initial="hidden"
            whileInView="visible"
            className="about-me-text">
            <motion.p
                variants={item}
            >Hello, I'm Srijon!</motion.p>
            <motion.p
                variants={item}
            >
                a passionate developer who has completed my BCA from Maulana Abul Kalam Azad University of Technology and I am currently pursuing MCA at JIS College of Engineering, Kalyani. I specialize in building full-stack web applications and mobile apps, focusing on clean UI and smooth user experience.
            </motion.p>
            <motion.p
                variants={item}
            >
                Along with development, I am currently learning Data Structures and Algorithms (DSA) using C++ to strengthen my problem-solving and technical depth.
            </motion.p>
        </motion.div>
    )
};

export default Aboutme;
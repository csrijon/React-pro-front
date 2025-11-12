import React from "react";
import './Aboutpart.css';
import { motion } from "framer-motion";

const Aboutme = () => {
    return (
        <div className="about-me-text">
            <motion.p 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{opacity:1,y:0}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            >Hello, I'm Srijon!</motion.p>
            <motion.p 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{opacity:1,y:0}}
            transition={{ duration: 0.6, ease: "easeOut",delay:0.32 }}
            >
                a passionate developer who has completed my BCA from Maulana Abul Kalam Azad University of Technology and I am currently pursuing MCA at JIS College of Engineering, Kalyani. I specialize in building full-stack web applications and mobile apps, focusing on clean UI and smooth user experience.
            </motion.p>
            <motion.p 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{opacity:1,y:0}}
            transition={{ duration: 0.6, ease: "easeOut",delay:0.64 }}
            >
                Along with development, I am currently learning Data Structures and Algorithms (DSA) using C++ to strengthen my problem-solving and technical depth.
            </motion.p>
        </div>
    )
}

export default Aboutme;
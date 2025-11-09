import React from "react";
import "./HeroSection.css";
import personImage from "../assets/Group 46.webp"
import StatusBar from "./StatusBar";
import { motion } from "framer-motion";

const HeroSection = () => {
    return (
        <section className="hero">
            <div className="hero-left">
                <motion.h1 initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} >
                    Srijon is a <span className="purple">Full Stack Web Developer</span> and{" "}
                    <span className="purple">App Developer</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut", delay: 0.4 }}
                    className="hero-subtext">
                    He crafts responsive websites and builds intuitive mobile apps where technology meets creativity.
                </motion.p>
                <motion.button
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut", delay: 0.8 }}
                    className="hero-btn">Contact me !!</motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0, backgroundColor: "#1f2227" }}
                    transition={{ duration: 0.5, ease: "easeInOut", delay: 1 }}
                    className="status">
                    <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut", delay: 1.3 }}
                        className="status-dot">
                    </motion.span>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut", delay: 1.5 }}
                    >
                        Currently working on <strong>Portfolio</strong>
                    </motion.span>
                </motion.div>
            </div>

            <div className="hero-right">
                {/* <img src={Image} alt="person" /> */}
                <motion.img 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1,filter: "drop-shadow(0px 0px 10px black)" }}

                    transition={{ duration: 0.5, ease: "easeInOut", delay: 0.5 }}
                src={personImage} alt="" />
                <StatusBar />
            </div>
        </section>
    );
};

export default HeroSection;

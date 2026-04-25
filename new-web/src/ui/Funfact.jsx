
import aboutlogo from "../assets/aboutlogo.webp"
import './Fanfact.css'
/* eslint-disable no-unused-vars */
import { delay, motion } from "framer-motion"

const Funfact = () => {

   const data = [
    { fact: "I love hiking and exploring new places." },
    { fact: "I can code for hours if there’s an interesting problem to solve." },
    { fact: "I once built a website entirely from scratch." },
    { fact: "My favorite debugging tool is a good console log." },
    { fact: "I enjoy solving logic puzzles in my free time." },
    { fact: "I can remember many CSS color codes by heart." },
    { fact: "I’m a night owl developer — most of my work happens at night." },
    { fact: "I once spent 3 hours fixing a bug caused by a missing semicolon." },
    { fact: "I enjoy learning random tech facts and tricks." },
    { fact: "I love clean, minimal, and user-friendly design." }
];

    return (
        <div className="about-fun-text" >
            <motion.h1
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            ><span>#</span>my-fun-facts</motion.h1>
            <motion.div className="funfact-content" >
                <motion.div className="left-section-funfact">
                    {data.map((item, index) =>
                        <motion.p
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 * index }}
                            key={index}>{item.fact}</motion.p>)
                    }
                </motion.div>
                <motion.div className="right-section-funfact">
                    <motion.img
                        src={aboutlogo}
                        alt="about"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                        }}
                    />
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Funfact;
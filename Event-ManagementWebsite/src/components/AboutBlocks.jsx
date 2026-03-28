/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../css/AboutBlocks.css";
import { motion } from "framer-motion";

const imageLeft = {
  hidden: { opacity: 0, x: -80, scale: 0.95 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 14
    }
  }
};

const imageRight = {
  hidden: { opacity: 0, x: 80, scale: 0.95 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 14
    }
  }
};

const textAnimation = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25
    }
  }
};

const AboutBlocks = () => {
  const [aboutBlock1Data, setAboutBlock1Data] = useState([]);
  const [aboutBlock2Data, setAboutBlock2Data] = useState([]);

  useEffect(() => {
    let fetchaboutblocks1 = async () => {
      try {
        let response = await fetch("https://backend-ofevent.onrender.com/api/fetchaboutblock1");
        let data = await response.json();
        setAboutBlock1Data(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchaboutblocks1();

    let fetchaboutblock2 = async () => {
      try {
        let response = await fetch("https://backend-ofevent.onrender.com/api/fetchaboutblock2");
        let data = await response.json();
        setAboutBlock2Data(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchaboutblock2();
  }, []);

  return (
    <section className="about-blocks">
      <div className="container">

        {/* Block 1 */}
        <motion.div
          className="about-row"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="about-image" variants={imageLeft}>
            <motion.img
            loading="lazy"
              src={aboutBlock1Data[0]?.Image}
              alt="what we offer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>

          <motion.div className="about-text" variants={textAnimation}>
            <h3>{aboutBlock1Data[0]?.title}</h3>

            <motion.p variants={textAnimation}>
              {aboutBlock1Data[0]?.blockpara1}
            </motion.p>

            <motion.p variants={textAnimation}>
              {aboutBlock1Data[0]?.blockpara2}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Block 2 */}
        <motion.div
          className="about-row reverse"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="about-image" variants={imageRight}>
            <motion.img
            loading="lazy"
              src={aboutBlock2Data[0]?.Image}
              alt="who we are"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>

          <motion.div className="about-text" variants={textAnimation}>
            <h3>{aboutBlock2Data[0]?.title}</h3>

            <motion.p variants={textAnimation}>
              {aboutBlock2Data[0]?.blockpara1}
            </motion.p>

            <motion.p variants={textAnimation}>
              {aboutBlock2Data[0]?.blockpara2}
            </motion.p>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
};

export default AboutBlocks;
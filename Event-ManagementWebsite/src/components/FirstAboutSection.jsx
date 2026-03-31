/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../css/FirstAboutSection.css";
import firstimages from "../assets/fifthimages.jpg";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2
    }
  }
};

const leftText = {
  hidden: { opacity: 0, x: -80 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 14
    }
  }
};

const rightImage = {
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

const statAnimation = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 130,
      damping: 12
    }
  }
};

const FirstAboutSection = () => {

  const [mainAboutData, setMainAboutData] = useState({});
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    let fetchmainabout = async () => {
      try {
        let response = await fetch("https://react-pro-front.onrender.com/api/fetchaboutmain");
        let data = await response.json();
        setMainAboutData(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchmainabout();

    let fetchaboutstarts = async () => {
      try {
        let response = await fetch("https://react-pro-front.onrender.com/api/fetchaboutstats");
        let data = await response.json();
        setStatsData(data[2].stats);
      } catch (error) {
        console.error(error);
      }
    };
    fetchaboutstarts();
  }, [])

  return (
    <section className="about-wrapper">
      <div className="container">

        {/* Top content */}
        <motion.div
          className="about-content"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >

          {/* Left text */}
          <motion.div className="about-text" variants={leftText}>
            <h3>{mainAboutData[0]?.title}</h3>

            <p>{mainAboutData[0]?.para1}</p>

            <p>{mainAboutData[0]?.para2}</p>
          </motion.div>

          {/* Right image */}
          <motion.div className="about-image" variants={rightImage}>
            <motion.img
            loading="lazy"
              src={mainAboutData[0]?.mainImage || firstimages}
              alt="about"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>

        </motion.div>

        {/* Stats */}
        <motion.div
          className="about-stats"
          variants={container}
          initial="hidden"
          whileInView="show"
          // viewport={{ once: true }}
        >
          {
            statsData.map((item, index) => (
              <motion.div
                className="stat"
                key={index}
                variants={statAnimation}
                whileHover={{
                  y: -8,
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 200 }
                }}
              >
                <h2>{item.number}</h2>
                <p>{item.label}</p>
              </motion.div>
            ))
          }
        </motion.div>

      </div>
    </section>
  );
};

export default FirstAboutSection;
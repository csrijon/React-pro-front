import React from "react";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import "./Project.css"
import "./Projects.css"
import habitiimage from "../assets/habittracker.png"
import Ytfetch from "../assets/yt fetch.png"
import onlinecom from "../assets/onliencompiler.png"
import DotGrid from "./DotGrid";
import Button from "../ui/Button";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion"


const ProjectSection = () => {
  const data = [
    {
      image: habitiimage,
      tags: "HTML CSS Ejs Express Js Mongodb",
      title: "Habit Tracker",
      description: "Minecraft servers hosting",
      buttons: [
        { label: "Live ↔", link: "#", type: "primary" },
        { label: "Cached >", link: "#", type: "secondary" },
      ],
    },
    {
      image: Ytfetch,
      tags: "React Express js Node.js",
      title: "Youtube Video and Audio Downloader",
      description: "Discord anti-crash bot",
      buttons: [
        { label: "Live ↔", link: "#", type: "primary" },
        { label: "Cached >", link: "#", type: "secondary" },
      ],
    },
    {
      image: onlinecom,
      tags: "CSS Express Node.js",
      title: "Online Compiler",
      description: "Get answers to your kahoot quiz",
      buttons: [
        { label: "Live ↔", link: "#", type: "primary" },
        { label: "Cached >", link: "#", type: "secondary" },
      ],
    },
  ];
  return (
    <>
      <section className="projet-section" >
        <div className="projet-heading">
          <div className="left-heading">
            <motion.h2
              initial={{ opacity: 0, x: -100, scale: 0 }}
              whileInView={{ opacity: 1, x: 0, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="about-me-heading">
              <span className="accent-text">#</span>projects
            </motion.h2>
          </div>
        </div>
        <div className="projects-container">
          {data.map((project, i) => (
            <motion.div key={i}
              style={{ boxShadow: "none" }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.3 }}
              whileHover={{
                scale: 1.2, y: -10, boxShadow: "0px 15px 35px rgba(199, 120, 221, 0.45)"
                , transition: { type: "spring", stiffness: 150, damping: 18 }
              }}
              className="project-card">
              <div className="card-top">
                <img src={project.image} alt={project.title} />
                <div className="tags">{project.tags}</div>
              </div>
              <div className="card-body">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
              <div className="card-buttons">
                {project.buttons.map((btn, index) => (
                  <a key={index} href={btn.link} className={`btn ${btn.type}`}>
                    {btn.label}
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="dot-box"><DotGrid length={16} /></div>
      </section>
      <Button />
    </>
  )
}

export default ProjectSection;
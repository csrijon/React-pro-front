import React from "react";
// import view from "../assets/View all ~~_.png"
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import "./Project.css"
import "./Projects.css"
// import oneimage from "../assets/oneimage1.jpg"
import habitiimage from "../assets/habittracker.png"
import Ytfetch from "../assets/yt fetch.png"
import onlinecom from "../assets/onliencompiler.png"
import DotGrid from "./DotGrid";
// import { NavLink } from "react-router-dom";
import Button from  "../ui/Button";
import {motion} from "framer-motion"


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
      image:Ytfetch ,
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
             <h2 className="about-me-heading">
          <span className="accent-text">#</span>projects
        </h2>
          </div>
          {/* <div className="right-heading">
            
            <NavLink to="/allprojects">View <KeyboardDoubleArrowRightIcon /></NavLink>
          </div> */}
        </div>
        <motion.div   className="projects-container">
          {data.map((project, i) => (
            <div key={i} className="project-card">
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
            </div>
          ))}
        </motion.div>
        <div className="dot-box"><DotGrid length={16} /></div>
      </section>
        <Button/>
    </>
  )
}

export default ProjectSection;
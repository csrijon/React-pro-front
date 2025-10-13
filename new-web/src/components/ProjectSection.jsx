import React from "react";
// import view from "../assets/View all ~~_.png"
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import "./Project.css"
import "./Projects.css"
import oneimage from "../assets/oneimage1.jpg"
import twoimage from "../assets/oneimage2.png"
import threeimage from "../assets/oneimage3.png"
import DotGrid from "./DotGrid";


const ProjectSection = () => {
     const data = [
    {
      image: oneimage,
      tags: "HTML SCSS Python Flask",
      title: "ChertNodes",
      description: "Minecraft servers hosting",
       buttons: [
      { label: "Live ↔", link: "#", type: "primary" },
      { label: "Cached >", link: "#", type: "secondary" },
    ],
    },
    {
      image: twoimage,
      tags: "React Express Discord.js Node.js",
      title: "ProtectX",
      description: "Discord anti-crash bot",
      buttons: [
      { label: "Live ↔", link: "#", type: "primary" },
      { label: "Cached >", link: "#", type: "secondary" },
    ],
    },
    {
      image: threeimage,
      tags: "CSS Express Node.js",
      title: "Kahoot Answers Viewer",
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
                        <h3><span>#</span>Project</h3>
                        <div className="line"></div>
                    </div>
                    <div className="right-heading">
                        {/* <img src={view} alt="" /> */}
                        <a href="#">View <KeyboardDoubleArrowRightIcon /></a>
                    </div>
                </div>
                 <div className="projects-container">
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
    </div>
    <div className="dot-box"><DotGrid length={8} /></div>
            </section>
        </>
    )
}

export default ProjectSection;
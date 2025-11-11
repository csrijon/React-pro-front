// SkillsSection.jsx
import React from "react";
import "./SkillsSection.css";
import { motion } from "framer-motion";

const skills = {
  Languages: ["C Basic", "Python Basic", "JavaScript"],
  Databases: ["Mongodb"],
  Tools: ["VSCode","Linux", "Figma","Canva","Git", "Font Awesome"],
  Other: ["HTML", "CSS", "EJS", "REST", "Bootstrap", "Tailwind CSS"],
  Frameworks: ["React Js","React Native", "Express.js"],
};

const SkillsSection = () => {
  return (
    <div className="skills-container">
      {Object.entries(skills).map(([category, items],i) => (
        <motion.div 
        initial={{ opacity: 0, y:50}}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.3, ease: "easeInOut" }}
        className="skills-box" key={category}>
          <motion.h3 
          initial ={{ opacity: 0}}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: i *0.5, ease: "easeInOut" }}
          >{category}</motion.h3>
          <motion.p
            initial ={{ opacity: 0}}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: i *0.5, ease: "easeInOut" }}
          >{items.join(" ")}</motion.p>
        </motion.div>
      ))}
    </div>
  );
};

export default SkillsSection;

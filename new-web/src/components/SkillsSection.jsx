// SkillsSection.jsx
import React from "react";
import "./SkillsSection.css";

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
      {Object.entries(skills).map(([category, items]) => (
        <div className="skills-box" key={category}>
          <h3>{category}</h3>
          <p>{items.join(" ")}</p>
        </div>
      ))}
    </div>
  );
};

export default SkillsSection;

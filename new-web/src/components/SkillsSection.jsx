// SkillsSection.jsx
import React from "react";
import "./SkillsSection.css";

const skills = {
  Languages: ["TypeScript", "Lua", "Python", "JavaScript"],
  Databases: ["SQLite", "PostgreSQL", "Mongo"],
  Tools: ["VSCode", "Neovim", "Linux", "Figma", "XFCE", "Arch", "Git", "Font Awesome"],
  Other: ["HTML", "CSS", "EJS", "SCSS", "REST", "Jinja"],
  Frameworks: ["React", "Vue", "Disnake", "Discord.js", "Flask", "Express.js"],
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

import React from 'react'
import "./Skill.css"
import skills from "../assets/skills.png"
import SkillsSection from './SkillsSection'

const Skillsection = () => {
    return (
        <div className='skill-section' >
            {/* <div className=""> */}
            <h2 className="top-section">
                <span className="accent-text">#</span>skills
            </h2>

            {/* </div> */}
            <div className="middle-skill">
                <div className="left-skill">
                    <img src={skills} alt="" />
                </div>
                <SkillsSection />
            </div>

        </div>
    )
}

export default Skillsection

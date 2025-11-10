import React from 'react'
import "./Skill.css"
import {motion} from "framer-motion"
import SkillsSection from './SkillsSection'

const Skillsection = () => {
    return (
        <div className='skill-section' >
            {/* <div className=""> */}
            <motion.h2 
            initial={{opacity:0,x:-100,scale:0}}
            whileInView={{opacity:1,x:0,scale:1.1}}
            transition={{duration:0.6,ease:"easeInOut"}}
            className="top-section">
                <span className="accent-text">#</span>skills
            </motion.h2>

            {/* </div> */}
            <div className="middle-skill">
                <div className="left-skill">
                    {/* <img src={skills} alt="" /> */}
                </div>
                <SkillsSection />
            </div>

        </div>
    )
}

export default Skillsection

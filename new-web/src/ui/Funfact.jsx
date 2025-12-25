
import aboutlogo from "../assets/aboutlogo.webp"
import './Fanfact.css'
/* eslint-disable no-unused-vars */
import {delay, motion} from "framer-motion"

// const temanimation={
//   hidden:{
//     opacity:0,
//     y:50
//   },
//   show:{
//     opacity:1,
//     y:0,
//     transition:{
//         duration:0.5,
//         delay:0.5
//     }
//   }
// }

const Funfact = () => {

    const data = [
        { fact: "I love hiking and exploring new" },
        { fact: "I can code for hours if there’s" },
        { fact: "I once built a website entirel" },
        { fact: "My favorite debugging tool is a" },
        { fact: "I enjoy solving logic puzzles" },
        { fact: "I can remember CSS color codes" },
        { fact: "I’m a night owl developer — most of" },
        { fact: "I once spent 3 hours fixing a bug" },
        { fact: "I enjoy learning random tech facts" },
        { fact: "I love clean, minimal, and" }
    ];

    return (
        <div className="about-fun-text" >
            <motion.h1 
            initial={{opacity:0,x:-50}}
            whileInView={{opacity:1,x:0}}
            transition={{duration:0.5}}
            ><span>#</span>my-fun-facts</motion.h1>
            <div className="funfact-content" >
                <div className="left-section-funfact">
                    {data.map((item, index) =>
                        <p key={index}>{item.fact}</p>)
                    }
                </div>
                <div className="right-section-funfact">
                    <img src={aboutlogo} alt="about" />
                </div>
            </div>
        </div>
    )
}

export default Funfact;
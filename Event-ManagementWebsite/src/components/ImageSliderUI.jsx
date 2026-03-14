import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import sampleImage from "../assets/firstimage.webp";
import secendimages from "../assets/secendimages.webp"
import thirdimages from "../assets/forthimages.jpg"
import "../css/ImageSliderUI.css"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"

const sliderimages = [
  sampleImage,
  secendimages,
  thirdimages
]
const ImageSliderUI = () => {
  const [currentIndex, setcurrentindex] = useState(0)
  
  const leftclick = ()=>{
      if (currentIndex===0) {
        setcurrentindex(sliderimages.length-1)
      }else{
        setcurrentindex(currentIndex-1)
      }
  }

  const rightclick = ()=>{
    if (currentIndex===sliderimages.length-1) {
      setcurrentindex(0)
    }else{
      setcurrentindex(currentIndex+1)
    }
  }

  let sliderAnimation ={
    hidden:{opacity:0, x:100},
    show:{opacity:1, x:0, transition:{duration:0.5}}
  }

  return (
    <div className="slider-wrapper">

      {/* Left Arrow */}
      <button onClick={leftclick} className="arrow left-arrow">
        <ArrowBackIcon />
      </button>
      <motion.div className="slider-container">
        <motion.div className="slider-card" >
              <motion.img loading="lazy" variants={sliderAnimation} initial="hidden" whileInView="show" src={sliderimages[currentIndex]} alt="slider" />
            </motion.div>
        
      </motion.div>

      {/* Right Arrow */}
      <button onClick={rightclick} className="arrow right-arrow">
        <ArrowForwardIcon />
      </button>

    </div>
  );
};

export default ImageSliderUI;

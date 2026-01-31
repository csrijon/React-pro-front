import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import sampleImage from "../assets/firstimage.webp";
import secendimages from "../assets/secendimages.webp"
import thirdimages from "../assets/forthimages.jpg"
import "../css/ImageSliderUI.css"

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

  return (
    <div className="slider-wrapper">
      {/* <h2>review</h2> */}
      {/* Left Arrow */}
      <button onClick={leftclick} className="arrow left-arrow">
        <ArrowBackIcon />
      </button>

      {/* Image Card */}
      {/* <div className="slider-card">
        <img src={sampleImage} alt="slider" />
      </div>
       <div className="slider-card">
        <img src={secendimages} alt="slider" />
      </div>
       <div className="slider-card">
        <img src={thirdimages} alt="slider" />
      </div> */}
      <div className="slider-container">
        <div className="slider-card" >
              <img src={sliderimages[currentIndex]} alt="slider" />
            </div>
        
      </div>

      {/* Right Arrow */}
      <button onClick={rightclick} className="arrow right-arrow">
        <ArrowForwardIcon />
      </button>

    </div>
  );
};

export default ImageSliderUI;

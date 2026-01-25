import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import sampleImage from "../assets/firstimage.webp"; 
import "../css/ImageSliderUI.css"

const ImageSliderUI = () => {
  return (
    <div className="slider-wrapper">
      {/* <h2>review</h2> */}
      {/* Left Arrow */}
      <button className="arrow left-arrow">
        <ArrowBackIcon />
      </button>

      {/* Image Card */}
      <div className="slider-card">
        <img src={sampleImage} alt="slider" />
      </div>

      {/* Right Arrow */}
      <button className="arrow right-arrow">
        <ArrowForwardIcon />
      </button>

    </div>
  );
};

export default ImageSliderUI;

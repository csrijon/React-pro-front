
import React,{useEffect,useState} from "react";
import "../css/FirstAboutSection.css";
import firstimages from "../assets/fifthimages.jpg"

const FirstAboutSection = () => {

  const [mainAboutData, setMainAboutData] = useState({});

  useEffect(() => {
    let fetchmainabout = async () => {
      try {
        let response = await fetch("http://localhost:3000/api/fetchaboutmain");
        let data = await response.json();
        console.log("Fetched Main About Data:", data);
        setMainAboutData(data);
      }

      catch (error) {
        console.error("Error fetching main about data:", error);
      }
    }
    fetchmainabout();
  }, [])

  return (
    <section className="about-wrapper">
      <div className="container">
        {/* Top content */}
        <div className="about-content">
          {/* Left text */}
          <div className="about-text">
            <h3>{mainAboutData[0]?.title}</h3>

            <p>
              {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum. */}
              {mainAboutData[0]?.para1}
            </p>

            <p>
              {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. */}
              {mainAboutData[0]?.para2}
            </p>
          </div>

          {/* Right image */}
          <div className="about-image">
            <img
              src={mainAboutData[0]?.mainImage || firstimages}
              alt="about"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="about-stats">
          <div className="stat">
            <h2>10,000</h2>
            <p>Wedding Vendors</p>
          </div>

          <div className="stat">
            <h2>20,000</h2>
            <p>Annual Weddings</p>
          </div>

          <div className="stat">
            <h2>1,000</h2>
            <p>Wedding Venues</p>
          </div>

          <div className="stat">
            <h2>1.5 M</h2>
            <p>Monthly Followers</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FirstAboutSection;
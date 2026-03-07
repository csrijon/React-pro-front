
import React, { useEffect, useState } from "react";
import "../css/FirstAboutSection.css";
import firstimages from "../assets/fifthimages.jpg"

const FirstAboutSection = () => {

  const [mainAboutData, setMainAboutData] = useState({});
  const [statsData, setStatsData] = useState([]);

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

    let fetchaboutstarts = async () => {
      try {
        let response = await fetch("http://localhost:3000/api/fetchaboutstats");
        let data = await response.json();
        console.log("Fetched About Stats Data:", data);
        // Assuming you have a state for stats
        setStatsData(data[2].stats);
        console.log("Stats State Updated:", data[2].stats);
      } catch (error) {
        console.error("Error fetching about stats data:", error);
      }
    };
    fetchaboutstarts();
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

              {mainAboutData[0]?.para1}
            </p>

            <p>
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
          {
            statsData.map((item, index) => (
              <div className="stat" key={index}>
                <h2>{item.number}</h2>
                <p>{item.label}</p>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  );
};

export default FirstAboutSection;
import React, { useEffect, useState } from "react";
import "../css/AboutBlocks.css";

const AboutBlocks = () => {
  const [aboutBlock1Data, setAboutBlock1Data] = useState({});
  const [aboutBlock2Data, setAboutBlock2Data] = useState({});

  useEffect(() => {
    let fetchaboutblocks1 = async () => {
      try {
        let response = await fetch("http://localhost:3000/api/fetchaboutblock1");
        let data = await response.json();
        console.log("Fetched About Block 1 Data:", data);
        setAboutBlock1Data(data);
      }
      catch (error) {
        console.error("Error fetching about block 1 data:", error);
      }
    }
    fetchaboutblocks1();

    let fetchaboutblock2 = async () => {
      try {
        let response = await fetch("http://localhost:3000/api/fetchaboutblock2");
        let data = await response.json();
        setAboutBlock2Data(data);
        console.log("Fetched About Block 2 Data:", data);
      }
      catch (error) {
        console.error("Error fetching about block 2 data:", error);
      }
    }
    fetchaboutblock2();
  }, [])


  return (
    <section className="about-blocks">
      <div className="container">
        {/* Block 1 */}
        <div className="about-row">
          <div className="about-image">
            <img
              src={aboutBlock1Data[0]?.Image}
              alt="what we offer"
              acceptedformats="image/*"
            />
          </div>

          <div className="about-text">
            <h3>{aboutBlock1Data[0]?.title}</h3>
            <p>
              {aboutBlock1Data[0]?.blockpara1}

            </p>
            <p>
              {aboutBlock1Data[0]?.blockpara2}
            </p>
          </div>
        </div>

        {/* Block 2 */}
        <div className="about-row reverse">
          <div className="about-image">
            <img
              src={aboutBlock2Data[0]?.Image}
              alt="who we are"
              acceptedformats="image/*"
            />
          </div>
          <div className="about-text">
            <h3>{aboutBlock2Data[0]?.title}</h3>
            <p>
              {aboutBlock2Data[0]?.blockpara1}
            </p>
            <p>
              {aboutBlock2Data[0]?.blockpara2}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutBlocks;
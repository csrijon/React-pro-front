import React from "react";
import "./HeroSection.css";
import personImage from "../assets/Group 46.webp"
import StatusBar from "./StatusBar";

const HeroSection = () => {
    return (
        <section className="hero">
            <div className="hero-left">
                <h1>
                    Srijon is a <span className="purple">web designer</span> and{" "}
                    <span className="purple">front-end developer</span>
                </h1>
                <p className="hero-subtext">
                    He crafts responsive websites where technologies meet creativity
                </p>
                <button className="hero-btn">Contact me !!</button>

                <div className="status">
                    <span className="status-dot"></span>
                    <span>
                        Currently working on <strong>Portfolio</strong>
                    </span>
                </div>
            </div>

            <div className="hero-right">
                {/* <img src={Image} alt="person" /> */}
                <img src={personImage} alt="" />
                <StatusBar />
            </div>
        </section>
    );
};

export default HeroSection;

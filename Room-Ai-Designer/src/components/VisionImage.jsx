import React from "react";
import "../css/Visionimage.css";
import bed3 from "../assets/bed6.jpeg";

const Visionimage = () => {
    return (
        <section className="vision-img-section">
            <div className="vision-img-left">
                <img src={bed3} alt="Preview" />
            </div>

            <div className="vision-img-right">
                <h4>AI Prompt Preview</h4>
                <p>
                    Uoenmunressstroviloes orea linhu soono bites stobi tornt lees
                    towasd paetent live sis koet the owewes sest anelt enevrd
                    tivant ovesr soerament at thero lober curosis lenee…
                </p>

                <h4>Favorite Brands</h4>
            </div>
        </section>
    );
};

export default Visionimage;

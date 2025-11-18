import React from "react";
import "../css/Herosection.css";
import heroImage from "../assets/heroimage.png";

const Herosection = () => {

    
    return (
        <section className="hero" >
            <div className="hero-container">
                <div className="hero-left">
                    <h1>Unlock your Dream Space with AI</h1>
                    <p>
                        Transform mobile scans into stunning 3D interiors,
                        visualize in AR/VR.
                    </p>
                </div>
                <div className="hero-right">
                    <img className="hero-image" src={heroImage} alt="3dimage" />
                </div>
            </div>           
        </section>
    )
}
export default Herosection;
import React from "react";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PaletteIcon from '@mui/icons-material/Palette';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import "../css/Herocardsection.css";
import bed1 from "../assets/1st bed room.webp"
import bed2 from "../assets/2nd bed room.webp"
import bed3 from "../assets/3rd bed room.jpg"
import { NavLink } from "react-router-dom";

const HeroCardSction = () => {
    const carddata = [
        { title: "AI-Powered Design", description: "Leverage advanced AI algorithms to create stunning interior designs tailored to your preferences.", icon: <CameraAltIcon /> },
        { title: "3D Visualization", description: "Transform your mobile scans into immersive 3D models for a realistic view of your space.", icon: <PaletteIcon /> },
        { title: "AR/VR Integration", description: "Experience your designs in augmented and virtual reality for an interactive preview.", icon: <ViewInArIcon /> }
    ]

    const imagedata = [
        { image: bed1 },
        { image: bed2 },
        { image: bed3 }
    ]
    return (
        <>
            <div className="features">
                {carddata.map((card, index) => (
                    <div className="feature-card" key={index} >
                        <div className="feature-icon">{card.icon}</div>
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                    </div>
                ))}
            </div>
            <div className="button-row">
                <NavLink to="/Scaner" className="btn">Start Designing Now</NavLink>
            </div>
            <div className="image-section">
                {imagedata.map((img, index) => (
                    <div className="image-card" key={index}>
                        <img src={img.image} alt={`bedroom-${index + 1}`} />
                    </div>
                ))}
            </div>
        </>
    )
}

export default HeroCardSction;
import React from "react";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PaletteIcon from '@mui/icons-material/Palette';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import "../css/HeroCardSction.css";

const HeroCardSction =()=>{
    const carddata = [
        { title: "AI-Powered Design", description: "Leverage advanced AI algorithms to create stunning interior designs tailored to your preferences.", icon: <CameraAltIcon /> },
        { title: "3D Visualization", description: "Transform your mobile scans into immersive 3D models for a realistic view of your space.", icon: <PaletteIcon /> },
        { title: "AR/VR Integration", description: "Experience your designs in augmented and virtual reality for an interactive preview.",icon:<ViewInArIcon/> }
    ]
    return(
         <div className="features">
                {carddata.map((card, index) => (
                    <div className="feature-card" key={index} >
                        <div className="wrapper-icon">{card.icon}</div>
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                    </div>
                ))}
            </div>
    )
}

export default HeroCardSction;
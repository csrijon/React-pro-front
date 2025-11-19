import React from "react";
import "../css/DreamSpaceSteps.css";
import bed4 from "../assets/bed4.webp";
import bed5 from "../assets/bed5.jpg";

// MUI Icons
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import PaletteIcon from "@mui/icons-material/Palette";
import ViewInArIcon from "@mui/icons-material/ViewInAr";

const DreamSpaceSteps = () => {
  const steps = [
    {
      icon: <SmartphoneIcon className="step-icon" />,
      title: "1. Scan & Capture",
      desc: "Use your smartphone to quickly scan any room. Our AR technology captures precise dimensions, wall layouts, inputs, and ceiling openings.",
      images: []
      
    },
    {
      icon: <PaletteIcon className="step-icon" />,
      title: "2. Design & Customize",
      desc: "Browse endless styles, materials, and furniture. Customize to taste, experiment, and watch AI create magic.",
      images: [
        bed4,
        bed5,
      ],
    },
    {
      icon: <ViewInArIcon className="step-icon" />,
      title: "3. Visualize & Live it",
      desc: "Step inside your design with immersive 360° previews and AR overlays. Export BIM/Revit files or share with friends.",
      images: [],
    },
  ];

  return (
    <div className="dream-wrapper">
      <h2 className="dream-title">Your Dream Space, Designed in Minutes</h2>

      <div className="dream-cards">
        {steps.map((step, index) => (
          <div className="dream-card" key={index}>
            {step.icon}
            <h3 className="step-title">{step.title}</h3>
            <p className="step-desc">{step.desc}</p>

            {/* Image previews (only for step 1 & 2) */}
            {step.images.length > 0 && (
              <div className="step-images">
                {step.images.map((img, i) => (
                  <img key={i} src={img} alt="preview" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DreamSpaceSteps;

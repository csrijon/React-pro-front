import React from "react";
import "../css/PricingPlans.css";

// MUI Icons
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PricingPlans = () => {
  // ---------- All Card Data Here ----------
  const plans = [
    {
      title: "Free",
      icon: <DesignServicesIcon style={{ fontSize: 40,color:"#060606ff" }} />,
      bg: "#ffffff",
      priceText: "5 designs / month",
      price: "$11 / month",
      btnText: "Start Free",
      btnType: "start",
      features: [
        "Upscayl Pro",
        "AR / VR Prompts",
        "AR / VR Export",
        "Health Boards",
      ],
    },
    {
      title: "Pro",
      icon: <WorkspacePremiumIcon style={{ fontSize: 40,color:"#060606ff" }} />,
      bg: "#faf6ee",
      recommended: true,
      priceText: "Unlimited designs",
      price: "$49 / month",
      btnText: "Upgrade Now",
      btnType: "upgrade",
      features: [
        "Unlimited Downloads",
        "Retina File Export",
        "AR / VR Export",
        "Priority Support",
      ],
    },
    {
      title: "Business",
      icon: <BusinessCenterIcon style={{ fontSize: 40,color:"#010101ff"}} />,
      bg: "#ffffff",
      priceText: "5 seats / 50 creators",
      price: "$99 / month",
      btnText: "Upgrade Now",
      btnType: "upgrade",
      features: [
        "Rent File Export",
        "AR / VR Export",
        "Profit File Export",
        "Health Boards",
      ],
    },
  ];

  // ----------------------------------------

  return (
    <div className="pricing-wrapper">
      <div className="pricing-container">

        {/* Header */}
        <div className="pricing-header">
          <h2>Find Your Perfect Plan</h2>
          <p>Unlock powerful AI design tools</p>
        </div>

        {/* Cards generated using map() */}
        <div className="pricing-cards">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`plan-card ${plan.recommended ? "recommended" : ""}`}
              style={{ background: plan.bg }}
            >
              {/* Recommended badge */}
              {plan.recommended && (
                <div className="recommended-badge">Recommended</div>
              )}

              {/* Icon */}
              <div className="icon-box">{plan.icon}</div>

              <h3>{plan.title}</h3>

              {/* Price section */}
              <p className="price">
                {plan.priceText}
                <br />
                <span>{plan.price}</span>
              </p>

              {/* Feature List */}
              <ul className="featuress">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <CheckCircleIcon /> {feature}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button className={plan.btnType === "start" ? "btn-start" : "btn-upgrade"}>
                {plan.btnText}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PricingPlans;

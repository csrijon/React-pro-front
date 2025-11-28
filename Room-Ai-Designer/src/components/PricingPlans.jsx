import React, { useState } from "react";
import "../css/PricingPlans.css";

// MUI Icons
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const PricingPlans = () => {

  const [open, setopen] = useState(null)

  const plans = [
    {
      title: "Free",
      icon: <DesignServicesIcon style={{ fontSize: 40, color: "#060606ff" }} />,
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
      icon: <WorkspacePremiumIcon style={{ fontSize: 40, color: "#060606ff" }} />,
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
      icon: <BusinessCenterIcon style={{ fontSize: 40, color: "#010101ff" }} />,
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

  const suggest = [
    {
      title: "What features are included in each plan?",
      desc: "Each plan is designed for different types of users. The Free plan gives you the essential features to get started, while the Pro plan unlocks unlimited access, advanced export options, and priority support. The Business plan is built for teams and creators who need higher limits, multiple seats, and commercial-grade tools. You can compare all features directly from the pricing section to see which plan suits your needs best."
    },
    {
      title: "How do I know if I need a license?",
      desc: "If you work professionally, create content for clients, or need higher-quality exports and unlimited downloads, you’ll need a license. A license ensures you can use all premium features without restrictions and get priority support whenever needed. If you're using the platform beyond basic personal use, upgrading is highly recommended."
    },
    {
      title: "Can I upgrade or downgrade my plan anytime?",
      desc: "Yes, you have full flexibility. You can upgrade to a higher plan whenever you need more features, and your account will instantly unlock the new tools. Similarly, if you feel a plan is no longer necessary, you can downgrade at the next billing cycle without losing access to your files or data."
    },
    {
      title: "Do you provide refunds if I cancel?",
      desc: "We offer fair and transparent billing. If you cancel your subscription, you will continue to have access to your premium features until the end of the billing period. Although partial refunds are not given automatically, our support team is always available to help in case of accidental charges or billing issues.."
    },
    {
      title: "Is the Free plan really free forever?",
      desc: "Yes, the Free plan is completely free and will remain free. You won’t be charged unless you choose to upgrade to Pro or Business. The Free plan has limited features, but it’s a great way to explore the platform and decide if you want access to advanced tools later."
    },
  ]
  const dropdownclick = (index) => {
    setopen(open === index ? null : index)
    console.log("hello i am a guy")
  }
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
        <div className="main-box">
          {suggest.map((item, index) => (
            <div className="box" onClick={() => dropdownclick(index)} >
              <div className="header-feq">
                <h4>{item.title}</h4>
                <span>{open === index ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</span>
              </div>
              {open === index && (<p>{item.desc}</p>)}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PricingPlans;

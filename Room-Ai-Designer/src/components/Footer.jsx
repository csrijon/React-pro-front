import React from "react";
import "../css/Footer.css";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Section */}
        <div className="footer-left">
          <img src="/footerlogo.png" alt="RoomAI Designer" className="footer-logo" />
          <div>
            <h2 className="footer-title">RoomAI Designer</h2>
            <p className="footer-sub">Powered by Trikuta Technology</p>
          </div>
        </div>

        {/* Middle Section */}
        <div className="footer-middle">
          <p>Developed by</p>
          <p className="company">
            Digidil Logic Soft Consultancy Pvt. Ltd.
          </p>
        </div>

        {/* Right Section */}
        <div className="footer-right">
          <p>Follow us on:</p>
          <div className="footer-icons">
            <TwitterIcon />
            <FacebookIcon />
            <InstagramIcon />
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

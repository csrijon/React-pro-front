import "../css/Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
        <div className="container">
      <div className="footer-container">

        {/* Left */}
        <div className="footer-left">
          <div className="logo-box">✦</div>
          <span>AI Project Builder</span>
        </div>

        {/* Center Links */}
        <ul className="footer-links">
          <li>Docs</li>
          <li>GitHub</li>
          <li>Contact</li>
          <li>Privacy Policy</li>
        </ul>

        {/* Right */}
        <div className="footer-right">
          © 2024 AI Project Builder. All rights reserved.
        </div>

      </div>
      </div>
    </footer>
  );
};

export default Footer;
import "../css/Footer.css";
import kiteimages from "../assets/Kites Events (1).png"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
      <div className="footer-top">

        {/* Logo & Social */}
        <div className="footer-col">
          {/* <h2 className="footer-logo">Company Logo</h2> */}
          <img className="footer-logo" src={kiteimages} alt="kite" />
          <p className="footer-title">Social Media</p>
          <div className="social-icons">
            <i className="ri-facebook-fill"></i>
            <i className="ri-twitter-x-line"></i>
            <i className="ri-linkedin-fill"></i>
            <i className="ri-instagram-line"></i>
          </div>
        </div>

        {/* Venues */}
        <div className="footer-col">
          <h4>Venues</h4>
          <ul>
            <li>Abu Dhabi</li>
            <li>Al Ain</li>
            <li>Ajman</li>
            <li>Dubai</li>
            <li>Fujairah</li>
            <li>Ras Al Khaimah</li>
          </ul>
        </div>

        {/* Suppliers */}
        <div className="footer-col">
          <h4>Suppliers</h4>
          <ul>
            <li>Photographers</li>
            <li>Decorators</li>
            <li>Venues Planner</li>
            <li>Choreographers</li>
            <li>Designers</li>
            <li>Makeup Artists</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-col">
          <h4>Newsletter</h4>
          <p className="newsletter-text">
            Subscribe To Get Latest Media Updates
          </p>
          <button className="chat-btn">Live Chat</button>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          Made wit love by <span>Srijon Chowdhury</span>
        </p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;

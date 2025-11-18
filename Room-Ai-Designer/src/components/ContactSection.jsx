import React from "react";
import "../css/ContactSection.css";

// MUI Icons
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";

const ContactSection = () => {
  return (
    <div className="contact-wrapper">
      <div className="contact-container">

        {/* Top Text */}
        <div className="contact-header">
          <h2>How Can We Help?</h2>
          <p>We’re here to answer your questions and provide support</p>
        </div>

        <div className="contact-content">

          {/* Left side */}
          <div className="left-side">

            {/* Card 1 */}
            <div className="info-card">
              <LocalPhoneIcon className="icon" sx={{ fontSize: 40 }} />
              <h3>Call Us</h3>
              <p className="info-number">(555) 123-4667</p>
              <p className="info-small">support 9 AM – 5 PM</p>
            </div>

            {/* Card 2 */}
            <div className="info-card">
              <EmailIcon className="icon" sx={{ fontSize: 45 }} />
              <h3>Email Us</h3>
              <p className="info-number">Live Chat</p>
              <p className="info-small">Priority support</p>
            </div>

            {/* Map box */}
            <div className="map-box">
              <img
                src="https://via.placeholder.com/130x130?text=Map"
                alt="map"
              />
              <div>
                <h4>Office Headquarter Address</h4>
                <p className="map-text">
                  19 this is short street <br />
                  View location also semi street <br />
                  Miami corporate street office <br />
                  lorem ipsum dolor sit amet
                </p>
              </div>
            </div>

          </div>

          {/* Right side (Form) */}
          <div className="right-side">
            <h3 className="form-title">Send Us a Message</h3>

            <form>
              <input type="text" placeholder="Your Name" />
              <input type="email" placeholder="Your Email" />
              <input type="text" placeholder="Subject" />
              <textarea rows="5" placeholder="Message"></textarea>

              <button type="submit" className="btn-send">
                Send Message
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactSection;

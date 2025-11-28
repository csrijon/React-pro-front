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
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6036.824994610947!2d88.35110672920666!3d22.565184589146572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027745734336eb%3A0xcd7691ac8360bae6!2sSiddha%20Esplanade!5e0!3m2!1sen!2sin!4v1763485232863!5m2!1sen!2sin"
    width="50%"
    height="100"
    style={{ border: 0, borderRadius: "12px" }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
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

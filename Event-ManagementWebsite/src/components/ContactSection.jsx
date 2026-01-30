import React from "react";
import "../css/contactSection.css";

const ContactSection = () => {
  return (
    <section className="contact-wrapper">
      {/* Left Form */}
      <div className="contact-form">
        <h2>Say Hello!</h2>

        <label>Full Name</label>
        <input type="text" placeholder="Enter Name" />

        <label>Contact Number</label>
        <input type="text" placeholder="Contact Number" />

        <label>Email Address</label>
        <input type="email" placeholder="Email Address" />

        <label>Message</label>
        <textarea placeholder="Enter Your Message"></textarea>

        <button type="submit">Submit</button>
      </div>

      {/* Right Info */}
      <div className="contact-info">
        <div className="info-block">
          <h3>Vendors</h3>
          <p>
            If you are a registered vendor or a business looking to promote your
            brand on our portal, please send in your queries at
            <br />
            <a href="mailto:vendors@company.com">vendors@company.com</a>
          </p>
        </div>

        <div className="info-block">
          <h3>Marketing Collaborations</h3>
          <p>
            For brand collaborations – sponsored content, social media
            activations etc., please write into
            <br />
            <a href="mailto:partnerships@company.com">
              partnerships@company.com
            </a>
          </p>
        </div>

        <div className="info-block">
          <h3>Wedding Submissions</h3>
          <p>
            &lt;Company Name&gt; features wedding across cultures, styles and
            budgets. To submit your wedding, kindly email us 15–20 photos at
            <br />
            <a href="mailto:submissions@company.com">
              submissions@company.com
            </a>
          </p>
        </div>

        <div className="info-block">
          <h3>Careers</h3>
          <p>
            We are a team of passionate young minds looking to reinvent the
            wedding space. Please check our careers page for current openings
            and email us at
            <br />
            <a href="mailto:hr@company.com">hr@company.com</a>
          </p>
        </div>

        <div className="info-block">
          <h3>Customers</h3>
          <p>
            We love to hear from our precious users. For any feedback or
            queries simply write in to
            <br />
            <a href="mailto:info@company.com">info@company.com</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
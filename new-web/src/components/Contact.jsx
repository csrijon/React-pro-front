import React from 'react';
import './Contact.css';
// Importing icons from the react-icons library
import { FaDiscord } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Contact = () => {
  return (
    <section className="contact-container">
      <div className="contact-content">
        <h2 className="contact-heading">
          <span className="accent-text">#</span>contacts
        </h2>
        <p className="contact-description">
          I'm interested in freelance opportunities. However, if you have other
          requests or questions, don't hesitate to contact me.
        </p>
      </div>
      <div className="contact-box">
        <p className="contact-box-title">Message me here</p>
        <div className="contact-item">
          <FaDiscord className="contact-icon" />
          <span>!Elias#3519</span>
        </div>
        <div className="contact-item">
          <MdEmail className="contact-icon" />
          <span>elias@elias.me</span>
        </div>
      </div>
    </section>
  );
};

export default Contact;
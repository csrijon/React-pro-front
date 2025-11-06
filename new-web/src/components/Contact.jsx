import React from 'react';
import './Contact.css';
// Importing icons from the react-icons library
import { FaDiscord } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import DotGrid from './DotGrid';
import Contacttop from '../ui/Contacttop';

const Contact = () => {
  return (
    <section className="contact-container">
      <Contacttop icon="#" />
      <div className="contact-box">
        <p className="contact-box-title">Message me here</p>
        <div className="contact-item">
          <FaDiscord className="contact-icon" />
          <span>!Elias#3519</span>
        </div>
        <div className="contact-item">
          <MdEmail className="contact-icon" />
          <span>csrijon92@gmail.com</span>
        </div>
      </div>
      <div className="dot-boxes">
        <DotGrid length={16} />
      </div>
    </section>
  );
};

export default Contact;
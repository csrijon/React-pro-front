/* eslint-disable no-unused-vars */
import "../css/Footer.css";
import kiteimages from "../assets/Kites Events (1).png"
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2
    }
  }
}

const columnAnimation = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 14
    }
  }
}

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">

        <motion.div
          className="footer-top"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >

          {/* Logo & Social */}
          <motion.div className="footer-col" variants={columnAnimation}>
            <img loading="lazy" className="footer-logo" src={kiteimages} alt="kite" />
            <p className="footer-title">Social Media</p>

            <div className="social-icons">
              <motion.i whileHover={{ scale: 1.2, y: -3 }} className="ri-facebook-fill"></motion.i>
              <motion.i whileHover={{ scale: 1.2, y: -3 }} className="ri-twitter-x-line"></motion.i>
              <motion.i whileHover={{ scale: 1.2, y: -3 }} className="ri-linkedin-fill"></motion.i>
              <motion.i whileHover={{ scale: 1.2, y: -3 }} className="ri-instagram-line"></motion.i>
            </div>
          </motion.div>

          {/* Venues */}
          <motion.div className="footer-col" variants={columnAnimation}>
            <h4>Venues</h4>
            <ul>
              <li>Abu Dhabi</li>
              <li>Al Ain</li>
              <li>Ajman</li>
              <li>Dubai</li>
              <li>Fujairah</li>
              <li>Ras Al Khaimah</li>
            </ul>
          </motion.div>

          {/* Suppliers */}
          <motion.div className="footer-col" variants={columnAnimation}>
            <h4>Suppliers</h4>
            <ul>
              <li>Photographers</li>
              <li>Decorators</li>
              <li>Venues Planner</li>
              <li>Choreographers</li>
              <li>Designers</li>
              <li>Makeup Artists</li>
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="footer-col" variants={columnAnimation}>
            <h4>Quick Links</h4>
            <ul>
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div className="footer-col" variants={columnAnimation}>
            <h4>Newsletter</h4>
            <p className="newsletter-text">
              Subscribe To Get Latest Media Updates
            </p>

            <motion.button
              className="chat-btn"
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              Live Chat
            </motion.button>

          </motion.div>

        </motion.div>

        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>
            Made with love by <span>Srijon Chowdhury</span>
          </p>
        </motion.div>

      </div>
    </footer>
  );
};

export default Footer;
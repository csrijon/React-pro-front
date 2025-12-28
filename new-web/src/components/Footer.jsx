import React from "react"
import "./Footer.css"
import { motion } from "framer-motion"
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa"
import logo from "../assets/Logo.svg"

const socialLinks = [
  { icon: <FaGithub/>, url: "https://github.com/csrijon" },
  { icon: <FaLinkedin/>, url: "https://www.linkedin.com/in/srijon-chowdhury-87354a268/" },
  { icon: <FaInstagram/>, url: "https://discord.gg/yourinvite" },
];

const Footer = () => {
  return (
    <motion.footer
      className="footer-container"
      // initial={{ opacity: 0, y: 50 }}
      // whileInView={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.6, ease: "easeOut" }}
      // viewport={{ once: true }}
    >
      <div className="footer-content">
        <div className="footer-top">

          {/* LEFT INFO */}
          <motion.div
            className="footer-info"
            // initial={{ opacity: 0, x: -40 }}
            // whileInView={{ opacity: 1, x: 0 }}
            // transition={{ duration: 0.6 }}
            // viewport={{ once: true }}
          >
            <div className="footer-title">
              <motion.img
                src={logo}
                alt="logo"
                // initial={{ scale: 0.8, opacity: 0 }}
                // whileInView={{ scale: 1, opacity: 1 }}
                // transition={{ duration: 0.5 }}
                // viewport={{ once: true }}
              />
              <span className="footer-name">Srijon</span>
              <a
                href="mailto:csrijon92@gmail.com"
                className="footer-email"
              >
                csrijon92@gmail.com
              </a>
            </div>

            <motion.p
              className="footer-description"
              // initial={{ opacity: 0 }}
              // whileInView={{ opacity: 1 }}
              // transition={{ delay: 0.3 }}
              // viewport={{ once: true }}
            >
              Full-Stack Web Developer And App Developer
            </motion.p>
          </motion.div>

          {/* RIGHT MEDIA */}
          <motion.div
            // className="footer-media"
            // initial={{ opacity: 0, x: 40 }}
            // whileInView={{ opacity: 1, x: 0 }}
            // transition={{ duration: 0.6 }}
            // viewport={{ once: true }}
          >
            <h3 className="media-title">Media</h3>

            <motion.div
              className="social-icons"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 },
                },
              }}
            >
              {socialLinks.map((item,index) => (
                <motion.a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* <Icon /> */}{item.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* BOTTOM */}
      <motion.div
        className="footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        viewport={{ once: true }}
      >
        <p>© Copyright 2025. Made by Srijon</p>
      </motion.div>
    </motion.footer>
  )
}

export default Footer

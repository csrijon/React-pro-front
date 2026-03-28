/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "../css/contactSection.css";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const leftAnimation = {
  hidden: { opacity: 0, x: -80 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 14
    }
  }
};

const rightAnimation = {
  hidden: { opacity: 0, x: 80 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 14
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

const ContactSection = () => {
  const [name, updatename] = useState("");
  const [number, setnumber] = useState("");
  const [email, setemail] = useState("");
  const [msg, setmsg] = useState("");

  const Handelname = (e) => updatename(e.target.value);
  const Handelnumber = (e) => setnumber(e.target.value);
  const Handelmail = (e) => setemail(e.target.value);
  const Handelmessage = (e) => setmsg(e.target.value);

  const onsubmit = async () => {
    try {
      const response = await fetch("https://backend-ofevent.onrender.com/api/mailsend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, number, email, msg })
      });

      const data = await response.json();
      console.log(data);

      updatename("");
      setnumber("");
      setemail("");
      setmsg("");

    } catch (error) {
      console.log(error, "server is not working");
    }
  };

  return (
    <section className="contact-wrapper">
      <div className="container">

        {/* Left Form */}
        <motion.div
          className="contact-form"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >

          <motion.h2 variants={leftAnimation}>Say Hello!</motion.h2>

          <motion.label variants={item}>Full Name</motion.label>
          <motion.input variants={item} required value={name} onChange={Handelname} type="text" placeholder="Enter Name" />

          <motion.label variants={item}>Contact Number</motion.label>
          <motion.input variants={item} required value={number} onChange={Handelnumber} type="text" placeholder="Contact Number" />

          <motion.label variants={item}>Email Address</motion.label>
          <motion.input variants={item} required value={email} onChange={Handelmail} type="email" placeholder="Email Address" />

          <motion.select variants={item} required className="custom-select">
            <option value disabled selected>Select Option</option>
            <option value="Vendors">Vendors</option>
            <option value="Marketing Collaborations">Marketing Collaborations</option>
            <option value="Wedding Submissions">Wedding Submissions</option>
            <option value="Careers">Careers</option>
            <option value="Customers">Customers</option>
          </motion.select>

          <motion.label variants={item}>Message</motion.label>
          <motion.textarea variants={item} required value={msg} onChange={Handelmessage} placeholder="Enter Your Message"></motion.textarea>

          <motion.button
            variants={item}
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={onsubmit}
            type="submit"
          >
            Submit
          </motion.button>

        </motion.div>

        {/* Right Map */}
        <motion.div
          className="contact-map"
          variants={rightAnimation}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <iframe
            src="https://www.google.com/maps?q=Kolkata&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            title="map"
          ></iframe>
        </motion.div>

      </div>
    </section>
  );
};

export default ContactSection;
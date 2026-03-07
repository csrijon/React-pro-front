import React, { useState } from "react";
import "../css/contactSection.css";

const ContactSection = () => {
  const [name, updatename] = useState("")
  const [number, setnumber] = useState("")
  const [email, setemail] = useState("")
  const [msg, setmsg] = useState("")

  const Handelname = (Event) => {
    updatename(Event.target.value)
    console.log(Event.target.value)
  }
  const Handelnumber = (Event) => {
    setnumber(Event.target.value)
    console.log(Event.target.value)
  }
  const Handelmail = (Event) => {
    const emaildata = Event.target.value
    setemail(emaildata)
    console.log(Event.target.value)
  }
  const Handelmessage = (Event) => {
    setmsg(Event.target.value)
    console.log(Event.target.value)
  }

  const onsubmit = async () => {

    try {
      const response = await fetch("http://localhost:3000/api/mailsend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, number, email, msg })
      })
      const data = await response.json()
      console.log(data)
      updatename("")
      setnumber("")
      setemail("")
      setmsg("")
    } catch (error) {
      console.log(error, "server is not working")
    }
  }

  return (
    <section className="contact-wrapper">
      <div className="container">
        {/* Left Form */}
        <div className="contact-form">
          <h2>Say Hello!</h2>

          <label>Full Name</label>
          <input required value={name} onChange={Handelname} type="text" placeholder="Enter Name" />

          <label>Contact Number</label>
          <input required value={number} onChange={Handelnumber} type="text" placeholder="Contact Number" />

          <label>Email Address</label>
          <input required value={email} onChange={Handelmail} type="email" placeholder="Email Address" />

          <select required className="custom-select">
            <option value disabled selected>Select Option</option>
            <option className="option" value="Vendors">Vendors</option>
            <option value="Marketing Collaborations">Marketing Collaborations</option>
            <option value="Wedding Submissions">Wedding Submissions</option>
            <option value="Careers">Careers</option>
            <option value="Customers">Customers</option>
          </select>

          <label>Message</label>
          <textarea required value={msg} onChange={Handelmessage} placeholder="Enter Your Message"></textarea>

          <button onClick={onsubmit} type="submit">Submit</button>
        </div>
        {/* Right Map */}
        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps?q=Kolkata&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
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

          <label>Message</label>
          <textarea required value={msg} onChange={Handelmessage} placeholder="Enter Your Message"></textarea>

          <button onClick={onsubmit} type="submit">Submit</button>
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
      </div>
    </section>
  );
};

export default ContactSection;
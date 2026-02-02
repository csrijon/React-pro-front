import React, { useState } from "react";
import "./Suggestion.css";

const Suggestion = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // UI logic only
    console.log({
      name,
      email,
      message,
    });

    // clear inputs after submit
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="suggestion-box">
      <h2>Give me your suggestion</h2>

      <form onSubmit={handleSubmit} className="suggestion-form">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter your gmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <textarea
          placeholder="Write your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Suggestion;
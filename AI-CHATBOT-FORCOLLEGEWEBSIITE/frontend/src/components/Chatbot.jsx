import { useState, useRef, useEffect } from "react";
import Image from "../assets/chatbot.avif"
import "./style.css";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const userMsg = message;
    setMessage("");

    // Show user message + typing
    setChat((prev) => [...prev, { user: userMsg, bot: "Typing..." }]);
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await response.json();

      // Replace typing with real response
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          user: userMsg,
          bot: data.response,
        };
        return updated;
      });
    } catch (error) {
      console.error("Error:", error);
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          user: userMsg,
          bot: "Server error. Please try again.",
        };
        return updated;
      });
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="college-header">
        <img src={Image} alt="JIS College" className="college-image" />
        <h2>AI Chat Assistant</h2>
      </div>

      {/* Chat Box */}
      <div className="chat-box">
        {chat.map((c, index) => (
          <div key={index} className="message-group">
            <p className="user-msg"><b>You:</b> {c.user}</p>
            <p className="bot-msg"><b>Bot:</b> {c.bot}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
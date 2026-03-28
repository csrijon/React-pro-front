import { useState } from "react"
import Image from "../assets/jiscollegeimage.png"
import "./style.css"

function Chatbot() {
    const [message, setMessage] = useState("")
    const [chat, setChat] = useState([])

    const sendMessage = async () => {
        if (message.trim() === "") return

        // Optional: Add user message immediately for better UI feel
        const userMessage = { user: message, bot: "..." };
        setChat([...chat, userMessage]);
        
        try {
            const response = await fetch("http://127.0.0.1:5000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: message })
            })

            const data = await response.json()

            // Replace the "..." with the actual bot response
            setChat(prevChat => {
                const updatedChat = [...prevChat];
                updatedChat[updatedChat.length - 1] = { user: message, bot: data.response };
                return updatedChat;
            });
            
        } catch (error) {
            console.error("Error:", error);
        }
        
        setMessage("")
    }

    return (
        <div className="chat-container">
            
            {/* --- NEW: JIS College Image Header --- */}
            <div className="college-header">
                {/* Replace src with the path to your downloaded JIS College image */}
                <img 
                    src={Image} 
                    alt="JIS College of Engineering Kalyani" 
                    className="college-image"
                />
                <h2>JISCE Assistant</h2>
            </div>

            <div className="chat-box">
                {chat.map((c, index) => (
                    <div key={index} className="message-group">
                        <p className="user-msg"><b>You:</b> {c.user}</p>
                        <p className="bot-msg"><b>Bot:</b> {c.bot}</p>
                    </div>
                ))}
            </div>

            <div className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about admission, fees..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()} /* Press Enter to send */
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            
        </div>
    )
}

export default Chatbot
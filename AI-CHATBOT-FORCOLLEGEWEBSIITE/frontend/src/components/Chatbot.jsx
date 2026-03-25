import { useState } from "react"
import "./style.css"

function Chatbot() {
    const [message, setMessage] = useState("")
    const [chat, setChat] = useState([])

    const sendMessage = async () => {
        if (message.trim() === "") return

        const response = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message })
        })

        const data = await response.json()

        setChat([...chat, { user: message, bot: data.response }])
        setMessage("")
    }

    return (
        <div className="chat-container">
            <div className="chat-box">
                {chat.map((c, index) => (
                    <div key={index}>
                        <p><b>You:</b> {c.user}</p>
                        <p><b>Bot:</b> {c.bot}</p>
                    </div>
                ))}
            </div>

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about admission, fees..."
            />

            <button onClick={sendMessage}>Send</button>
        </div>
    )
}

export default Chatbot
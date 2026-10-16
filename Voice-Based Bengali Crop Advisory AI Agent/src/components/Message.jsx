export default function Message({ message, speaking, onToggleSpeak }) {
  const isUser = message.role === 'user'
  return (
    <div className={`msg ${isUser ? 'user' : 'bot'}`}>
      <div className="avatar">{isUser ? '🧑‍🌾' : '🤖'}</div>
      <div className="bubble">
        <div className="msg-text">{message.text}</div>
        {!isUser && (
          <div className="msg-actions">
            <button className="ghost-btn" onClick={() => onToggleSpeak(message)}>
              {speaking ? '⏹ থামান' : '🔊 শুনুন'}
            </button>
            {message.tools?.length > 0 && (
              <span className="tool-tags">
                {message.tools.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

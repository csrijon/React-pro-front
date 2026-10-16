import { useState } from 'react'

export default function Composer({ busy, listening, onMic, onSend, suggestions }) {
  const [value, setValue] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!value.trim()) return
    onSend(value)
    setValue('')
  }

  return (
    <div className="composer">
      <div className="suggestions">
        {suggestions.map((s) => (
          <button key={s} className="chip" disabled={busy} onClick={() => onSend(s)}>
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="composer-row">
        <button
          type="button"
          className={`mic-btn ${listening ? 'listening' : ''}`}
          onClick={onMic}
          disabled={busy}
          aria-label="Voice input"
        >
          {listening ? '■' : '🎤'}
        </button>
        <input
          className="text-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={listening ? 'শুনছি… বলুন' : 'বাংলায় প্রশ্ন লিখুন বা মাইকে বলুন'}
          disabled={busy}
        />
        <button type="submit" className="send-btn" disabled={busy || !value.trim()}>
          {busy ? '…' : 'পাঠান'}
        </button>
      </form>

      <div className="mic-hint">
        {listening
          ? 'কথা বলুন — শেষ হলে স্বয়ংক্রিয়ভাবে পাঠানো হবে'
          : 'মাইক চেপে বাংলায় কণ্ঠে প্রশ্ন করুন'}
      </div>
    </div>
  )
}

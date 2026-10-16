import { useCallback, useEffect, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import Message from './components/Message.jsx'
import ToolFlow from './components/ToolFlow.jsx'
import Composer from './components/Composer.jsx'
import WeatherCard from './components/WeatherCard.jsx'
import ImageAnalyzer from './components/ImageAnalyzer.jsx'
import { askAgent, DEMO_QUESTIONS } from './lib/mockAgent.js'
import { startListening, speak, stopSpeaking, supportsStt } from './lib/speech.js'

let uid = 0
const nextId = () => ++uid

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: nextId(),
      role: 'assistant',
      text: 'আসসালামু আলাইকুম! আমি আপনার কৃষি সহকারী। ফসল, রোগ, সার, আবহাওয়া — যেকোনো প্রশ্ন কণ্ঠে করুন, আমি বাংলায় উত্তর দেব।',
      tools: [],
    },
  ])
  const [steps, setSteps] = useState(null)
  const [busy, setBusy] = useState(false)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [speakingId, setSpeakingId] = useState(null)
  const [sttError, setSttError] = useState('')
  const [imageResult, setImageResult] = useState(null)
  const stopRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    stopSpeaking()
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, steps, interim])

  const send = useCallback(
    async (raw, opts = {}) => {
      const text = raw.trim()
      if (!text || busy) return
      setBusy(true)
      setInterim('')
      setSttError('')
      setMessages((m) => [...m, { id: nextId(), role: 'user', text }])
      setSteps(null)

      try {
        const res = await askAgent({
          text,
          hasImage: Boolean(opts.hasImage),
          onStep: setSteps,
        })
        const id = nextId()
        setMessages((m) => [...m, { id, role: 'assistant', text: res.text, tools: res.tools }])
        speak(res.text, {
          onEnd: () => setSpeakingId((cur) => (cur === id ? null : cur)),
        })
        setSpeakingId(id)
      } finally {
        setBusy(false)
        setSteps(null)
      }
    },
    [busy]
  )

  const toggleMic = () => {
    if (listening) {
      stopRef.current?.()
      return
    }
    if (!supportsStt()) {
      setSttError('এই ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয় — অনুগ্রহ করে Chrome/Edge ব্যবহার করুন।')
      return
    }
    stopRef.current = startListening({
      lang: 'bn-BD',
      onInterim: setInterim,
      onFinal: (t) => {
        stopRef.current = null
        setListening(false)
        send(t)
      },
      onError: (e) => {
        stopRef.current = null
        setListening(false)
        if (e === 'not-allowed' || e === 'service-not-allowed')
          setSttError('মাইক্রোফোনের অনুমতি প্রয়োজন — ব্রাউজার সেটিংসে অনুমতি দিন।')
        else if (e !== 'no-speech' && e !== 'aborted')
          setSttError('ভয়েস ধরা যায়নি, আবার চেষ্টা করুন।')
      },
      onEnd: () => {
        setListening(false)
        stopRef.current = null
      },
    })
    setListening(true)
  }

  const toggleSpeak = (msg) => {
    if (speakingId === msg.id) {
      stopSpeaking()
      setSpeakingId(null)
      return
    }
    speak(msg.text, { onEnd: () => setSpeakingId((c) => (c === msg.id ? null : c)) })
    setSpeakingId(msg.id)
  }

  return (
    <div className="app">
      <Header />

      <main className="layout">
        <section className="chat-panel">
          <div className="chat-scroll" ref={scrollRef}>
            {messages.map((m) => (
              <Message
                key={m.id}
                message={m}
                speaking={speakingId === m.id}
                onToggleSpeak={toggleSpeak}
              />
            ))}

            {steps && (
              <div className="flow-card">
                <div className="flow-title">এজেন্ট কাজ করছে…</div>
                <ToolFlow steps={steps} />
              </div>
            )}

            {interim && (
              <div className="interim">
                <span className="dot" /> {interim}
              </div>
            )}
          </div>

          {sttError && <div className="alert">{sttError}</div>}

          <Composer
            busy={busy}
            listening={listening}
            onMic={toggleMic}
            onSend={(t) => send(t)}
            suggestions={DEMO_QUESTIONS}
          />
        </section>

        <aside className="side-panel">
          <WeatherCard />
          <ImageAnalyzer onResult={setImageResult} result={imageResult} />

          <div className="card expert">
            <div className="card-title">বিশেষজ্জ পরামর্শ</div>
            <p>
              এই এজেন্ট ২৪/৭ প্রাথমিক সহায়তা দেয় — কৃষি বিশেষজ্ঞের বিকল্প নয়। জটিল বা
              অনিশ্চিত পরিস্থিতিতে স্থানীয় কৃষি বিশেষজ্ঞের পরামর্শ নিন।
            </p>
          </div>
        </aside>
      </main>

      <footer className="footer">
        কণ্ঠভিত্তিক বাংলা ফসল পরামর্শ AI এজেন্ট · STT · RAG · আবহাওয়া টুল · রোগ শনাক্তি
      </footer>
    </div>
  )
}

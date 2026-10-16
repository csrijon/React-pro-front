import { useEffect, useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AskAdvice from './pages/AskAdvice.jsx'
import CropGuide from './pages/CropGuide.jsx'
import Weather from './pages/Weather.jsx'
import About from './pages/About.jsx'
import { getHealth, apiBase } from './lib/api.js'

const NAV = [
  { to: '/', label: 'হোম', end: true },
  { to: '/ask', label: 'পরামর্শ নিন' },
  { to: '/guide', label: 'ফসল নির্দেশিকা' },
  { to: '/weather', label: 'আবহাওয়া' },
  { to: '/about', label: 'প্রকল্প সম্পর্কে' },
]

export default function App() {
  const [health, setHealth] = useState(null)
  const [healthError, setHealthError] = useState(false)

  useEffect(() => {
    let alive = true
    getHealth()
      .then((h) => alive && setHealth(h))
      .catch(() => alive && setHealthError(true))
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        মূল কন্টেন্টে যান
      </a>

      <header className="site-header">
        <div className="wrap header-inner">
          <div>
            <h1 className="brand">বাংলা কৃষি সহায়ক</h1>
            <p className="tagline">Voice-Based Bengali Crop Advisory AI Agent</p>
          </div>
          <nav aria-label="প্রধান নেভিগেশন">
            <ul className="nav">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {healthError && (
        <div className="banner banner-error wrap" role="alert">
          ব্যাকএন্ড সার্ভার পাওয়া যায়নি ({apiBase})। <code>npm start</code> দিয়ে ব্যাকএন্ড চালু
          করুন।
        </div>
      )}
      {/* {health?.demo_mode && (
        <div className="banner banner-demo wrap" role="status">
          <strong>ডেমো মোড সক্রিয়:</strong> ব্যাকএন্ড এখন mock (নকল) মডেল ব্যবহার করছে — উত্তর
          বাস্তব LLM থেকে আসছে না। সত্যিকারের উত্তরের জন্য ব্যাকএন্ডে <code>LLM_PROVIDER=openai</code>{' '}
          সেট করুন।
        </div>
      )} */}
      {health && !health.demo_mode && (
        <div className="banner banner-ok wrap" role="status">
          <strong>লাইভ মোড:</strong> ব্যাকএন্ড LLM প্রোভাইডারে সংযুক্ত ({health.provider} ·{' '}
          {health.model || 'model from env'}).
        </div>
      )}

      <main id="main" className="wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ask" element={<AskAdvice />} />
          <Route path="/guide" element={<CropGuide />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <p>
            বাংলা কৃষি সহায়ক — MCA ফাইনাল ইয়ার প্রকল্প (ডেমো)। এটি প্রাথমিক তথ্য সহায়তা, কৃষি
            বিশেষজ্ঞের বিকল্প নয়।
          </p>
          <p className="muted">
            গুরুতর বা অনিশ্চিত সমস্যায় স্থানীয় কৃষি বিশেষজ্ঞ বা কৃষি বিজ্ঞান কেন্দ্রে (KVK) যোগাযোগ
            করুন।
          </p>
        </div>
      </footer>
    </div>
  )
}

function NotFound() {
  return (
    <section className="card">
      <h2>পৃষ্ঠা পাওয়া যায়নি</h2>
      <p>আপনি যে ঠিকানায় গেছেন সেখানে কিছু নেই। হোম পেজে ফিরে যান।</p>
      <p>
        <NavLink to="/">হোমে ফিরুন</NavLink>
      </p>
    </section>
  )
}

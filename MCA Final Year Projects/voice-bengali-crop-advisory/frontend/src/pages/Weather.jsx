import { useEffect, useState } from 'react'
import { getWeather } from '../lib/api.js'

export default function Weather() {
  const [payload, setPayload] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    getWeather()
      .then((d) => alive && setPayload(d))
      .catch((e) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [])

  if (error) {
    return (
      <div className="card error-box" role="alert">
        আবহাওয়ার তথ্য আনা যায়নি: {error}
      </div>
    )
  }
  if (!payload) return <p className="card">লোড হচ্ছে…</p>

  const d = payload.data

  return (
    <div className="stack">
      <section className="card">
        <div className="result-head">
          <h2>আবহাওয়া</h2>
          {payload.live ? (
            <span className="badge badge-ok">লাইভ তথ্য</span>
          ) : (
            <span className="badge badge-demo">ডেমো তথ্য</span>
          )}
        </div>

        {payload.demo_note && <p className="caution">{payload.demo_note}</p>}

        <dl className="weather-grid">
          <div>
            <dt>এলাকা</dt>
            <dd>{d.place}</dd>
          </div>
          <div>
            <dt>তাপমাত্রা</dt>
            <dd>{d.temp_c ?? '—'}°C</dd>
          </div>
          <div>
            <dt>আর্দ্রতা</dt>
            <dd>{d.humidity ?? '—'}%</dd>
          </div>
          <div>
            <dt>বাতাস (কিমি/ঘণ্টা)</dt>
            <dd>{d.wind_kph ?? '—'}</dd>
          </div>
          <div>
            <dt>বৃষ্টির সম্ভাবনা (মেঘ ভিত্তিক)</dt>
            <dd>{d.rain_chance ?? '—'}%</dd>
          </div>
          <div>
            <dt>অবস্থা</dt>
            <dd>{d.condition}</dd>
          </div>
        </dl>

        <p className="caution">{d.advice_bn}</p>
        <p className="muted">
          সত্যিকারের আবহাওয়া পূর্বাভাস সবসময় বিশ্বস্ত আবহাওয়া সেবা থেকে যাচাই করে নিন। ব্যাকএন্ডে{' '}
          <code>WEATHER_API_KEY</code> সেট করলে এখানে লাইভ তথ্য দেখাবে।
        </p>
      </section>
    </div>
  )
}

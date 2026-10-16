import { useEffect, useState } from 'react'
import { getCropGuide } from '../lib/api.js'

export default function CropGuide() {
  const [entries, setEntries] = useState([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    getCropGuide()
      .then((data) => {
        if (!alive) return
        setEntries(data.entries)
        setStatus('ready')
      })
      .catch((e) => {
        if (!alive) return
        setError(e.message)
        setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [])

  const filtered = entries.filter((e) => {
    const needle = q.trim().toLowerCase()
    if (!needle) return true
    const hay = [e.title_bn, e.title_en, e.summary_bn, ...(e.crops || []), ...(e.topics || [])]
      .join(' ')
      .toLowerCase()
    return hay.includes(needle)
  })

  return (
    <div className="stack">
      <section className="card">
        <h2>ফসল নির্দেশিকা</h2>
        <p className="muted">
          নিচের তথ্য ছোট ডেমো জ্ঞানভাণ্ডার থেকে আসছে — প্রতিটি এন্ট্রি কৃষি বিশেষজ্ঞ যাচাইয়ের
          অপেক্ষায়। কীটনাশকের নির্দিষ্ট মাত্রা ইচ্ছাকৃতভাবে দেওয়া হয়নি।
        </p>
        <label className="label" htmlFor="search">
          সার্চ করুন (ফসল বা বিষয়)
        </label>
        <input
          id="search"
          className="input"
          type="search"
          value={q}
          placeholder="যেমন: ধান, আলু, পাট, সেচ, সার…"
          onChange={(e) => setQ(e.target.value)}
        />
      </section>

      {status === 'loading' && <p className="card">লোড হচ্ছে…</p>}
      {status === 'error' && (
        <p className="card error-box" role="alert">
          নির্দেশিকা আনা যায়নি: {error}
        </p>
      )}

      {status === 'ready' && filtered.length === 0 && (
        <p className="card">কিছু পাওয়া যায়নি — অন্য শব্দ দিয়ে খুঁজুন।</p>
      )}

      <div className="stack">
        {filtered.map((e) => (
          <article className="card crop-entry" key={e.id}>
            <div className="result-head">
              <h3>{e.title_bn}</h3>
              <span className="badge badge-demo">ডেমো · যাচাই বাকি</span>
            </div>
            <p className="muted">{e.title_en}</p>
            <p>{e.summary_bn}</p>
            <ul className="bullets">
              {(e.body_bn || []).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            {e.caution_bn && <p className="caution">{e.caution_bn}</p>}
            <p className="source-meta">
              <span>প্রকাশক: {e.publisher}</span>
              <span>ফসল: {(e.crops || []).join(', ')}</span>
              <span>বিষয়: {(e.topics || []).join(', ')}</span>
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

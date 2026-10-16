import { useState } from 'react'
import { getAdvice } from '../lib/api.js'

const EXAMPLES = [
  'ধানের ক্ষেতে পানি কীভাবে দেব?',
  'আমার ধানের পাতায় ছোপ দেখছি, কী করব?',
  'ইউরিয়া সার কীভাবে দেব?',
  'আলুর জমিতে পানি জমে গেলে কী হয়?',
  'পাট চাষে কী খেয়াল রাখব?',
]

const CROPS = ['', 'ধান', 'আলু', 'পাট', 'সবজি']

export default function AskAdvice() {
  const [question, setQuestion] = useState('')
  const [crop, setCrop] = useState('')
  const [language, setLanguage] = useState('bn')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const submit = async (textOverride) => {
    const q = (textOverride ?? question).trim()
    if (!q) {
      setError('প্রশ্ন লিখুন বা নিচের উদাহরণগুলোর একটি বেছে নিন।')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await getAdvice({ question: q, crop, language })
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="stack">
      <section className="card">
        <h2>পরামর্শ নিন</h2>
        <p className="muted">
          আপনার প্রশ্ন বাংলা বা ইংরেজিতে লিখুন। উত্তর বাংলায় দেওয়া হবে।
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <label className="label" htmlFor="question">
            আপনার প্রশ্ন
          </label>
          <textarea
            id="question"
            className="textarea"
            rows={4}
            value={question}
            maxLength={600}
            placeholder="যেমন: ধানের ক্ষেতে পানি কীভাবে দেব?"
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
          />

          <div className="row">
            <div>
              <label className="label" htmlFor="crop">
                ফসল (ঐচ্ছিক)
              </label>
              <select
                id="crop"
                className="select"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                disabled={loading}
              >
                {CROPS.map((c) => (
                  <option key={c} value={c}>
                    {c || '— নির্বাচন নেই —'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="lang">
                উত্তরের ভাষা
              </label>
              <select
                id="lang"
                className="select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={loading}
              >
                <option value="bn">বাংলা</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className="row row-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'উত্তর তৈরি হচ্ছে…' : 'প্রশ্ন পাঠান'}
            </button>
            <MicButton />
          </div>
        </form>

        <div className="examples">
          <span className="label">উদাহরণ প্রশ্ন:</span>
          <ul className="chips">
            {EXAMPLES.map((ex) => (
              <li key={ex}>
                <button
                  type="button"
                  className="chip"
                  disabled={loading}
                  onClick={() => {
                    setQuestion(ex)
                    submit(ex)
                  }}
                >
                  {ex}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {loading && (
        <div className="card loading" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" /> এজেন্ট কাজ করছে… প্রশ্ন শ্রেণিবদ্ধ করা,
          জ্ঞানভাণ্ডার খোঁজা ও উত্তর তৈরি হচ্ছে।
        </div>
      )}

      {error && (
        <div className="card error-box" role="alert">
          <strong>সমস্যা হয়েছে:</strong> {error}
        </div>
      )}

      {result && <AdviceResult result={result} />}
    </div>
  )
}

function MicButton() {
  return (
    <button
      type="button"
      className="btn btn-mic"
      disabled
      title="Phase 3 এ যোগ হবে (Web Speech API)"
      aria-disabled="true"
    >
      🎤 ভয়েস ইনপুট — শীঘ্রই আসছে
      <span className="sr-only">(এখনো সক্রিয় নয়)</span>
    </button>
  )
}

function AdviceResult({ result }) {
  return (
    <section className="card result" aria-live="polite">
      <div className="result-head">
        <h3>উত্তর</h3>
        <div className="badges">
          <span className="badge">{CATEGORY_LABEL[result.category] || result.category}</span>
          {result.provider?.demo && <span className="badge badge-demo">ডেমো উত্তর (mock)</span>}
        </div>
      </div>

      <p className="answer">{result.answer}</p>

      {result.uncertainty?.needs_expert && (
        <p className="caution">
          <strong>গুরুত্বপূর্ণ:</strong>{' '}
          {result.uncertainty.reason === 'no_knowledge_base_match'
            ? 'এই প্রশ্নের জন্য আমাদের জ্ঞানভাণ্ডারে পর্যাপ্ত তথ্য পাওয়া যায়নি — উত্তরটি নিশ্চিত নয়।'
            : 'এটি ডেমো উত্তর — বাস্তব মডেল থেকে আসেনি।'}{' '}
          স্থানীয় কৃষি বিশেষজ্ঞ বা কৃষি বিজ্ঞান কেন্দ্রে (KVK) যোগাযোগ করুন।
        </p>
      )}

      <div className="sources">
        <h4>তথ্যসূত্র / প্রমাণ (knowledge base)</h4>
        {result.sources?.length ? (
          <ul>
            {result.sources.map((s) => (
              <li key={s.id}>
                <span className="source-title">
                  {s.title_bn} <span className="muted">({s.title_en})</span>
                </span>
                <div className="source-meta">
                  <span>প্রকাশক: {s.publisher}</span>
                  <span>স্কোর: {s.score}</span>
                  <span>
                    যাচাই:{' '}
                    {s.needs_review ? 'বিশেষজ্ঞ যাচাইয়ের অপেক্ষায়' : s.reviewed_date || '—'}
                  </span>
                  {s.url ? (
                    <a href={s.url} rel="noreferrer noopener" target="_blank">
                      উৎস দেখুন
                    </a>
                  ) : (
                    <span className="muted">কোনো যাচাইকৃত লিংক নেই</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">কোনো তথ্যসূত্র পাওয়া যায়নি — তাই উত্তরটি নিশ্চিত নয়।</p>
        )}
      </div>

      <details className="agent-steps">
        <summary>এজেন্ট কী কী ধাপ পেরিয়েছে (agent trace)</summary>
        <ol>
          {result.steps?.map((s, i) => (
            <li key={i}>
              <code>{s.tool}</code> — {s.label} <span className="muted">({s.detail})</span>
            </li>
          ))}
        </ol>
      </details>
    </section>
  )
}

const CATEGORY_LABEL = {
  crop_problem: 'ফসল/সমস্যা',
  irrigation: 'সেচ',
  pest: 'পোক ও রোগ',
  fertilizer: 'সার',
  general: 'সাধারণ',
}

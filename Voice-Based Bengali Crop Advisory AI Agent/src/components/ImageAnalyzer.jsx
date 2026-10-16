import { useRef, useState } from 'react'
import { analyzeImage } from '../lib/mockAgent.js'

export default function ImageAnalyzer({ result, onResult }) {
  const [preview, setPreview] = useState('')
  const [progress, setProgress] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setPreview(URL.createObjectURL(file))
    setBusy(true)
    setProgress('')
    const res = await analyzeImage({ onProgress: setProgress })
    onResult(res)
    setBusy(false)
  }

  return (
    <div className="card image-card">
      <div className="card-title">
        পাতার ছবি পাঠান <span className="tag">disease_model</span>
      </div>

      <div
        className="dropzone"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFile(e.dataTransfer.files?.[0])
        }}
      >
        {preview ? (
          <img src={preview} alt="uploaded leaf" className="preview" />
        ) : (
          <div className="drop-hint">
            <div className="drop-icon">🍃</div>
            ছবি টেনে আনুন বা ক্লিক করুন
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {busy && <div className="progress">🔄 {progress || 'বিশ্লেষণ চলছে…'}</div>}

      {result && !busy && (
        <div className="result">
          <div className="result-head">
            <strong>{result.name}</strong>
            <span className="conf">{result.confidence}% নিশ্চিত</span>
          </div>
          <p>{result.advice}</p>
        </div>
      )}
    </div>
  )
}

const SR =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : undefined

export const supportsStt = Boolean(SR)

export function supportsTts() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function startListening({ lang = 'bn-BD', onInterim, onFinal, onError, onEnd }) {
  if (!SR) {
    onError?.('speech-unsupported')
    return null
  }
  const rec = new SR()
  rec.lang = lang
  rec.continuous = false
  rec.interimResults = true
  rec.maxAlternatives = 1

  rec.onresult = (event) => {
    let interim = ''
    let final = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript
      if (event.results[i].isFinal) final += t
      else interim += t
    }
    if (interim) onInterim?.(interim)
    if (final) onFinal?.(final.trim())
  }
  rec.onerror = (e) => onError?.(e.error || 'unknown')
  rec.onend = () => onEnd?.()

  try {
    rec.start()
  } catch (e) {
    onError?.('start-failed')
    return null
  }
  return () => {
    try {
      rec.stop()
    } catch {
      /* already stopped */
    }
  }
}

function pickVoice(lang) {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang?.startsWith(lang.slice(0, 2))) ||
    voices.find((v) => /bn|Bengali/i.test(v.lang + v.name)) ||
    null
  )
}

export function speak(text, { lang = 'bn-BD', onEnd } = {}) {
  if (!supportsTts() || !text) {
    onEnd?.()
    return false
  }
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  const voice = pickVoice(lang)
  if (voice) u.voice = voice
  u.rate = 0.98
  u.onend = () => onEnd?.()
  u.onerror = () => onEnd?.()
  window.speechSynthesis.speak(u)
  return true
}

export function stopSpeaking() {
  if (supportsTts()) window.speechSynthesis.cancel()
}

import { storage } from './storage'

let ctx

function getContext() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx ??= new AC()
  return ctx
}

/**
 * Browsers keep Web Audio muted until the visitor has interacted with the page. Call this once at start-up:
 * the first click / tap / key press anywhere unlocks audio, so the order chime can play later.
 */
export function primeAudio() {
  const unlock = () => {
    const c = getContext()
    if (c && c.state === 'suspended') c.resume().catch(() => {})
    window.removeEventListener('pointerdown', unlock, true)
    window.removeEventListener('keydown', unlock, true)
  }
  window.addEventListener('pointerdown', unlock, true)
  window.addEventListener('keydown', unlock, true)
}

/**
 * Short rising "success" chime (C5-E5-G5-C6), synthesised with the Web Audio API: no audio file to download or license.
 * Resolves to true when the sound was actually started, false when the browser blocked it (or sound is switched off).
 * Turn the sound off with: localStorage.setItem('mg_sound', '"off"')
 */
export async function playSuccessSound({ force = false } = {}) {
  try {
    if (!force && storage.get('mg_sound') === 'off') return false
    const c = getContext()
    if (!c) return false
    if (c.state === 'suspended') await Promise.race([c.resume(), new Promise((r) => setTimeout(r, 600))])
    if (c.state !== 'running') {
      console.warn('[sound] The browser blocked audio until you click or tap on the page.')
      return false
    }
    const start = c.currentTime + 0.05
    ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const t = start + i * 0.12
      // a soft triangle layer an octave up gives the sine a bell-like tone
      for (const [type, f, peak] of [['sine', freq, 0.45], ['triangle', freq * 2, 0.12]]) {
        const osc = c.createOscillator()
        const gain = c.createGain()
        osc.type = type
        osc.frequency.value = f
        gain.gain.setValueAtTime(0.0001, t)
        gain.gain.exponentialRampToValueAtTime(peak, t + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9)
        osc.connect(gain).connect(c.destination)
        osc.start(t)
        osc.stop(t + 0.95)
      }
    })
    return true
  } catch {
    return false // sound is a nicety: never let it break the page
  }
}

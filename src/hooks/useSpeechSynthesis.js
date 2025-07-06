import { useRef } from 'react'

// Map i18next language codes to Web Speech API voice language codes
const LANGUAGE_MAP = {
  en: 'en-US',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  bn: 'bn-IN',
  ml: 'ml-IN',
  ur: 'ur-IN',
}

export default function useSpeechSynthesis() {
  const synthRef = useRef(window.speechSynthesis)
  const utteranceRef = useRef(null)

  // Find a voice that matches the language
  const getVoice = (lang) => {
    const voices = synthRef.current.getVoices()
    // Try exact match
    let voice = voices.find(v => v.lang === lang)
    if (!voice) {
      // Try partial match (e.g., 'hi' for 'hi-IN')
      voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]))
    }
    // Fallback to default
    return voice || voices[0]
  }

  // Speak the given text in the specified language
  const speak = (text, lang = 'en') => {
    if (!('speechSynthesis' in window)) return
    if (synthRef.current.speaking) {
      synthRef.current.cancel()
    }
    const voiceLang = LANGUAGE_MAP[lang] || 'en-US'
    const utter = new window.SpeechSynthesisUtterance(text)
    utter.lang = voiceLang
    utter.voice = getVoice(voiceLang)
    utter.rate = 1
    utter.pitch = 1
    utter.volume = 1
    utteranceRef.current = utter
    synthRef.current.speak(utter)
  }

  // Stop speaking
  const stop = () => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel()
    }
  }

  return { speak, stop, speaking: synthRef.current.speaking }
} 
import { useState, useCallback } from 'react';

const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isSupported = typeof window !== 'undefined' && 
    'speechSynthesis' in window && 
    'SpeechSynthesisUtterance' in window;

  const speak = useCallback((text, language = 'en-US', rate = 1) => {
    if (!isSupported || !text) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = rate;
      utterance.volume = 1;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Speech synthesis failed:', error);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported };
};

export default useSpeech; 
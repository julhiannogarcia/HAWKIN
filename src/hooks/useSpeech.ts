'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeech = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const loadVoices = useCallback(() => {
    if (typeof window === 'undefined') return;
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      setVoices(availableVoices);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, [loadVoices]);

  const speak = useCallback((text: string, lang: 'en' | 'es', onEnd?: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = lang === 'en' ? 'en-US' : 'es-MX';
    
    // Buscar la mejor voz
    const selectedVoice = 
      voices.find(v => v.lang.includes(langCode) && v.name.includes('Google')) ||
      voices.find(v => v.lang.includes(langCode) && v.name.includes('Microsoft')) ||
      voices.find(v => v.lang.includes(langCode)) ||
      voices[0];

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.lang = langCode;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voices]);

  const stop = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { isReady, isSpeaking, speak, stop, voices };
};

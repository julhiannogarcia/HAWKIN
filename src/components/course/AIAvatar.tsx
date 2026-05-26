'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles, Languages } from 'lucide-react';

interface AIAvatarProps {
  text: string;
  lang: 'en' | 'es';
  isSpeaking: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  autoStart?: boolean;
}

export default function AIAvatar({ text, lang, isSpeaking, onStart, onEnd, autoStart = false }: AIAvatarProps) {
  const [internalIsSpeaking, setInternalIsSpeaking] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Seleccionar la mejor voz disponible para el idioma
  const findBestVoice = useCallback((targetLang: 'en' | 'es') => {
    const voices = window.speechSynthesis.getVoices();
    const langCode = targetLang === 'en' ? 'en-US' : 'es-MX';
    
    // Preferencia: Google, luego Microsoft, luego cualquiera que coincida con el idioma
    return (
      voices.find(v => v.lang.includes(langCode) && v.name.includes('Google')) ||
      voices.find(v => v.lang.includes(langCode) && v.name.includes('Microsoft')) ||
      voices.find(v => v.lang.includes(targetLang)) ||
      null
    );
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      setVoice(findBestVoice(lang));
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, [lang, findBestVoice]);

  const speak = useCallback(() => {
    if (!text || typeof window === 'undefined') return;

    // Cancelar cualquier discurso previo
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;
    utterance.lang = lang === 'en' ? 'en-US' : 'es-MX';
    utterance.rate = 0.9; // Un poco más lento para mejor aprendizaje
    utterance.pitch = 1.1; // Tono ligeramente más futurista/amigable

    utterance.onstart = () => {
      setInternalIsSpeaking(true);
      onStart?.();
    };

    utterance.onend = () => {
      setInternalIsSpeaking(false);
      onEnd?.();
    };

    utterance.onerror = () => {
      setInternalIsSpeaking(false);
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }, [text, lang, voice, onStart, onEnd]);

  useEffect(() => {
    if (isSpeaking && !internalIsSpeaking) {
      speak();
    } else if (!isSpeaking && internalIsSpeaking) {
      window.speechSynthesis.cancel();
      setInternalIsSpeaking(false);
    }
  }, [isSpeaking, speak, internalIsSpeaking]);

  useEffect(() => {
    if (autoStart) {
      // Pequeño delay para que el usuario esté listo
      const timer = setTimeout(speak, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoStart, speak]);

  return (
    <div className="relative flex flex-col items-center justify-center p-12">
      {/* EL AVATAR: NÚCLEO HAWKIN IA */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Anillos de energía de fondo */}
        <AnimatePresence>
          {internalIsSpeaking && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.5, 2], 
                    opacity: [0.3, 0.1, 0] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.6,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Círculo Principal Vibrante */}
        <motion.div
          animate={internalIsSpeaking ? {
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 20px rgba(34,211,238,0.3)",
              "0 0 50px rgba(34,211,238,0.6)",
              "0 0 20px rgba(34,211,238,0.3)"
            ]
          } : { scale: 1 }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="relative z-10 w-40 h-40 bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl border border-white/20"
        >
          {/* Ojo / Centro de Proceso */}
          <motion.div 
            animate={internalIsSpeaking ? {
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1.1, 0.8]
            } : { opacity: 0.8 }}
            transition={{ duration: 0.3, repeat: Infinity }}
            className="w-16 h-16 bg-white rounded-full blur-[2px] opacity-80 flex items-center justify-center"
          >
            <div className="w-8 h-8 bg-cyan-400 rounded-full shadow-[0_0_20px_#22d3ee]" />
          </motion.div>
        </motion.div>

        {/* Indicador de Idioma */}
        <div className="absolute -top-4 -right-4 bg-black border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
          <Languages className="text-cyan-400" size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            {lang === 'en' ? 'Inglés' : 'Español'}
          </span>
        </div>
      </div>

      {/* Control de Audio Visual */}
      <div className="mt-12 flex items-center gap-3">
        <div className={`flex gap-1 items-end h-4 ${internalIsSpeaking ? 'opacity-100' : 'opacity-20'}`}>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={internalIsSpeaking ? {
                height: [4, 16, 8, 14, 4]
              } : { height: 4 }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity, 
                delay: i * 0.1 
              }}
              className="w-1 bg-cyan-400 rounded-full"
            />
          ))}
        </div>
        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">
          {internalIsSpeaking ? 'Procesando Voz IA...' : 'Avatar en Espera'}
        </span>
      </div>
    </div>
  );
}

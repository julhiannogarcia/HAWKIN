'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

interface VoiceRecorderProps {
  targetPhrase: string;
  onResult: (accuracy: number, transcript: string) => void;
  lang?: 'en-US' | 'es-MX';
}

export default function VoiceRecorder({ targetPhrase, onResult, lang = 'en-US' }: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Inicializar el motor de reconocimiento de voz del navegador
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Safari.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang;

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      
      // Lógica de comparación simple (Case-insensitive y limpieza de puntos/comas)
      const cleanTarget = targetPhrase.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
      const cleanResult = result.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
      
      // Calcular precisión básica (porcentaje de palabras correctas)
      const targetWords = cleanTarget.split(' ');
      const resultWords = cleanResult.split(' ');
      const correctWords = resultWords.filter(word => targetWords.includes(word));
      const accuracy = (correctWords.length / targetWords.length) * 100;

      onResult(Math.min(accuracy, 100), result);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setError('Permiso de micrófono denegado.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [lang, targetPhrase, onResult]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setError(null);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-10 bg-white/[0.02] border border-white/5 rounded-[40px]">
      <div className="relative">
        {/* EFECTO DE ONDAS DE VOZ */}
        <AnimatePresence>
          {isListening && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                  className="absolute inset-0 bg-cyan-500/20 rounded-full -z-10"
                />
              ))}
            </>
          )}
        </AnimatePresence>

        <button
          onClick={toggleListening}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl ${
            isListening 
              ? 'bg-red-500 shadow-red-500/40 animate-pulse' 
              : 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/40'
          }`}
        >
          {isListening ? <MicOff className="text-white" size={32} /> : <Mic className="text-black" size={32} />}
        </button>
      </div>

      <div className="text-center space-y-4">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
          {isListening ? 'HAWKIN está escuchando...' : 'Pulsa el micro y habla'}
        </p>
        
        {transcript && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-black/40 border border-white/10 rounded-2xl"
          >
            <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-2">Escuché esto:</p>
            <p className="text-lg font-bold italic text-white">"{transcript}"</p>
          </motion.div>
        )}

        {error && (
          <p className="text-red-500 text-[9px] font-black uppercase flex items-center justify-center gap-2">
            <AlertCircle size={14} /> {error}
          </p>
        )}
      </div>

      {!isListening && transcript && (
        <button 
          onClick={toggleListening}
          className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
        >
          <RotateCcw size={14} /> Intentar de nuevo
        </button>
      )}
    </div>
  );
}

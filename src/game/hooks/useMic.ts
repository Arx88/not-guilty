/**
 * Hook para manejar micrófono:
 * - Web Speech API (SpeechRecognition) para transcripción en streaming
 * - Web Audio API (AnalyserNode) para medir volumen en tiempo real
 * - Detección de palabras clave: "protesto", "objeción", "recusación", "recuerdo"
 */
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useGame } from '../state/store';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface UseMicOptions {
  onKeyword?: (keyword: string, fullText: string) => void;
  onFinalTranscript?: (text: string) => void;
}

const KEYWORDS = ['protesto', 'protesta', 'objeción', 'objecion', 'recusación', 'recusacion', 'recuerdo', 'sí', 'si', 'no'];

export function useMic(options: UseMicOptions = {}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const setVolumen = useGame((s) => s.setVolumen);
  const setTranscripcion = useGame((s) => s.setTranscripcion);
  const setEscuchando = useGame((s) => s.setEscuchando);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) setSupported(true);
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = useCallback(async () => {
    if (listening) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      console.error('Web Speech API no soportada');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = (dataArray[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / dataArray.length);
        const vol = Math.min(1, rms * 3);
        setVolumen(vol);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      console.error('No se pudo acceder al micrófono:', err);
      return;
    }

    const recognition = new SR();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = '';

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
          const lower = transcript.toLowerCase();
          for (const kw of KEYWORDS) {
            if (lower.includes(kw)) {
              optionsRef.current.onKeyword?.(kw, transcript);
              break;
            }
          }
          optionsRef.current.onFinalTranscript?.(transcript);
        } else {
          interim += transcript;
        }
      }
      setTranscripcion(finalTranscript + interim);
    };

    recognition.onerror = (event: any) => {
      console.error('SpeechRecognition error:', event.error);
    };

    recognition.onend = () => {
      if (streamRef.current) {
        try {
          recognition.start();
        } catch (e) {}
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setListening(true);
      setEscuchando(true);
    } catch (err) {
      console.error('Error iniciando recognition:', err);
    }
  }, [listening, setVolumen, setTranscripcion, setEscuchando]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setListening(false);
    setEscuchando(false);
    setVolumen(0);
  }, [setEscuchando, setVolumen]);

  return { supported, listening, start, stop };
}

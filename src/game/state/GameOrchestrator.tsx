/**
 * Orquestador del juego con STATE MACHINE real.
 *
 * Flujo:
 * F1 (Apertura)
 *   F1.a: juez lee cargos
 *   F1.b: jugador responde sí/no (por voz)
 *   F1.c: juez acusa recibo → transición a F2
 * F2 (Testimonio fiscal)
 *   F2.a: fiscal presenta teoría + evidencia 1 (maletero)
 *   F2.b: window objeción 5s — si jugador dice "protesto", juez decide
 *   F2.c: fiscal presenta evidencia 2 (video)
 *   F2.d: window objeción 5s
 *   F2.e: juez anuncia F3
 * F3 (Evidencia defensa) — versión simplificada
 *   F3.a: juez pregunta "desea presentar evidencia?"
 *   F3.b: jugador responde
 *   F3.c: juez anuncia F4
 * F4 (Testigos) — simplificado
 *   F4.a: sube guarda, juez pide contrainterrogatorio
 *   F4.b: jugador habla libre → IA responde
 *   F4.c: sube supervisor, mismo flujo
 *   F4.d: juez anuncia F5
 * F5 (Alegato + veredicto)
 *   F5.a: juez da 30s para alegato
 *   F5.b: jugador habla
 *   F5.c: juez + jurados votan
 *   F5.d: veredicto
 */
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useGame } from '../state/store';
import { llamarNPC } from '../state/npc-client';
import { useMic } from '../hooks/useMic';
import { CASE_QUESO } from '../data/case-queso';

type Subfase =
  | 'F1.a' | 'F1.b' | 'F1.c'
  | 'F2.a' | 'F2.b' | 'F2.c' | 'F2.d' | 'F2.e'
  | 'F3.a' | 'F3.b' | 'F3.c'
  | 'F4.a' | 'F4.b' | 'F4.c' | 'F4.d'
  | 'F5.a' | 'F5.b' | 'F5.c' | 'F5.d'
  | 'done';

export function GameOrchestrator() {
  // ── Estado del juego ──
  const fase = useGame((s) => s.fase);
  const caso = useGame((s) => s.caso);
  const iniciarPartida = useGame((s) => s.iniciarPartida);
  const setFase = useGame((s) => s.setFase);
  const setNpcActual = useGame((s) => s.setNpcActual);
  const setCaption = useGame((s) => s.setCaption);
  const setIaPensando = useGame((s) => s.setIaPensando);
  const pushMensaje = useGame((s) => s.pushMensaje);
  const ajustarMedidor = useGame((s) => s.ajustarMedidor);
  const ajustarSimpatia = useGame((s) => s.ajustarSimpatia);
  const recusarJurado = useGame((s) => s.recusarJurado);
  const setVeredicto = useGame((s) => s.setVeredicto);
  const setError = useGame((s) => s.setError);
  const credibilidad = useGame((s) => s.credibilidad);
  const sospecha = useGame((s) => s.sospecha);
  const jurados = useGame((s) => s.jurados);

  // ── Estado local del orquestador (subfase) ──
  const [subfase, setSubfase] = useState<Subfase>('F1.a');
  const [windowObjecion, setWindowObjecion] = useState(false);
  const [intervencionJugador, setIntervencionJugador] = useState<string | null>(null);

  // Refs para acceso dentro de callbacks
  const subfaseRef = useRef(subfase);
  subfaseRef.current = subfase;
  const faseRef = useRef(fase);
  faseRef.current = fase;

  // ── Helper: hablar con NPC ──
  const hablar = useCallback(
    async (
      npc: 'juez' | 'fiscal' | 'guarda' | 'novia' | 'supervisor',
      mensaje: string,
      contextoExtra?: string
    ) => {
      setIaPensando(true);
      setNpcActual(npc);
      try {
        const result = await llamarNPC({ npc, userMessage: mensaje, contextoExtra });
        setCaption(result.reply, npc);
        pushMensaje({
          role: 'assistant',
          content: result.reply,
          npc,
          ts: Date.now(),
        });
        return result.reply;
      } catch (err: any) {
        setError(err.message);
        setCaption('— ERROR: ' + err.message, 'sistema');
      } finally {
        setIaPensando(false);
      }
    },
    [setCaption, setIaPensando, setNpcActual, pushMensaje, setError]
  );

  // ── Helper: transición automática de subfase con delay ──
  const irA = useCallback((nueva: Subfase, delay = 1500) => {
    const t = setTimeout(() => setSubfase(nueva), delay);
    return () => clearTimeout(t);
  }, []);

  // ── Iniciar partida al montar ──
  useEffect(() => {
    iniciarPartida(CASE_QUESO);
  }, [iniciarPartida]);

  // ── STATE MACHINE: reaccionar a cambios de subfase ──
  useEffect(() => {
    console.log('[SM] subfase →', subfase);
    if (!caso) return;

    switch (subfase) {
      case 'F1.a': {
        // Juez lee cargos
        const t = setTimeout(() => {
          hablar(
            'juez',
            `Inicia el juicio. Acusado, se le imputa: ${caso.cargos}. Lugar: ${caso.lugar}, hora: ${caso.hora}. ¿Entiende los cargos?`
          );
          setSubfase('F1.b');
        }, 1200);
        return () => clearTimeout(t);
      }
      case 'F1.b': {
        // Esperando respuesta sí/no del jugador (la maneja onKeyword)
        // No hacer nada, esperar
        break;
      }
      case 'F1.c': {
        // Juez acusa recibo y pasa a F2
        const t = setTimeout(() => {
          hablar(
            'juez',
            intervencionJugador
              ? `El acusado ha respondido: "${intervencionJugador}". Proceda el fiscal con su teoría del caso.`
              : 'Proceda el fiscal con su teoría del caso.'
          );
          setIntervencionJugador(null);
          setFase('F2');
          setSubfase('F2.a');
        }, 800);
        return () => clearTimeout(t);
      }
      case 'F2.a': {
        // Fiscal presenta teoría + evidencia 1 (maletero)
        const t = setTimeout(() => {
          hablar(
            'fiscal',
            'Presenta tu teoría del caso en 2 frases y menciona el "Análisis del maletero" como primera evidencia incriminatoria.',
            'Empieza con: "La acusación sostiene que..." Menciona específicamente el análisis del maletero del coche del museo.'
          );
          setSubfase('F2.b');
        }, 1500);
        return () => clearTimeout(t);
      }
      case 'F2.b': {
        // Window de objeción de 6 segundos
        setWindowObjecion(true);
        const t = setTimeout(() => {
          setWindowObjecion(false);
          setSubfase('F2.c');
        }, 6000);
        return () => clearTimeout(t);
      }
      case 'F2.c': {
        // Fiscal presenta evidencia 2 (video)
        const t = setTimeout(() => {
          hablar(
            'fiscal',
            'Presenta la segunda evidencia: el video de seguridad del museo. Describe brevemente qué se ve en la imagen borrosa.',
            'Segunda evidencia: video de seguridad a las 03:47, persona con uniforme del museo cargando una caja.'
          );
          setSubfase('F2.d');
        }, 2000);
        return () => clearTimeout(t);
      }
      case 'F2.d': {
        setWindowObjecion(true);
        const t = setTimeout(() => {
          setWindowObjecion(false);
          setSubfase('F2.e');
        }, 6000);
        return () => clearTimeout(t);
      }
      case 'F2.e': {
        const t = setTimeout(() => {
          hablar('juez', 'Fiscal, ha presentado su caso. Defensa, ¿desea presentar evidencia a su favor?');
          setFase('F3');
          setSubfase('F3.a');
        }, 1500);
        return () => clearTimeout(t);
      }
      case 'F3.a': {
        // Esperando respuesta del jugador (sí/no)
        break;
      }
      case 'F3.b': {
        // Juez admite o rechaza y pasa a F4
        const t = setTimeout(() => {
          hablar(
            'juez',
            'Llamemos al primer testigo. Don Eustaquio, guardia de seguridad del museo.'
          );
          setFase('F4');
          setSubfase('F4.a');
        }, 1500);
        return () => clearTimeout(t);
      }
      case 'F4.a': {
        // Guarda declara
        const t = setTimeout(() => {
          hablar(
            'guarda',
            'Cuéntale al tribunal qué pasó esa noche. Eres el guardia, estabas en el baño cuando pasó.',
            'Testimonio inicial del guarda. Recuerda: estuviste 20 min en el baño con dolor de estómago desde las 03:35. No viste nada.'
          );
          setSubfase('F4.b');
        }, 1500);
        return () => clearTimeout(t);
      }
      case 'F4.b': {
        // Esperando contra-interrogatorio del jugador
        break;
      }
      case 'F4.c': {
        // Sube supervisor
        const t = setTimeout(() => {
          hablar(
            'juez',
            'Llame al segundo testigo. Anselmo Tellez, supervisor del museo.'
          );
          setSubfase('F4.d');
        }, 1500);
        return () => clearTimeout(t);
      }
      case 'F4.d': {
        const t = setTimeout(() => {
          hablar(
            'supervisor',
            'Cuéntale al tribunal lo que sabes del acusado. Eres el supervisor, lo despediste hace un mes.',
            'Testimonio del supervisor. Tu agenda: inculpar al acusado. Destaca que conocía las cámaras y los puntos ciegos.'
          );
          setSubfase('F4.e' as Subfase);
        }, 1500);
        return () => clearTimeout(t);
      }
      case 'F4.e' as Subfase: {
        // Esperando contra-interrogatorio del supervisor
        break;
      }
      case 'F5.a': {
        const t = setTimeout(() => {
          hablar(
            'juez',
            'Defensa, tiene 30 segundos para su alegato final. Hable cuando esté listo.'
          );
          setSubfase('F5.b');
        }, 1500);
        return () => clearTimeout(t);
      }
      case 'F5.b': {
        // Esperando alegato del jugador
        break;
      }
      case 'F5.c': {
        // Veredicto
        const t = setTimeout(() => {
          // Calcular veredicto simple
          const score = credibilidad - sospecha;
          const veredicto = score >= 0 ? 'absuelto' : 'culpable';
          hablar(
            'juez',
            `El tribunal ha deliberado. ${veredicto === 'absuelto' ? 'NO CULPABLE' : 'CULPABLE'}. ${
              veredicto === 'absuelto'
                ? 'Quede libre. Sin costas.'
                : 'Se le condena a 4 años de prisión.'
            }`
          );
          setVeredicto(veredicto);
          setSubfase('done');
        }, 1500);
        return () => clearTimeout(t);
      }
    }
  }, [subfase, caso, hablar, setFase, setVeredicto, intervencionJugador, credibilidad, sospecha]);

  // ── Detección de keywords del micrófono ──
  const onKeyword = useCallback(
    (kw: string, fullText: string) => {
      const sf = subfaseRef.current;
      console.log('[KW]', kw, 'en subfase', sf, '→', fullText);

      // PROTESTO en F2.b o F2.d (windows de objeción)
      if (
        (kw === 'protesto' || kw === 'protesta' || kw === 'objeción' || kw === 'objecion') &&
        (sf === 'F2.b' || sf === 'F2.d') &&
        windowObjecion
      ) {
        setWindowObjecion(false);
        hablar(
          'juez',
          `El acusado ha protestado. Fundamento: "${fullText}". Decida si la admite o la rechaza.`,
          `El jugador dijo "${kw}" durante la presentación de evidencia del fiscal. Evalúa si el fundamento es válido. Si es relevante, admite la objeción (Sospecha -8). Si no, recházala (Credibilidad -3).`
        );
        ajustarMedidor('credibilidad', +5);
        ajustarMedidor('sospecha', -8);
      }
      // SÍ / NO en F1.b
      if ((kw === 'sí' || kw === 'si' || kw === 'no') && sf === 'F1.b') {
        setIntervencionJugador(fullText);
        setSubfase('F1.c');
      }
      // SÍ / NO en F3.a (evidencia)
      if ((kw === 'sí' || kw === 'si' || kw === 'no') && sf === 'F3.a') {
        if (kw === 'sí' || kw === 'si') {
          hablar('juez', 'Admito la presentación de evidencia. Pero por ahora, pasemos a los testigos.');
          ajustarMedidor('credibilidad', +3);
        } else {
          hablar('juez', 'La defensa renuncia a presentar evidencia. Pasemos a los testigos.');
          ajustarMedidor('credibilidad', -5);
        }
        setSubfase('F3.b');
      }
      // Cualquier texto en F4.b o F4.d → contra-interrogatorio
      // (esto se maneja en onFinalTranscript)
    },
    [hablar, ajustarMedidor, windowObjecion]
  );

  // ── Final transcript → contra-interrogatorio / alegato ──
  const onFinalTranscript = useCallback(
    (text: string) => {
      const sf = subfaseRef.current;
      console.log('[FT]', sf, '→', text);
      if (!text || text.trim().length < 3) return;

      // F4.b: contra-interrogatorio al guarda
      if (sf === 'F4.b') {
        hablar(
          'guarda',
          text,
          `El jugador te contrainterroga: "${text}". Responde como el guardia Don Eustaquio. Si te pregunta por la hora, di que estabas en el baño 20 min. Si te pregunta por el supervisor, tu tono cambia (hay enemistad).`
        );
      }
      // F4.e: contra-interrogatorio al supervisor
      else if (sf === ('F4.e' as Subfase)) {
        hablar(
          'supervisor',
          text,
          `El jugador te contrainterroga: "${text}". Responde como Anselmo Tellez. Si te preguntan por qué despediste al acusado, di "reducción de personal". Si te preguntan cuántos despediste, di "solo a él". Tienes enemistad con el guarda.`
        );
      }
      // F5.b: alegato final
      else if (sf === 'F5.b') {
        hablar(
          'juez',
          text,
          `El jugador presenta su alegato final: "${text}". Como juez, evalúa su argumento y prepara el veredicto.`
        );
        setSubfase('F5.c');
      }
    },
    [hablar]
  );

  // ── Hook de micrófono ──
  useMic({ onKeyword, onFinalTranscript });

  // Pasar a F5 cuando termina F4.e tras 2 intervenciones del jugador (simplificado)
  // Esto requiere un contador; por ahora pasamos manualmente con un botón en la UI
  // O lo hacemos tras 1 intervención del supervisor:
  useEffect(() => {
    // Si estamos en F4.e y el supervisor ya habló, esperar 8s y pasar a F5
    if (subfase === ('F4.e' as Subfase)) {
      const t = setTimeout(() => {
        setSubfase('F5.a');
        setFase('F5');
      }, 25000); // 25s para contra-interrogar al supervisor
      return () => clearTimeout(t);
    }
  }, [subfase, setFase]);

  // Pasar de F4.b a F4.c después de 25s
  useEffect(() => {
    if (subfase === 'F4.b') {
      const t = setTimeout(() => {
        hablar('juez', 'Suficiente. Llame al segundo testigo.');
        setSubfase('F4.c');
      }, 25000);
      return () => clearTimeout(t);
    }
  }, [subfase, hablar]);

  return null;
}

/**
 * Orquestador REACTIVO del juego.
 *
 * Filosofía: el jugador habla cuando quiere. Su texto va al NPC activo.
 * La IA responde a lo que dijo. Los medidores cambian según evaluación.
 *
 * Flujo:
 * F1 (Apertura): Juez lee cargos → jugador responde lo que quiera → juez reacciona → F2
 * F2 (Fiscal): Fiscal presenta evidencia 1 → window objeción 6s → fiscal presenta evidencia 2 → window objeción → F3
 * F3 (Defensa): Juez pregunta si quiere presentar evidencia → jugador habla → juez decide → F4
 * F4 (Testigos): Sube guarda → jugador contra-interroga (habla libre) → sube supervisor → mismo → F5
 * F5 (Alegato): Jugador tiene 30s para alegato → veredicto automático
 */
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useGame } from '../state/store';
import { llamarNPC } from '../state/npc-client';
import { useMic } from '../hooks/useMic';
import { CASE_QUESO } from '../data/case-queso';
import { sndSuccess, sndFail, sndGavel, sndTick, sndWindowOpen, sndWindowClose, sndVerdict, sndClick, initAudio } from './sounds';

type Subfase =
  | 'F1.espera'           // Esperando respuesta del jugador a "¿entiende los cargos?"
  | 'F1.respuesta'        // Juez reacciona a lo que dijo el jugador
  | 'F2.fiscal1'          // Fiscal presenta evidencia 1
  | 'F2.window1'          // Window objeción 6s
  | 'F2.fiscal2'          // Fiscal presenta evidencia 2
  | 'F2.window2'          // Window objeción 6s
  | 'F2.transicion'       // Juez anuncia F3
  | 'F3.pregunta'         // Juez pregunta si quiere presentar evidencia
  | 'F3.espera'           // Jugador responde
  | 'F3.transicion'       // Juez anuncia F4
  | 'F4.guarda_subida'    // Sube el guarda
  | 'F4.guarda_testimonio' // Guarda declara
  | 'F4.guarda_contra'    // Jugador contra-interroga al guarda
  | 'F4.supervisor_subida'
  | 'F4.supervisor_testimonio'
  | 'F4.supervisor_contra'
  | 'F4.transicion'
  | 'F5.alegato'          // Jugador hace alegato
  | 'F5.veredicto'        // Juez emite veredicto
  | 'done';

const TIMER_FASES: Record<string, number> = {
  'F4.guarda_contra': 30,     // 30s para contra-interrogar
  'F4.supervisor_contra': 30,
  'F5.alegato': 45,           // 45s para alegato
};

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
  const setWindowObjecion = useGame((s) => s.setWindowObjecion);
  const setTimerSegundos = useGame((s) => s.setTimerSegundos);
  const setSubfaseActual = useGame((s) => s.setSubfaseActual);
  const windowObjecion = useGame((s) => s.windowObjecion);
  const timerSegundos = useGame((s) => s.timerSegundos);

  // ── Estado local ──
  const [subfase, setSubfase] = useState<Subfase>('F1.espera');
  const [intervencionJugador, setIntervencionJugador] = useState<string | null>(null);
  const [contadorContraGuarda, setContadorContraGuarda] = useState(0);
  const [contadorContraSupervisor, setContadorContraSupervisor] = useState(0);

  // Refs
  const subfaseRef = useRef(subfase);
  subfaseRef.current = subfase;
  const faseRef = useRef(fase);
  faseRef.current = fase;

  // Sincronizar subfase con store (para que UI pueda reaccionar)
  useEffect(() => {
    setSubfaseActual(subfase);
  }, [subfase, setSubfaseActual]);

  // ── Helper: hablar con NPC ──
  const hablar = useCallback(
    async (
      npc: 'juez' | 'fiscal' | 'guarda' | 'novia' | 'supervisor',
      mensaje: string,
      contextoExtra?: string
    ) => {
      setIaPensando(true);
      setNpcActual(npc);
      // Sonido según NPC
      if (npc === 'juez') sndGavel();
      else sndClick();
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
        sndFail();
      } finally {
        setIaPensando(false);
      }
    },
    [setCaption, setIaPensando, setNpcActual, pushMensaje, setError]
  );

  // ── Iniciar partida ──
  useEffect(() => {
    iniciarPartida(CASE_QUESO);
  }, [iniciarPartida]);

  // ── F1: Juez lee cargos al iniciar ──
  const yaInicioAperturaRef = useRef(false);
  useEffect(() => {
    if (fase === 'F1' && caso && subfase === 'F1.espera' && !intervencionJugador && !yaInicioAperturaRef.current) {
      yaInicioAperturaRef.current = true;
      const t = setTimeout(() => {
        hablar(
          'juez',
          `Inicia el juicio. Acusado, se le imputa: ${caso.cargos}. Lugar: ${caso.lugar}, hora: ${caso.hora}. ¿Entiende los cargos?`
        );
      }, 800);
      return () => clearTimeout(t);
    }
  }, [fase, caso, subfase, hablar, intervencionJugador]);

  // ── STATE MACHINE: reaccionar a subfase ──
  useEffect(() => {
    console.log('[SM]', subfase);
    if (!caso) return;

    switch (subfase) {
      case 'F1.respuesta': {
        // Juez reacciona a lo que dijo el jugador
        const t = setTimeout(() => {
          hablar(
            'juez',
            `El acusado ha dicho: "${intervencionJugador}". Reacciona brevemente y pasa la palabra al fiscal.`,
            `El jugador respondió a "¿entiende los cargos?" con: "${intervencionJugador}". Si dijo "sí" o similar, acusa recibo y pasa al fiscal. Si dijo "no", le preguntas si se declara culpable o inocente.`
          );
          setIntervencionJugador(null);
          setFase('F2');
          setSubfase('F2.fiscal1');
        }, 500);
        return () => clearTimeout(t);
      }

      case 'F2.fiscal1': {
        const t = setTimeout(() => {
          hablar(
            'fiscal',
            'Presenta tu teoría del caso en 2 frases y menciona el análisis del maletero como primera evidencia.',
            'Empieza: "La acusación sostiene que..." Menciona específicamente el análisis del maletero con 99.7% de coincidencia.'
          );
          setSubfase('F2.window1');
        }, 1500);
        return () => clearTimeout(t);
      }

      case 'F2.window1': {
        setWindowObjecion(true);
        setTimerSegundos(6);
        sndWindowOpen();
        const t = setTimeout(() => {
          setWindowObjecion(false);
          setTimerSegundos(null);
          setSubfase('F2.fiscal2');
        }, 6000);
        return () => clearTimeout(t);
      }

      case 'F2.fiscal2': {
        const t = setTimeout(() => {
          hablar(
            'fiscal',
            'Presenta la segunda evidencia: el video de seguridad del museo a las 03:47.',
            'Segunda evidencia: video de seguridad a las 03:47, persona con uniforme del museo cargando caja en el maletero.'
          );
          setSubfase('F2.window2');
        }, 2500);
        return () => clearTimeout(t);
      }

      case 'F2.window2': {
        setWindowObjecion(true);
        setTimerSegundos(6);
        sndWindowOpen();
        const t = setTimeout(() => {
          setWindowObjecion(false);
          setTimerSegundos(null);
          setSubfase('F2.transicion');
        }, 6000);
        return () => clearTimeout(t);
      }

      case 'F2.transicion': {
        const t = setTimeout(() => {
          hablar('juez', 'Fiscal, ha presentado su caso. Defensa, ¿desea presentar evidencia a su favor?');
          setFase('F3');
          setSubfase('F3.espera');
        }, 2000);
        return () => clearTimeout(t);
      }

      case 'F3.transicion': {
        const t = setTimeout(() => {
          hablar('juez', 'Llamemos al primer testigo. Don Eustaquio, guardia de seguridad del museo.');
          setFase('F4');
          setSubfase('F4.guarda_subida');
        }, 1500);
        return () => clearTimeout(t);
      }

      case 'F4.guarda_subida': {
        const t = setTimeout(() => {
          setSubfase('F4.guarda_testimonio');
        }, 1500);
        return () => clearTimeout(t);
      }

      case 'F4.guarda_testimonio': {
        const t = setTimeout(() => {
          hablar(
            'guarda',
            'Cuéntale al tribunal qué pasó esa noche.',
            'Testimonio inicial. Estabas en el baño 20 min con dolor de estómago desde las 03:35. No viste nada.'
          );
          setSubfase('F4.guarda_contra');
          setTimerSegundos(TIMER_FASES['F4.guarda_contra']);
        }, 1500);
        return () => clearTimeout(t);
      }

      case 'F4.guarda_contra': {
        // Esperar input del jugador o timeout
        const t = setTimeout(() => {
          if (contadorContraGuarda === 0) {
            hablar('juez', 'Sin preguntas, defensa. Llame al segundo testigo.');
          }
          setSubfase('F4.supervisor_subida');
        }, TIMER_FASES['F4.guarda_contra'] * 1000);
        return () => clearTimeout(t);
      }

      case 'F4.supervisor_subida': {
        setTimerSegundos(null);
        const t = setTimeout(() => {
          hablar('juez', 'Llame al segundo testigo. Anselmo Tellez, supervisor del museo.');
          setSubfase('F4.supervisor_testimonio');
        }, 1500);
        return () => clearTimeout(t);
      }

      case 'F4.supervisor_testimonio': {
        const t = setTimeout(() => {
          hablar(
            'supervisor',
            'Cuéntale al tribunal lo que sabes del acusado.',
            'Testimonio inicial. Buscas inculpar al acusado. Destaca que conocía las cámaras y tenía acceso al coche.'
          );
          setSubfase('F4.supervisor_contra');
          setTimerSegundos(TIMER_FASES['F4.supervisor_contra']);
        }, 1500);
        return () => clearTimeout(t);
      }

      case 'F4.supervisor_contra': {
        const t = setTimeout(() => {
          if (contadorContraSupervisor === 0) {
            hablar('juez', 'Suficiente. Pasemos al alegato final.');
          }
          setSubfase('F4.transicion');
        }, TIMER_FASES['F4.supervisor_contra'] * 1000);
        return () => clearTimeout(t);
      }

      case 'F4.transicion': {
        setTimerSegundos(null);
        const t = setTimeout(() => {
          hablar('juez', 'Defensa, tiene 45 segundos para su alegato final. Hable cuando esté listo.');
          setFase('F5');
          setSubfase('F5.alegato');
          setTimerSegundos(TIMER_FASES['F5.alegato']);
        }, 1500);
        return () => clearTimeout(t);
      }

      case 'F5.veredicto': {
        const t = setTimeout(() => {
          // Fórmula del GDD: score = Credibilidad - Sospecha
          const score = credibilidad - sospecha;
          const veredicto: 'absuelto' | 'culpable' = score >= 0 ? 'absuelto' : 'culpable';
          const veredictoTexto = veredicto === 'absuelto' ? 'NO CULPABLE' : 'CULPABLE';

          sndVerdict();
          hablar(
            'juez',
            `Emite veredicto. Credibilidad final: ${credibilidad}/100. Sospecha final: ${sospecha}/100. Tu veredicto es: ${veredictoTexto}.`,
            `Es el momento del VEREDICTO FINAL. Credibilidad: ${credibilidad}/100. Sospecha: ${sospecha}/100. Tu veredicto OBLIGATORIO es: ${veredictoTexto}. Empieza tu respuesta SIEMPRE con "${veredictoTexto}." y luego explica en máximo 50 palabras por qué llegas a ese veredicto basándote en las pruebas y testimonios del juicio.`
          );
          // Forzar veredicto en el estado aunque la IA tarde
          setTimeout(() => {
            setVeredicto(veredicto);
            if (veredicto === 'absuelto') sndSuccess();
            else sndFail();
          }, 4000);
          setSubfase('done');
        }, 1500);
        return () => clearTimeout(t);
      }
    }
  }, [subfase, caso, hablar, setFase, setVeredicto, intervencionJugador, credibilidad, sospecha, contadorContraGuarda, contadorContraSupervisor]);

  // ── Timer countdown ──
  useEffect(() => {
    if (timerSegundos === null) return;
    if (timerSegundos <= 0) {
      setTimerSegundos(null);
      return;
    }
    const t = setTimeout(() => setTimerSegundos(timerSegundos - 1), 1000);
    return () => clearTimeout(t);
  }, [timerSegundos]);

  // ── Detección de keywords ──
  const onKeyword = useCallback(
    (kw: string, fullText: string) => {
      const sf = subfaseRef.current;
      console.log('[KW]', kw, sf, '→', fullText);

      // PROTESTO en windows de objeción
      if (
        (kw === 'protesto' || kw === 'protesta' || kw === 'objeción' || kw === 'objecion') &&
        (sf === 'F2.window1' || sf === 'F2.window2') &&
        windowObjecion
      ) {
        setWindowObjecion(false);
        setTimerSegundos(null);
        sndWindowClose();
        hablar(
          'juez',
          `El acusado ha protestado: "${fullText}". Evalúa la objeción y decide: "Protesta admitida" o "Protesta rechazada".`,
          `El jugador objeta con este fundamento: "${fullText}". Si el fundamento es relevante (cadena de custodia, identificación dudosa, peso vs admisibilidad), ADMITE la objeción. Si es irrelevante o llega tarde, RECHÁZALA. Empieza SIEMPRE con "Protesta admitida" o "Protesta rechazada".`
        ).then((reply: string | undefined) => {
          if (reply && reply.toLowerCase().includes('admitida')) {
            ajustarMedidor('credibilidad', +8);
            ajustarMedidor('sospecha', -10);
            sndSuccess();
          } else if (reply && reply.toLowerCase().includes('rechazada')) {
            ajustarMedidor('credibilidad', -3);
            ajustarMedidor('sospecha', +5);
            sndFail();
          }
        });
      }

      // RECUSACIÓN
      if (kw === 'recusación' || kw === 'recusacion') {
        const match = fullText.match(/\d+/);
        if (match) {
          const silla = parseInt(match[0]);
          if (silla >= 1 && silla <= 5) {
            const ok = recusarJurado(silla);
            if (ok) {
              hablar(
                'juez',
                `El acusado solicita recusar al jurado ${silla}. Fundamento: "${fullText}". Decide si lo retiras o lo mantienes.`,
                `El jugador recusa al jurado ${silla}. Para decidir: si el jurado tenía sesgo evidente (fruncía el ceño, no reaccionaba a evidencia exculpatoria), RETÍRALo. Si no, MANTÉNlo y dile al jugador que sigue.`
              );
            } else {
              setCaption('Ya no tienes recusaciones disponibles.', 'sistema');
            }
          }
        }
      }
    },
    [hablar, ajustarMedidor, recusarJurado, setCaption, windowObjecion]
  );

  // ── Final transcript → según subfase ──
  const onFinalTranscript = useCallback(
    (text: string) => {
      const sf = subfaseRef.current;
      if (!text || text.trim().length < 3) return;
      console.log('[FT]', sf, '→', text);

      // F1: respuesta a "¿entiende los cargos?"
      if (sf === 'F1.espera') {
        setIntervencionJugador(text);
        setSubfase('F1.respuesta');
        return;
      }

      // F3: respuesta a "¿desea presentar evidencia?"
      if (sf === 'F3.espera' && caso) {
        const lower = text.toLowerCase();
        // Si el jugador presenta una evidencia específica (viene con "Presento la evidencia:")
        if (lower.includes('presento la evidencia') || lower.includes('evidencia')) {
          // Buscar qué evidencia es
          const evidencias = caso.evidencias;
          let evidenciaPresentada: typeof evidencias[0] | null = null;
          for (const ev of evidencias) {
            if (lower.includes(ev.nombre.toLowerCase()) || lower.includes(ev.id)) {
              evidenciaPresentada = ev;
              break;
            }
          }
          if (evidenciaPresentada) {
            const ev = evidenciaPresentada;
            // Bonus según tipo
            if (ev.tipo === 'exculpatoria') {
              ajustarMedidor('credibilidad', +8);
              ajustarMedidor('sospecha', -10);
              sndSuccess();
            } else if (ev.tipo === 'ambigua') {
              ajustarMedidor('credibilidad', +4);
              ajustarMedidor('sospecha', -3);
            } else if (ev.tipo === 'incriminatoria') {
              ajustarMedidor('sospecha', +8);
              sndFail();
            }
            hablar(
              'juez',
              `El acusado presenta: ${ev.nombre}. ${ev.descripcion}. ¿Fiscal, objeta?`,
              `El jugador presenta la evidencia "${ev.nombre}" (${ev.tipo}). Admítela brevemente y pasa a testigos.`
            );
          } else {
            hablar(
              'juez',
              `El acusado solicita presentar evidencia. Admitida. Pasemos a los testigos.`,
              `El jugador dice: "${text}". Admite y pasa a testigos.`
            );
            ajustarMedidor('credibilidad', +3);
          }
        } else if (lower.includes('no') || lower.includes('renuncio') || lower.includes('pasar')) {
          hablar(
            'juez',
            `La defensa renuncia a presentar evidencia. Pasemos a los testigos.`,
            `El jugador dice: "${text}". Si no quiere presentar evidencia, pasa a testigos.`
          );
          ajustarMedidor('credibilidad', -5);
          sndFail();
        } else {
          // Respuesta ambigua, interpretar como sí
          hablar(
            'juez',
            `El acusado solicita presentar evidencia. Admitida. Pasemos a los testigos.`,
            `El jugador dice: "${text}". Admite y pasa a testigos.`
          );
          ajustarMedidor('credibilidad', +3);
        }
        setSubfase('F3.transicion');
        return;
      }

      // F4.guarda_contra: contra-interrogatorio al guarda
      if (sf === 'F4.guarda_contra') {
        setContadorContraGuarda((c) => c + 1);
        hablar(
          'guarda',
          text,
          `El jugador te contrainterroga: "${text}". Responde como Don Eustaquio. Si te preguntan por tu turno, di 22:00 a 06:00. Si te preguntan por el baño, di 20 min. Si te preguntan por Anselmo, tu tono cambia: lo consideras mandón.`
        ).then((reply: string | undefined) => {
          // Si el jugador expone una contradicción, premiar
          if (reply && (reply.includes('no recuerdo') || reply.includes('no vi') || reply.includes('baño'))) {
            ajustarMedidor('sospecha', -3);
          }
        });
        return;
      }

      // F4.supervisor_contra
      if (sf === 'F4.supervisor_contra') {
        setContadorContraSupervisor((c) => c + 1);
        hablar(
          'supervisor',
          text,
          `El jugador te contrainterroga: "${text}". Responde como Anselmo Tellez. Si te preguntan por el despido, di "reducción de personal". Si insisten, admite "solo a él" con incomodidad. Si te preguntan por Eustaquio, hostilízalo.`
        ).then((reply: string | undefined) => {
          // Si el jugador expone el vínculo de enemistad o la mentira del despido, premiar
          if (
            (text.toLowerCase().includes('por qué') && text.toLowerCase().includes('despid')) ||
            (text.toLowerCase().includes('cuántos') && text.toLowerCase().includes('despid'))
          ) {
            ajustarMedidor('credibilidad', +5);
            ajustarMedidor('sospecha', -5);
          }
        });
        return;
      }

      // F5.alegato: cuando el jugador termina su alegato, pasar a veredicto
      if (sf === 'F5.alegato') {
        hablar(
          'juez',
          `El acusado presenta su alegato: "${text}". Emite veredicto.`,
          `El jugador dice: "${text}". Evalúa su argumento. Credibilidad actual: ${credibilidad}, Sospecha: ${sospecha}. Emite veredicto explicando brevemente.`
        );
        setTimerSegundos(null);
        setSubfase('F5.veredicto');
        return;
      }
    },
    [hablar, ajustarMedidor, credibilidad, sospecha, caso]
  );

  // ── Hook de micrófono ──
  useMic({ onKeyword, onFinalTranscript });

  // ── Listener para input de texto (botón PROTESTO + campo de texto) ──
  // Esto garantiza que el juego funcione sin micrófono
  // Usamos refs para evitar registrar el listener múltiples veces
  const onKeywordRef = useRef(onKeyword);
  const onFinalTranscriptRef = useRef(onFinalTranscript);
  onKeywordRef.current = onKeyword;
  onFinalTranscriptRef.current = onFinalTranscript;

  useEffect(() => {
    const handler = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      if (!text || text.trim().length < 1) return;
      console.log('[UI INPUT]', text);

      // Procesar como keyword si aplica
      const lower = text.toLowerCase();
      for (const kw of ['protesto', 'protesta', 'objeción', 'objecion', 'recusación', 'recusacion', 'sí', 'si', 'no']) {
        if (lower.includes(kw)) {
          onKeywordRef.current(kw, text);
          break;
        }
      }

      // Procesar como final transcript
      onFinalTranscriptRef.current(text);
    };
    window.addEventListener('notguilty-player-input', handler);
    return () => window.removeEventListener('notguilty-player-input', handler);
  }, []); // Sin dependencias = se registra una sola vez

  return null;
}

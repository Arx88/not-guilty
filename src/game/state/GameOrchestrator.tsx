/**
 * Orquestador REDISEÑADO con mecánicas que importan.
 * 
 * CAMBIOS FUNDAMENTALES:
 * 1. Objeciones LIMITADAS (3 total) — gastar con cuidado
 * 2. CONTRADICCIONES — el jugador puede señalar contradicciones entre testigos
 * 3. FEEDBACK CLARO — cada acción muestra "+X Credibilidad" o "-X Sospecha"
 * 4. TIMING HUMANO — 20s para objeciones, no 6s
 * 5. TESTIMONIOS SE GUARDAN — para comparar después
 */
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useGame } from '../state/store';
import { llamarNPC } from '../state/npc-client';
import { useMic } from '../hooks/useMic';
import { CASE_QUESO } from '../data/case-queso';
import { sndSuccess, sndFail, sndGavel, sndTick, sndWindowOpen, sndWindowClose, sndVerdict, sndClick, initAudio } from './sounds';

type Subfase =
  | 'F1.espera'
  | 'F1.respuesta'
  | 'F2.fiscal1'
  | 'F2.window1'
  | 'F2.fiscal2'
  | 'F2.window2'
  | 'F2.transicion'
  | 'F3.espera'
  | 'F3.transicion'
  | 'F4.guarda_subida'
  | 'F4.guarda_testimonio'
  | 'F4.guarda_contra'
  | 'F4.supervisor_subida'
  | 'F4.supervisor_testimonio'
  | 'F4.supervisor_contra'
  | 'F4.transicion'
  | 'F5.alegato'
  | 'F5.veredicto'
  | 'done';

export function GameOrchestrator() {
  const fase = useGame((s) => s.fase);
  const npcActual = useGame((s) => s.npcActual);
  const caso = useGame((s) => s.caso);
  const iniciarPartida = useGame((s) => s.iniciarPartida);
  const setFase = useGame((s) => s.setFase);
  const setNpcActual = useGame((s) => s.setNpcActual);
  const setCaption = useGame((s) => s.setCaption);
  const setIaPensando = useGame((s) => s.setIaPensando);
  const pushMensaje = useGame((s) => s.pushMensaje);
  const ajustarMedidor = useGame((s) => s.ajustarMedidor);
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
  // Nuevas mecánicas
  const objecionesRestantes = useGame((s) => s.objecionesRestantes);
  const gastarObjecion = useGame((s) => s.gastarObjecion);
  const descubrirContradiccion = useGame((s) => s.descubrirContradiccion);
  const setFeedbackFlash = useGame((s) => s.setFeedbackFlash);
  const setTestimonioEscuchado = useGame((s) => s.setTestimonioEscuchado);

  const [subfase, setSubfase] = useState<Subfase>('F1.espera');
  const [intervencionJugador, setIntervencionJugador] = useState<string | null>(null);
  const [contadorContraGuarda, setContadorContraGuarda] = useState(0);
  const [contadorContraSupervisor, setContadorContraSupervisor] = useState(0);

  const subfaseRef = useRef(subfase);
  subfaseRef.current = subfase;
  const faseRef = useRef(fase);
  faseRef.current = fase;

  useEffect(() => {
    setSubfaseActual(subfase);
  }, [subfase, setSubfaseActual]);

  // ── Helper: hablar con NPC + guardar testimonio ──
  const hablar = useCallback(
    async (
      npc: 'juez' | 'fiscal' | 'guarda' | 'novia' | 'supervisor',
      mensaje: string,
      contextoExtra?: string,
      isStageDirection?: boolean
    ) => {
      setIaPensando(true);
      setNpcActual(npc);
      if (npc === 'juez') sndGavel();
      else sndClick();
      try {
        const result = await llamarNPC({ npc, userMessage: mensaje, contextoExtra, isStageDirection });
        setCaption(result.reply, npc);
        pushMensaje({ role: 'assistant', content: result.reply, npc, ts: Date.now() });
        // Guardar testimonio para comparar después
        if (npc === 'guarda' || npc === 'supervisor' || npc === 'novia') {
          setTestimonioEscuchado(npc, result.reply);
        }
        return result.reply;
      } catch (err: any) {
        setError(err.message);
        setCaption('— ERROR: ' + err.message, 'sistema');
        sndFail();
      } finally {
        setIaPensando(false);
      }
    },
    [setCaption, setIaPensando, setNpcActual, pushMensaje, setError, setTestimonioEscuchado]
  );

  // ── Helper: feedback visual ──
  const feedback = useCallback((msg: string, tipo: 'bien' | 'mal' | 'info') => {
    setFeedbackFlash(msg);
    if (tipo === 'bien') sndSuccess();
    else if (tipo === 'mal') sndFail();
  }, [setFeedbackFlash]);

  // ── Iniciar partida ──
  useEffect(() => {
    iniciarPartida(CASE_QUESO);
  }, [iniciarPartida]);

  // ── F1: Juez lee cargos ──
  useEffect(() => {
    if (fase === 'F1' && caso && subfase === 'F1.espera' && !intervencionJugador) {
      const t = setTimeout(() => {
        hablar(
          'juez',
          `Abre la sesión. Lee los cargos en voz alta: "${caso.cargos}". Lugar: ${caso.lugar}, hora: ${caso.hora}. Luego pregunta al acusado: ¿Entiende los cargos?`,
          undefined,
          true
        );
        feedback('El juicio ha comenzado. Responde al juez.', 'info');
      }, 800);
      return () => clearTimeout(t);
    }
  }, [fase, caso, subfase, hablar, intervencionJugador, feedback]);

  // ── STATE MACHINE ──
  useEffect(() => {
    if (!caso) return;

    switch (subfase) {
      case 'F1.respuesta': {
        const t = setTimeout(() => {
          hablar(
            'juez',
            `El acusado acaba de decir: "${intervencionJugador}". Como juez, reacciona brevemente y pasa la palabra al fiscal.`,
            undefined,
            true
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
            'TÚ ERES LA FISCAL. Hablas al tribunal. NUNCA hables como el acusado.',
            true
          );
          setSubfase('F2.window1');
        }, 1500);
        return () => clearTimeout(t);
      }

      case 'F2.window1': {
        setWindowObjecion(true);
        setTimerSegundos(20); // 20s, no 6s
        sndWindowOpen();
        const t = setTimeout(() => {
          setWindowObjecion(false);
          setTimerSegundos(null);
          setSubfase('F2.fiscal2');
        }, 20000);
        return () => clearTimeout(t);
      }

      case 'F2.fiscal2': {
        const t = setTimeout(() => {
          hablar(
            'fiscal',
            'Presenta la segunda evidencia: el video de seguridad del museo a las 03:47.',
            'TÚ ERES LA FISCAL. Hablas al tribunal. NUNCA hables como el acusado.',
            true
          );
          setSubfase('F2.window2');
        }, 2500);
        return () => clearTimeout(t);
      }

      case 'F2.window2': {
        setWindowObjecion(true);
        setTimerSegundos(20);
        sndWindowOpen();
        const t = setTimeout(() => {
          setWindowObjecion(false);
          setTimerSegundos(null);
          setSubfase('F2.transicion');
        }, 20000);
        return () => clearTimeout(t);
      }

      case 'F2.transicion': {
        const t = setTimeout(() => {
          hablar('juez', 'Fiscal, ha presentado su caso. Defensa, ¿desea presentar evidencia a su favor?', undefined, true);
          setFase('F3');
          setSubfase('F3.espera');
        }, 2000);
        return () => clearTimeout(t);
      }

      case 'F3.transicion': {
        const t = setTimeout(() => {
          hablar('juez', 'Llamemos al primer testigo. Don Eustaquio, guardia de seguridad.', undefined, true);
          setFase('F4');
          setSubfase('F4.guarda_subida');
        }, 1500);
        return () => clearTimeout(t);
      }

      case 'F4.guarda_subida': {
        const t = setTimeout(() => setSubfase('F4.guarda_testimonio'), 1500);
        return () => clearTimeout(t);
      }

      case 'F4.guarda_testimonio': {
        const t = setTimeout(() => {
          hablar('guarda', 'Cuéntale al tribunal qué pasó esa noche.', 'TÚ ERES DON EUSTAQUIO, el guardia. NUNCA hables como el acusado o el juez.', true).then((reply) => {
            if (reply) {
              feedback('Testimonio del guarda registrado. ESCUCHA con atención — busca contradicciones.', 'info');
            }
          });
          setSubfase('F4.guarda_contra');
          setTimerSegundos(40);
        }, 1500);
        return () => clearTimeout(t);
      }

      case 'F4.guarda_contra': {
        const t = setTimeout(() => {
          if (contadorContraGuarda === 0) {
            hablar('juez', 'Sin preguntas, defensa. Llame al segundo testigo.', undefined, true);
            feedback('No contrainterrogaste al guarda. Sin información adicional.', 'info');
          }
          setSubfase('F4.supervisor_subida');
        }, 40000);
        return () => clearTimeout(t);
      }

      case 'F4.supervisor_subida': {
        setTimerSegundos(null);
        const t = setTimeout(() => {
          hablar('juez', 'Llame al segundo testigo. Anselmo Tellez, supervisor.', undefined, true);
          setSubfase('F4.supervisor_testimonio');
        }, 1500);
        return () => clearTimeout(t);
      }

      case 'F4.supervisor_testimonio': {
        const t = setTimeout(() => {
          hablar('supervisor', 'Cuéntale al tribunal lo que sabes del acusado.', 'TÚ ERES ANSELMO TELLEZ, el supervisor. NUNCA hables como el acusado o el juez.', true).then((reply) => {
            if (reply) {
              feedback('Testimonio del supervisor registrado. COMPARA con lo que dijo el guarda.', 'info');
            }
          });
          setSubfase('F4.supervisor_contra');
          setTimerSegundos(40);
        }, 1500);
        return () => clearTimeout(t);
      }

      case 'F4.supervisor_contra': {
        const t = setTimeout(() => {
          if (contadorContraSupervisor === 0) {
            hablar('juez', 'Suficiente. Pasemos al alegato final.', undefined, true);
          }
          setSubfase('F4.transicion');
        }, 40000);
        return () => clearTimeout(t);
      }

      case 'F4.transicion': {
        setTimerSegundos(null);
        const t = setTimeout(() => {
          hablar('juez', 'Defensa, tiene 60 segundos para su alegato final.', undefined, true);
          setFase('F5');
          setSubfase('F5.alegato');
          setTimerSegundos(60);
        }, 1500);
        return () => clearTimeout(t);
      }

      case 'F5.veredicto': {
        const t = setTimeout(() => {
          const score = credibilidad - sospecha;
          const veredicto: 'absuelto' | 'culpable' = score >= 0 ? 'absuelto' : 'culpable';
          const veredictoTexto = veredicto === 'absuelto' ? 'NO CULPABLE' : 'CULPABLE';
          sndVerdict();
          hablar(
            'juez',
            `Emite tu veredicto final. Credibilidad: ${credibilidad}/100. Sospecha: ${sospecha}/100. Tu veredicto es: ${veredictoTexto}.`,
            `TÚ ERES EL JUEZ. Es el momento del VEREDICTO FINAL. Credibilidad: ${credibilidad}/100. Sospecha: ${sospecha}/100. Tu veredicto OBLIGATORIO es: ${veredictoTexto}. Empieza tu respuesta con "${veredictoTexto}." y explica en máximo 50 palabras por qué.`,
            true
          );
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
  }, [subfase, caso, hablar, setFase, setVeredicto, intervencionJugador, credibilidad, sospecha, contadorContraGuarda, contadorContraSupervisor, feedback, setWindowObjecion, setTimerSegundos]);

  // ── Timer countdown ──
  useEffect(() => {
    if (timerSegundos === null) return;
    if (timerSegundos <= 0) { setTimerSegundos(null); return; }
    const t = setTimeout(() => setTimerSegundos(timerSegundos - 1), 1000);
    return () => clearTimeout(t);
  }, [timerSegundos, setTimerSegundos]);

  // ── Detección de keywords + contradicciones ──
  const onKeyword = useCallback(
    (kw: string, fullText: string) => {
      const sf = subfaseRef.current;

      // PROTESTO — ahora GASTA un recurso limitado
      if (
        (kw === 'protesto' || kw === 'protesta' || kw === 'objeción' || kw === 'objecion') &&
        (sf === 'F2.window1' || sf === 'F2.window2') &&
        windowObjecion
      ) {
        // Verificar si le quedan objeciones
        if (objecionesRestantes <= 0) {
          setCaption('No te quedan objeciones. Tendrás que aguantar esta evidencia.', 'sistema');
          feedback('Sin objeciones restantes. Piensa mejor la próxima.', 'mal');
          return;
        }
        gastarObjecion();
        setWindowObjecion(false);
        setTimerSegundos(null);
        sndWindowClose();
        feedback(`Objeción #${4 - objecionesRestantes} usada. Quedan ${objecionesRestantes - 1}.`, 'info');
        hablar(
          'juez',
          `El acusado objeta: "${fullText}". Decide: admitida o rechazada.`,
          `El jugador objeta: "${fullText}". Si el fundamento es relevante (cadena de custodia, acceso compartido, peso vs admisibilidad), ADMITE. Si es irrelevante, RECHAZA. Empieza con "Protesta admitida" o "Protesta rechazada".`,
          true
        ).then((reply: string | undefined) => {
          if (reply && reply.toLowerCase().includes('admitida')) {
            ajustarMedidor('credibilidad', +8);
            ajustarMedidor('sospecha', -10);
            feedback('¡PROTESTA ADMITIDA! +8 Credibilidad, -10 Sospecha', 'bien');
          } else if (reply && reply.toLowerCase().includes('rechazada')) {
            ajustarMedidor('credibilidad', -3);
            ajustarMedidor('sospecha', +5);
            feedback('Protesta rechazada. -3 Credibilidad, +5 Sospecha', 'mal');
          }
        });
      }

      // CONTRADICCIÓN — nueva mecánica
      if (kw === 'contradicción' || kw === 'contradiccion' || kw === 'contradice') {
        const testimonios = useGame.getState().testimoniosEscuchados;
        const casoData = useGame.getState().caso;
        if (!casoData || Object.keys(testimonios).length < 2) {
          feedback('Necesitas al menos 2 testimonios para señalar una contradicción.', 'info');
          return;
        }
        // La IA del juez evalúa si la contradicción es real
        hablar(
          'juez',
          `El acusado señala una contradicción: "${fullText}". Compara los testimonios y decide si es válida.`,
          `El jugador dice que hay una contradicción: "${fullText}".
Testimonios escuchados: ${JSON.stringify(testimonios)}.
Si hay una contradicción REAL entre los testimonios (ej: un testigo dice X y otro dice lo contrario), di "CONTRADICCIÓN VÁLIDA" y exige al testigo que explique. Si no hay contradicción real, di "No hay contradicción" y pasa de largo.`,
          true
        ).then((reply: string | undefined) => {
          if (reply && reply.toLowerCase().includes('contradicción válida')) {
            ajustarMedidor('credibilidad', +12);
            ajustarMedidor('sospecha', -8);
            feedback('¡CONTRADICCIÓN VÁLIDA! +12 Credibilidad, -8 Sospecha', 'bien');
            // Marcar contradicción como descubierta
            if (casoData.contradicciones) {
              casoData.contradicciones.forEach((c) => descubrirContradiccion(c.id));
            }
          } else {
            ajustarMedidor('credibilidad', -5);
            feedback('No hay contradicción. -5 Credibilidad por perder el tiempo.', 'mal');
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
              feedback(`Jurado ${silla} recusado.`, 'info');
              hablar('juez', `El acusado recusa al jurado ${silla}. Fundamento: "${fullText}".`, undefined, true);
            } else {
              setCaption('Ya no tienes recusaciones disponibles.', 'sistema');
            }
          }
        }
      }
    },
    [hablar, ajustarMedidor, recusarJurado, setCaption, windowObjecion, objecionesRestantes, gastarObjecion, feedback, descubrirContradiccion]
  );

  // ── Final transcript ──
  const onFinalTranscript = useCallback(
    (text: string) => {
      const sf = subfaseRef.current;
      if (!text || text.trim().length < 3) return;

      if (sf === 'F1.espera') {
        setIntervencionJugador(text);
        setSubfase('F1.respuesta');
        return;
      }

      if (sf === 'F3.espera' && caso) {
        const lower = text.toLowerCase();
        if (lower.includes('evidencia') || lower.includes('presento')) {
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
            if (ev.tipo === 'exculpatoria') {
              ajustarMedidor('credibilidad', +8);
              ajustarMedidor('sospecha', -10);
              feedback(`¡Evidencia exculpatoria! +8 Credibilidad, -10 Sospecha`, 'bien');
            } else if (ev.tipo === 'ambigua') {
              ajustarMedidor('credibilidad', +4);
              ajustarMedidor('sospecha', -3);
              feedback(`Evidencia ambigua. +4 Credibilidad, -3 Sospecha`, 'info');
            } else if (ev.tipo === 'incriminatoria') {
              ajustarMedidor('sospecha', +8);
              feedback(`¡Evidencia incriminatoria! +8 Sospecha. Mal elección.`, 'mal');
            }
            hablar('juez', `El acusado presenta: ${ev.nombre}. ${ev.descripcion}.`, undefined, true);
          } else {
            ajustarMedidor('credibilidad', +3);
            hablar('juez', 'Evidencia admitida. Pasemos a los testigos.', undefined, true);
          }
        } else if (lower.includes('no') || lower.includes('renuncio')) {
          ajustarMedidor('credibilidad', -5);
          feedback('Renunciaste a presentar evidencia. -5 Credibilidad', 'mal');
          hablar('juez', 'La defensa renuncia. Pasemos a los testigos.', undefined, true);
        } else {
          ajustarMedidor('credibilidad', +3);
          hablar('juez', 'Evidencia admitida. Pasemos a los testigos.', undefined, true);
        }
        setSubfase('F3.transicion');
        return;
      }

      if (sf === 'F4.guarda_contra') {
        setContadorContraGuarda((c) => c + 1);
        hablar('guarda', text).then((reply: string | undefined) => {
          if (reply && (reply.includes('no recuerdo') || reply.includes('no vi') || reply.includes('baño'))) {
            ajustarMedidor('sospecha', -3);
            feedback('El guarda admite que no vio nada. -3 Sospecha', 'info');
          }
        });
        return;
      }

      if (sf === 'F4.supervisor_contra') {
        setContadorContraSupervisor((c) => c + 1);
        hablar('supervisor', text).then((reply: string | undefined) => {
          const lower = text.toLowerCase();
          if ((lower.includes('despid') && (lower.includes('cuántos') || lower.includes('solo'))) ||
              (lower.includes('por qué') && lower.includes('despid'))) {
            ajustarMedidor('credibilidad', +5);
            ajustarMedidor('sospecha', -5);
            feedback('¡Expones el móvil de venganza! +5 Credibilidad, -5 Sospecha', 'bien');
          }
        });
        return;
      }

      if (sf === 'F5.alegato') {
        hablar('juez', `El acusado presenta su alegato: "${text}". Emite veredicto.`, undefined, true);
        setTimerSegundos(null);
        setSubfase('F5.veredicto');
        return;
      }
    },
    [hablar, ajustarMedidor, feedback, caso, setTimerSegundos]
  );

  // ── Hook de micrófono ──
  useMic({ onKeyword, onFinalTranscript });

  // ── Listener para input de texto ──
  const onKeywordRef = useRef(onKeyword);
  const onFinalTranscriptRef = useRef(onFinalTranscript);
  onKeywordRef.current = onKeyword;
  onFinalTranscriptRef.current = onFinalTranscript;

  useEffect(() => {
    const handler = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      if (!text || text.trim().length < 1) return;
      const lower = text.toLowerCase();
      const keywords = ['protesto', 'protesta', 'objeción', 'objecion', 'recusación', 'recusacion', 'contradicción', 'contradiccion', 'contradice', 'sí', 'si', 'no'];
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          onKeywordRef.current(kw, text);
          break;
        }
      }
      onFinalTranscriptRef.current(text);
    };
    window.addEventListener('notguilty-player-input', handler);
    return () => window.removeEventListener('notguilty-player-input', handler);
  }, []);

  return null;
}

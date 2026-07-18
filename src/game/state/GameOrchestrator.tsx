/**
 * Orquestador del juego: maneja el flujo de fases, IA y micrófono.
 */
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useGame } from '../state/store';
import { llamarNPC } from '../state/npc-client';
import { useMic } from '../hooks/useMic';
import { CASE_QUESO } from '../data/case-queso';

export function GameOrchestrator() {
  // ── Hooks de Zustand (todos primero, en orden consistente) ──
  const fase = useGame((s) => s.fase);
  const npcActual = useGame((s) => s.npcActual);
  const caso = useGame((s) => s.caso);
  const mensajesCount = useGame((s) => s.mensajes.length);
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

  // ── Refs para acceso dentro de callbacks sin re-crearlos ──
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
        setCaption('— ERROR —', 'sistema');
      } finally {
        setIaPensando(false);
      }
    },
    [setCaption, setIaPensando, setNpcActual, pushMensaje, setError]
  );

  // ── Detección de keywords del micrófono ──
  const onKeyword = useCallback(
    (kw: string, fullText: string) => {
      const f = faseRef.current;
      console.log('[KW]', kw, 'en fase', f, '→', fullText);

      // PROTESTO / OBJECIÓN
      if ((kw === 'protesto' || kw === 'protesta' || kw === 'objeción' || kw === 'objecion') && f === 'F2') {
        hablar('juez', `He dicho "${kw.toUpperCase()}". Quiero fundamentar mi objeción: ${fullText}.`);
        ajustarMedidor('credibilidad', +5);
        ajustarMedidor('sospecha', -8);
      }
      // RECUSACIÓN
      if ((kw === 'recusación' || kw === 'recusacion') && f === 'F4') {
        const match = fullText.match(/\d+/);
        if (match) {
          const silla = parseInt(match[0]);
          if (silla >= 1 && silla <= 5) {
            const ok = recusarJurado(silla);
            if (ok) {
              hablar('juez', `He solicitado recusar al jurado ${silla}. Fundamento: ${fullText}.`);
            } else {
              setCaption('Ya no tienes recusaciones disponibles.', 'sistema');
            }
          }
        }
      }
      // SÍ / NO (apertura F1)
      if ((kw === 'sí' || kw === 'si' || kw === 'no') && f === 'F1') {
        if (kw === 'sí' || kw === 'si') {
          hablar('juez', 'El acusado reconoce los cargos. Proceda el fiscal.');
        } else {
          hablar('juez', 'El acusado rechaza los cargos. Proceda el fiscal de todos modos.');
        }
      }
    },
    [hablar, ajustarMedidor, recusarJurado, setCaption]
  );

  // ── Hook de micrófono ──
  const mic = useMic({ onKeyword });

  // ── Iniciar partida al montar ──
  useEffect(() => {
    iniciarPartida(CASE_QUESO);
  }, [iniciarPartida]);

  // ── Flujo automático de F1 (apertura) ──
  const aperturaIniciadaRef = useRef(false);
  useEffect(() => {
    console.log('[ORCH] F1 effect - fase:', fase, 'caso:', !!caso, 'yaIniciado:', aperturaIniciadaRef.current);
    if (fase === 'F1' && !aperturaIniciadaRef.current && caso) {
      aperturaIniciadaRef.current = true;
      console.log('[ORCH] Disparando apertura del juez');
      const textoJuez = `Abre la sesión. Acusado, se le imputa: ${caso.cargos}. Lugar: ${caso.lugar}, hora: ${caso.hora}. ¿Entiende los cargos?`;
      const t = setTimeout(() => {
        hablar('juez', textoJuez).then(() => {
          console.log('[ORCH] Juez respondió');
        }).catch((e) => {
          console.error('[ORCH] Error juez:', e);
        });
      }, 800);
      return () => clearTimeout(t);
    }
  }, [fase, hablar, caso]);

  // ── Cuando el jugador confirma cargos, pasar a F2 ──
  useEffect(() => {
    if (fase === 'F1' && mensajesCount >= 2) {
      const t = setTimeout(() => {
        setFase('F2');
        setTimeout(() => {
          hablar(
            'fiscal',
            'El fiscal presentará su teoría del caso y la primera evidencia.',
            'Empieza tu teoría del caso en 1 frase y presenta la evidencia "Análisis del maletero" como prueba incriminatoria.'
          );
        }, 1500);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [fase, mensajesCount, hablar, setFase]);

  return null;
}

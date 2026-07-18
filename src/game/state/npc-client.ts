/**
 * Cliente para llamar a /api/chat (NVIDIA NIM).
 * Maneja system prompts según NPC y fase actual.
 */
'use client';

import { useGame } from './store';
import { CASE_QUESO, JUECES_SYSTEM_PROMPTS, FISCAL_SYSTEM_PROMPT, CaseVariant } from '../data/case-queso';

interface ChatParams {
  npc: 'juez' | 'fiscal' | 'guarda' | 'novia' | 'supervisor';
  userMessage: string;
  contextoExtra?: string;
  isStageDirection?: boolean; // Si es true, el mensaje es una dirección de escena, no del jugador
}

export async function llamarNPC({ npc, userMessage, contextoExtra, isStageDirection }: ChatParams) {
  const state = useGame.getState();
  const variante = state.variante as CaseVariant;

  // Construir system prompt según NPC
  let systemPrompt = '';
  switch (npc) {
    case 'juez':
      systemPrompt = JUECES_SYSTEM_PROMPTS[variante.v3_perfilJuez];
      break;
    case 'fiscal':
      systemPrompt = FISCAL_SYSTEM_PROMPT;
      break;
    case 'guarda':
    case 'novia':
    case 'supervisor':
      const witness = CASE_QUESO.testigos.find((t) => t.id === npc);
      if (!witness) throw new Error('Testigo no encontrado: ' + npc);
      systemPrompt = witness.systemPromptBase;
      if (variante.v1_testigoMentiroso === npc) {
        systemPrompt +=
          '\n\nINSTRUCCIÓN ESPECIAL: Tú eres el testigo que MIENTE esta partida. Tu testimonio sobre los hechos debe contener al menos una mentira verificable (hora, lugar, o acción). Mantén la mentira coherentemente. Si el jugador te atrapa en la contradicción, admítelo con incomodidad.';
      }
      if (
        (npc === 'guarda' || npc === 'supervisor') &&
        (variante.v4_vinculo === 'enemistad' || variante.v4_vinculo === 'complices')
      ) {
        const otroId = npc === 'guarda' ? 'supervisor' : 'guarda';
        const otro = CASE_QUESO.testigos.find((t) => t.id === otroId);
        if (variante.v4_vinculo === 'enemistad') {
          systemPrompt += `\n\nINSTRUCCIÓN DE VÍNCULO: Tienes enemistad manifiesta con ${otro?.nombre} (${otro?.rol}). Si el jugador te pregunta por él/ella, tu tono cambia a hostil. Usa palabras como "inútil", "incompetente", "no me haga hablar de esa persona".`;
        } else {
          systemPrompt += `\n\nINSTRUCCIÓN DE VÍNCULO: Tú y ${otro?.nombre} (${otro?.rol}) son cómplices. Han coordinado sus testimonios. Si mencionas la misma hora exacta sin que te la pregunten, es porque la ensayaron. Si el jugador nota la coincidencia, reaccionas a la defensiva.`;
        }
      }
      break;
  }

  if (contextoExtra) {
    systemPrompt += `\n\nCONTEXTO ADICIONAL: ${contextoExtra}`;
  }

  // Estado actual del juego como contexto
  const estadoCtx = `Fase actual: ${state.fase}. Credibilidad del acusado: ${state.credibilidad}/100. Sospecha: ${state.sospecha}/100. Vínculo expuesto: ${state.vinculoExpuesto ? 'sí' : 'no'}.`;

  // Si es dirección de escena, el mensaje es una instrucción para el NPC, no del jugador
  const userContent = isStageDirection
    ? `${estadoCtx}\n\n[DIRECCIÓN DE ESCENA]: ${userMessage}`
    : `${estadoCtx}\n\nJugador/acusado dice: "${userMessage}"`;

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'user', content: userContent },
      ],
      systemPrompt,
      npc,
      temperature: 0.75,
      maxTokens: 200,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'desconocido' }));
    throw new Error(`API ${response.status}: ${err.error || err.detail}`);
  }

  const data = await response.json();
  return data as { reply: string; latencyMs: number; tokensUsed: number; npc: string };
}

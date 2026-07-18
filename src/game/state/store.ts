/**
 * Estado global del juego NOT GUILTY.
 * Maneja: fase actual, medidores, jurados, IA, captura de micrófono, transcripción.
 */
'use client';

import { create } from 'zustand';
import { CaseData, CaseVariant, JuryConfig, generarJurados, generarVariante } from '../data/case-queso';

export type Fase = 'pre' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'veredicto';

interface NPCMessage {
  role: 'user' | 'assistant';
  content: string;
  npc?: string;
  ts: number;
}

interface GameState {
  fase: Fase;
  seed: number;
  caso: CaseData | null;
  variante: CaseVariant | null;
  jurados: JuryConfig[];
  juradosRecusados: number[]; // sillas
  recusacionesUsadas: number; // 0 o 1

  // Medidores (0-100)
  credibilidad: number;
  sospecha: number;

  // Vínculo expuesto
  vinculoExpuesto: boolean;

  // IA
  npcActual: 'juez' | 'fiscal' | 'guarda' | 'novia' | 'supervisor' | null;
  mensajes: NPCMessage[];
  iaPensando: boolean;

  // Micrófono
  transcripcion: string;
  escuchando: boolean;
  volumen: number; // 0-1, live

  // UI
  caption: string; // texto que aparece en pantalla como subtítulo del NPC
  speakerActual: string | null;
  errorJuego: string | null;
  veredictoFinal: 'culpable' | 'absuelto' | null;

  // Acciones
  iniciarPartida: (caso?: CaseData) => void;
  setFase: (f: Fase) => void;
  setCaso: (c: CaseData) => void;
  setNpcActual: (n: GameState['npcActual']) => void;
  pushMensaje: (m: NPCMessage) => void;
  setIaPensando: (v: boolean) => void;
  setCaption: (c: string, speaker?: string) => void;
  setTranscripcion: (t: string) => void;
  setEscuchando: (v: boolean) => void;
  setVolumen: (v: number) => void;
  ajustarMedidor: (m: 'credibilidad' | 'sospecha', delta: number) => void;
  ajustarSimpatia: (silla: number, delta: number) => void;
  recusarJurado: (silla: number) => boolean;
  setVinculoExpuesto: (v: boolean) => void;
  setError: (e: string | null) => void;
  setVeredicto: (v: 'culpable' | 'absuelto') => void;
  reset: () => void;
}

const INITIAL = {
  fase: 'pre' as Fase,
  seed: 0,
  caso: null,
  variante: null,
  jurados: [],
  juradosRecusados: [],
  recusacionesUsadas: 0,
  credibilidad: 50,
  sospecha: 50,
  vinculoExpuesto: false,
  npcActual: null,
  mensajes: [],
  iaPensando: false,
  transcripcion: '',
  escuchando: false,
  volumen: 0,
  caption: '',
  speakerActual: null,
  errorJuego: null,
  veredictoFinal: null,
};

export const useGame = create<GameState>((set, get) => ({
  ...INITIAL,

  iniciarPartida: (caso?: CaseData) => {
    const seed = Math.floor(Math.random() * 1_000_000_000);
    const variante = generarVariante(seed);
    const jurados = generarJurados(seed);
    const casoFinal = caso ?? get().caso;
    set({
      ...INITIAL,
      caso: casoFinal,
      seed,
      variante,
      jurados,
      fase: 'F1',
    });
  },

  setFase: (f) => set({ fase: f }),
  setCaso: (c) => set({ caso: c }),
  setNpcActual: (n) => set({ npcActual: n }),
  pushMensaje: (m) => set((s) => ({ mensajes: [...s.mensajes, m] })),
  setIaPensando: (v) => set({ iaPensando: v }),
  setCaption: (c, speaker) => set({ caption: c, speakerActual: speaker || null }),
  setTranscripcion: (t) => set({ transcripcion: t }),
  setEscuchando: (v) => set({ escuchando: v }),
  setVolumen: (v) => set({ volumen: v }),

  ajustarMedidor: (m, delta) =>
    set((s) => ({
      [m]: Math.max(0, Math.min(100, s[m] + delta)),
    })),

  ajustarSimpatia: (silla, delta) =>
    set((s) => ({
      jurados: s.jurados.map((j) =>
        j.silla === silla
          ? { ...j, simpatiaInicial: Math.max(0, Math.min(100, j.simpatiaInicial + delta)) }
          : j
      ),
    })),

  recusarJurado: (silla) => {
    const s = get();
    if (s.recusacionesUsadas >= 1) return false;
    if (s.juradosRecusados.includes(silla)) return false;
    set({
      juradosRecusados: [...s.juradosRecusados, silla],
      recusacionesUsadas: 1,
    });
    return true;
  },

  setVinculoExpuesto: (v) => set({ vinculoExpuesto: v }),
  setError: (e) => set({ errorJuego: e }),
  setVeredicto: (v) => set({ veredictoFinal: v, fase: 'veredicto' }),
  reset: () => set({ ...INITIAL }),
}));

/**
 * Datos del caso 001: "Robo de 3.000 kg de queso manchego del Museo del Jamón".
 * Estructura fija del expediente. Los atributos rolados (V1-V4) se generan en runtime.
 */

export interface CaseData {
  id: string;
  expediente: string;
  cargos: string;
  lugar: string;
  hora: string;
  valorEstimado: string;
  tono: 'absurdo' | 'dramedia' | 'satira';
  testigos: Witness[];
  evidencias: Evidence[];
  recuerdos: Memory[];
}

export interface Witness {
  id: string;
  nombre: string;
  rol: string;
  perfil: string;
  lealtadBase: number; // 0-100, antes de variantes
  systemPromptBase: string;
}

export interface Evidence {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'exculpatoria' | 'incriminatoria' | 'ambigua' | 'trampa';
}

export interface Memory {
  id: string;
  nombre: string;
  descripcion: string;
  pistas: string[];
}

export const CASE_QUESO: CaseData = {
  id: 'queso-manchego-001',
  expediente: 'EXPEDIENTE 2026/NOTG-001',
  cargos:
    'Hurto agravado de producto artesanal (3.000 kg de queso manchego con denominación de origen, valor estimado 180.000 €)',
  lugar: 'Museo del Jamón, Madrid',
  hora: '03:47',
  valorEstimado: '180.000 €',
  tono: 'absurdo',
  testigos: [
    {
      id: 'guarda',
      nombre: 'Don Eustaquio',
      rol: 'Guardia de seguridad nocturno',
      perfil: 'Asustadizo, lealtad neutra',
      lealtadBase: 50,
      systemPromptBase: `Eres Don Eustaquio, guardia de seguridad nocturno del Museo del Jamón. Llevas 23 años en el puesto. Eres nervioso, tartamudeas cuando te preguntan detalles, pero eres honesto.
Esa noche estabas en el baño con dolor de estómago durante 20 minutos (desde las 03:35 hasta las 03:55). El robo fue a las 03:47. NO VISTE NADA.
Hablas en español castizo con humildad. Usas "su señoría" y "yo qué sé".
Tus respuestas son CORTAS (máximo 40 palabras). No inventes detalles que no conoces.`,
    },
    {
      id: 'novia',
      nombre: 'Maribel',
      rol: 'Pareja del acusado',
      perfil: 'Leal, pero honesta',
      lealtadBase: 80,
      systemPromptBase: `Eres Maribel, pareja del acusado desde hace 4 años. Eres sincera y leal, pero no mentirás bajo juramento.
Esa noche el acusado llegó a casa a las 4:00 de la madrugada (no a las 4:15 como dijiste al principio — te confundiste con otro día). Olía a gasolina del coche. NO olía a queso.
Hablas con cariño del acusado pero sin defender lo indefendible. Usas expresiones coloquiales madrileñas.
Tus respuestas son CORTAS (máximo 40 palabras).`,
    },
    {
      id: 'supervisor',
      nombre: 'Anselmo Tellez',
      rol: 'Supervisor del museo',
      perfil: 'Vengativo, despidió al acusado hace 1 mes',
      lealtadBase: 15,
      systemPromptBase: `Eres Anselmo Tellez, supervisor del Museo del Jamón. Despediste al acusado hace 1 mes por "reducción de personal" pero en realidad solo lo despediste a él.
Tienes enemistad personal con Don Eustaquio (el guardia): lo consideras un incompetente que se pasa la mitad del turno en el baño.
Tu testimonio busca inculpar al acusado. Destacas que conocía las cámaras, los puntos ciegos y tenía acceso al coche de reparto.
Hablas con tono autoritario y burocrático. Usas "le conste" y "es pertinente señalar".
Tus respuestas son CORTAS (máximo 50 palabras).`,
    },
  ],
  evidencias: [
    {
      id: 'ev-wapp',
      nombre: 'Mensaje de WhatsApp',
      descripcion:
        'Mensaje del acusado a su novia a las 03:50: "ya salgo del curro, voy para casa". Si el robo fue a las 03:47 y el mensaje fue 3 min después, el acusado estaría en el museo cargando queso, no yéndose.',
      tipo: 'exculpatoria',
    },
    {
      id: 'ev-gasolina',
      nombre: 'Recibo de gasolina',
      descripcion:
        'Ticket de una estación a 30 km del museo, fechado a las 03:30. El coche del museo estaba en la gasolinera, no en el museo, 17 minutos antes del robo.',
      tipo: 'ambigua',
    },
    {
      id: 'ev-rutas',
      nombre: 'Cronograma de rutas',
      descripcion:
        'Hoja de ruta programada del acusado esa noche. Mostraba 4 paradas programadas entre las 22:00 y las 04:00, todas en puntos opuestos al museo.',
      tipo: 'ambigua',
    },
    {
      id: 'ev-maletero',
      nombre: 'Análisis del maletero',
      descripcion:
        'Análisis de laboratorio: el maletero del coche tenía trazas de queso manchego D.O. Coincidencia del 0,3% con quesos de otra denom.',
      tipo: 'incriminatoria',
    },
  ],
  recuerdos: [
    {
      id: 'rec-gasolinera',
      nombre: 'Parada en la gasolinera',
      descripcion: 'Recuerdas haber parado a las 03:30 en la gasolinera de la A-3, km 28. Compraste tabaco y un Red Bull. El coche del museo aparcado fuera.',
      pistas: ['coche', 'gasolina', 'tabaco', '03:30', 'A-3'],
    },
    {
      id: 'rec-despido',
      nombre: 'El día que te despidieron',
      descripcion: 'Hace un mes, Anselmo te llamó a su oficina. "Prescindimos de tus servicios." Fuiste el único despedido. No hubo reducción de personal.',
      pistas: ['despido', 'Anselmo', 'oficina', 'único', 'venganza'],
    },
  ],
};

// Configuración de jurados (siempre 2 Estrictos, 2 Empáticos, 1 Popular)
export interface JuryConfig {
  silla: number;
  perfil: 'estricto' | 'empatico' | 'popular';
  simpatiaInicial: number;
}

export function generarJurados(seed: number): JuryConfig[] {
  // PRNG simple basado en seed
  const rng = mulberry32(seed);
  const simpatias = {
    estricto: () => 30 + Math.floor(rng() * 16), // 30-45
    empatico: () => 45 + Math.floor(rng() * 16), // 45-60
    popular: () => 40 + Math.floor(rng() * 16), // 40-55
  };

  // Orden de perfiles aleatorio, composición fija
  const perfiles: Array<'estricto' | 'empatico' | 'popular'> = [
    'estricto', 'estricto', 'empatico', 'empatico', 'popular',
  ];
  // Shuffle
  for (let i = perfiles.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [perfiles[i], perfiles[j]] = [perfiles[j], perfiles[i]];
  }

  return perfiles.map((perfil, i) => ({
    silla: i + 1,
    perfil,
    simpatiaInicial:
      perfil === 'estricto'
        ? simpatias.estricto()
        : perfil === 'empatico'
        ? simpatias.empatico()
        : simpatias.popular(),
  }));
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Variabilidad V1-V4 (rolada en pre-partida)
export interface CaseVariant {
  v1_testigoMentiroso: 'guarda' | 'novia' | 'supervisor';
  v2_evidenciaClave: 'ev-wapp' | 'ev-gasolina' | 'ev-rutas';
  v3_perfilJuez: 'filosofo' | 'estricto' | 'impaciente';
  v4_vinculo: 'complices' | 'enemistad' | 'coartada';
}

export function generarVariante(seed: number): CaseVariant {
  const rng = mulberry32(seed * 7);
  const variant: CaseVariant = {
    v1_testigoMentiroso: ['guarda', 'novia', 'supervisor'][Math.floor(rng() * 3)] as any,
    v2_evidenciaClave: ['ev-wapp', 'ev-gasolina', 'ev-rutas'][Math.floor(rng() * 3)] as any,
    v3_perfilJuez: ['filosofo', 'estricto', 'impaciente'][Math.floor(rng() * 3)] as any,
    v4_vinculo: ['complices', 'enemistad', 'coartada'][Math.floor(rng() * 3)] as any,
  };
  // Aplicar reglas de exclusión (10.2 del GDD)
  // Regla 1: V1=guarda y V4=complices → re-rola V4
  if (variant.v1_testigoMentiroso === 'guarda' && variant.v4_vinculo === 'complices') {
    variant.v4_vinculo = rng() > 0.5 ? 'enemistad' : 'coartada';
  }
  // Regla 2: V3=estricto y V4=coartada → re-rola V4
  if (variant.v3_perfilJuez === 'estricto' && variant.v4_vinculo === 'coartada') {
    variant.v4_vinculo = rng() > 0.5 ? 'complices' : 'enemistad';
  }
  return variant;
}

export const JUECES_SYSTEM_PROMPTS: Record<CaseVariant['v3_perfilJuez'], string> = {
  filosofo: `Eres el JUEZ FILÓSOFO. Voz grave, lento, reflexivo. Hablas con frases largas y citas implícitas.
Consideras cada palabra. No te apresuras. Pides fundamentación antes de admitir objeciones.
Si el jugador grita, le pides moderación con calma. Si el jugador hace una pausa larga, no le interrumpes.
Tus decisiones se basan en la coherencia lógica, no en emociones.
Responde SIEMPRE en español, máximo 60 palabras por intervención.`,
  estricto: `Eres el JUEZ ESTRICTO. Voz firme, rápida, cortante. No toleras improvisaciones.
Penalizas el volumen alto de voz. Penalicas las vacilaciones ("eh", "bueno", "o sea").
Si el jugador grita, le llamas la atención inmediatamente. Si vacila más de 4 veces por minuto, le pides concreción.
Admites objeciones solo si el fundamento es legalmente preciso.
Tus decisiones se basan en el rigor procesal.
Responde SIEMPRE en español, máximo 50 palabras por intervención.`,
  impaciente: `Eres el JUEZ IMPACIENTE. Voz aguda, mira el reloj, suspira. Quieres acabar ya.
Penalices las pausas largas (>2 segundos). Si el jugador se queda callado, le apremias.
Si el jugador habla rápido y al grano, le facilitas. Si se va por las ramas, le cortas.
Admites objeciones rápidamente para mantener el ritmo.
Tus decisiones se basan en la intuición y la urgencia.
Responde SIEMPRE en español, máximo 40 palabras por intervención.`,
};

export const FISCAL_SYSTEM_PROMPT = `Eres la FISCAL. Voz aguda, rápida, ambiciosa. Tu objetivo es conseguir la condena del acusado.
Atacas cualquier contradicción. Cuestionas la credibilidad del acusado. Defiendes a tus testigos aunque mientan (si mienten, lo haces sin que se note).
Si el jugador objeta con buen fundamento, reconoces la objeción solo si no tienes escapatoria.
Si el jugador hace 2 objeciones admitidas seguidas, te confundes en la siguiente intervención (citas mal una evidencia o mezclas testigos). NO corriges voluntariamente.
Responde SIEMPRE en español, máximo 70 palabras.`;

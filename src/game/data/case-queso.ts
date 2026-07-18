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
      systemPromptBase: `Eres Don Eustaquio, guardia de seguridad NOCTURNO del Museo del Jamón (tu turno es de 22:00 a 06:00). Llevas 23 años en el puesto. Eres nervioso, tartamudeas cuando te preguntan detalles, pero eres honesto.

EL CASO: El acusado es un repostero nocturno del museo. Se le acusa de robar 3.000 kg de queso manchego D.O. valorado en 180.000€. El robo fue a las 03:47 de la madrugada en el museo. Usaron el coche de reparto del museo para llevarse el queso.

TU VERDAD: Esa noche estabas en el baño con dolor de estómago durante 20 minutos (desde las 03:35 hasta las 03:55). El robo fue a las 03:47. NO VISTE NADA. Tu turno terminó a las 06:00 como todos los días.

REGLAS:
- NUNCA uses palabras en inglés. Solo español castizo.
- Tu turno es NOCTURNO (22:00 a 06:00). NUNCA digas que terminó "a las ocho".
- Hablas en español castizo con humildad. Usas "su señoría" y "yo qué sé".
- Respuestas CORTAS (máximo 40 palabras). No inventes detalles.
- Si te preguntan por Anselmo Tellez (supervisor), tu tono cambia: lo consideras un mandón pretencioso.
- NO mencionas al acusado si no se te pregunta directamente.`,
    },
    {
      id: 'novia',
      nombre: 'Maribel',
      rol: 'Pareja del acusado',
      perfil: 'Leal, pero honesta',
      lealtadBase: 80,
      systemPromptBase: `Eres Maribel, pareja del acusado desde hace 4 años. Eres sincera y leal, pero no mentirás bajo juramento.

EL CASO: Acusan a tu pareja de robar 3.000 kg de queso manchego del Museo del Jamón a las 03:47.

TU VERDAD: Esa noche el acusado llegó a casa a las 4:00 de la madrugada. Olía a gasolina del coche. NO olía a queso.

REGLAS:
- Hablas con cariño del acusado pero sin defender lo indefendible.
- Usas expresiones coloquiales madrileñas ("tío", "qué va", "o sea").
- Respuestas CORTAS (máximo 40 palabras).
- Confirmas la hora de llegada (4:00), no mientes.`,
    },
    {
      id: 'supervisor',
      nombre: 'Anselmo Tellez',
      rol: 'Supervisor del museo',
      perfil: 'Vengativo, despidió al acusado hace 1 mes',
      lealtadBase: 15,
      systemPromptBase: `Eres Anselmo Tellez, supervisor del Museo del Jamón. Despediste al acusado hace 1 mes por "reducción de personal" pero en realidad solo lo despediste a él. Tienes enemistad personal con Don Eustaquio (el guardia): lo consideras un incompetente que se pasa la mitad del turno en el baño.

EL CASO: Acusan a tu ex-empleado de robar 3.000 kg de queso manchego D.O. del museo a las 03:47. Quieres que lo condenen.

TU AGENDA: Tu testimonio busca inculpar al acusado. Destacas que conocía las cámaras, los puntos ciegos y tenía acceso al coche de reparto. NO mencionas que lo despediste por venganza personal.

REGLAS:
- NUNCA uses palabras en inglés. Solo español.
- Hablas con tono autoritario y burocrático. Usas "le conste" y "es pertinente señalar".
- Respuestas CORTAS (máximo 50 palabras).
- Si te preguntan por qué despediste al acusado, dices "reducción de personal". Si insisten en cuántos despediste, admites "solo a él" con incomodidad.
- Si te preguntan por Eustaquio, tu tono cambia a hostil: lo llamas "incompetente", "inútil", "lastre operativo".`,
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
        'Análisis de laboratorio: el maletero del coche del museo tenía trazas de queso manchego D.O. Coincidencia del 0,3% con quesos de otra denom.',
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
  filosofo: `Eres el JUEZ FILÓSOFO. Voz grave, lento, reflexivo. Hablas con frases largas.

EL CASO: El acusado es un repostero nocturno del Museo del Jamón acusado de robar 3.000 kg de queso manchego D.O. (180.000€) a las 03:47. Tienes delante: 3 testigos (guarda, novia, supervisor), 4 evidencias (mensaje WhatsApp 03:50, recibo gasolina 03:30 a 30km, cronograma rutas, análisis maletero con trazas de queso).

REGLAS:
- NUNCA muestres tu razonamiento interno. NUNCA hables en inglés. Responde directamente en español.
- Cuando el jugador objete, decides SIEMPRE entre "Protesta admitida" o "Protesta rechazada" como primera frase.
- Pides fundamentación antes de admitir objeciones.
- Si el jugador grita, le pides moderación con calma.
- Tus decisiones se basan en la coherencia lógica, no en emociones.
- Responde SIEMPRE en español, máximo 60 palabras por intervención.
- Puedes usar acciones entre asteriscos (*asiente*, *ajusta las gafas*).
- En el veredicto final, dice explícitamente "CULPABLE" o "NO CULPABLE" como primera palabra.`,
  estricto: `Eres el JUEZ ESTRICTO. Voz firme, rápida, cortante. No toleras improvisaciones.

EL CASO: El acusado es un repostero nocturno del Museo del Jamón acusado de robar 3.000 kg de queso manchego D.O. (180.000€) a las 03:47. Tienes delante: 3 testigos, 4 evidencias.

REGLAS:
- NUNCA muestres tu razonamiento interno. NUNCA hables en inglés. Responde directamente en español.
- Cuando el jugador objete, decides SIEMPRE entre "Protesta admitida" o "Protesta rechazada" como primera frase.
- Penalizas el volumen alto de voz. Penalizas las vacilaciones.
- Si el jugador grita, le llamas la atención inmediatamente.
- Admites objeciones solo si el fundamento es legalmente preciso.
- Responde SIEMPRE en español, máximo 50 palabras por intervención.
- En el veredicto final, dice explícitamente "CULPABLE" o "NO CULPABLE" como primera palabra.`,
  impaciente: `Eres el JUEZ IMPACIENTE. Voz aguda, miras el reloj, suspiras. Quieres acabar ya.

EL CASO: El acusado es un repostero nocturno del Museo del Jamón acusado de robar 3.000 kg de queso manchego D.O. a las 03:47.

REGLAS:
- NUNCA muestres tu razonamiento interno. NUNCA hables en inglés. Responde directamente en español.
- Cuando el jugador objete, decides SIEMPRE entre "Protesta admitida" o "Protesta rechazada" como primera frase.
- Penalizas las pausas largas. Si el jugador se queda callado, le apremias.
- Si el jugador habla rápido y al grano, le facilitas. Si se va por las ramas, le cortas.
- Admites objeciones rápidamente para mantener el ritmo.
- Responde SIEMPRE en español, máximo 40 palabras por intervención.
- En el veredicto final, dice explícitamente "CULPABLE" o "NO CULPABLE" como primera palabra.`,
};

export const FISCAL_SYSTEM_PROMPT = `Eres la FISCAL. Voz aguda, rápida, ambiciosa.

EL CASO: El acusado es un repostero nocturno del Museo del Jamón acusado de robar 3.000 kg de queso manchego D.O. (180.000€) a las 03:47. Se llevó el queso en el coche de reparto del museo.

EVIDENCIAS DE LA ACUSACIÓN:
1. Análisis del maletero del coche del museo: trazas de queso manchego D.O. (99.7% de coincidencia).
2. Video de seguridad a las 03:47: persona con uniforme del museo cargando caja en el maletero.
3. El acusado conocía las cámaras y tenía acceso al coche (era repostero nocturno).

TU AGENDA: Tu objetivo es conseguir la condena. Atacas cualquier contradicción. Cuestionas la credibilidad del acusado. Defiendes a tus testigos.

REGLAS:
- Responde SIEMPRE en español, máximo 70 palabras.
- NUNCA inventes crímenes que no sean el robo de queso (NO menciones asesinatos, armas, sangre, cadáveres).
- Si el jugador objeta con buen fundamento, reconoces la objeción solo si no tienes escapatoria.
- Si el jugador hace 2 objeciones admitidas seguidas, te confundes en la siguiente intervención.`;

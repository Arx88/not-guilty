/**
 * Caso del queso manchego — REDISEÑADO con contradicciones reales.
 * 
 * CAMBIO FUNDAMENTAL: los testigos ahora tienen contradicciones REALES
 * entre sus testimonios. El jugador debe ESCUCHAR, COMPARAR y SEÑALAR
 * las contradicciones. Esto es lo que hace Phoenix Wright divertido.
 * 
 * 3 contradicciones escondidas:
 * C1: Guarda dice "no vi a nadie" ↔ Supervisor dice "el guarda me avisó que vio a alguien"
 * C2: Supervisor dice "reducción de personal" ↔ Admite "solo despidió a 1 persona"
 * C3: Fiscal dice "video a las 03:47" ↔ WhatsApp a las 03:50 "ya salgo del curro" (3 min para cargar 3000 kg)
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
  contradicciones: Contradiction[];
}

export interface Witness {
  id: string;
  nombre: string;
  rol: string;
  perfil: string;
  lealtadBase: number;
  systemPromptBase: string;
}

export interface Evidence {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'exculpatoria' | 'incriminatoria' | 'ambigua' | 'trampa';
}

export interface Contradiction {
  id: string;
  descripcion: string;
  testigoA: string; // ID del testigo que dijo X
  testigoB: string; // ID del testigo que dijo Y (contradictorio)
  fraseA: string; // Lo que dijo A
  fraseB: string; // Lo que dijo B (contradictorio)
  descubierta: boolean;
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
      systemPromptBase: `TÚ ERES DON EUSTAQUIO, guardia de seguridad NOCTURNO del Museo del Jamón. El jugador es el ACUSADO. NUNCA hables como si fueras el acusado o el juez. TÚ eres testigo.

EL CASO: El acusado es un repostero nocturno del museo. Se le acusa de robar 3.000 kg de queso manchego D.O. valorado en 180.000€. El robo fue a las 03:47 de la madrugada en el museo.

TU VERDAD: Esa noche estabas en el baño con dolor de estómago durante 20 minutos (desde las 03:35 hasta las 03:55). El robo fue a las 03:47. NO VISTE NADA. Tu turno terminó a las 06:00 como todos los días.

REGLAS:
- NUNCA uses palabras en inglés. Solo español castizo.
- Tu turno es NOCTURNO (22:00 a 06:00). NUNCA digas que terminó "a las ocho".
- Hablas en español castizo con humildad. Usas "su señoría" y "yo qué sé".
- Respuestas CORTAS (máximo 40 palabras). No inventes detalles.
- Si te preguntan por Anselmo Tellez (supervisor), tu tono cambia: lo consideras un mandón pretencioso.`,
    },
    {
      id: 'novia',
      nombre: 'Maribel',
      rol: 'Pareja del acusado',
      perfil: 'Leal, pero honesta',
      lealtadBase: 80,
      systemPromptBase: `TÚ ERES MARIBEL, pareja del acusado desde hace 4 años. El jugador es el ACUSADO. NUNCA hables como si fueras el acusado o el juez. TÚ eres testigo.

Eres sincera y leal, pero no mentirás bajo juramento.

EL CASO: Acusan a tu pareja de robar 3.000 kg de queso manchego del Museo del Jamón a las 03:47.

TU VERDAD: Esa noche el acusado llegó a casa a las 4:00 de la madrugada. Olía a gasolina del coche. NO olía a queso.

REGLAS:
- NUNCA uses palabras en inglés. Solo español.
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
      systemPromptBase: `TÚ ERES ANSELMO TELLEZ, supervisor del Museo del Jamón. El jugador es el ACUSADO. NUNCA hables como si fueras el acusado o el juez. TÚ eres testigo de cargo.

Despediste al acusado hace 1 mes por "reducción de personal" pero en realidad solo lo despediste a él. Tienes enemistad personal con Don Eustaquio (el guardia).

EL CASO: Acusan a tu ex-empleado de robar 3.000 kg de queso manchego D.O. del museo a las 03:47. Quieres que lo condenen.

TU AGENDA: Tu testimonio busca inculpar al acusado. Destacas que conocía las cámaras, los puntos ciegos y tenía acceso al coche de reparto.

REGLAS:
- NUNCA uses palabras en inglés. Solo español.
- Hablas con tono autoritario y burocrático. Usas "le conste" y "es pertinente señalar".
- Respuestas CORTAS (máximo 50 palabras).
- Si te preguntan por qué despediste al acusado, dices "reducción de personal". Si insisten en cuántos despediste, admite "solo a él" con incomodidad.
- Si te preguntan por Eustaquio, tu tono cambia a hostil: lo llamas "incompetente", "inútil".

IMPORTANTE - CONTRADICCIÓN QUE DEBES MENCIONAR:
En tu testimonio inicial, DEBES decir: "El guarda Eustaquio me avisó esa noche que vio a alguien sospechoso cerca del almacén." Esto es una MENTIRA — Eustaquio estaba en el baño y no vio a nadie. Pero tú lo dices para inculpar al acusado. Si el jugador te pregunta si Eustaquio te avisó, mantén la mentira. Si el jugador confronta tu versión con la de Eustaquio (que dice que no vio nada), admite la contradicción con incomodidad.`,
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
  contradicciones: [
    {
      id: 'C1',
      descripcion: 'El guarda dice que NO vio a nadie, pero el supervisor dice que el guarda LE AVISÓ que vio a alguien sospechoso.',
      testigoA: 'guarda',
      testigoB: 'supervisor',
      fraseA: 'No vi nada, su señoría. Yo qué sé.',
      fraseB: 'El guarda Eustaquio me avisó que vio a alguien sospechoso.',
      descubierta: false,
    },
    {
      id: 'C2',
      descripcion: 'El supervisor dice "reducción de personal" pero admite que solo despidió a 1 persona. No es reducción, es venganza personal.',
      testigoA: 'supervisor',
      testigoB: 'supervisor',
      fraseA: 'Reducción de personal, le conste.',
      fraseB: 'Solo a él. Es pertinente señalar que...',
      descubierta: false,
    },
    {
      id: 'C3',
      descripcion: 'El fiscal dice que el video muestra al acusado a las 03:47, pero el WhatsApp a las 03:50 dice "ya salgo del curro". 3 minutos no bastan para cargar 3.000 kg de queso.',
      testigoA: 'fiscal',
      testigoB: 'acusado',
      fraseA: 'Video a las 03:47 muestra al acusado cargando cajas.',
      fraseB: 'WhatsApp a las 03:50: "ya salgo del curro, voy para casa".',
      descubierta: false,
    },
  ],
};

// Configuración de jurados
export interface JuryConfig {
  silla: number;
  perfil: 'estricto' | 'empatico' | 'popular';
  simpatiaInicial: number;
}

export function generarJurados(seed: number): JuryConfig[] {
  const rng = mulberry32(seed);
  const perfiles: Array<'estricto' | 'empatico' | 'popular'> = [
    'estricto', 'estricto', 'empatico', 'empatico', 'popular',
  ];
  for (let i = perfiles.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [perfiles[i], perfiles[j]] = [perfiles[j], perfiles[i]];
  }
  return perfiles.map((perfil, i) => ({
    silla: i + 1,
    perfil,
    simpatiaInicial:
      perfil === 'estricto'
        ? 30 + Math.floor(rng() * 16)
        : perfil === 'empatico'
        ? 45 + Math.floor(rng() * 16)
        : 40 + Math.floor(rng() * 16),
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
  if (variant.v1_testigoMentiroso === 'guarda' && variant.v4_vinculo === 'complices') {
    variant.v4_vinculo = rng() > 0.5 ? 'enemistad' : 'coartada';
  }
  if (variant.v3_perfilJuez === 'estricto' && variant.v4_vinculo === 'coartada') {
    variant.v4_vinculo = rng() > 0.5 ? 'complices' : 'enemistad';
  }
  return variant;
}

export const JUECES_SYSTEM_PROMPTS: Record<CaseVariant['v3_perfilJuez'], string> = {
  filosofo: `TÚ ERES EL JUEZ de este tribunal. El jugador es el ACUSADO en el banquillo. NUNCA hables como si fueras el acusado. TÚ diriges el juicio.

Eres el JUEZ FILÓSOFO. Voz grave, lento, reflexivo. Hablas con frases largas.

EL CASO: El acusado es un repostero nocturno del Museo del Jamón acusado de robar 3.000 kg de queso manchego D.O. (180.000€) a las 03:47.

REGLAS:
- TÚ ERES EL JUEZ. El que te habla es el ACUSADO. NUNCA respondas como si fueras el acusado.
- NUNCA muestres tu razonamiento interno. NUNCA hables en inglés.
- Cuando el jugador objete, decides SIEMPRE entre "Protesta admitida" o "Protesta rechazada" como primera frase.
- Si el jugador señala una contradicción entre testigos, reacciona con "CONTRADICCIÓN VÁLIDA" o "No hay contradicción".
- Responde SIEMPRE en español, máximo 60 palabras.
- En el veredicto final, dice explícitamente "CULPABLE" o "NO CULPABLE" como primera palabra.`,
  estricto: `TÚ ERES EL JUEZ de este tribunal. El jugador es el ACUSADO en el banquillo. NUNCA hables como si fueras el acusado. TÚ diriges el juicio.

Eres el JUEZ ESTRICTO. Voz firme, rápida, cortante.

EL CASO: El acusado es un repostero nocturno del Museo del Jamón acusado de robar 3.000 kg de queso manchego D.O. (180.000€) a las 03:47.

REGLAS:
- TÚ ERES EL JUEZ. El que te habla es el ACUSADO. NUNCA respondas como si fueras el acusado.
- NUNCA muestres tu razonamiento interno. NUNCA hables en inglés.
- Cuando el jugador objete, decides SIEMPRE entre "Protesta admitida" o "Protesta rechazada".
- Si el jugador señala una contradicción, reacciona con "CONTRADICCIÓN VÁLIDA" o "No hay contradicción".
- Responde SIEMPRE en español, máximo 50 palabras.
- Veredicto: "CULPABLE" o "NO CULPABLE" como primera palabra.`,
  impaciente: `TÚ ERES EL JUEZ de este tribunal. El jugador es el ACUSADO en el banquillo. NUNCA hables como si fueras el acusado. TÚ diriges el juicio.

Eres el JUEZ IMPACIENTE. Voz aguda, miras el reloj, suspiras.

EL CASO: El acusado es un repostero nocturno del Museo del Jamón acusado de robar 3.000 kg de queso manchego D.O. a las 03:47.

REGLAS:
- TÚ ERES EL JUEZ. El que te habla es el ACUSADO. NUNCA respondas como si fueras el acusado.
- NUNCA muestres tu razonamiento interno. NUNCA hables en inglés.
- Cuando el jugador objete, decides SIEMPRE entre "Protesta admitida" o "Protesta rechazada".
- Si el jugador señala una contradicción, reacciona con "CONTRADICCIÓN VÁLIDA" o "No hay contradicción".
- Responde SIEMPRE en español, máximo 40 palabras.
- Veredicto: "CULPABLE" o "NO CULPABLE" como primera palabra.`,
};

export const FISCAL_SYSTEM_PROMPT = `TÚ ERES LA FISCAL de este tribunal. El jugador es el ACUSADO. NUNCA hables como si fueras el acusado. TÚ acusas.

Voz aguda, rápida, ambiciosa.

EL CASO: El acusado es un repostero nocturno del Museo del Jamón acusado de robar 3.000 kg de queso manchego D.O. (180.000€) a las 03:47.

EVIDENCIAS:
1. Análisis del maletero: trazas de queso manchego D.O. (99.7% coincidencia).
2. Video de seguridad a las 03:47: persona con uniforme cargando caja.
3. El acusado conocía las cámaras y tenía acceso al coche.

REGLAS:
- TÚ ERES LA FISCAL. NUNCA hables como el acusado.
- Responde SIEMPRE en español, máximo 70 palabras.
- NUNCA inventes crímenes que no sean el robo de queso.
- Si el jugador objeta con buen fundamento, reconoce la objeción solo si no tienes escapatoria.
- Si el jugador señala una contradicción en tus testigos, defiéndete o cambia de estrategia.`;

/**
 * Sistema de sonido procedural con Web Audio API.
 * Sin archivos externos — todos los sonidos se generan en runtime.
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      return null;
    }
  }
  return audioCtx;
}

/** Beep simple con frecuencia y duración */
function tone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

/** Acorde ascendente (victoria / credibilidad sube) */
export function sndSuccess() {
  tone(523.25, 0.15, 'sine', 0.12); // C5
  setTimeout(() => tone(659.25, 0.15, 'sine', 0.12), 80); // E5
  setTimeout(() => tone(783.99, 0.25, 'sine', 0.15), 160); // G5
}

/** Acorde descendente (derrota / sospecha sube) */
export function sndFail() {
  tone(440, 0.15, 'sawtooth', 0.1); // A4
  setTimeout(() => tone(349.23, 0.15, 'sawtooth', 0.1), 80); // F4
  setTimeout(() => tone(261.63, 0.3, 'sawtooth', 0.12), 160); // C4
}

/** Golpe de mazo (juez habla) */
export function sndGavel() {
  const ctx = getCtx();
  if (!ctx) return;
  // Ruido corto + tono grave
  const bufferSize = ctx.sampleRate * 0.1;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 200;
  const gain = ctx.createGain();
  gain.gain.value = 0.4;
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start();
}

/** Tick del timer (cada segundo) */
export function sndTick() {
  tone(880, 0.05, 'square', 0.08);
}

/** Beep de window de objeción abriendo */
export function sndWindowOpen() {
  tone(440, 0.1, 'triangle', 0.15);
  setTimeout(() => tone(660, 0.1, 'triangle', 0.15), 100);
  setTimeout(() => tone(880, 0.2, 'triangle', 0.18), 200);
}

/** Beep de window de objeción cerrando (urgente) */
export function sndWindowClose() {
  tone(880, 0.08, 'sawtooth', 0.12);
  setTimeout(() => tone(440, 0.15, 'sawtooth', 0.12), 80);
}

/** Veredicto: solemne */
export function sndVerdict() {
  tone(130.81, 0.5, 'sine', 0.2); // C3
  setTimeout(() => tone(196, 0.5, 'sine', 0.2), 200); // G3
  setTimeout(() => tone(261.63, 0.8, 'sine', 0.25), 400); // C4
}

/** Click botón */
export function sndClick() {
  tone(1200, 0.03, 'square', 0.06);
}

/** Inicializar audio context tras interacción del usuario */
export function initAudio() {
  const ctx = getCtx();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
}

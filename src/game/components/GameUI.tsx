/**
 * GameUI v4.0 — Rediseño basado en Design Doc v3 (3-column reference).
 *
 * LAYOUT (3-column grid):
 * - LEFT (180px): CASO ACTUAL · TRIBUNAL · CÓMO DEFENDERTE
 * - CENTER (flex): 3D courtroom scene visible · dialogue box · waveform · input bar
 * - RIGHT (180px): CREDIBILIDAD/SOSPECHA · actions · HISTORIAL · settings/end/share
 *
 * The 3D scene renders BEHIND this overlay (sibling component). The center
 * column has no background so the scene shows through; only the bottom area
 * (dialogue + waveform + input) and floating overlays receive pointer events.
 */
'use client';

import { useGame } from '../state/store';
import { useMic } from '../hooks/useMic';
import { Button } from '@/components/ui/button';
import {
  Mic,
  MicOff,
  Send,
  Gavel,
  Users,
  Check,
  FileText,
  FlaskConical,
  ListChecks,
  Settings,
  LogOut,
  Share2,
  History as HistoryIcon,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { initAudio, sndClick, sndTick, startAmbient, stopAmbient } from '../state/sounds';

const PLAYER_INPUT_EVENT = 'notguilty-player-input';
export function sendPlayerInput(text: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PLAYER_INPUT_EVENT, { detail: text }));
  }
}

// Design tokens (per reference spec)
const GOLD = '#c69850';
const GREEN = '#5a9e5a';
const RED = '#c44545';
const TEAL = '#5fb6c0';
const BODY = '#f0e4cf';

export function GameUI() {
  const fase = useGame((s) => s.fase);
  const credibilidad = useGame((s) => s.credibilidad);
  const sospecha = useGame((s) => s.sospecha);
  const caption = useGame((s) => s.caption);
  const speakerActual = useGame((s) => s.speakerActual);
  const iaPensando = useGame((s) => s.iaPensando);
  const transcripcion = useGame((s) => s.transcripcion);
  const volumen = useGame((s) => s.volumen);
  const caso = useGame((s) => s.caso);
  const variante = useGame((s) => s.variante);
  const jurados = useGame((s) => s.jurados);
  const juradosRecusados = useGame((s) => s.juradosRecusados);
  const errorJuego = useGame((s) => s.errorJuego);
  const veredictoFinal = useGame((s) => s.veredictoFinal);
  const windowObjecion = useGame((s) => s.windowObjecion);
  const timerSegundos = useGame((s) => s.timerSegundos);
  const subfaseActual = useGame((s) => s.subfaseActual);
  const objecionesRestantes = useGame((s) => s.objecionesRestantes);
  const feedbackFlash = useGame((s) => s.feedbackFlash);
  const mensajes = useGame((s) => s.mensajes);
  const testimoniosEscuchados = useGame((s) => s.testimoniosEscuchados);

  const [micActive, setMicActive] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [waveTick, setWaveTick] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const mic = useMic({});

  const timerAnterior = useRef(timerSegundos);
  useEffect(() => {
    if (
      timerSegundos !== null &&
      timerSegundos !== timerAnterior.current &&
      timerSegundos > 0 &&
      timerSegundos <= 5
    )
      sndTick();
    timerAnterior.current = timerSegundos;
  }, [timerSegundos]);

  useEffect(() => {
    if (fase !== 'pre') startAmbient();
    return () => stopAmbient();
  }, [fase]);

  // Live waveform animation when mic is active
  useEffect(() => {
    if (!micActive) return;
    let raf: number;
    const loop = () => {
      setWaveTick((t) => (t + 1) % 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [micActive]);

  if (fase === 'pre') return null;

  const esperandoJugador = [
    'F1.espera',
    'F3.espera',
    'F4.guarda_contra',
    'F4.supervisor_contra',
    'F5.alegato',
  ].includes(subfaseActual);

  const speakerLabel = {
    juez: 'JUEZ',
    fiscal: 'FISCAL',
    guarda: 'EUSTAQUIO',
    supervisor: 'ANSELMO',
    novia: 'MARIBEL',
    sistema: 'SISTEMA',
    null: 'DIÁLOGO',
  }[speakerActual || 'null'];

  const tKeys = Object.keys(testimoniosEscuchados);

  const toggleMic = () => {
    initAudio();
    sndClick();
    if (micActive) {
      mic.stop();
      setMicActive(false);
    } else {
      mic.start();
      setMicActive(true);
    }
  };

  const submitText = () => {
    const t = textInput.trim();
    if (!t) return;
    sndClick();
    sendPlayerInput(t);
    setTextInput('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const hint = windowObjecion
    ? `¡PROTESTA! (${objecionesRestantes} restantes)`
    : subfaseActual === 'F1.espera'
    ? '💬 Responde al juez'
    : subfaseActual === 'F3.espera'
    ? '📋 Click una evidencia abajo'
    : subfaseActual === 'F4.guarda_contra'
    ? '🛡️ Pregunta al guarda'
    : subfaseActual === 'F4.supervisor_contra'
    ? '👔 Pregunta al supervisor · ¿Dijo algo distinto al guarda?'
    : subfaseActual === 'F5.alegato'
    ? '⚖️ ALEGATO FINAL · Convence al juez'
    : '⏳ Esperando...';

  // Historial from mensajes (NPC lines)
  const historial = mensajes.slice(-12).map((m) => {
    const d = new Date(m.ts);
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    const spk = m.npc ? m.npc.toUpperCase().slice(0, 8) : 'TÚ';
    return {
      ts: `${mm}:${ss}`,
      speaker: spk,
      text: m.content.slice(0, 80),
      isPlayer: m.role === 'user',
    };
  });

  const credLabel =
    credibilidad >= 70 ? 'Favorable' : credibilidad >= 45 ? 'Neutral' : 'En duda';
  const sospLabel =
    sospecha >= 70 ? 'Alarmante' : sospecha >= 45 ? 'Neutral' : 'Baja';

  const juezLabel = variante?.v3_perfilJuez
    ? variante.v3_perfilJuez.charAt(0).toUpperCase() + variante.v3_perfilJuez.slice(1)
    : '—';

  // Waveform bar amplitudes
  const BARS = 32;
  const wave = Array.from({ length: BARS }, (_, i) => {
    if (!micActive) return 0.18 + Math.sin(i * 0.5) * 0.1;
    const phase = (waveTick * 0.15 + i * 0.6) % (Math.PI * 2);
    const base = 0.35 + Math.sin(phase) * 0.35 + Math.sin(phase * 2.3 + i) * 0.15;
    const vol = Math.min(1, volumen * 2.2);
    return Math.max(0.12, Math.min(1, base * (0.5 + vol)));
  });

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      style={{ fontFamily: 'Inter, system-ui, sans-serif', color: BODY }}
    >
      <style jsx>{`
        @keyframes hb { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes bi { from{transform:translateY(8px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes pop { from{transform:scale(.9);opacity:0} to{transform:scale(1);opacity:1} }
        .ng-panel {
          background: rgba(20,20,20,0.9);
          border: 1px solid rgba(100,100,100,0.3);
          border-radius: 8px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .ng-header {
          color: ${GOLD};
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .ng-mono {
          font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
        }
        .ng-scroll::-webkit-scrollbar { width: 4px; }
        .ng-scroll::-webkit-scrollbar-thumb { background: rgba(100,100,100,0.4); border-radius: 2px; }
        .ng-scroll::-webkit-scrollbar-track { background: transparent; }
        .ng-action {
          background: rgba(20,20,20,0.9);
          border: 1px solid rgba(100,100,100,0.3);
          border-radius: 8px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: background 0.15s;
        }
        .ng-action:hover { background: rgba(40,40,40,0.95); }
      `}</style>

      {/* Tension overlay */}
      {sospecha > 70 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle,transparent 40%,rgba(139,42,42,${(sospecha - 70) / 80}) 100%)`,
            animation: 'hb 1.2s infinite',
          }}
        />
      )}

      {/* ═══════ 3-COLUMN GRID ═══════ */}
      <div className="absolute inset-0 grid grid-cols-[180px_1fr_180px] gap-2 p-2">
        {/* ═══════════ LEFT COLUMN ═══════════ */}
        <div className="flex flex-col gap-2 pointer-events-auto overflow-hidden">
          {/* CASO ACTUAL */}
          <div className="ng-panel p-2.5">
            <div className="ng-header text-[14px] mb-1.5">CASO ACTUAL</div>
            <div className="text-[12px] mb-0.5">Fase {fase}</div>
            <div className="text-[12px]">JUEZ: {juezLabel}</div>
            {caso && (
              <div
                className="ng-mono text-[10px] opacity-50 mt-1.5 pt-1.5"
                style={{ borderTop: '1px solid rgba(100,100,100,0.2)' }}
              >
                {caso.expediente}
              </div>
            )}
          </div>

          {/* TRIBUNAL */}
          <div className="ng-panel p-2.5 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center gap-1.5 mb-2">
              <Users className="h-3.5 w-3.5" style={{ color: BODY }} />
              <div className="ng-header text-[14px]">TRIBUNAL</div>
            </div>
            <div className="flex-1 overflow-y-auto ng-scroll space-y-1.5">
              {jurados.length === 0 && (
                <div className="text-[10px] opacity-40 italic">Esperando jurado…</div>
              )}
              {jurados.map((j) => {
                const recusado = juradosRecusados.includes(j.silla);
                return (
                  <div
                    key={j.silla}
                    className={`flex items-center gap-1.5 ${recusado ? 'opacity-30' : ''}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ng-mono font-bold flex-shrink-0 ${
                        recusado
                          ? 'bg-stone-700 text-stone-500'
                          : j.simpatiaInicial > 60
                          ? 'bg-emerald-800 text-emerald-100'
                          : j.simpatiaInicial < 35
                          ? 'bg-red-900 text-red-100'
                          : 'bg-stone-700 text-amber-100'
                      }`}
                    >
                      {recusado ? '✕' : j.silla}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] leading-tight">JURADO {j.silla}</div>
                      <div
                        className="h-1 mt-0.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(60,60,60,0.6)' }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${j.simpatiaInicial}%`, background: GREEN }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CÓMO DEFENDERTE */}
          <div className="ng-panel p-2.5">
            <div className="ng-header text-[14px] mb-1.5">CÓMO DEFENDERTE</div>
            <ul className="space-y-1">
              {[
                'Habla claro y con confianza',
                'Responde solo a lo que te pregunten',
                'Aporta detalles y contexto',
                'Tu tono y pausas también importan',
              ].map((t) => (
                <li key={t} className="flex items-start gap-1.5">
                  <Check
                    className="h-3 w-3 mt-0.5 flex-shrink-0"
                    style={{ color: GREEN }}
                  />
                  <span className="text-[11px] leading-tight">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ═══════════ CENTER COLUMN (3D scene visible) ═══════════ */}
        <div className="relative flex flex-col justify-end pointer-events-none">
          {/* Timer (floating top-center) */}
          {timerSegundos !== null && timerSegundos > 0 && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="ng-panel px-3 py-1 flex items-center gap-2">
                <span className="ng-mono text-[12px]" style={{ color: GOLD }}>
                  ⏱
                </span>
                <span
                  className={`ng-mono text-[16px] font-bold ${
                    timerSegundos <= 5 ? 'text-red-400 animate-pulse' : ''
                  }`}
                  style={timerSegundos > 5 ? { color: BODY } : undefined}
                >
                  {timerSegundos}s
                </span>
              </div>
            </div>
          )}

          {/* Feedback flash */}
          {feedbackFlash && (
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none z-50">
              <div
                className={`px-6 py-2.5 rounded-lg border font-bold text-sm shadow-2xl ${
                  feedbackFlash.includes('ADMITIDA') ||
                  feedbackFlash.includes('VÁLIDA') ||
                  feedbackFlash.includes('venganza') ||
                  feedbackFlash.includes('exculpatoria')
                    ? 'bg-emerald-900/90 border-emerald-400 text-emerald-100'
                    : feedbackFlash.includes('rechazada') ||
                      feedbackFlash.includes('No hay') ||
                      feedbackFlash.includes('incriminatoria') ||
                      feedbackFlash.includes('Renunciaste')
                    ? 'bg-red-900/90 border-red-400 text-red-100'
                    : 'bg-amber-900/90 border-amber-400 text-amber-100'
                }`}
                style={{ animation: 'pop .3s' }}
              >
                {feedbackFlash}
              </div>
            </div>
          )}

          {/* TESTIMONIOS panel (F4 only, floats above dialogue) */}
          {fase === 'F4' && tKeys.length > 0 && (
            <div className="absolute bottom-[150px] left-2 pointer-events-auto z-30 w-56">
              <div
                className="ng-panel p-2"
                style={{ borderColor: 'rgba(150,100,200,0.35)' }}
              >
                <div className="text-[10px] ng-mono mb-1" style={{ color: '#b39ddb' }}>
                  📝 TESTIMONIOS
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto ng-scroll">
                  {tKeys.map((k) => (
                    <div
                      key={k}
                      className="bg-stone-900/60 rounded p-1.5 border border-purple-800/20"
                    >
                      <div className="text-[9px] ng-mono text-purple-300">
                        {k === 'guarda'
                          ? '🛡️ Eustaquio'
                          : k === 'supervisor'
                          ? '👔 Anselmo'
                          : '💕 Maribel'}
                        :
                      </div>
                      <div className="text-[9px] text-amber-100/50 leading-tight">
                        {testimoniosEscuchados[k].slice(0, 100)}…
                      </div>
                    </div>
                  ))}
                </div>
                {tKeys.length >= 2 && (
                  <div className="text-[8px] text-purple-400 mt-1 border-t border-purple-800/30 pt-1">
                    ⚡ ¿Contradicción? Escríbela abajo
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hint contextual */}
          {esperandoJugador && (
            <div className="absolute bottom-[148px] left-1/2 -translate-x-1/2 pointer-events-none z-10">
              <div
                className={`px-3 py-1 rounded text-[11px] ng-mono ${
                  windowObjecion
                    ? 'bg-red-950/70 border border-red-600/50 text-red-300 animate-pulse'
                    : 'bg-emerald-950/60 border border-emerald-700/30 text-emerald-300'
                }`}
              >
                {hint}
              </div>
            </div>
          )}

          {/* PROTESTO button (F2 window only) */}
          {windowObjecion && objecionesRestantes > 0 && (
            <div className="absolute bottom-[182px] left-1/2 -translate-x-1/2 pointer-events-auto z-30">
              <Button
                onClick={() => inputRef.current?.focus()}
                className="bg-red-700 hover:bg-red-800 text-red-50 px-4 py-2 text-sm font-black border border-red-400/50 animate-pulse"
              >
                <Gavel className="mr-1.5 h-3.5 w-3.5" /> PROTESTO ({objecionesRestantes})
              </Button>
            </div>
          )}

          {/* EVIDENCIAS panel (F3 only) */}
          {fase === 'F3' && subfaseActual === 'F3.espera' && caso && (
            <div className="absolute bottom-[150px] left-1/2 -translate-x-1/2 w-full max-w-xl px-2 pointer-events-auto z-30">
              <div className="ng-panel p-2">
                <div className="ng-header text-[12px] mb-1.5 text-center">
                  EVIDENCIAS — Click para presentar
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {caso.evidencias.map((ev) => (
                    <button
                      key={ev.id}
                      onClick={() =>
                        sendPlayerInput(
                          `Presento la evidencia: ${ev.nombre}. ${ev.descripcion}`
                        )
                      }
                      className={`border rounded p-1.5 text-left hover:scale-105 transition-transform ${
                        ev.tipo === 'exculpatoria'
                          ? 'bg-emerald-950/40 border-emerald-600/40'
                          : ev.tipo === 'incriminatoria'
                          ? 'bg-red-950/40 border-red-600/40'
                          : 'bg-stone-900/40 border-amber-700/30'
                      }`}
                    >
                      <div className="text-[10px] font-bold text-amber-300">
                        {ev.nombre}
                      </div>
                      <div className="text-[9px] text-amber-100/50 leading-tight">
                        {ev.descripcion.slice(0, 60)}…
                      </div>
                      <div className="text-[8px] ng-mono mt-0.5 opacity-50">
                        {ev.tipo.toUpperCase()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Live transcription */}
          {transcripcion && (
            <div className="absolute bottom-[120px] left-1/2 -translate-x-1/2 max-w-[60%] pointer-events-none z-10">
              <div className="text-[11px] ng-mono text-emerald-300/80 bg-black/50 px-2.5 py-0.5 rounded">
                TÚ: {transcripcion.slice(-80)}
              </div>
            </div>
          )}

          {/* Dialogue box (lower-center, NOT covering full scene) */}
          {(caption || iaPensando) && (
            <div className="px-4 pb-2 pointer-events-none">
              <div
                className="max-w-xl mx-auto ng-panel overflow-hidden shadow-xl"
                style={{ animation: 'bi .3s' }}
              >
                {/* Gold header bar */}
                <div
                  className="px-3 py-1.5 flex items-center justify-between"
                  style={{
                    background: `linear-gradient(90deg, ${GOLD}33, ${GOLD}11)`,
                    borderBottom: '1px solid rgba(100,100,100,0.25)',
                  }}
                >
                  <span
                    className="text-[12px] font-black tracking-widest"
                    style={{ color: GOLD }}
                  >
                    {speakerLabel}
                  </span>
                  {iaPensando && (
                    <span
                      className="text-[11px] ng-mono animate-pulse"
                      style={{ color: GOLD }}
                    >
                      ···
                    </span>
                  )}
                </div>
                {/* Dialogue body */}
                <div className="px-3 py-2.5 text-[14px] leading-snug">
                  {caption || '...'}
                </div>
              </div>
            </div>
          )}

          {/* Audio waveform (decorative + tied to volume) */}
          <div className="px-4 pb-1.5 pointer-events-none flex justify-center">
            <div className="flex items-end gap-0.5 h-4">
              {wave.map((amp, i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-full"
                  style={{
                    height: `${Math.max(15, Math.min(100, amp * 100))}%`,
                    background: GREEN,
                    opacity: micActive ? 0.95 : 0.4,
                    transition: 'height 90ms linear',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Input bar */}
          <div className="pointer-events-auto px-4 pb-2">
            <div className="max-w-xl mx-auto flex gap-2 items-center">
              {/* Mic button (green circular, 56x56) */}
              <Button
                onClick={toggleMic}
                className={`rounded-full h-14 w-14 p-0 border-2 flex-shrink-0 ${
                  micActive
                    ? 'bg-red-700 border-red-400 animate-pulse text-red-50'
                    : 'border-emerald-400/40 text-white'
                }`}
                style={!micActive ? { background: GREEN } : undefined}
                title={micActive ? 'Detener micrófono' : 'Activar micrófono'}
              >
                {micActive ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              {/* Text input */}
              <input
                ref={inputRef}
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitText();
                }}
                placeholder="Habla para defenderte... (Pulsa ENTER para enviar)"
                className="flex-1 ng-panel text-[13px] px-3 py-2.5 focus:outline-none placeholder:text-stone-500"
                style={{ color: BODY }}
              />
              {/* Send button (paper plane) */}
              <Button
                onClick={submitText}
                className="h-14 w-12 p-0 flex-shrink-0 text-stone-900 hover:opacity-90"
                style={{ background: GOLD }}
                title="Enviar"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* ═══════════ RIGHT COLUMN ═══════════ */}
        <div className="flex flex-col gap-2 pointer-events-auto overflow-hidden">
          {/* CREDIBILIDAD / SOSPECHA */}
          <div className="ng-panel p-2.5">
            <div className="flex justify-between items-baseline mb-0.5">
              <span className="text-[14px] font-bold" style={{ color: TEAL }}>
                CREDIBILIDAD
              </span>
              <span className="ng-mono text-[20px] font-bold" style={{ color: BODY }}>
                {credibilidad}
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden mb-0.5"
              style={{ background: 'rgba(60,60,60,0.6)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${credibilidad}%`, background: GREEN }}
              />
            </div>
            <div className="text-[11px] mb-2 opacity-80">{credLabel}</div>

            <div className="flex justify-between items-baseline mb-0.5">
              <span className="text-[14px] font-bold" style={{ color: RED }}>
                SOSPECHA
              </span>
              <span
                className={`ng-mono text-[20px] font-bold ${
                  sospecha > 70 ? 'text-red-400 animate-pulse' : ''
                }`}
                style={sospecha <= 70 ? { color: BODY } : undefined}
              >
                {sospecha}
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden mb-0.5"
              style={{ background: 'rgba(60,60,60,0.6)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${sospecha}%`, background: RED }}
              />
            </div>
            <div className="text-[11px] opacity-80">{sospLabel}</div>

            {/* Objeciones restantes */}
            <div
              className="mt-2 pt-2"
              style={{ borderTop: '1px solid rgba(100,100,100,0.2)' }}
            >
              <div className="flex items-center gap-1.5">
                <Gavel className="h-3 w-3" style={{ color: RED }} />
                <span className="text-[11px] opacity-80">Objeciones:</span>
                <div className="flex gap-1 ml-auto">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        i < objecionesRestantes
                          ? 'bg-red-800/60 border-red-500/50'
                          : 'bg-stone-800 border-stone-700'
                      }`}
                    >
                      {i < objecionesRestantes && (
                        <Gavel className="h-2 w-2 text-red-200" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-1.5">
            <button className="ng-action p-2 flex items-center gap-2 text-left">
              <FileText className="h-4 w-4 flex-shrink-0" style={{ color: GOLD }} />
              <span className="text-[12px]">Notas</span>
            </button>
            <button className="ng-action p-2 flex items-center gap-2 text-left">
              <FlaskConical className="h-4 w-4 flex-shrink-0" style={{ color: GOLD }} />
              <span className="text-[12px]">Pruebas</span>
            </button>
            <button className="ng-action p-2 flex items-center gap-2 text-left">
              <ListChecks className="h-4 w-4 flex-shrink-0" style={{ color: GOLD }} />
              <span className="text-[12px]">Datos</span>
            </button>
          </div>

          {/* HISTORIAL */}
          <div className="ng-panel p-2.5 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center gap-1.5 mb-1.5">
              <HistoryIcon className="h-3.5 w-3.5" style={{ color: BODY }} />
              <div className="ng-header text-[14px]">HISTORIAL</div>
            </div>
            <div className="flex-1 overflow-y-auto ng-scroll space-y-1">
              {historial.length === 0 && (
                <div className="text-[10px] opacity-40 italic">Sin entradas aún</div>
              )}
              {historial.map((h, i) => (
                <div key={i} className="text-[10px] leading-tight">
                  <span className="ng-mono opacity-50">{h.ts}</span>{' '}
                  <span className="ng-mono" style={{ color: GOLD }}>
                    {h.speaker}:
                  </span>
                  <span className="opacity-80"> {h.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom buttons: settings / end session / share */}
          <div className="flex items-center gap-1.5">
            <button
              className="ng-action p-2 flex-1 flex items-center justify-center"
              title="Ajustes"
            >
              <Settings className="h-4 w-4" style={{ color: BODY }} />
            </button>
            <button
              className="ng-action p-2 flex-[2] flex items-center justify-center gap-1"
              title="Fin de sesión"
              onClick={() => window.location.reload()}
            >
              <LogOut className="h-3.5 w-3.5" style={{ color: RED }} />
              <span className="text-[11px]">Fin de sesión</span>
            </button>
            <button
              className="ng-action p-2 flex-1 flex items-center justify-center"
              title="Compartir"
            >
              <Share2 className="h-4 w-4" style={{ color: BODY }} />
            </button>
          </div>
        </div>
      </div>

      {/* ═══════ ERROR ═══════ */}
      {errorJuego && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-50">
          <div className="bg-red-950/90 border border-red-500 rounded-lg p-3 max-w-sm">
            <div className="text-red-300 text-xs ng-mono">{errorJuego}</div>
          </div>
        </div>
      )}

      {/* ═══════ VEREDICTO ═══════ */}
      {veredictoFinal && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center pointer-events-auto z-50">
          <div
            className={`p-10 border-4 rounded-xl ${
              veredictoFinal === 'absuelto' ? 'border-emerald-500' : 'border-red-500'
            }`}
          >
            <div className="text-center">
              <div
                className="text-[10px] ng-mono mb-2 tracking-widest"
                style={{ color: GOLD }}
              >
                VEREDICTO
              </div>
              <div
                className={`text-5xl font-black mb-3 ${
                  veredictoFinal === 'absuelto' ? 'text-emerald-400' : 'text-red-500'
                }`}
              >
                {veredictoFinal === 'absuelto' ? 'NO CULPABLE' : 'CULPABLE'}
              </div>
              <div className="text-amber-300 text-xs mb-4">
                {veredictoFinal === 'absuelto'
                  ? 'Queda libre. Sin costas.'
                  : '4 años de prisión.'}
              </div>
              <div className="flex gap-6 justify-center text-xs ng-mono mb-4">
                <div>
                  <div style={{ color: TEAL }}>CRED</div>
                  <div className="text-emerald-200 text-lg">{credibilidad}</div>
                </div>
                <div>
                  <div style={{ color: RED }}>SOSP</div>
                  <div className="text-red-200 text-lg">{sospecha}</div>
                </div>
              </div>
              <Button
                onClick={() => window.location.reload()}
                style={{ background: GOLD }}
                className="text-stone-900 hover:opacity-90"
              >
                Jugar de nuevo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

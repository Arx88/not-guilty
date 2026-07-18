/**
 * UI overlay REDISEÑADO — sin superposiciones, jerarquía clara.
 * 
 * LAYOUT:
 * TOP LEFT: Expediente (mínimo)
 * TOP RIGHT: Medidores + Objeciones
 * CENTER: Burbuja de diálogo (foco principal)
 * BOTTOM: Input (mic + texto) — SIEMPRE visible
 * Contextual: hints, evidencias, PROTESTO aparecen SOLO cuando aplican
 */
'use client';

import { useGame } from '../state/store';
import { useMic } from '../hooks/useMic';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, AlertTriangle, Gavel, Send } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { initAudio, sndClick, sndTick, startAmbient, stopAmbient } from '../state/sounds';

const PLAYER_INPUT_EVENT = 'notguilty-player-input';

export function sendPlayerInput(text: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PLAYER_INPUT_EVENT, { detail: text }));
  }
}

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
  const contradiccionesDescubiertas = useGame((s) => s.contradiccionesDescubiertas);
  const feedbackFlash = useGame((s) => s.feedbackFlash);

  const [micActive, setMicActive] = useState(false);
  const [textInput, setTextInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const mic = useMic({});

  const timerAnterior = useRef(timerSegundos);
  useEffect(() => {
    if (timerSegundos !== null && timerSegundos !== timerAnterior.current && timerSegundos > 0 && timerSegundos <= 5) {
      sndTick();
    }
    timerAnterior.current = timerSegundos;
  }, [timerSegundos]);

  useEffect(() => {
    if (fase !== 'pre') startAmbient();
    return () => stopAmbient();
  }, [fase]);

  if (fase === 'pre') return null;

  const esperandoJugador =
    subfaseActual === 'F1.espera' ||
    subfaseActual === 'F3.espera' ||
    subfaseActual === 'F4.guarda_contra' ||
    subfaseActual === 'F4.supervisor_contra' ||
    subfaseActual === 'F5.alegato';

  const speakerLabel = speakerActual === 'juez' ? '⚖️ JUEZ' :
    speakerActual === 'fiscal' ? '📋 FISCAL' :
    speakerActual === 'guarda' ? '🛡️ EUSTAQUIO' :
    speakerActual === 'supervisor' ? '👔 ANSELMO' :
    speakerActual === 'sistema' ? '⚠️ SISTEMA' : '🗨️';

  const toggleMic = () => {
    initAudio();
    sndClick();
    if (micActive) { mic.stop(); setMicActive(false); }
    else { mic.start(); setMicActive(true); }
  };

  const submitText = () => {
    const text = textInput.trim();
    if (!text) return;
    sndClick();
    sendPlayerInput(text);
    setTextInput('');
    if (inputRef.current) inputRef.current.value = '';
  };

  // Testimonios para el panel de F4
  const testimonios = useGame.getState().testimoniosEscuchados;
  const testimonioKeys = Object.keys(testimonios);

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col">
      {/* ═══ BARRA SUPERIOR ═══ */}
      <div className="flex justify-between items-start p-3 gap-3">
        {/* Izquierda: Expediente minimal */}
        <Card className="px-3 py-2 bg-black/70 border-amber-700/40 backdrop-blur pointer-events-auto">
          <div className="text-[9px] font-mono text-amber-400 tracking-widest">EXPEDIENTE</div>
          <div className="text-[10px] text-amber-200/70 font-mono">FASE {fase} · JUEZ: {variante?.v3_perfilJuez}</div>
        </Card>

        {/* Derecha: Medidores + Objeciones */}
        <div className="flex flex-col gap-2 items-end">
          <Card className="px-3 py-2 bg-black/70 border-amber-700/40 backdrop-blur w-56">
            <div className="flex justify-between text-[10px] font-mono mb-0.5">
              <span className="text-emerald-400">CREDIBILIDAD</span>
              <span className={credibilidad >= 50 ? 'text-emerald-300' : 'text-red-300'}>{credibilidad}</span>
            </div>
            <Progress value={credibilidad} className={`h-2 ${credibilidad >= 50 ? 'bg-emerald-950' : 'bg-red-950'}`} />
            <div className="flex justify-between text-[10px] font-mono mb-0.5 mt-1">
              <span className="text-red-400">SOSPECHA</span>
              <span className={sospecha > 70 ? 'text-red-300 animate-pulse' : 'text-red-300'}>{sospecha}{sospecha > 70 && ' ⚠'}</span>
            </div>
            <Progress value={sospecha} className={`h-2 ${sospecha > 70 ? 'bg-red-700' : 'bg-red-950'}`} />
          </Card>
          
          {/* Objeciones restantes */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                i < objecionesRestantes ? 'bg-red-700 border-red-400 text-red-100' : 'bg-stone-800 border-stone-600 text-stone-500'
              }`}>
                <Gavel className="h-3 w-3" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ ÁREA CENTRAL: Burbuja de diálogo ═══ */}
      <div className="flex-1 flex items-center justify-center px-4">
        {(caption || iaPensando) && (
          <div className="w-full max-w-2xl pointer-events-none">
            <div className="bg-amber-50 border-4 border-amber-900 rounded-2xl p-5 shadow-2xl" style={{ animation: 'bubbleIn 0.3s ease-out' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-black tracking-widest text-amber-900">{speakerLabel}</span>
                {iaPensando && <span className="text-xs font-mono text-amber-700 animate-pulse">··· pensando ···</span>}
              </div>
              <div className="text-stone-900 text-lg font-serif leading-relaxed">{caption || '...'}</div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ PANEL DE TESTIMONIOS (solo F4) ═══ */}
      {fase === 'F4' && testimonioKeys.length > 0 && (
        <div className="absolute left-3 top-24 w-64 pointer-events-auto">
          <Card className="p-2 bg-black/70 border-purple-700/40 backdrop-blur">
            <div className="text-[9px] font-mono text-purple-400 mb-1">📝 TESTIMONIOS</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {testimonioKeys.map((k) => (
                <div key={k} className="bg-stone-900/60 rounded p-1.5 border border-purple-800/30">
                  <div className="text-[9px] font-mono text-purple-300">{k === 'guarda' ? '🛡️ Eustaquio' : '👔 Anselmo'}:</div>
                  <div className="text-[9px] text-amber-100/60 leading-tight">{testimonios[k].slice(0, 120)}...</div>
                </div>
              ))}
            </div>
            {testimonioKeys.length >= 2 && (
              <div className="text-[9px] text-purple-400 mt-1 border-t border-purple-800/30 pt-1">⚡ ¿Hay contradicciones? Di "contradicción"</div>
            )}
          </Card>
        </div>
      )}

      {/* ═══ FEEDBACK FLASH ═══ */}
      {feedbackFlash && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none z-50">
          <div className={`px-6 py-3 rounded-lg border-2 font-bold text-lg shadow-2xl ${
            feedbackFlash.includes('ADMITIDA') || feedbackFlash.includes('VÁLIDA') ? 'bg-emerald-900/90 border-emerald-400 text-emerald-100' :
            feedbackFlash.includes('rechazada') || feedbackFlash.includes('No hay') || feedbackFlash.includes('incriminatoria') || feedbackFlash.includes('Renunciaste') ? 'bg-red-900/90 border-red-400 text-red-100' :
            'bg-amber-900/90 border-amber-400 text-amber-100'
          }`} style={{ animation: 'bubbleIn 0.3s ease-out' }}>
            {feedbackFlash}
          </div>
        </div>
      )}

      {/* ═══ TIMER (cuando hay countdown) ═══ */}
      {timerSegundos !== null && timerSegundos > 0 && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-30">
          <div className={`text-2xl font-black ${timerSegundos <= 5 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
            ⏱ {timerSegundos}s
          </div>
        </div>
      )}

      {/* ═══ BOTÓN PROTESTO (solo F2 window) ═══ */}
      {windowObjecion && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-16 pointer-events-auto z-40">
          <Button
            onClick={() => {
              if (objecionesRestantes > 0) {
                inputRef.current?.focus();
              } else {
                sendPlayerInput('¡Protesto!');
              }
            }}
            disabled={objecionesRestantes <= 0}
            className={`px-6 py-3 text-base font-black border-2 ${
              objecionesRestantes > 0 ? 'bg-red-700 hover:bg-red-800 text-red-50 border-red-400 animate-pulse' : 'bg-stone-800 text-stone-600 border-stone-700'
            }`}
          >
            <Gavel className="mr-2 h-4 w-4" /> ¡PROTESTO! ({objecionesRestantes})
          </Button>
        </div>
      )}

      {/* ═══ PANEL DE EVIDENCIAS (solo F3) ═══ */}
      {fase === 'F3' && subfaseActual === 'F3.espera' && caso && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 w-[90%] max-w-2xl pointer-events-auto z-30">
          <Card className="p-3 bg-black/85 border-amber-600/50 backdrop-blur">
            <div className="text-[10px] font-mono text-amber-400 mb-2 text-center">EVIDENCIAS — Click para presentar</div>
            <div className="grid grid-cols-2 gap-2">
              {caso.evidencias.map((ev) => (
                <button key={ev.id} onClick={() => sendPlayerInput(`Presento la evidencia: ${ev.nombre}. ${ev.descripcion}`)}
                  className={`border rounded p-2 text-left transition-all hover:scale-105 ${
                    ev.tipo === 'exculpatoria' ? 'bg-emerald-950/50 border-emerald-600/50 hover:border-emerald-400' :
                    ev.tipo === 'incriminatoria' ? 'bg-red-950/50 border-red-600/50 hover:border-red-400' :
                    'bg-stone-900/50 border-amber-700/40 hover:border-amber-500'
                  }`}>
                  <div className="text-[10px] font-bold text-amber-300">{ev.nombre}</div>
                  <div className="text-[9px] text-amber-100/60 leading-tight">{ev.descripcion.slice(0, 70)}...</div>
                  <div className="text-[8px] font-mono mt-1 opacity-60">{ev.tipo.toUpperCase()}</div>
                </button>
              ))}
            </div>
            <div className="text-[9px] text-amber-500/60 mt-2 text-center">O di "no" para no presentar (penalización: -5 credibilidad)</div>
          </Card>
        </div>
      )}

      {/* ═══ HINT CONTEXTUAL ═══ */}
      {esperandoJugador && !windowObjecion && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <div className="bg-emerald-950/70 border border-emerald-700/40 rounded px-3 py-1.5 backdrop-blur">
            <div className="text-[10px] font-mono text-emerald-300">
              {subfaseActual === 'F1.espera' && '💬 Responde al juez. Ej: "sí, entiendo los cargos"'}
              {subfaseActual === 'F3.espera' && '📋 Click una evidencia arriba. Verde = te ayuda, Rojo = te perjudica'}
              {subfaseActual === 'F4.guarda_contra' && '🛡️ Pregúntale al guarda. Ej: "¿A qué hora salió del baño?"'}
              {subfaseActual === 'F4.supervisor_contra' && '👔 Pregúntale al supervisor. Ej: "¿Por qué me despidió?"'}
              {subfaseActual === 'F5.alegato' && '⚖️ ALEGATO FINAL. Convence al juez. Usa todo lo que descubriste.'}
            </div>
          </div>
        </div>
      )}

      {/* ═══ TRANSCRIPCIÓN EN VIVO ═══ */}
      {transcripcion && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 max-w-[80vw] pointer-events-none z-10">
          <div className="text-xs font-mono text-emerald-300 bg-black/60 px-3 py-1 rounded backdrop-blur border border-emerald-700/30">
            TÚ: {transcripcion.slice(-100)}
          </div>
        </div>
      )}

      {/* ═══ BARRA INFERIOR: Input ═══ */}
      <div className="p-4 pointer-events-auto">
        <div className="max-w-2xl mx-auto flex gap-2 items-center">
          {/* Mic */}
          <Button onClick={toggleMic} className={`rounded-full h-12 w-12 p-0 border-2 flex-shrink-0 ${
            micActive ? 'bg-red-700 hover:bg-red-800 border-red-400 animate-pulse' : 'bg-amber-700 hover:bg-amber-800 border-amber-300/40'
          }`}>
            {micActive ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          {/* Text input */}
          <input ref={inputRef} type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submitText(); }}
            placeholder="Escribe lo que quieres decir y pulsa Enter..."
            className="flex-1 bg-black/80 border border-amber-700/50 text-amber-100 px-4 py-3 rounded-lg text-sm font-mono focus:outline-none focus:border-amber-500"
          />
          {/* Send */}
          <Button onClick={submitText} className="bg-amber-700 hover:bg-amber-800 text-amber-50 h-12 px-4 flex-shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-center text-[9px] font-mono text-amber-500/50 mt-1">
          {micActive ? '🎙️ ESCUCHANDO — habla claro' : 'Escribe o activa el micrófono'}
        </div>
      </div>

      {/* ═══ JURADO (minimal, bottom-right) ═══ */}
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <div className="flex gap-1">
          {jurados.map((j) => {
            const recusado = juradosRecusados.includes(j.silla);
            return (
              <div key={j.silla} className={`w-6 h-6 rounded text-center text-[9px] font-mono pt-1 ${
                recusado ? 'bg-stone-800 text-stone-600' :
                j.simpatiaInicial > 60 ? 'bg-emerald-700 text-emerald-100' :
                j.simpatiaInicial < 35 ? 'bg-red-800 text-red-100' : 'bg-amber-700 text-amber-100'
              }`} title={`${j.perfil} (${j.simpatiaInicial})`}>
                {recusado ? '✕' : j.silla}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ Tensión visual ═══ */}
      {sospecha > 70 && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(circle, transparent 40%, rgba(139,42,42,${(sospecha - 70) / 80}) 100%)`,
          animation: 'heartbeat 1.2s ease-in-out infinite',
        }} />
      )}

      {/* ═══ Error ═══ */}
      {errorJuego && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-50">
          <Card className="p-4 bg-red-950/90 border-red-500 max-w-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-red-300 text-xs font-mono">{errorJuego}</div>
            </div>
          </Card>
        </div>
      )}

      {/* ═══ Veredicto ═══ */}
      {veredictoFinal && (
        <div className="absolute inset-0 bg-black/85 flex items-center justify-center pointer-events-auto z-50">
          <Card className={`p-10 border-4 ${veredictoFinal === 'absuelto' ? 'border-emerald-500' : 'border-red-500'}`}>
            <div className="text-center">
              <div className="text-[11px] font-mono text-amber-400 mb-2 tracking-widest">VEREDICTO</div>
              <div className={`text-6xl font-black mb-4 ${veredictoFinal === 'absuelto' ? 'text-emerald-400' : 'text-red-500'}`}>
                {veredictoFinal === 'absuelto' ? 'NO CULPABLE' : 'CULPABLE'}
              </div>
              <div className="text-amber-300 text-sm">{veredictoFinal === 'absuelto' ? 'Queda libre. Sin costas.' : 'Condena: 4 años de prisión.'}</div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs font-mono">
                <div><div className="text-emerald-400">CREDIBILIDAD</div><div className="text-emerald-200 text-lg">{credibilidad}</div></div>
                <div><div className="text-red-400">SOSPECHA</div><div className="text-red-200 text-lg">{sospecha}</div></div>
              </div>
              <Button onClick={() => window.location.reload()} className="mt-6 bg-amber-700 hover:bg-amber-800 text-amber-50">Jugar de nuevo</Button>
            </div>
          </Card>
        </div>
      )}

      <style jsx>{`
        @keyframes heartbeat { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes bubbleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

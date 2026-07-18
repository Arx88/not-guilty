/**
 * GameUI v3.0 — Rediseño completo basado en Design Doc v2.
 * 
 * LAYOUT (sin superposiciones):
 * - Centro (60%): Tribunal 3D visible
 * - Inferior: Burbuja diálogo + Input (siempre visible)
 * - Sup-izq: Caso (mínimo)
 * - Sup-der: Medidores + Objeciones
 * - Izq (F4): Testimonios
 * - Der-inf: Jurado (mínimo)
 */
'use client';

import { useGame } from '../state/store';
import { useMic } from '../hooks/useMic';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Send, Gavel } from 'lucide-react';
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
  const feedbackFlash = useGame((s) => s.feedbackFlash);

  const [micActive, setMicActive] = useState(false);
  const [textInput, setTextInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const mic = useMic({});

  const timerAnterior = useRef(timerSegundos);
  useEffect(() => {
    if (timerSegundos !== null && timerSegundos !== timerAnterior.current && timerSegundos > 0 && timerSegundos <= 5) sndTick();
    timerAnterior.current = timerSegundos;
  }, [timerSegundos]);

  useEffect(() => {
    if (fase !== 'pre') startAmbient();
    return () => stopAmbient();
  }, [fase]);

  if (fase === 'pre') return null;

  const esperandoJugador = ['F1.espera','F3.espera','F4.guarda_contra','F4.supervisor_contra','F5.alegato'].includes(subfaseActual);
  const speakerLabel = {juez:'⚖️ JUEZ',fiscal:'📋 FISCAL',guarda:'🛡️ EUSTAQUIO',supervisor:'👔 ANSELMO',novia:'💕 MARIBEL',sistema:'⚠️ SISTEMA',null:'🗨️'}[speakerActual || 'null'];
  const testimonios = useGame.getState().testimoniosEscuchados;
  const tKeys = Object.keys(testimonios);

  const toggleMic = () => { initAudio(); sndClick(); micActive ? (mic.stop(), setMicActive(false)) : (mic.start(), setMicActive(true)); };
  const submitText = () => { const t = textInput.trim(); if (!t) return; sndClick(); sendPlayerInput(t); setTextInput(''); if(inputRef.current) inputRef.current.value=''; };

  const hint = windowObjecion ? `⚡ ¡PROTESTA! (${objecionesRestantes} restantes)` :
    subfaseActual==='F1.espera' ? '💬 Responde al juez' :
    subfaseActual==='F3.espera' ? '📋 Click una evidencia abajo' :
    subfaseActual==='F4.guarda_contra' ? '🛡️ Pregunta al guarda' :
    subfaseActual==='F4.supervisor_contra' ? '👔 Pregunta al supervisor · ¿Dijo algo distinto al guarda?' :
    subfaseActual==='F5.alegato' ? '⚖️ ALEGATO FINAL · Convence al juez' : '⏳ Esperando...';

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      <style jsx>{`
        @keyframes hb { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes bi { from{transform:translateY(8px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes pop { from{transform:scale(.9);opacity:0} to{transform:scale(1);opacity:1} }
      `}</style>

      {/* Tensión */}
      {sospecha > 70 && <div className="absolute inset-0 pointer-events-none" style={{background:`radial-gradient(circle,transparent 40%,rgba(139,42,42,${(sospecha-70)/80}) 100%)`,animation:'hb 1.2s infinite'}}/>}

      {/* ══ SUP-IZQ: Caso (mínimo) ══ */}
      <div className="absolute top-3 left-3 pointer-events-auto">
        <div className="bg-black/60 border border-amber-800/30 rounded-lg px-3 py-1.5 backdrop-blur">
          <div className="text-[8px] font-mono text-amber-500/60 tracking-widest">EXPEDIENTE</div>
          <div className="text-[10px] font-mono text-amber-300/80">F{fase.slice(1)} · {variante?.v3_perfilJuez}</div>
        </div>
      </div>

      {/* ══ SUP-DER: Medidores + Objeciones ══ */}
      <div className="absolute top-3 right-3 pointer-events-auto">
        <div className="bg-black/60 border border-amber-800/30 rounded-lg px-3 py-2 backdrop-blur w-48">
          <div className="flex justify-between text-[10px] font-mono mb-0.5">
            <span className="text-emerald-400">CRED</span>
            <span className={credibilidad>=50?'text-emerald-300':'text-red-300'}>{credibilidad}</span>
          </div>
          <Progress value={credibilidad} className="h-1.5 mb-1.5" />
          <div className="flex justify-between text-[10px] font-mono mb-0.5">
            <span className="text-red-400">SOSP</span>
            <span className={sospecha>70?'text-red-300 animate-pulse':'text-red-300'}>{sospecha}{sospecha>70&&'⚠'}</span>
          </div>
          <Progress value={sospecha} className="h-1.5" />
          {/* Objeciones */}
          <div className="flex gap-1 mt-2 justify-center">
            {[0,1,2].map(i=>(
              <div key={i} className={`w-5 h-5 rounded-full border flex items-center justify-center ${i<objecionesRestantes?'bg-red-800/60 border-red-500/50':'bg-stone-800 border-stone-700'}`}>
                {i<objecionesRestantes&&<Gavel className="h-2.5 w-2.5 text-red-200"/>}
              </div>
            ))}
          </div>
        </div>
        {/* Timer */}
        {timerSegundos!==null && timerSegundos>0 && (
          <div className="text-center mt-1">
            <span className={`text-lg font-black font-mono ${timerSegundos<=5?'text-red-400 animate-pulse':'text-amber-400'}`}>⏱{timerSegundos}</span>
          </div>
        )}
      </div>

      {/* ══ IZQ (F4): Testimonios ══ */}
      {fase==='F4' && tKeys.length>0 && (
        <div className="absolute left-3 top-20 w-56 pointer-events-auto">
          <div className="bg-black/60 border border-purple-700/40 rounded-lg p-2 backdrop-blur">
            <div className="text-[9px] font-mono text-purple-400 mb-1">📝 TESTIMONIOS</div>
            <div className="space-y-1 max-h-28 overflow-y-auto">
              {tKeys.map(k=>(
                <div key={k} className="bg-stone-900/60 rounded p-1.5 border border-purple-800/20">
                  <div className="text-[8px] font-mono text-purple-300">{k==='guarda'?'🛡️ Eustaquio':'👔 Anselmo'}:</div>
                  <div className="text-[9px] text-amber-100/50 leading-tight">{testimonios[k].slice(0,100)}...</div>
                </div>
              ))}
            </div>
            {tKeys.length>=2 && <div className="text-[8px] text-purple-400 mt-1 border-t border-purple-800/30 pt-1">⚡ ¿Contradicción? Escríbela abajo</div>}
          </div>
        </div>
      )}

      {/* ══ DER-INF: Jurado ══ */}
      <div className="absolute bottom-20 right-3 pointer-events-none">
        <div className="flex gap-1">
          {jurados.map(j=>{
            const r=juradosRecusados.includes(j.silla);
            return <div key={j.silla} className={`w-5 h-5 rounded text-center text-[8px] font-mono pt-0.5 ${r?'bg-stone-800 text-stone-600':j.simpatiaInicial>60?'bg-emerald-700 text-emerald-100':j.simpatiaInicial<35?'bg-red-800 text-red-100':'bg-amber-700 text-amber-100'}`}>{r?'✕':j.silla}</div>;
          })}
        </div>
      </div>

      {/* ══ FEEDBACK FLASH ══ */}
      {feedbackFlash && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none z-50">
          <div className={`px-6 py-2.5 rounded-lg border font-bold text-sm shadow-2xl ${feedbackFlash.includes('ADMITIDA')||feedbackFlash.includes('VÁLIDA')||feedbackFlash.includes('venganza')||feedbackFlash.includes('exculpatoria')?'bg-emerald-900/90 border-emerald-400 text-emerald-100':feedbackFlash.includes('rechazada')||feedbackFlash.includes('No hay')||feedbackFlash.includes('incriminatoria')||feedbackFlash.includes('Renunciaste')?'bg-red-900/90 border-red-400 text-red-100':'bg-amber-900/90 border-amber-400 text-amber-100'}`} style={{animation:'pop .3s'}}>
            {feedbackFlash}
          </div>
        </div>
      )}

      {/* ══ HINT contextual ══ */}
      {esperandoJugador && !windowObjecion && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <div className="bg-emerald-950/60 border border-emerald-700/30 rounded px-3 py-1 backdrop-blur text-[11px] font-mono text-emerald-300">{hint}</div>
        </div>
      )}
      {windowObjecion && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <div className="bg-red-950/70 border border-red-600/50 rounded px-3 py-1 backdrop-blur text-[11px] font-mono text-red-300 animate-pulse">{hint}</div>
        </div>
      )}

      {/* ══ TRANSCRIPCIÓN ══ */}
      {transcripcion && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 max-w-[70vw] pointer-events-none z-10">
          <div className="text-[11px] font-mono text-emerald-300/80 bg-black/50 px-2.5 py-0.5 rounded">TÚ: {transcripcion.slice(-80)}</div>
        </div>
      )}

      {/* ══ BOTÓN PROTESTO (solo F2 window) ══ */}
      {windowObjecion && objecionesRestantes>0 && (
        <div className="absolute bottom-32 right-1/2 translate-x-36 pointer-events-auto z-30">
          <Button onClick={()=>inputRef.current?.focus()} className="bg-red-700 hover:bg-red-800 text-red-50 px-4 py-2 text-sm font-black border border-red-400/50 animate-pulse">
            <Gavel className="mr-1 h-3 w-3"/> PROTESTO ({objecionesRestantes})
          </Button>
        </div>
      )}

      {/* ══ EVIDENCIAS (solo F3) ══ */}
      {fase==='F3' && subfaseActual==='F3.espera' && caso && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-[90%] max-w-xl pointer-events-auto z-30">
          <div className="bg-black/80 border border-amber-600/40 rounded-lg p-2 backdrop-blur">
            <div className="text-[9px] font-mono text-amber-400 mb-1.5 text-center">EVIDENCIAS — Click para presentar</div>
            <div className="grid grid-cols-2 gap-1.5">
              {caso.evidencias.map(ev=>(
                <button key={ev.id} onClick={()=>sendPlayerInput(`Presento la evidencia: ${ev.nombre}. ${ev.descripcion}`)}
                  className={`border rounded p-1.5 text-left hover:scale-105 transition-transform ${ev.tipo==='exculpatoria'?'bg-emerald-950/40 border-emerald-600/40':ev.tipo==='incriminatoria'?'bg-red-950/40 border-red-600/40':'bg-stone-900/40 border-amber-700/30'}`}>
                  <div className="text-[9px] font-bold text-amber-300">{ev.nombre}</div>
                  <div className="text-[8px] text-amber-100/50 leading-tight">{ev.descripcion.slice(0,60)}...</div>
                  <div className="text-[7px] font-mono mt-0.5 opacity-50">{ev.tipo.toUpperCase()}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ INFERIOR: Burbuja diálogo + Input ══ */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
        {/* Burbuja diálogo */}
        {(caption || iaPensando) && (
          <div className="max-w-2xl mx-auto px-4 pb-2">
            <div className="bg-amber-50/95 border-2 border-amber-800/60 rounded-xl p-3 shadow-xl" style={{animation:'bi .3s'}}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-black tracking-widest text-amber-900">{speakerLabel}</span>
                {iaPensando && <span className="text-[10px] font-mono text-amber-700 animate-pulse">···</span>}
              </div>
              <div className="text-stone-800 text-sm font-serif leading-snug">{caption||'...'}</div>
            </div>
          </div>
        )}
        {/* Input bar */}
        <div className="bg-black/70 border-t border-amber-800/20 backdrop-blur px-4 py-2.5">
          <div className="max-w-2xl mx-auto flex gap-2 items-center">
            <Button onClick={toggleMic} className={`rounded-full h-10 w-10 p-0 border-2 flex-shrink-0 ${micActive?'bg-red-700 border-red-400 animate-pulse':'bg-amber-700 border-amber-300/30'}`}>
              {micActive?<MicOff className="h-4 w-4"/>:<Mic className="h-4 w-4"/>}
            </Button>
            <input ref={inputRef} type="text" value={textInput} onChange={e=>setTextInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter')submitText();}}
              placeholder="Escribe y pulsa Enter..."
              className="flex-1 bg-black/70 border border-amber-700/30 text-amber-100 px-3 py-2 rounded text-sm font-mono focus:outline-none focus:border-amber-500/50"
            />
            <Button onClick={submitText} className="bg-amber-700 hover:bg-amber-800 h-10 px-3 flex-shrink-0">
              <Send className="h-4 w-4"/>
            </Button>
          </div>
        </div>
      </div>

      {/* ══ ERROR ══ */}
      {errorJuego && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-50">
          <div className="bg-red-950/90 border border-red-500 rounded-lg p-3 max-w-sm">
            <div className="text-red-300 text-xs font-mono">{errorJuego}</div>
          </div>
        </div>
      )}

      {/* ══ VEREDICTO ══ */}
      {veredictoFinal && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center pointer-events-auto z-50">
          <div className={`p-10 border-4 rounded-xl ${veredictoFinal==='absuelto'?'border-emerald-500':'border-red-500'}`}>
            <div className="text-center">
              <div className="text-[10px] font-mono text-amber-400 mb-2 tracking-widest">VEREDICTO</div>
              <div className={`text-5xl font-black mb-3 ${veredictoFinal==='absuelto'?'text-emerald-400':'text-red-500'}`}>{veredictoFinal==='absuelto'?'NO CULPABLE':'CULPABLE'}</div>
              <div className="text-amber-300 text-xs mb-4">{veredictoFinal==='absuelto'?'Queda libre. Sin costas.':'4 años de prisión.'}</div>
              <div className="flex gap-6 justify-center text-xs font-mono mb-4">
                <div><div className="text-emerald-400">CRED</div><div className="text-emerald-200 text-lg">{credibilidad}</div></div>
                <div><div className="text-red-400">SOSP</div><div className="text-red-200 text-lg">{sospecha}</div></div>
              </div>
              <Button onClick={()=>window.location.reload()} className="bg-amber-700 hover:bg-amber-800 text-amber-50">Jugar de nuevo</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

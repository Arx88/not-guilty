/**
 * UI overlay completo: medidores, timer, botón PROTESTO, F3 evidencias, micrófono.
 */
'use client';

import { useGame } from '../state/store';
import { useMic } from '../hooks/useMic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, AlertTriangle, Gavel, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// Exponer el enviarMensaje al window para que GameUI pueda usarlo sin pasar por el orquestador
// Mejor: usar un evento custom
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

  const [micActive, setMicActive] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const mic = useMic({});

  const toggleMic = () => {
    if (micActive) {
      mic.stop();
      setMicActive(false);
    } else {
      mic.start();
      setMicActive(true);
    }
  };

  const submitText = () => {
    if (!textInput.trim()) return;
    sendPlayerInput(textInput);
    setTextInput('');
  };

  if (fase === 'pre') return null;

  // ¿En qué subfase estamos?
  const esperandoJugador =
    subfaseActual === 'F1.espera' ||
    subfaseActual === 'F3.espera' ||
    subfaseActual === 'F4.guarda_contra' ||
    subfaseActual === 'F4.supervisor_contra' ||
    subfaseActual === 'F5.alegato';

  // Mensaje de qué debe hacer el jugador
  const hintJugador = () => {
    if (windowObjecion) return 'Di "¡Protesto!" + tu fundamento AHORA';
    if (subfaseActual === 'F1.espera') return 'Responde al juez (sí/no/libre)';
    if (subfaseActual === 'F3.espera') return 'Di "sí" para presentar evidencia o "no"';
    if (subfaseActual === 'F4.guarda_contra') return 'Contra-interroga al GUARDA (habla libre)';
    if (subfaseActual === 'F4.supervisor_contra') return 'Contra-interroga al SUPERVISOR (habla libre)';
    if (subfaseActual === 'F5.alegato') return 'ALEGATO FINAL: habla con fuerza';
    return 'Escuchando al tribunal...';
  };

  // Peor jurado para hint
  const peorJurado = jurados
    .filter((j) => !juradosRecusados.includes(j.silla))
    .sort((a, b) => a.simpatiaInicial - b.simpatiaInicial)[0];

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* ─── Header: expediente + fase ─── */}
      <div className="absolute top-3 left-3 pointer-events-auto">
        <Card className="p-2.5 bg-black/70 border-amber-700/40 backdrop-blur">
          <div className="text-[9px] font-mono text-amber-400 tracking-widest">
            {caso?.expediente || 'EXPEDIENTE'}
          </div>
          <div className="text-xs font-bold text-amber-50 leading-tight max-w-xs mt-0.5">
            {caso?.cargos?.slice(0, 60) || 'Cargos...'}...
          </div>
          <div className="flex gap-1.5 mt-1.5">
            <Badge variant="outline" className="border-amber-600/50 text-amber-300 text-[9px] font-mono px-1.5 py-0">
              FASE {fase}
            </Badge>
            {variante && (
              <Badge variant="outline" className="border-amber-600/30 text-amber-400/70 text-[9px] font-mono px-1.5 py-0">
                JUEZ: {variante.v3_perfilJuez}
              </Badge>
            )}
          </div>
        </Card>
      </div>

      {/* ─── Top-right: medidores ─── */}
      <div className="absolute top-3 right-3 w-64 pointer-events-auto">
        <Card className="p-2.5 bg-black/70 border-amber-700/40 backdrop-blur space-y-1.5">
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-0.5">
              <span className="text-emerald-400">CREDIBILIDAD</span>
              <span className={credibilidad >= 50 ? 'text-emerald-300' : 'text-red-300'}>{credibilidad}</span>
            </div>
            <Progress value={credibilidad} className="h-2 bg-emerald-950" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-0.5">
              <span className="text-red-400">SOSPECHA</span>
              <span className={sospecha > 70 ? 'text-red-300 animate-pulse' : 'text-red-300'}>
                {sospecha} {sospecha > 70 && '⚠'}
              </span>
            </div>
            <Progress value={sospecha} className="h-2 bg-red-950" />
          </div>
          <div>
            <div className="flex justify-between text-[9px] font-mono mb-0.5">
              <span className="text-amber-400">MIC</span>
              <span className="text-amber-300">{Math.round(volumen * 100)}%</span>
            </div>
            <Progress value={volumen * 100} className="h-1 bg-amber-950" />
          </div>
        </Card>
      </div>

      {/* ─── Hint de turno del jugador ─── */}
      <div className="absolute top-32 right-3 w-64 pointer-events-none">
        <Card
          className={`p-2 backdrop-blur border ${
            esperandoJugador || windowObjecion
              ? 'bg-emerald-950/60 border-emerald-700/40'
              : 'bg-stone-950/60 border-stone-700/30'
          }`}
        >
          <div
            className={`text-[9px] font-mono tracking-widest mb-0.5 ${
              esperandoJugador || windowObjecion ? 'text-emerald-400' : 'text-stone-500'
            }`}
          >
            {esperandoJugador || windowObjecion ? '► TU TURNO' : '... ESCUCHANDO ...'}
          </div>
          <div
            className={`text-[11px] font-mono leading-tight ${
              esperandoJugador || windowObjecion ? 'text-emerald-100/90' : 'text-stone-400'
            }`}
          >
            {hintJugador()}
          </div>
          {timerSegundos !== null && timerSegundos > 0 && (
            <div className="mt-1 text-[14px] font-mono text-amber-300 font-bold">
              ⏱ {timerSegundos}s
            </div>
          )}
        </Card>
      </div>

      {/* ─── BOTÓN GRANDE PROTESTO cuando hay window ─── */}
      {windowObjecion && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="text-center">
            <div
              className="text-7xl font-black text-red-500 mb-4 animate-pulse"
              style={{ textShadow: '0 0 20px rgba(239,68,68,0.8)' }}
            >
              ¡PROTESTO!
            </div>
            <div className="text-red-200 text-sm font-mono bg-black/70 px-4 py-2 rounded inline-block">
              Di "¡Protesto!" + tu fundamento · {timerSegundos}s restantes
            </div>
          </div>
        </div>
      )}

      {/* ─── Transcripción en vivo del jugador ─── */}
      {transcripcion && (
        <div className="absolute bottom-44 left-1/2 -translate-x-1/2 max-w-[80vw] pointer-events-none z-10">
          <div className="text-xs font-mono text-emerald-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-emerald-700/30">
            <span className="text-emerald-500">TÚ: </span>
            {transcripcion.slice(-120)}
          </div>
        </div>
      )}

      {/* ─── Botón micrófono + Input de texto (fallback) ─── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-2">
        <div className="flex gap-2 items-center">
          <Button
            onClick={toggleMic}
            size="lg"
            className={`rounded-full h-14 w-14 p-0 border-2 ${
              micActive
                ? 'bg-red-700 hover:bg-red-800 border-red-400 animate-pulse'
                : 'bg-amber-700 hover:bg-amber-800 border-amber-300/40'
            }`}
            title={micActive ? 'Apagar micrófono' : 'Activar micrófono'}
          >
            {micActive ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          {/* Botón para mostrar/ocultar input de texto */}
          <Button
            onClick={() => setShowTextInput(!showTextInput)}
            size="sm"
            className="bg-stone-700 hover:bg-stone-800 border border-amber-700/40 text-amber-200 text-xs"
            title="Escribir en lugar de hablar"
          >
            ⌨ Texto
          </Button>
        </div>

        {/* Input de texto cuando está activo */}
        {showTextInput && (
          <div className="flex gap-2 w-[500px] max-w-[90vw]">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitText();
              }}
              placeholder="Escribe lo que quieres decir y pulsa Enter..."
              className="flex-1 bg-black/80 border border-amber-700/50 text-amber-100 px-3 py-2 rounded text-sm font-mono focus:outline-none focus:border-amber-500"
              autoFocus
            />
            <Button
              onClick={submitText}
              size="sm"
              className="bg-amber-700 hover:bg-amber-800 text-amber-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="text-[9px] font-mono text-amber-400/80">
          {micActive ? 'ESCUCHANDO · habla claro' : 'click micrófono o usa ⌨ Texto'}
        </div>
      </div>

      {/* ─── BOTÓN PROTESTO clickable cuando hay window ─── */}
      {windowObjecion && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-auto z-40">
          <Button
            onClick={() => sendPlayerInput('¡Protesto!')}
            className="bg-red-700 hover:bg-red-800 text-red-50 px-8 py-4 text-lg font-black animate-pulse border-2 border-red-400"
          >
            <Gavel className="mr-2 h-5 w-5" />
            ¡PROTESTO!
          </Button>
        </div>
      )}

      {/* ─── Comandos ─── */}
      <div className="absolute bottom-6 left-3 pointer-events-none">
        <Card className="p-2 bg-black/60 border-amber-700/30 backdrop-blur">
          <div className="text-[9px] font-mono text-amber-500 mb-1">COMANDOS</div>
          <div className="space-y-0.5 text-[10px] font-mono text-amber-300/80">
            <div>"¡Protesto!" — objetar</div>
            <div>"Recusación, jurado N"</div>
            <div className="text-emerald-400/70 mt-1">F4/F5: habla libre</div>
          </div>
        </Card>
      </div>

      {/* ─── Estado jurado ─── */}
      <div className="absolute bottom-6 right-3 pointer-events-none">
        <Card className="p-2 bg-black/60 border-amber-700/30 backdrop-blur">
          <div className="text-[9px] font-mono text-amber-500 mb-1">JURADO</div>
          <div className="flex gap-1">
            {jurados.map((j) => {
              const recusado = juradosRecusados.includes(j.silla);
              const color = recusado
                ? 'bg-stone-800 text-stone-600'
                : j.simpatiaInicial > 60
                ? 'bg-emerald-700 text-emerald-100'
                : j.simpatiaInicial < 35
                ? 'bg-red-800 text-red-100'
                : 'bg-amber-700 text-amber-100';
              return (
                <div
                  key={j.silla}
                  className={`${color} w-7 h-7 rounded text-center text-[10px] font-mono pt-1.5`}
                  title={`${j.perfil} (${j.simpatiaInicial})`}
                >
                  {recusado ? '✕' : j.silla}
                </div>
              );
            })}
          </div>
          {peorJurado && peorJurado.simpatiaInicial < 40 && (
            <div className="text-[9px] font-mono text-red-400 mt-1">
              Jurado {peorJurado.silla} hostil
            </div>
          )}
        </Card>
      </div>

      {/* ─── Latido visual cuando sospecha > 70 ─── */}
      {sospecha > 70 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle, transparent 40%, rgba(139,42,42,${(sospecha - 70) / 80}) 100%)`,
            animation: 'heartbeat 1.2s ease-in-out infinite',
          }}
        />
      )}

      {/* ─── Error ─── */}
      {errorJuego && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-50">
          <Card className="p-4 bg-red-950/90 border-red-500 max-w-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-red-200 text-sm font-bold mb-1">Error</div>
                <div className="text-red-300 text-xs font-mono">{errorJuego}</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ─── Veredicto final ─── */}
      {veredictoFinal && (
        <div className="absolute inset-0 bg-black/85 flex items-center justify-center pointer-events-auto z-50">
          <Card className={`p-10 border-4 ${veredictoFinal === 'absuelto' ? 'border-emerald-500' : 'border-red-500'}`}>
            <div className="text-center">
              <div className="text-[11px] font-mono text-amber-400 mb-2 tracking-widest">VEREDICTO</div>
              <div className={`text-6xl font-black mb-4 ${veredictoFinal === 'absuelto' ? 'text-emerald-400' : 'text-red-500'}`}>
                {veredictoFinal === 'absuelto' ? 'NO CULPABLE' : 'CULPABLE'}
              </div>
              <div className="text-amber-300 text-sm">
                {veredictoFinal === 'absuelto' ? 'Queda libre. Sin costas.' : 'Condena: 4 años de prisión.'}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <div className="text-emerald-400">CREDIBILIDAD</div>
                  <div className="text-emerald-200 text-lg">{credibilidad}</div>
                </div>
                <div>
                  <div className="text-red-400">SOSPECHA</div>
                  <div className="text-red-200 text-lg">{sospecha}</div>
                </div>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="mt-6 bg-amber-700 hover:bg-amber-800 text-amber-50"
              >
                Jugar de nuevo
              </Button>
            </div>
          </Card>
        </div>
      )}

      <style jsx>{`
        @keyframes heartbeat {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

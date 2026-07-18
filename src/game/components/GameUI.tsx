/**
 * UI overlay del juego: medidores, subtítulos, botón de micrófono, instrucciones.
 */
'use client';

import { useGame } from '../state/store';
import { useMic } from '../hooks/useMic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, AlertTriangle, Volume2 } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  const errorJuego = useGame((s) => s.errorJuego);
  const veredictoFinal = useGame((s) => s.veredictoFinal);

  const [micActive, setMicActive] = useState(false);
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

  if (fase === 'pre') return null;

  const speakerLabel = {
    juez: 'JUEZ',
    fiscal: 'FISCAL',
    guarda: 'DON EUSTAQUIO',
    novia: 'MARIBEL',
    supervisor: 'ANSELMO',
    sistema: 'SISTEMA',
    null: '',
  }[speakerActual || 'null'];

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* ─── Header: expediente + fase ─── */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <Card className="p-3 bg-black/70 border-amber-700/40 backdrop-blur">
          <div className="text-[10px] font-mono text-amber-400 mb-1 tracking-widest">
            {caso?.expediente || 'EXPEDIENTE'}
          </div>
          <div className="text-sm font-bold text-amber-50 leading-tight max-w-md">
            {caso?.cargos?.slice(0, 80) || 'Cargos...'}...
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="border-amber-600/50 text-amber-300 text-[10px] font-mono">
              FASE {fase}
            </Badge>
            {variante && (
              <Badge variant="outline" className="border-amber-600/30 text-amber-400/70 text-[10px] font-mono">
                JUEZ: {variante.v3_perfilJuez}
              </Badge>
            )}
          </div>
        </Card>
      </div>

      {/* ─── Top-right: medidores ─── */}
      <div className="absolute top-4 right-4 w-72 pointer-events-auto">
        <Card className="p-3 bg-black/70 border-amber-700/40 backdrop-blur space-y-2">
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-emerald-400">CREDIBILIDAD</span>
              <span className="text-emerald-300">{credibilidad}</span>
            </div>
            <Progress value={credibilidad} className="h-2 bg-emerald-950" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-red-400">SOSPECHA</span>
              <span className="text-red-300">{sospecha}</span>
            </div>
            <Progress value={sospecha} className="h-2 bg-red-950" />
          </div>
          {/* Volumen en vivo */}
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-amber-400">MIC</span>
              <span className="text-amber-300">{Math.round(volumen * 100)}%</span>
            </div>
            <Progress value={volumen * 100} className="h-1 bg-amber-950" />
          </div>
        </Card>
      </div>

      {/* ─── Jury panel: 5 sillas ─── */}
      <div className="absolute top-32 right-4 w-72 pointer-events-auto">
        <Card className="p-3 bg-black/70 border-amber-700/40 backdrop-blur">
          <div className="text-[10px] font-mono text-amber-400 mb-2 tracking-widest">JURADO</div>
          <div className="grid grid-cols-5 gap-1">
            {jurados.map((j) => {
              const color =
                j.simpatiaInicial > 60 ? 'bg-emerald-600' : j.simpatiaInicial < 35 ? 'bg-red-700' : 'bg-amber-700';
              return (
                <div
                  key={j.silla}
                  className={`${color} h-8 rounded text-center text-[10px] font-mono pt-1.5 text-white/90`}
                  title={`${j.perfil} (simpatía ${j.simpatiaInicial})`}
                >
                  {j.silla}
                </div>
              );
            })}
          </div>
          <div className="text-[9px] font-mono text-amber-500/60 mt-1">
            Estricto · Empático · Popular (2·2·1)
          </div>
        </Card>
      </div>

      {/* ─── Caption / subtítulo del NPC ─── */}
      {(caption || iaPensando) && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-[800px] max-w-[90vw] pointer-events-none">
          <Card className="p-4 bg-black/85 border-amber-600/50 backdrop-blur">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono text-amber-400 tracking-widest">
                {speakerLabel}
              </span>
              {iaPensando && (
                <span className="text-[10px] font-mono text-amber-300 animate-pulse">
                  · pensando ·
                </span>
              )}
            </div>
            <div className="text-amber-50 text-base leading-relaxed">
              {caption || '...'}
            </div>
          </Card>
        </div>
      )}

      {/* ─── Transcripción en vivo del jugador ─── */}
      {transcripcion && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 max-w-[80vw] pointer-events-none">
          <div className="text-[12px] font-mono text-emerald-300/90 bg-black/50 px-3 py-1 rounded backdrop-blur">
            TÚ: {transcripcion.slice(-100)}
          </div>
        </div>
      )}

      {/* ─── Botón micrófono (centro-abajo) ─── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
        <Button
          onClick={toggleMic}
          size="lg"
          className={`rounded-full h-16 w-16 p-0 ${
            micActive
              ? 'bg-red-700 hover:bg-red-800 animate-pulse'
              : 'bg-amber-700 hover:bg-amber-800'
          } border-2 border-amber-300/40`}
          title={micActive ? 'Apagar micrófono' : 'Activar micrófono'}
        >
          {micActive ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
        {!micActive && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-amber-400 whitespace-nowrap">
            ACTIVAR MICRÓFONO
          </div>
        )}
      </div>

      {/* ─── Hints de palabras clave ─── */}
      <div className="absolute bottom-6 left-4 pointer-events-none">
        <Card className="p-2 bg-black/60 border-amber-700/30 backdrop-blur">
          <div className="text-[9px] font-mono text-amber-500 mb-1">COMANDOS DE VOZ</div>
          <div className="space-y-0.5 text-[10px] font-mono text-amber-300/80">
            <div>"¡Protesto!" — objetar al fiscal</div>
            <div>"¡Recusación, jurado N!" — recusar</div>
            <div>"Sí" / "No" — responder al juez</div>
          </div>
        </Card>
      </div>

      {/* ─── Latido visual (diegético) cuando sospecha > 70 ─── */}
      {sospecha > 70 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle, transparent 40%, rgba(139, 42, 42, ${
              (sospecha - 70) / 100
            }) 100%)`,
            animation: 'heartbeat 1.2s ease-in-out infinite',
          }}
        />
      )}

      {/* ─── Error ─── */}
      {errorJuego && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
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
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center pointer-events-auto">
          <Card className={`p-12 border-4 ${veredictoFinal === 'absuelto' ? 'border-emerald-500' : 'border-red-500'}`}>
            <div className="text-center">
              <div className="text-[11px] font-mono text-amber-400 mb-2 tracking-widest">VEREDICTO</div>
              <div className={`text-7xl font-black ${veredictoFinal === 'absuelto' ? 'text-emerald-400' : 'text-red-500'}`}>
                {veredictoFinal === 'absuelto' ? 'NO CULPABLE' : 'CULPABLE'}
              </div>
              <div className="text-amber-300 text-sm mt-4">
                {veredictoFinal === 'absuelto'
                  ? 'Quede libre. Sin costas.'
                  : 'Se le condena a 4 años de prisión.'}
              </div>
            </div>
          </Card>
        </div>
      )}

      <style jsx>{`
        @keyframes heartbeat {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

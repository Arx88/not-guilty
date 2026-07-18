/**
 * UI overlay: medidores, timer, botón objeción, micrófono, feedback visual.
 */
'use client';

import { useGame } from '../state/store';
import { useMic } from '../hooks/useMic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, AlertTriangle, Gavel, Clock, Heart } from 'lucide-react';
import { useState } from 'react';

interface GameUIProps {
  windowObjecion?: boolean;
  timerSegundos?: number | null;
  subfase?: string;
}

export function GameUI(_props: GameUIProps = {}) {
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

  const [micActive, setMicActive] = useState(false);
  const mic = useMic({});

  // Flash visual basado en el valor del medidor (sin refs)
  const flashCred = credibilidad > 50 ? 'good' : 'bad';
  const flashSosp = sospecha > 70 ? 'bad' : sospecha < 30 ? 'good' : null;

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

  // Encontrar el jurado con menor simpatía (candidato a recusación)
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

      {/* ─── Top-right: medidores con flash ─── */}
      <div className="absolute top-3 right-3 w-64 pointer-events-auto">
        <Card className="p-2.5 bg-black/70 border-amber-700/40 backdrop-blur space-y-1.5">
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-0.5">
              <span className="text-emerald-400">CREDIBILIDAD</span>
              <span className={flashCred === 'good' ? 'text-emerald-300' : 'text-red-300'}>
                {credibilidad}
              </span>
            </div>
            <Progress value={credibilidad} className="h-2 bg-emerald-950" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-0.5">
              <span className="text-red-400">SOSPECHA</span>
              <span className={flashSosp === 'bad' ? 'text-red-300 animate-pulse' : flashSosp === 'good' ? 'text-emerald-300' : 'text-red-300'}>
                {sospecha} {flashSosp === 'bad' && '⚠'}
              </span>
            </div>
            <Progress value={sospecha} className="h-2 bg-red-950" />
          </div>
          {/* Volumen micrófono */}
          <div>
            <div className="flex justify-between text-[9px] font-mono mb-0.5">
              <span className="text-amber-400">MIC</span>
              <span className="text-amber-300">{Math.round(volumen * 100)}%</span>
            </div>
            <Progress value={volumen * 100} className="h-1 bg-amber-950" />
          </div>
        </Card>
      </div>

      {/* ─── Hint: lo que debe hacer el jugador ─── */}
      <div className="absolute top-32 right-3 w-64 pointer-events-none">
        <Card className="p-2 bg-emerald-950/60 border-emerald-700/40 backdrop-blur">
          <div className="text-[9px] font-mono text-emerald-400 tracking-widest mb-0.5">TU TURNO</div>
          <div className="text-[11px] text-emerald-100/90 font-mono leading-tight">
            {fase === 'F1' && 'Di "sí" o "no" (o lo que quieras)'}
            {fase === 'F2' && 'Di "¡Protesto!" durante la window o calla'}
            {fase === 'F3' && 'Di "sí" para presentar evidencia'}
            {fase === 'F4' && 'Contra-interroga al testigo (habla libre)'}
            {fase === 'F5' && 'Alegato final: habla con fuerza'}
          </div>
        </Card>
      </div>

      {/* ─── Transcripción en vivo del jugador ─── */}
      {transcripcion && (
        <div className="absolute bottom-44 left-1/2 -translate-x-1/2 max-w-[80vw] pointer-events-none z-10">
          <div className="text-xs font-mono text-emerald-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-emerald-700/30">
            <span className="text-emerald-500">TÚ: </span>
            {transcripcion.slice(-120)}
          </div>
        </div>
      )}

      {/* ─── Botón micrófono + comandos ─── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-2">
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
        <div className="text-[9px] font-mono text-amber-400/80">
          {micActive ? 'ESCUCHANDO · habla claro' : 'click para hablar'}
        </div>
      </div>

      {/* ─── Hints de comandos ─── */}
      <div className="absolute bottom-6 left-3 pointer-events-none">
        <Card className="p-2 bg-black/60 border-amber-700/30 backdrop-blur">
          <div className="text-[9px] font-mono text-amber-500 mb-1">COMANDOS</div>
          <div className="space-y-0.5 text-[10px] font-mono text-amber-300/80">
            <div><span className="text-amber-400">"</span>¡Protesto!<span className="text-amber-400">"</span> — objetar</div>
            <div><span className="text-amber-400">"</span>Recusación, jurado N<span className="text-amber-400">"</span></div>
            <div className="text-emerald-400/70 mt-1">F4/F5: habla libre</div>
          </div>
        </Card>
      </div>

      {/* ─── Estado del jurado (mini) ─── */}
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

      {/* ─── Tensión: latido cuando sospecha > 70 ─── */}
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
                {veredictoFinal === 'absuelto'
                  ? 'Queda libre. Sin costas.'
                  : 'Condena: 4 años de prisión.'}
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

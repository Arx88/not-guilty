/**
 * Escena 2D del tribunal — NOT GUILTY.
 * Estilo: ilustración cómic / Phoenix Wright moderno.
 * No usa WebGL, no crashea el servidor, carga instantáneo.
 */
'use client';

import { useGame } from '../state/store';
import { Character2D } from './Character2D';

export function CourtroomScene2D() {
  const fase = useGame((s) => s.fase);
  const npcActual = useGame((s) => s.npcActual);
  const caption = useGame((s) => s.caption);
  const speakerActual = useGame((s) => s.speakerActual);
  const iaPensando = useGame((s) => s.iaPensando);
  const jurados = useGame((s) => s.jurados);
  const juradosRecusados = useGame((s) => s.juradosRecusados);
  const volumen = useGame((s) => s.volumen);
  const sospecha = useGame((s) => s.sospecha);

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
    <div className="absolute inset-0 overflow-hidden">
      {/* Fondo: gradiente madera oscura */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #1a1410 0%, #2a1f15 50%, #3d2817 100%)',
        }}
      />
      {/* Paneles de madera verticales */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 border-r border-black/30"
            style={{
              background: `linear-gradient(180deg, rgba(90,61,43,0.4) 0%, rgba(60,40,25,0.6) 100%)`,
              boxShadow: i % 2 === 0 ? 'inset 2px 0 4px rgba(0,0,0,0.3)' : 'none',
            }}
          />
        ))}
      </div>
      {/* Escudo dorado central */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle, #c69850 30%, #8b6f4a 70%, transparent 100%)',
          opacity: 0.5,
          filter: 'blur(2px)',
        }}
      />

      {/* ─── ESCENA: TRIBUNAL ─── */}
      <div className="relative w-full h-full flex flex-col justify-end pb-32">
        {/* Fila trasera: Juez centrado */}
        <div className="flex items-end justify-center gap-8 mb-2">
          {/* Fiscal (izquierda) */}
          <div className="relative w-32 h-44 sm:w-40 sm:h-56">
            <div className="absolute inset-x-0 bottom-0 h-3 bg-stone-800 rounded-t" />
            <Character2D role="fiscal" active={npcActual === 'fiscal'} nombre="FISCAL" />
          </div>

          {/* Juez (centro, elevado) */}
          <div className="relative w-36 h-56 sm:w-44 sm:h-64 -mt-8">
            {/* Estrado del juez */}
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-b from-amber-900 to-stone-950 border-2 border-amber-700/40 rounded-t-lg flex items-center justify-center">
              <div className="w-16 h-3 bg-amber-700 rounded-full opacity-60" />
            </div>
            <Character2D role="juez" active={npcActual === 'juez'} nombre="JUEZ" />
          </div>

          {/* Acusado (derecha, en banquillo) */}
          <div className="relative w-32 h-44 sm:w-40 sm:h-56">
            <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-b from-stone-800 to-stone-950 border-2 border-amber-700/30 rounded-t" />
            <Character2D role="acusado" active={true} nombre="ACUSADO (TÚ)" />
          </div>
        </div>

        {/* Testigo (aparece cuando hay testigo activo) */}
        {(npcActual === 'guarda' || npcActual === 'novia' || npcActual === 'supervisor') && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-32 w-28 h-40 animate-fade-in">
            <div className="absolute bottom-0 inset-x-0 h-6 bg-stone-800 border border-amber-700/30 rounded-t" />
            <Character2D role="testigo" active={true} nombre={speakerLabel} />
          </div>
        )}

        {/* Jurado (izquierda, en hilera) */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:block">
          <div className="bg-stone-950/70 border-2 border-amber-700/30 rounded-lg p-2">
            <div className="text-[9px] font-mono text-amber-500 mb-1 tracking-widest text-center">JURADO</div>
            <div className="grid grid-cols-5 gap-1">
              {jurados.map((j) => {
                const recusado = juradosRecusados.includes(j.silla);
                if (recusado) {
                  return (
                    <div
                      key={j.silla}
                      className="w-12 h-16 bg-stone-900 border border-stone-700 rounded flex items-center justify-center"
                    >
                      <span className="text-[9px] font-mono text-stone-500 rotate-12">RECUSADO</span>
                    </div>
                  );
                }
                return (
                  <div key={j.silla} className="w-12 h-16 relative">
                    <Character2D role="jurado" simpatia={j.simpatiaInicial} />
                    <div className="absolute -top-1 -right-1 text-[8px] font-mono bg-black/80 text-amber-300 px-1 rounded">
                      {j.silla}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── BURBUJA DE DIÁLOGO (Phoenix Wright style) ─── */}
      {(caption || iaPensando) && (
        <div className="absolute bottom-44 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl pointer-events-none">
          <div
            className="relative bg-amber-50 border-4 border-amber-900 rounded-2xl p-5 shadow-2xl"
            style={{ animation: 'bubbleIn 0.3s ease-out' }}
          >
            {/* Punta de la burbuja hacia el hablante */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-amber-50 border-r-4 border-b-4 border-amber-900 transform rotate-45" />

            {/* Speaker label */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black tracking-[0.3em] text-amber-900">
                {speakerLabel}
              </span>
              {iaPensando && (
                <span className="text-xs font-mono text-amber-700 animate-pulse">
                  ··· pensando ···
                </span>
              )}
            </div>

            {/* Texto de la IA */}
            <div className="text-stone-900 text-base sm:text-lg font-serif leading-relaxed">
              {caption || '...'}
            </div>
          </div>
        </div>
      )}

      {/* ─── Vignette + tintes por estado ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: sospecha > 70
            ? `radial-gradient(circle, transparent 40%, rgba(139,42,42,${(sospecha - 70) / 80}) 100%)`
            : 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.6) 100%)',
          animation: sospecha > 70 ? 'heartbeat 1.2s ease-in-out infinite' : undefined,
        }}
      />

      <style jsx>{`
        @keyframes bubbleIn {
          from { transform: translate(-50%, 20px) scale(0.9); opacity: 0; }
          to { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
        @keyframes heartbeat {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}

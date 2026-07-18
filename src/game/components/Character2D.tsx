/**
 * Personajes SVG estilo low-poly cartoon (inspirado en KayKit/Quaternius).
 * Cada personaje es un SVG inline con estados: idle, talking, pointing.
 */
'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface Character2DProps {
  role: 'juez' | 'fiscal' | 'acusado' | 'testigo' | 'jurado';
  active?: boolean;
  simpatia?: number; // 0-100, solo para jurado
  nombre?: string;
}

// SVG paths para cada personaje
function JuezSVG({ talking }: { talking: boolean }) {
  return (
    <svg viewBox="0 0 100 140" className="w-full h-full" style={{ filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.4))' }}>
      {/* Toga negra */}
      <polygon points="20,80 80,80 75,140 25,140" fill="#1a1a1a" stroke="#0a0a0a" strokeWidth="1.5" />
      <polygon points="20,80 80,80 80,90 20,90" fill="#2c2c2c" />
      {/* Cuerpo */}
      <rect x="35" y="60" width="30" height="25" fill="#3a3a3a" />
      {/* Cuello */}
      <rect x="42" y="50" width="16" height="12" fill="#e8c9a0" />
      {/* Cabeza */}
      <circle cx="50" cy="40" r="15" fill="#e8c9a0" stroke="#5a3d2b" strokeWidth="1" />
      {/* Peluca blanca */}
      <path d="M 35 35 Q 35 25 50 25 Q 65 25 65 35 L 65 48 Q 65 50 60 50 L 40 50 Q 35 50 35 48 Z" fill="#f5f5f5" stroke="#ddd" strokeWidth="1" />
      {/* Peluca rizos laterales */}
      <circle cx="35" cy="42" r="4" fill="#f5f5f5" />
      <circle cx="65" cy="42" r="4" fill="#f5f5f5" />
      {/* Ojos */}
      <circle cx="44" cy="40" r="1.5" fill="#1a1a1a" />
      <circle cx="56" cy="40" r="1.5" fill="#1a1a1a" />
      {/* Cejas enojo */}
      <line x1="40" y1="36" x2="48" y2="38" stroke="#3a3a3a" strokeWidth="1.5" />
      <line x1="60" y1="36" x2="52" y2="38" stroke="#3a3a3a" strokeWidth="1.5" />
      {/* Boca (movible) */}
      {talking ? (
        <ellipse cx="50" cy="46" rx="3" ry="2" fill="#5a2a2a" />
      ) : (
        <line x1="46" y1="46" x2="54" y2="46" stroke="#5a2a2a" strokeWidth="1.5" />
      )}
      {/* Mazo */}
      <rect x="78" y="95" width="14" height="6" fill="#8b6f4a" stroke="#5a3d2b" strokeWidth="1" transform="rotate(-30 85 98)" />
      <rect x="74" y="89" width="8" height="14" fill="#c69850" stroke="#8b6f4a" strokeWidth="1" transform="rotate(-30 78 96)" />
    </svg>
  );
}

function FiscalSVG({ talking }: { talking: boolean }) {
  return (
    <svg viewBox="0 0 100 140" className="w-full h-full" style={{ filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.4))' }}>
      {/* Traje */}
      <polygon points="22,75 78,75 75,140 25,140" fill="#2c2c3a" stroke="#1a1a28" strokeWidth="1.5" />
      {/* Camisa */}
      <polygon points="42,75 58,75 55,100 45,100" fill="#f0f0f0" />
      {/* Corbata roja */}
      <polygon points="48,75 52,75 53,100 47,100" fill="#8b2a2a" />
      {/* Cuello */}
      <rect x="44" y="65" width="12" height="10" fill="#e8c9a0" />
      {/* Cabeza */}
      <circle cx="50" cy="50" r="14" fill="#e8c9a0" stroke="#5a3d2b" strokeWidth="1" />
      {/* Pelo negro */}
      <path d="M 36 48 Q 36 35 50 35 Q 64 35 64 48 L 64 42 L 36 42 Z" fill="#1a1a1a" />
      {/* Ojos */}
      <circle cx="44" cy="50" r="1.5" fill="#1a1a1a" />
      <circle cx="56" cy="50" r="1.5" fill="#1a1a1a" />
      {/* Cejas agresivas */}
      <line x1="40" y1="46" x2="48" y2="48" stroke="#1a1a1a" strokeWidth="1.5" />
      <line x1="60" y1="46" x2="52" y2="48" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Boca seria */}
      {talking ? (
        <ellipse cx="50" cy="56" rx="3" ry="2" fill="#5a2a2a" />
      ) : (
        <line x1="46" y1="56" x2="54" y2="56" stroke="#5a2a2a" strokeWidth="1.5" />
      )}
    </svg>
  );
}

function AcusadoSVG({ talking, nervioso }: { talking: boolean; nervioso: boolean }) {
  return (
    <svg viewBox="0 0 100 140" className="w-full h-full" style={{
      filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.4))',
      transform: nervioso ? `translate(${Math.sin(Date.now() / 50) * 1}px, 0)` : undefined,
    }}>
      {/* Camisa */}
      <polygon points="25,75 75,75 72,140 28,140" fill="#d8c5a0" stroke="#8b6f4a" strokeWidth="1.5" />
      {/* Camisa interior */}
      <polygon points="44,75 56,75 53,100 47,100" fill="#f0f0f0" />
      {/* Cuello */}
      <rect x="44" y="65" width="12" height="10" fill="#e8c9a0" />
      {/* Cabeza */}
      <circle cx="50" cy="50" r="14" fill="#e8c9a0" stroke="#5a3d2b" strokeWidth="1" />
      {/* Pelo castaño */}
      <path d="M 36 48 Q 36 33 50 33 Q 64 33 64 48 L 64 40 L 36 40 Z" fill="#5a3d2b" />
      {/* Ojos */}
      <circle cx="44" cy="50" r="1.5" fill="#1a1a1a" />
      <circle cx="56" cy="50" r="1.5" fill="#1a1a1a" />
      {/* Cejas preocupadas */}
      <line x1="40" y1="48" x2="48" y2="46" stroke="#5a3d2b" strokeWidth="1.5" />
      <line x1="60" y1="48" x2="52" y2="46" stroke="#5a3d2b" strokeWidth="1.5" />
      {/* Boca nerviosa */}
      {talking ? (
        <ellipse cx="50" cy="56" rx="3" ry="2" fill="#5a2a2a" />
      ) : (
        <path d="M 46 56 Q 50 54 54 56" stroke="#5a2a2a" strokeWidth="1.5" fill="none" />
      )}
      {/* Gotas de sudor si nervioso */}
      {nervioso && (
        <>
          <ellipse cx="38" cy="42" rx="1.5" ry="2" fill="#88c0f0" />
          <ellipse cx="62" cy="42" rx="1.5" ry="2" fill="#88c0f0" />
        </>
      )}
    </svg>
  );
}

function TestigoSVG({ talking, color }: { talking: boolean; color: string }) {
  return (
    <svg viewBox="0 0 100 140" className="w-full h-full" style={{ filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.4))' }}>
      {/* Ropa */}
      <polygon points="25,75 75,75 72,140 28,140" fill={color} stroke="#5a3d2b" strokeWidth="1.5" />
      {/* Cuello */}
      <rect x="44" y="65" width="12" height="10" fill="#e8c9a0" />
      {/* Cabeza */}
      <circle cx="50" cy="50" r="14" fill="#e8c9a0" stroke="#5a3d2b" strokeWidth="1" />
      {/* Pelo gris */}
      <path d="M 36 48 Q 36 33 50 33 Q 64 33 64 48 L 64 40 L 36 40 Z" fill="#888" />
      {/* Ojos */}
      <circle cx="44" cy="50" r="1.5" fill="#1a1a1a" />
      <circle cx="56" cy="50" r="1.5" fill="#1a1a1a" />
      {/* Cejas neutrales */}
      <line x1="40" y1="46" x2="48" y2="46" stroke="#888" strokeWidth="1.5" />
      <line x1="60" y1="46" x2="52" y2="46" stroke="#888" strokeWidth="1.5" />
      {/* Boca */}
      {talking ? (
        <ellipse cx="50" cy="56" rx="3" ry="2.5" fill="#5a2a2a" />
      ) : (
        <line x1="46" y1="56" x2="54" y2="56" stroke="#5a2a2a" strokeWidth="1.5" />
      )}
    </svg>
  );
}

function JuradoSVG({ simpatia }: { simpatia: number }) {
  // Expresión según simpatía
  const cejaY = simpatia > 60 ? 47 : simpatia < 35 ? 45 : 46;
  const bocaType = simpatia > 60 ? 'sonriendo' : simpatia < 35 ? 'enojado' : 'neutral';
  const colorCamisa = simpatia > 60 ? '#4a7a4a' : simpatia < 35 ? '#7a4a4a' : '#5a5a7a';

  return (
    <svg viewBox="0 0 60 80" className="w-full h-full">
      {/* Cuerpo */}
      <polygon points="15,45 45,45 42,80 18,80" fill={colorCamisa} />
      {/* Cabeza */}
      <circle cx="30" cy="30" r="10" fill="#e8c9a0" stroke="#5a3d2b" strokeWidth="0.8" />
      {/* Pelo */}
      <path d="M 20 30 Q 20 18 30 18 Q 40 18 40 30 L 40 24 L 20 24 Z" fill="#5a3d2b" />
      {/* Ojos */}
      <circle cx="26" cy="30" r="1" fill="#1a1a1a" />
      <circle cx="34" cy="30" r="1" fill="#1a1a1a" />
      {/* Cejas */}
      {simpatia < 35 ? (
        <>
          <line x1="22" y1={cejaY} x2="29" y2={cejaY + 1.5} stroke="#5a3d2b" strokeWidth="1" />
          <line x1="38" y1={cejaY} x2="31" y2={cejaY + 1.5} stroke="#5a3d2b" strokeWidth="1" />
        </>
      ) : simpatia > 60 ? (
        <>
          <line x1="22" y1={cejaY} x2="29" y2={cejaY - 1} stroke="#5a3d2b" strokeWidth="1" />
          <line x1="38" y1={cejaY} x2="31" y2={cejaY - 1} stroke="#5a3d2b" strokeWidth="1" />
        </>
      ) : (
        <>
          <line x1="22" y1={cejaY} x2="29" y2={cejaY} stroke="#5a3d2b" strokeWidth="1" />
          <line x1="38" y1={cejaY} x2="31" y2={cejaY} stroke="#5a3d2b" strokeWidth="1" />
        </>
      )}
      {/* Boca */}
      {bocaType === 'sonriendo' && <path d="M 26 36 Q 30 38 34 36" stroke="#5a2a2a" strokeWidth="1.2" fill="none" />}
      {bocaType === 'enojado' && <path d="M 26 37 Q 30 35 34 37" stroke="#5a2a2a" strokeWidth="1.2" fill="none" />}
      {bocaType === 'neutral' && <line x1="27" y1="36" x2="33" y2="36" stroke="#5a2a2a" strokeWidth="1" />}
    </svg>
  );
}

export function Character2D({ role, active = false, simpatia = 50, nombre }: Character2DProps) {
  // El estado "hablando" se determina por si el personaje está activo
  const talking = active;

  return (
    <div
      className={`relative w-full h-full transition-all duration-300 ${active ? 'scale-105' : 'scale-100'}`}
      style={{
        animation: active && talking ? 'charBob 0.6s ease-in-out infinite' : undefined,
      }}
    >
      {role === 'juez' && <JuezSVG talking={talking} />}
      {role === 'fiscal' && <FiscalSVG talking={talking} />}
      {role === 'acusado' && <AcusadoSVG talking={talking} nervioso={active} />}
      {role === 'testigo' && <TestigoSVG talking={talking} color="#7a5a3a" />}
      {role === 'jurado' && <JuradoSVG simpatia={simpatia} />}
      {active && (
        <div className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-amber-400 rounded animate-pulse pointer-events-none" />
      )}
      {nombre && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-amber-200 whitespace-nowrap bg-black/60 px-2 py-0.5 rounded">
          {nombre}
        </div>
      )}
      <style jsx>{`
        @keyframes charBob {
          0%, 100% { transform: scale(1.05) translateY(0); }
          50% { transform: scale(1.05) translateY(-3px); }
        }
      `}</style>
    </div>
  );
}

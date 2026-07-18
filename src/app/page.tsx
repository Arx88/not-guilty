'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Play, AlertTriangle } from 'lucide-react';

// Escena 3D con assets Kenney CC0 + personajes low-poly
const CourtroomScene3D = dynamic(() => import('@/game/components/CourtroomScene3D'), { ssr: false });
const GameUI = dynamic(() => import('@/game/components/GameUI').then((m) => m.GameUI), { ssr: false });
const GameOrchestrator = dynamic(
  () => import('@/game/state/GameOrchestrator').then((m) => m.GameOrchestrator),
  { ssr: false }
);

export default function Home() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-950 via-amber-950/30 to-stone-950 flex items-center justify-center p-6">
        <Card className="max-w-2xl bg-stone-900/80 border-amber-700/40 backdrop-blur p-10">
          <div className="text-center space-y-6">
            <div className="text-[10px] font-mono text-amber-500 tracking-[0.3em]">
              EXPEDIENTE 2026/NOTG-001
            </div>
            <h1 className="text-7xl font-black text-amber-50 leading-none">
              NOT <span className="italic text-amber-600">Guilty</span>
            </h1>
            <p className="text-amber-200/80 text-lg">
              Un tribunal donde <b className="text-amber-400">tú eres el acusado</b>,
              el juez es una IA, y tu única arma es tu voz.
            </p>

            <div className="bg-black/40 border border-amber-800/30 rounded p-4 text-left space-y-2 text-sm">
              <div className="text-amber-400 font-mono text-[10px] tracking-widest mb-2">
                EL CASO
              </div>
              <div className="text-amber-100">
                Hurto agravado de <b>3.000 kg de queso manchego D.O.</b> del Museo del Jamón.
                Valor: 180.000 €. Hora: 03:47.
              </div>
              <div className="text-amber-400 font-mono text-[10px] tracking-widest mt-4 mb-2">
                CÓMO JUGAR
              </div>
              <ul className="text-amber-200/70 text-xs space-y-1">
                <li>· Activa el micrófono (permiso del navegador)</li>
                <li>· Responde <b>"sí"</b> o <b>"no"</b> cuando el juez te pregunte</li>
                <li>· Di <b>"¡Protesto!"</b> para objetar al fiscal</li>
                <li>· Di <b>"¡Recusación, jurado N!"</b> para recusar un jurado</li>
                <li>· Habla con calma o el juez se impacienta</li>
              </ul>
            </div>

            <div className="bg-amber-950/30 border border-amber-700/30 rounded p-3 flex items-start gap-2 text-left">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-300/80">
                <b>Requisitos:</b> Navegador Chrome/Edge (Web Speech API). Micrófono.
                Latencia IA: 1-3 s por intervención. Mejor con auriculares para evitar eco.
              </div>
            </div>

            <Button
              onClick={() => setStarted(true)}
              size="lg"
              className="bg-amber-700 hover:bg-amber-800 text-amber-50 px-8 py-6 text-lg"
            >
              <Play className="mr-2 h-5 w-5" /> INICIAR JUICIO
            </Button>

            <div className="text-[10px] font-mono text-amber-600/60 tracking-widest">
              POWERED BY NVIDIA NIM · LLAMA 3.1 NEMOTRON 70B
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950">
      <GameOrchestrator />
      <CourtroomScene3D />
      <GameUI />
    </div>
  );
}

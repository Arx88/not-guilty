'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Keyboard, Play } from 'lucide-react';

const CourtroomScene3D = dynamic(() => import('@/game/components/CourtroomScene3D'), { ssr: false });
const GameUI = dynamic(() => import('@/game/components/GameUI').then((m) => m.GameUI), { ssr: false });
const GameOrchestrator = dynamic(() => import('@/game/state/GameOrchestrator').then((m) => m.GameOrchestrator), { ssr: false });

export default function Home() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4">
        {/* Título minimalista */}
        <div className="text-center mb-12">
          <div className="text-[10px] font-mono text-amber-600/50 tracking-[0.4em] mb-4">EXPEDIENTE 2026/NOTG-001</div>
          <h1 className="text-7xl font-black text-amber-50 leading-none mb-3" style={{fontFamily:'Playfair Display, serif'}}>
            NOT <span className="italic text-amber-600 font-normal">Guilty</span>
          </h1>
          <p className="text-amber-200/50 text-sm">Estás en el banquillo. El juez es IA. Defiéndete.</p>
        </div>

        {/* Un solo botón */}
        <Button onClick={() => setStarted(true)} size="lg" className="bg-amber-700 hover:bg-amber-800 text-amber-50 px-12 py-6 text-lg">
          <Play className="mr-2 h-5 w-5" /> JUGAR
        </Button>

        {/* Tips mínimos debajo */}
        <div className="mt-8 flex gap-6 text-[11px] font-mono text-amber-500/40">
          <span>🎤 Habla o ⌨ escribe</span>
          <span>⚡ 3 objeciones</span>
          <span>🔍 Detecta mentiras</span>
        </div>
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

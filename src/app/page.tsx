'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, AlertTriangle, Mic, Gavel, Scale, MessageSquare } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-b from-stone-950 via-amber-950/30 to-stone-950 flex items-center justify-center p-4">
        <Card className="max-w-3xl bg-stone-900/80 border-amber-700/40 backdrop-blur p-8">
          <div className="space-y-6">
            {/* Título */}
            <div className="text-center">
              <div className="text-[10px] font-mono text-amber-500 tracking-[0.3em] mb-2">
                EXPEDIENTE 2026/NOTG-001
              </div>
              <h1 className="text-6xl font-black text-amber-50 leading-none mb-3">
                NOT <span className="italic text-amber-600">Guilty</span>
              </h1>
              <p className="text-amber-200/80 text-base">
                Estás en el banquillo. Te acusan de un delito que no cometiste.
                <br />
                El juez, el fiscal y los testigos son <b className="text-amber-400">inteligencia artificial</b>.
                <br />
                Tu única arma es tu <b className="text-amber-400">voz</b> (o tu teclado).
              </p>
            </div>

            {/* El caso */}
            <div className="bg-black/40 border border-amber-800/30 rounded-lg p-4">
              <div className="text-amber-400 font-mono text-[10px] tracking-widest mb-2">
                📋 EL CASO
              </div>
              <div className="text-amber-100 text-sm">
                Te acusan de robar <b>3.000 kg de queso manchego D.O.</b> del Museo del Jamón.
                Valor: 180.000 €. Hora del robo: 03:47 de la madrugada.
                <br /><br />
                <span className="text-amber-300/70">Tú eras repostero nocturno del museo. Tenías acceso al coche de reparto.
                Pero esa noche estabas en una gasolinera a 30 km. ¿Cómo lo demuestras?</span>
              </div>
            </div>

            {/* Cómo se juega - claro y visual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-stone-800/50 border border-amber-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Mic className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-300 font-bold text-sm">CÓMO HABLAR</span>
                </div>
                <ul className="text-amber-100/70 text-xs space-y-1">
                  <li>1. Click el botón <b>micrófono</b> (rojo) y habla</li>
                  <li>2. O click <b>⌨ Texto</b> y escribe + Enter</li>
                  <li>3. La IA te responde en 1-3 segundos</li>
                </ul>
              </div>

              <div className="bg-stone-800/50 border border-amber-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Gavel className="h-4 w-4 text-red-400" />
                  <span className="text-amber-300 font-bold text-sm">OBJECIONES</span>
                </div>
                <ul className="text-amber-100/70 text-xs space-y-1">
                  <li>Cuando veas <b className="text-red-400">"¡PROTESTO!"</b> en rojo:</li>
                  <li>Click el botón o di "¡Protesto!"</li>
                  <li>Luego explica <b>por qué</b> objetas</li>
                  <li>Ej: "El coche lo usan 5 empleados"</li>
                </ul>
              </div>

              <div className="bg-stone-800/50 border border-amber-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="h-4 w-4 text-emerald-400" />
                  <span className="text-amber-300 font-bold text-sm">TU OBJETIVO</span>
                </div>
                <ul className="text-amber-100/70 text-xs space-y-1">
                  <li>Mantén <b className="text-emerald-400">Credibilidad</b> alta</li>
                  <li>Mantén <b className="text-red-400">Sospecha</b> baja</li>
                  <li>Si Credibilidad ≥ Sospecha al final: <b className="text-emerald-400">ABSUELTO</b></li>
                  <li>Si no: <b className="text-red-400">CULPABLE</b></li>
                </ul>
              </div>

              <div className="bg-stone-800/50 border border-amber-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-300 font-bold text-sm">LAS 5 FASES</span>
                </div>
                <ul className="text-amber-100/70 text-xs space-y-1">
                  <li><b>F1:</b> El juez te lee los cargos → responde</li>
                  <li><b>F2:</b> El fiscal presenta pruebas → ¡Protesta!</li>
                  <li><b>F3:</b> Presenta tu evidencia → click una</li>
                  <li><b>F4:</b> Contrainterroga a los testigos</li>
                  <li><b>F5:</b> Alegato final → veredicto</li>
                </ul>
              </div>
            </div>

            {/* Aviso */}
            <div className="bg-amber-950/30 border border-amber-700/30 rounded p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-300/80">
                <b>Funciona mejor en Chrome/Edge.</b> Necesitas micrófono (o usa el botón ⌨ Texto).
                La IA tarda 1-3 segundos en responder. Sé claro y conciso.
              </div>
            </div>

            {/* Botón */}
            <div className="text-center">
              <Button
                onClick={() => setStarted(true)}
                size="lg"
                className="bg-amber-700 hover:bg-amber-800 text-amber-50 px-12 py-6 text-lg"
              >
                <Play className="mr-2 h-5 w-5" /> INICIAR JUICIO
              </Button>
              <div className="text-[10px] font-mono text-amber-600/60 tracking-widest mt-3">
                IA: NVIDIA NEMOTRON ULTRA 550B · VOZ: WEB SPEECH API
              </div>
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

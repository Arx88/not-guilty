/**
 * Escena 3D del tribunal — NOT GUILTY.
 * Three.js procedural geometry — personajes low-poly detallados.
 * Estilo: Party Animals / Lethal Company low-poly cartoon.
 *
 * Mejoras visuales v2:
 *  - Balanza de la justicia dorada en la pared del fondo
 *  - Banderas (EE.UU. y España) en astas doradas a ambos lados del juez
 *  - Panelado de madera vertical más denso con molduras y zócalo
 *  - Barandilla frontal (balaustrada) en el estrado del juez
 *  - Iluminación dramática más cálida (spots potentes + apliques de pared)
 *  - Suelo de planchas de madera con variación de color + alfombra central roja
 *  - Estrado del testigo con micrófono
 *  - Mesas de defensa/fiscalía con libros apilados
 *  - Banca del jurado con dos niveles de asientos
 *  - Techo con vigas de madera
 *  - Plantas decorativas procedurales (sin GLB externos)
 *
 * Funcionalidad preservada:
 *  - Personajes low-poly (juez, fiscal, acusado, testigo, jurado)
 *  - CameraRig reactivo a `fase` y `npcActual`
 *  - Integración con store `useGame`
 *  - Highlighting de personaje activo (etiqueta Html)
 */
'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, ContactShadows } from '@react-three/drei';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { useGame } from '../state/store';

// ──────────────────────────────────────────────────────────
// PERSONAJE LOW-POLY DETALLADO
// Cuerpo + cabeza + manos + piernas con formas reales
// ──────────────────────────────────────────────────────────
interface CharacterProps {
  position: [number, number, number];
  rotation?: number;
  color: string;
  role: 'juez' | 'fiscal' | 'acusado' | 'testigo';
  active?: boolean;
  volumen?: number;
}

function LowPolyCharacter({ position, rotation = 0, color, role, active = false, volumen = 0 }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftHandRef = useRef<THREE.Mesh>(null);
  const rightHandRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Respiración
    const breathe = Math.sin(t * 1.5 + position[0]) * 0.02;
    groupRef.current.position.y = position[1] + breathe;

    // Temblor del acusado según volumen
    if (role === 'acusado' && volumen > 0.1) {
      const amp = volumen * 0.02;
      groupRef.current.position.x = position[0] + Math.sin(t * 30) * amp;
      groupRef.current.position.z = position[2] + Math.cos(t * 25) * amp;
    } else {
      groupRef.current.position.x = position[0];
      groupRef.current.position.z = position[2];
    }

    // Rotación de cuerpo si activo
    if (active) {
      groupRef.current.rotation.y = rotation + Math.sin(t * 0.8) * 0.05;
    } else {
      groupRef.current.rotation.y = rotation;
    }

    // Cabeza mira ligeramente
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.5 + position[0] * 2) * 0.15;
      headRef.current.rotation.x = Math.sin(t * 0.7) * 0.05;
    }

    // Manos se mueven si hablando
    if (active && leftHandRef.current && rightHandRef.current) {
      leftHandRef.current.position.x = -0.35 + Math.sin(t * 4) * 0.05;
      rightHandRef.current.position.x = 0.35 + Math.cos(t * 4) * 0.05;
    }
  });

  // Color de camisa según rol
  const shirtColor = role === 'juez' ? '#1a1a1a' : role === 'fiscal' ? '#2c2c3a' : role === 'acusado' ? '#d8c5a0' : '#7a5a3a';

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      {/* PIERNAS */}
      <mesh position={[-0.15, 0.4, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.25]} />
        <meshStandardMaterial color="#3a2818" roughness={0.7} />
      </mesh>
      <mesh position={[0.15, 0.4, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.25]} />
        <meshStandardMaterial color="#3a2818" roughness={0.7} />
      </mesh>
      {/* ZAPATOS */}
      <mesh position={[-0.15, 0.05, 0.05]} castShadow>
        <boxGeometry args={[0.22, 0.15, 0.35]} />
        <meshStandardMaterial color="#1a1208" roughness={0.5} />
      </mesh>
      <mesh position={[0.15, 0.05, 0.05]} castShadow>
        <boxGeometry args={[0.22, 0.15, 0.35]} />
        <meshStandardMaterial color="#1a1208" roughness={0.5} />
      </mesh>

      {/* CUERPO (torso) */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.6, 0.7, 0.35]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>

      {/* BRAZOS */}
      <mesh ref={leftHandRef} position={[-0.4, 1.1, 0]} castShadow>
        <boxGeometry args={[0.18, 0.7, 0.25]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>
      <mesh ref={rightHandRef} position={[0.4, 1.1, 0]} castShadow>
        <boxGeometry args={[0.18, 0.7, 0.25]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>

      {/* MANOS */}
      <mesh position={[-0.4, 0.75, 0]} castShadow>
        <boxGeometry args={[0.2, 0.18, 0.22]} />
        <meshStandardMaterial color="#e8c9a0" roughness={0.6} />
      </mesh>
      <mesh position={[0.4, 0.75, 0]} castShadow>
        <boxGeometry args={[0.2, 0.18, 0.22]} />
        <meshStandardMaterial color="#e8c9a0" roughness={0.6} />
      </mesh>

      {/* CUELLO */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 8]} />
        <meshStandardMaterial color="#e8c9a0" roughness={0.6} />
      </mesh>

      {/* CABEZA */}
      <mesh ref={headRef} position={[0, 1.85, 0]} castShadow>
        <boxGeometry args={[0.4, 0.42, 0.4]} />
        <meshStandardMaterial color="#e8c9a0" roughness={0.6} />
      </mesh>

      {/* OJOS (negros) */}
      <mesh position={[-0.1, 1.88, 0.21]}>
        <boxGeometry args={[0.06, 0.08, 0.02]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0.1, 1.88, 0.21]}>
        <boxGeometry args={[0.06, 0.08, 0.02]} />
        <meshStandardMaterial color="#000" />
      </mesh>

      {/* PELO */}
      {role !== 'juez' && (
        <mesh position={[0, 2.07, 0]}>
          <boxGeometry args={[0.42, 0.12, 0.42]} />
          <meshStandardMaterial color={role === 'fiscal' ? '#1a1a1a' : role === 'acusado' ? '#5a3d2b' : '#888'} />
        </mesh>
      )}

      {/* ACCESORIOS POR ROL */}
      {role === 'juez' && (
        <>
          {/* TOGA (extendida) */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <coneGeometry args={[0.55, 1.4, 8]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
          </mesh>
          {/* PELO BLANCO (peluca) */}
          <mesh position={[0, 2.05, 0]}>
            <boxGeometry args={[0.45, 0.18, 0.45]} />
            <meshStandardMaterial color="#f0f0f0" roughness={0.95} />
          </mesh>
          {/* MAZO */}
          <mesh position={[0.5, 1.1, 0.3]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
            <meshStandardMaterial color="#8b6f4a" />
          </mesh>
          <mesh position={[0.6, 1.25, 0.4]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.12, 0.12, 0.2, 8]} />
            <meshStandardMaterial color="#c69850" metalness={0.4} />
          </mesh>
        </>
      )}

      {role === 'fiscal' && (
        <>
          {/* CORBATA ROJA */}
          <mesh position={[0, 1.1, 0.18]}>
            <boxGeometry args={[0.08, 0.5, 0.02]} />
            <meshStandardMaterial color="#8b2a2a" roughness={0.5} />
          </mesh>
        </>
      )}

      {role === 'acusado' && active && volumen > 0.2 && (
        <>
          {/* GOTA DE SUDOR */}
          <mesh position={[0.3, 2.1, 0.2]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#88c0f0" transparent opacity={0.8} />
          </mesh>
        </>
      )}

      {/* ACTIVE INDICATOR */}
      {active && (
        <Html position={[0, 2.5, 0]} center distanceFactor={8}>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: '#fbbf24',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'monospace',
            border: '1px solid #fbbf24',
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
          }}>
            {role === 'juez' ? 'JUEZ' : role === 'fiscal' ? 'FISCAL' : role === 'acusado' ? 'TÚ' : 'TESTIGO'}
          </div>
        </Html>
      )}
    </group>
  );
}

// ──────────────────────────────────────────────────────────
// JURADO (versión mini)
// ──────────────────────────────────────────────────────────
function JuryMember({ position, simpatia, silla }: { position: [number, number, number]; simpatia: number; silla: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.3 + silla) * 0.2;
    }
  });

  // Color de camisa según simpatía
  const shirtColor = simpatia > 60 ? '#4a7a4a' : simpatia < 35 ? '#7a4a4a' : '#5a5a7a';

  return (
    <group ref={groupRef} position={position}>
      {/* Cuerpo */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.25]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>
      {/* Piernas */}
      <mesh position={[-0.1, 0.15, 0]}>
        <boxGeometry args={[0.13, 0.3, 0.18]} />
        <meshStandardMaterial color="#2a1810" />
      </mesh>
      <mesh position={[0.1, 0.15, 0]}>
        <boxGeometry args={[0.13, 0.3, 0.18]} />
        <meshStandardMaterial color="#2a1810" />
      </mesh>
      {/* Cabeza */}
      <mesh ref={headRef} position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.28, 0.3, 0.28]} />
        <meshStandardMaterial color="#e8c9a0" />
      </mesh>
      {/* Ojos */}
      <mesh position={[-0.07, 0.98, 0.15]}>
        <boxGeometry args={[0.04, 0.05, 0.02]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0.07, 0.98, 0.15]}>
        <boxGeometry args={[0.04, 0.05, 0.02]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      {/* Pelo */}
      <mesh position={[0, 1.12, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.3]} />
        <meshStandardMaterial color={silla % 2 === 0 ? '#5a3d2b' : '#1a1a1a'} />
      </mesh>
      {/* Etiqueta de silla */}
      <Html position={[0, 1.4, 0]} center distanceFactor={6}>
        <div style={{
          background: simpatia > 60 ? 'rgba(74,122,74,0.85)' : simpatia < 35 ? 'rgba(122,74,74,0.85)' : 'rgba(90,90,122,0.85)',
          color: '#fff',
          padding: '2px 8px',
          borderRadius: '3px',
          fontSize: '12px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
        }}>
          {silla}
        </div>
      </Html>
    </group>
  );
}

// ──────────────────────────────────────────────────────────
// BALANZA DE LA JUSTICIA (scales of justice) — dorada
// Montada en la pared del fondo, detrás del juez
// ──────────────────────────────────────────────────────────
function ScalesOfJustice({ position, scale = 1.6 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Base */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.42, 0.12, 24]} />
        <meshStandardMaterial color="#d4a843" metalness={0.85} roughness={0.25} emissive="#3a2a08" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.18, 0.3, 0.1, 24]} />
        <meshStandardMaterial color="#c69850" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* Poste vertical central */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.05, 1.3, 12]} />
        <meshStandardMaterial color="#d4a843" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Esfera decorativa central */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#f0c560" metalness={0.9} roughness={0.15} emissive="#5a3f10" emissiveIntensity={0.4} />
      </mesh>

      {/* Haz horizontal superior */}
      <mesh position={[0, 1.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 2.0, 12]} />
        <meshStandardMaterial color="#d4a843" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Remates del haz (adornos en los extremos) */}
      {[-1.0, 1.0].map((x) => (
        <mesh key={`tip-${x}`} position={[x, 1.4, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#f0c560" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      {/* Cadenas y bandejas — izquierda y derecha */}
      {[-1.0, 1.0].map((x) => (
        <group key={`pan-${x}`} position={[x, 1.4, 0]}>
          {/* Gancho */}
          <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.06, 0.018, 8, 16]} />
            <meshStandardMaterial color="#d4a843" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Cadena (3 eslabones) */}
          {[0, 0.08, 0.16].map((dy, i) => (
            <mesh key={i} position={[0, -0.15 - dy, 0]} rotation={i % 2 === 0 ? [0, 0, 0] : [Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.025, 0.008, 6, 12]} />
              <meshStandardMaterial color="#c69850" metalness={0.85} roughness={0.25} />
            </mesh>
          ))}
          {/* Plato de la bandeja (superior horizontal) */}
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.02, 24]} />
            <meshStandardMaterial color="#d4a843" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Copa de la bandeja (plato hondo) */}
          <mesh position={[0, -0.46, 0]}>
            <cylinderGeometry args={[0.28, 0.18, 0.1, 24]} />
            <meshStandardMaterial color="#f0c560" metalness={0.9} roughness={0.15} emissive="#3a2a08" emissiveIntensity={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ──────────────────────────────────────────────────────────
// BANDERA EN ASTA DORADA
// type='us' → EE.UU.   type='es' → España
// ──────────────────────────────────────────────────────────
function FlagPole({
  position,
  type,
  flipped = false,
}: {
  position: [number, number, number];
  type: 'us' | 'es';
  flipped?: boolean;
}) {
  const flagScaleX = flipped ? -1 : 1;

  return (
    <group position={position}>
      {/* Base ornamentada del asta */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.24, 0.2, 16]} />
        <meshStandardMaterial color="#8b6f4a" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.09, 0.2, 0.12, 16]} />
        <meshStandardMaterial color="#d4a843" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#c69850" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Asta (poste vertical) */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.045, 5.8, 12]} />
        <meshStandardMaterial color="#d4a843" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Remate (esfera dorada con brillo) */}
      <mesh position={[0, 6.15, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#f0c560" metalness={0.9} roughness={0.15} emissive="#5a3f10" emissiveIntensity={0.3} />
      </mesh>
      {/* Punta cónica superior */}
      <mesh position={[0, 6.3, 0]}>
        <coneGeometry args={[0.06, 0.18, 12]} />
        <meshStandardMaterial color="#f0c560" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* BANDERA */}
      <group position={[0.05, 4.6, 0]} scale={[flagScaleX, 1, 1]}>
        {type === 'us' ? (
          <group>
            {/* Fondo blanco de la bandera */}
            <mesh position={[0.95, 0, 0]} castShadow>
              <boxGeometry args={[1.9, 1.05, 0.015]} />
              <meshStandardMaterial color="#f5f5f5" roughness={0.8} side={THREE.DoubleSide} />
            </mesh>
            {/* 7 franjas rojas */}
            {[-0.45, -0.30, -0.15, 0, 0.15, 0.30, 0.45].map((y, i) => (
              <mesh key={i} position={[0.95, y, 0.01]}>
                <boxGeometry args={[1.9, 0.075, 0.01]} />
                <meshStandardMaterial color="#b22234" roughness={0.7} side={THREE.DoubleSide} />
              </mesh>
            ))}
            {/* Cantón azul (esquina superior izquierda) */}
            <mesh position={[0.48, 0.27, 0.02]}>
              <boxGeometry args={[0.76, 0.54, 0.015]} />
              <meshStandardMaterial color="#3c3b6e" roughness={0.7} side={THREE.DoubleSide} />
            </mesh>
            {/* Estrellas (puntos blancos) */}
            {Array.from({ length: 15 }).map((_, i) => {
              const col = i % 5;
              const row = Math.floor(i / 5);
              return (
                <mesh key={`star-${i}`} position={[0.22 + col * 0.13, 0.12 + row * 0.12, 0.03]}>
                  <sphereGeometry args={[0.018, 6, 6]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.25} />
                </mesh>
              );
            })}
          </group>
        ) : (
          <group>
            {/* Franja roja superior */}
            <mesh position={[0.95, 0.33, 0]} castShadow>
              <boxGeometry args={[1.9, 0.27, 0.015]} />
              <meshStandardMaterial color="#aa151b" roughness={0.7} side={THREE.DoubleSide} />
            </mesh>
            {/* Franja amarilla central */}
            <mesh position={[0.95, 0, 0]} castShadow>
              <boxGeometry args={[1.9, 0.54, 0.015]} />
              <meshStandardMaterial color="#f1bf00" roughness={0.7} side={THREE.DoubleSide} />
            </mesh>
            {/* Franja roja inferior */}
            <mesh position={[0.95, -0.33, 0]} castShadow>
              <boxGeometry args={[1.9, 0.27, 0.015]} />
              <meshStandardMaterial color="#aa151b" roughness={0.7} side={THREE.DoubleSide} />
            </mesh>
            {/* Escudo simplificado (círculo dorado) */}
            <mesh position={[0.55, 0, 0.012]}>
              <circleGeometry args={[0.12, 24]} />
              <meshStandardMaterial color="#d4a843" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0.55, 0, 0.014]}>
              <ringGeometry args={[0.12, 0.14, 24]} />
              <meshStandardMaterial color="#8b6f4a" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}

// ──────────────────────────────────────────────────────────
// PANELADO DE MADERA VERTICAL (pared del fondo mejorada)
// Más paneles, con marco, vetas, molduras y zócalo
// ──────────────────────────────────────────────────────────
function WoodPaneling() {
  // 13 paneles verticales con espaciado uniforme
  const panelXs = [-12.6, -10.45, -8.3, -6.15, -4.0, -2.0, 0, 2.0, 4.0, 6.15, 8.3, 10.45, 12.6];
  const woodTones = [
    '#4a2f1c', '#5a3d2b', '#42261a', '#52342a',
    '#4a2f1c', '#5a3d2b', '#42261a', '#5a3d2b',
    '#4a2f1c', '#52342a', '#42261a', '#5a3d2b', '#4a2f1c',
  ];

  return (
    <group>
      {/* Pared base (color oscuro detrás de los paneles) */}
      <mesh position={[0, 5, -15]} receiveShadow>
        <boxGeometry args={[40, 10, 0.3]} />
        <meshStandardMaterial color="#1a0e05" roughness={1} />
      </mesh>

      {/* Paneles verticales con marco y detalle */}
      {panelXs.map((x, i) => (
        <group key={i} position={[x, 5, -14.85]}>
          {/* Marco exterior */}
          <mesh receiveShadow>
            <boxGeometry args={[2.05, 8.6, 0.06]} />
            <meshStandardMaterial color={woodTones[i]} roughness={0.65} />
          </mesh>
          {/* Panel interior (ligero relieve) */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[1.75, 8.3, 0.04]} />
            <meshStandardMaterial color={woodTones[i]} roughness={0.5} />
          </mesh>
          {/* Veteadura vertical izquierda */}
          <mesh position={[-0.55, 0, 0.04]}>
            <boxGeometry args={[0.04, 8.0, 0.015]} />
            <meshStandardMaterial color="#1a0e05" roughness={0.9} />
          </mesh>
          {/* Veteadura vertical derecha */}
          <mesh position={[0.55, 0, 0.04]}>
            <boxGeometry args={[0.04, 8.0, 0.015]} />
            <meshStandardMaterial color="#1a0e05" roughness={0.9} />
          </mesh>
          {/* Veteadura vertical central */}
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[0.03, 8.0, 0.015]} />
            <meshStandardMaterial color="#2a1810" roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* Moldura horizontal superior (cornisa) */}
      <mesh position={[0, 9.4, -14.8]}>
        <boxGeometry args={[28, 0.35, 0.12]} />
        <meshStandardMaterial color="#3d2817" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Filete dorado bajo cornisa */}
      <mesh position={[0, 9.15, -14.82]}>
        <boxGeometry args={[28, 0.08, 0.14]} />
        <meshStandardMaterial color="#c69850" metalness={0.7} roughness={0.3} emissive="#3a2a08" emissiveIntensity={0.15} />
      </mesh>

      {/* Zócalo inferior */}
      <mesh position={[0, 0.3, -14.8]}>
        <boxGeometry args={[28, 0.6, 0.12]} />
        <meshStandardMaterial color="#2a1810" roughness={0.7} />
      </mesh>
      {/* Moldura del zócalo */}
      <mesh position={[0, 0.65, -14.82]}>
        <boxGeometry args={[28, 0.06, 0.14]} />
        <meshStandardMaterial color="#5a3d2b" roughness={0.5} />
      </mesh>
    </group>
  );
}

// ──────────────────────────────────────────────────────────
// ESTRADO DEL JUEZ (con barandilla frontal / balaustrada)
// ──────────────────────────────────────────────────────────
function JudgeBench() {
  return (
    <group position={[0, 0, -10]}>
      {/* Plataforma elevada detrás del estrado */}
      <mesh position={[0, 0.1, -1.5]} receiveShadow castShadow>
        <boxGeometry args={[9, 0.2, 2]} />
        <meshStandardMaterial color="#3d2817" roughness={0.7} />
      </mesh>

      {/* Cuerpo principal del estrado */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[7, 1.4, 2.2]} />
        <meshStandardMaterial color="#4a2f1c" roughness={0.6} />
      </mesh>

      {/* Panel frontal decorativo (más claro) */}
      <mesh position={[0, 0.7, 1.11]}>
        <boxGeometry args={[6.8, 1.2, 0.04]} />
        <meshStandardMaterial color="#5a3d2b" roughness={0.5} />
      </mesh>

      {/* Molduras verticales en el frontal */}
      {[-3, -1.5, 0, 1.5, 3].map((x) => (
        <mesh key={`mold-${x}`} position={[x, 0.7, 1.13]}>
          <boxGeometry args={[0.08, 1.0, 0.02]} />
          <meshStandardMaterial color="#3d2817" roughness={0.6} />
        </mesh>
      ))}

      {/* Escudo dorado central en el frontal */}
      <mesh position={[0, 0.7, 1.14]}>
        <circleGeometry args={[0.27, 24]} />
        <meshStandardMaterial color="#d4a843" metalness={0.8} roughness={0.2} emissive="#3a2a08" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 0.7, 1.15]}>
        <ringGeometry args={[0.27, 0.32, 24]} />
        <meshStandardMaterial color="#c69850" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Tabla superior del estrado (escritorio grueso) */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.4, 0.2, 2.4]} />
        <meshStandardMaterial color="#5a3d2b" roughness={0.4} />
      </mesh>

      {/* Pequeño atril/sobre elevado para el juez */}
      <mesh position={[0, 1.7, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.15, 0.8]} />
        <meshStandardMaterial color="#6a4a30" roughness={0.45} />
      </mesh>

      {/* BARANDILLA FRONTAL (balaustrada) */}
      <group position={[0, 0, 1.35]}>
        {/* Rail superior */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <boxGeometry args={[7.4, 0.1, 0.1]} />
          <meshStandardMaterial color="#7a5640" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Rail inferior */}
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[7.4, 0.08, 0.08]} />
          <meshStandardMaterial color="#5a3d2b" roughness={0.5} />
        </mesh>
        {/* Balaustres verticales (17 piezas) */}
        {Array.from({ length: 17 }).map((_, i) => {
          const x = -3.6 + i * 0.45;
          return (
            <mesh key={`bal-${i}`} position={[x, 1.1, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 1.0, 8]} />
              <meshStandardMaterial color="#7a5640" roughness={0.5} metalness={0.1} />
            </mesh>
          );
        })}
        {/* Postes de las esquinas (más gruesos) */}
        {[-3.6, 3.6].map((x) => (
          <mesh key={`post-${x}`} position={[x, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 1.15, 8]} />
            <meshStandardMaterial color="#8b6f4a" roughness={0.4} metalness={0.15} />
          </mesh>
        ))}
        {/* Capiteles de los postes */}
        {[-3.6, 3.6].map((x) => (
          <mesh key={`cap-${x}`} position={[x, 1.72, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#d4a843" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Silla del juez (respaldo visible detrás) */}
      <group position={[0, 0, -1.0]}>
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[0.7, 1.2, 0.15]} />
          <meshStandardMaterial color="#2a1810" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.5, 0.05]}>
          <boxGeometry args={[0.6, 0.1, 0.6]} />
          <meshStandardMaterial color="#3a2818" roughness={0.7} />
        </mesh>
      </group>

      {/* Martillo (gavel) sobre la mesa */}
      <group position={[2.5, 1.65, 0.3]} rotation={[0, 0, -Math.PI / 6]}>
        {/* Mango */}
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
          <meshStandardMaterial color="#5a3d2b" roughness={0.5} />
        </mesh>
        {/* Cabeza del mazo (perpendicular al mango) */}
        <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.18, 12]} />
          <meshStandardMaterial color="#8b6f4a" roughness={0.4} />
        </mesh>
      </group>

      {/* Libros apilados sobre el estrado */}
      <mesh position={[-2.5, 1.65, 0.2]} castShadow>
        <boxGeometry args={[0.5, 0.08, 0.35]} />
        <meshStandardMaterial color="#5a2a2a" roughness={0.6} />
      </mesh>
      <mesh position={[-2.5, 1.74, 0.2]} castShadow>
        <boxGeometry args={[0.52, 0.08, 0.37]} />
        <meshStandardMaterial color="#2a3a5a" roughness={0.6} />
      </mesh>
      <mesh position={[-2.5, 1.83, 0.2]} castShadow>
        <boxGeometry args={[0.48, 0.08, 0.33]} />
        <meshStandardMaterial color="#3a4a2a" roughness={0.6} />
      </mesh>
    </group>
  );
}

// ──────────────────────────────────────────────────────────
// MESA DE DEFENSA / FISCALÍA
// ──────────────────────────────────────────────────────────
function LawyerTable({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Tablero superior */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.1, 1.8]} />
        <meshStandardMaterial color="#5a3d2b" roughness={0.45} />
      </mesh>
      {/* Panel frontal */}
      <mesh position={[0, 0.45, 0.85]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.9, 0.1]} />
        <meshStandardMaterial color="#4a2f1c" roughness={0.6} />
      </mesh>
      {/* Paneles laterales */}
      <mesh position={[-1.45, 0.45, 0]} castShadow>
        <boxGeometry args={[0.1, 0.9, 1.6]} />
        <meshStandardMaterial color="#3d2817" roughness={0.7} />
      </mesh>
      <mesh position={[1.45, 0.45, 0]} castShadow>
        <boxGeometry args={[0.1, 0.9, 1.6]} />
        <meshStandardMaterial color="#3d2817" roughness={0.7} />
      </mesh>
      {/* Molduras horizontales frontales */}
      <mesh position={[0, 0.83, 0.91]}>
        <boxGeometry args={[3.0, 0.06, 0.04]} />
        <meshStandardMaterial color="#7a5640" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.13, 0.91]}>
        <boxGeometry args={[3.0, 0.06, 0.04]} />
        <meshStandardMaterial color="#7a5640" roughness={0.4} />
      </mesh>
      {/* Paneles decorativos frontales */}
      {[-0.9, 0, 0.9].map((x) => (
        <mesh key={`dp-${x}`} position={[x, 0.48, 0.92]}>
          <boxGeometry args={[0.7, 0.6, 0.02]} />
          <meshStandardMaterial color="#5a3d2b" roughness={0.5} />
        </mesh>
      ))}
      {/* Libros apilados */}
      <mesh position={[-1.0, 1.0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.08, 0.3]} />
        <meshStandardMaterial color="#8b2a2a" roughness={0.6} />
      </mesh>
      <mesh position={[-1.0, 1.09, 0]} castShadow>
        <boxGeometry args={[0.42, 0.08, 0.32]} />
        <meshStandardMaterial color="#2a4a6a" roughness={0.6} />
      </mesh>
      <mesh position={[-1.0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.38, 0.08, 0.28]} />
        <meshStandardMaterial color="#4a5a2a" roughness={0.6} />
      </mesh>
      {/* Silla detrás */}
      <mesh position={[0.5, 0.5, -0.9]} castShadow>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#3a2818" roughness={0.7} />
      </mesh>
      <mesh position={[0.5, 0.9, -1.1]}>
        <boxGeometry args={[0.5, 0.7, 0.1]} />
        <meshStandardMaterial color="#3a2818" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ──────────────────────────────────────────────────────────
// ESTRADO DEL TESTIGO (con micrófono)
// ──────────────────────────────────────────────────────────
function WitnessStand({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Plataforma elevada */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.9, 0.2, 1.7]} />
        <meshStandardMaterial color="#3d2817" roughness={0.7} />
      </mesh>
      {/* Cuerpo frontal */}
      <mesh position={[0, 0.65, 0.75]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.0, 0.12]} />
        <meshStandardMaterial color="#4a2f1c" roughness={0.6} />
      </mesh>
      {/* Panel interior frontal */}
      <mesh position={[0, 0.65, 0.81]}>
        <boxGeometry args={[1.3, 0.7, 0.02]} />
        <meshStandardMaterial color="#5a3d2b" roughness={0.5} />
      </mesh>
      {/* Moldura frontal superior */}
      <mesh position={[0, 1.05, 0.82]}>
        <boxGeometry args={[1.6, 0.06, 0.04]} />
        <meshStandardMaterial color="#7a5640" roughness={0.4} />
      </mesh>
      {/* Moldura frontal inferior */}
      <mesh position={[0, 0.2, 0.82]}>
        <boxGeometry args={[1.6, 0.06, 0.04]} />
        <meshStandardMaterial color="#7a5640" roughness={0.4} />
      </mesh>
      {/* Tablero superior (donde apoya el testigo) */}
      <mesh position={[0, 1.2, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.1, 0.9]} />
        <meshStandardMaterial color="#5a3d2b" roughness={0.4} />
      </mesh>
      {/* Soporte del micrófono */}
      <mesh position={[0, 1.45, 0.55]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.45, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Cabezal del micrófono */}
      <mesh position={[0, 1.72, 0.55]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Vaso de agua */}
      <mesh position={[0.55, 1.32, 0.3]}>
        <cylinderGeometry args={[0.07, 0.05, 0.14, 12]} />
        <meshStandardMaterial color="#88c0f0" transparent opacity={0.4} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ──────────────────────────────────────────────────────────
// BANQUILLO DEL ACUSADO (con barandilla frontal)
// ──────────────────────────────────────────────────────────
function DefendantBox({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Plataforma */}
      <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.9, 0.1, 1.5]} />
        <meshStandardMaterial color="#3d2817" roughness={0.7} />
      </mesh>
      {/* Mesa interior */}
      <mesh position={[0, 0.7, 0.35]} castShadow>
        <boxGeometry args={[1.4, 0.08, 0.5]} />
        <meshStandardMaterial color="#5a3d2b" roughness={0.5} />
      </mesh>
      <mesh position={[-0.6, 0.35, 0.35]}>
        <boxGeometry args={[0.06, 0.7, 0.06]} />
        <meshStandardMaterial color="#3d2817" roughness={0.6} />
      </mesh>
      <mesh position={[0.6, 0.35, 0.35]}>
        <boxGeometry args={[0.06, 0.7, 0.06]} />
        <meshStandardMaterial color="#3d2817" roughness={0.6} />
      </mesh>

      {/* BARANDILLA FRONTAL (lado +z, hacia la cámara) */}
      <group position={[0, 0, 0.75]}>
        {/* Rail inferior */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.7, 0.06, 0.06]} />
          <meshStandardMaterial color="#7a5640" roughness={0.4} />
        </mesh>
        {/* Rail superior */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[1.7, 0.08, 0.08]} />
          <meshStandardMaterial color="#7a5640" roughness={0.4} />
        </mesh>
        {/* Balaustres */}
        {[-0.7, -0.35, 0, 0.35, 0.7].map((x) => (
          <mesh key={`db-${x}`} position={[x, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
            <meshStandardMaterial color="#7a5640" roughness={0.5} />
          </mesh>
        ))}
        {/* Postes de esquinas */}
        {[-0.85, 0.85].map((x) => (
          <mesh key={`dp-${x}`} position={[x, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.75, 8]} />
            <meshStandardMaterial color="#8b6f4a" roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ──────────────────────────────────────────────────────────
// BANCA DEL JURADO (con dos niveles de asientos)
// ──────────────────────────────────────────────────────────
function JuryBox() {
  return (
    <group position={[-13, 0, -3]}>
      {/* Plataforma elevada inferior */}
      <mesh position={[2, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.5, 0.3, 7]} />
        <meshStandardMaterial color="#3d2817" roughness={0.7} />
      </mesh>
      {/* Plataforma elevada superior */}
      <mesh position={[2, 0.55, 1]} receiveShadow castShadow>
        <boxGeometry args={[3.5, 0.4, 5]} />
        <meshStandardMaterial color="#4a2f1c" roughness={0.6} />
      </mesh>
      {/* Respaldo trasero */}
      <mesh position={[0.25, 1.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 2.5, 7]} />
        <meshStandardMaterial color="#3d2817" roughness={0.7} />
      </mesh>
      {/* Barandilla frontal */}
      <mesh position={[3.7, 1.0, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 7]} />
        <meshStandardMaterial color="#7a5640" roughness={0.4} />
      </mesh>
      <mesh position={[3.65, 1.4, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 7]} />
        <meshStandardMaterial color="#8b6f4a" roughness={0.4} />
      </mesh>
      {/* Balaustres frontales */}
      {[-3, -1.8, -0.6, 0.6, 1.8, 3].map((z) => (
        <mesh key={`jb-${z}`} position={[3.7, 1.0, z]}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshStandardMaterial color="#7a5640" roughness={0.5} />
        </mesh>
      ))}
      {/* Asientos nivel inferior (5) */}
      {[-2.4, -1.2, 0, 1.2, 2.4].map((z) => (
        <group key={`js-${z}`} position={[1.5, 0.85, z]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.08, 0.5]} />
            <meshStandardMaterial color="#5a3d2b" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.3, -0.3]}>
            <boxGeometry args={[1.2, 0.6, 0.1]} />
            <meshStandardMaterial color="#4a2f1c" roughness={0.6} />
          </mesh>
        </group>
      ))}
      {/* Asientos nivel superior (3) */}
      {[-1.8, 0, 1.8].map((z) => (
        <group key={`jt-${z}`} position={[1.5, 1.25, z]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.08, 0.5]} />
            <meshStandardMaterial color="#5a3d2b" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.3, -0.3]}>
            <boxGeometry args={[1.2, 0.6, 0.1]} />
            <meshStandardMaterial color="#4a2f1c" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ──────────────────────────────────────────────────────────
// SUELO DE MADERA (planchas con variación de color + alfombra central)
// ──────────────────────────────────────────────────────────
function WoodenFloor() {
  const plankColors = ['#5a3d2b', '#4a2f1c', '#6a4a30', '#52342a', '#5a3d2b', '#42261a', '#5a3d2b', '#6a4a30'];

  return (
    <group>
      {/* Base del suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#3d2817" roughness={0.85} />
      </mesh>

      {/* Planchas de madera con variación de color */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = -16 + i * 2.7;
        return (
          <group key={`plank-${i}`}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, -3]} receiveShadow>
              <planeGeometry args={[2.6, 28]} />
              <meshStandardMaterial color={plankColors[i % plankColors.length]} roughness={0.7} />
            </mesh>
            {/* Línea de separación entre planchas */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x + 1.35, 0.02, -3]}>
              <planeGeometry args={[0.06, 28]} />
              <meshStandardMaterial color="#1a0e05" roughness={0.95} />
            </mesh>
          </group>
        );
      })}

      {/* Alfombra central roja frente al estrado del juez */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -5]} receiveShadow>
        <planeGeometry args={[3.2, 9]} />
        <meshStandardMaterial color="#6a2a2a" roughness={0.9} />
      </mesh>
      {/* Borde interno de la alfombra */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, -5]}>
        <planeGeometry args={[3.0, 8.8]} />
        <meshStandardMaterial color="#8b3838" roughness={0.85} />
      </mesh>
      {/* Filete dorado en el borde */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -5]}>
        <ringGeometry args={[4.45, 4.6, 4]} />
        <meshStandardMaterial color="#c69850" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

// ──────────────────────────────────────────────────────────
// APLIQUE DE PARED (sconce — lámpara decorativa con luz cálida)
// ──────────────────────────────────────────────────────────
function WallSconce({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Placa de pared */}
      <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.04, 16]} />
        <meshStandardMaterial color="#3d2817" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Brazo del candelabro */}
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[0.08, 0.08, 0.18]} />
        <meshStandardMaterial color="#5a3d2b" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Base de la lámpara */}
      <mesh position={[0, 0.1, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.04, 12]} />
        <meshStandardMaterial color="#d4a843" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Bombilla (esfera brillante) */}
      <mesh position={[0, 0.18, 0.22]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#ffe0a0" emissive="#ffd070" emissiveIntensity={2.0} />
      </mesh>
      {/* Punto de luz cálido */}
      <pointLight position={[0, 0.18, 0.25]} intensity={0.5} color="#ffd070" distance={4} decay={2} />
    </group>
  );
}

// ──────────────────────────────────────────────────────────
// TECHO CON VIGAS DE MADERA
// ──────────────────────────────────────────────────────────
function CeilingWithBeams() {
  return (
    <group>
      {/* Techo base */}
      <mesh position={[0, 10, -3]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#2a1810" roughness={0.85} />
      </mesh>
      {/* Vigas del techo */}
      {[-12, -8, -4, 0, 4, 8, 12].map((x) => (
        <mesh key={`beam-${x}`} position={[x, 9.8, -3]} castShadow>
          <boxGeometry args={[0.4, 0.4, 24]} />
          <meshStandardMaterial color="#3d2817" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// ──────────────────────────────────────────────────────────
// PLANTA EN MACETA (procedural — reemplaza GLB externo)
// ──────────────────────────────────────────────────────────
function PottedPlant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Maceta */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.25, 0.6, 12]} />
        <meshStandardMaterial color="#5a3d2b" roughness={0.7} />
      </mesh>
      {/* Tierra */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.05, 12]} />
        <meshStandardMaterial color="#2a1810" roughness={1} />
      </mesh>
      {/* Hojas (conos verdes) */}
      {[
        [0, 1.0, 0, 0],
        [0.2, 0.9, 0.1, 0.3],
        [-0.2, 0.9, 0.1, -0.3],
        [0.1, 0.85, -0.2, 0.5],
        [-0.15, 0.95, 0.15, -0.5],
        [0.25, 1.1, 0, 0.2],
      ].map((p, i) => (
        <mesh key={`leaf-${i}`} position={[p[0], p[1], p[2]]} rotation={[p[3], 0, 0]} castShadow>
          <coneGeometry args={[0.1, 0.7, 6]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#3a5a2a' : '#4a6a3a'} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ──────────────────────────────────────────────────────────
// ESTRUCTURAS COMPLETAS DEL TRIBUNAL
// ──────────────────────────────────────────────────────────
function CourtroomStructures() {
  return (
    <group>
      <WoodenFloor />
      <CeilingWithBeams />
      <WoodPaneling />

      {/* Balanza de la justicia dorada en el centro de la pared del fondo */}
      <ScalesOfJustice position={[0, 5.2, -14.6]} scale={1.6} />

      {/* Banderas a ambos lados del juez (EE.UU. izquierda, España derecha) */}
      <FlagPole position={[-5, 0, -13]} type="us" flipped={false} />
      <FlagPole position={[5, 0, -13]} type="es" flipped />

      {/* Apliques de luz en la pared */}
      <WallSconce position={[-9, 4.2, -14.7]} />
      <WallSconce position={[9, 4.2, -14.7]} />
      <WallSconce position={[-13, 4.2, -14.7]} />
      <WallSconce position={[13, 4.2, -14.7]} />

      {/* Estrado del juez con barandilla */}
      <JudgeBench />

      {/* Mesa de la fiscalía (izquierda) */}
      <LawyerTable position={[-7, 0, -5]} rotation={-Math.PI / 4} />

      {/* Mesa de la defensa (derecha) */}
      <LawyerTable position={[7, 0, -5]} rotation={Math.PI / 4} />

      {/* Banquillo del acusado (centro) */}
      <DefendantBox position={[0, 0, -1]} />

      {/* Estrado del testigo (derecha) */}
      <WitnessStand position={[4, 0, -8]} rotation={-Math.PI / 4} />

      {/* Banca del jurado (izquierda) */}
      <JuryBox />

      {/* Plantas decorativas procedurales */}
      <PottedPlant position={[-9, 0, -13]} scale={1.2} />
      <PottedPlant position={[9, 0, -13]} scale={1.2} />
    </group>
  );
}

// ──────────────────────────────────────────────────────────
// LUCES (más cálidas y dramáticas)
// ──────────────────────────────────────────────────────────
function Lights() {
  return (
    <>
      {/* Ambient muy tenue y cálida */}
      <ambientLight intensity={0.35} color="#fff0d0" />

      {/* Hemisférica para tono natural */}
      <hemisphereLight args={['#ffd9a0', '#2a1810', 0.4]} />

      {/* Direccional principal con sombras */}
      <directionalLight
        position={[3, 14, 6]}
        intensity={1.0}
        color="#ffe4b5"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.0005}
      />

      {/* Spot potente sobre el JUEZ */}
      <spotLight
        position={[0, 9, -10]}
        angle={0.45}
        penumbra={0.4}
        intensity={3.5}
        color="#ffd095"
        target-position={[0, 1.5, -10]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        distance={25}
        decay={1.5}
      />

      {/* Spot sobre el ACUSADO */}
      <spotLight
        position={[0, 8, 1]}
        angle={0.4}
        penumbra={0.5}
        intensity={3.0}
        color="#fff0d8"
        target-position={[0, 1, -1]}
        castShadow
        distance={20}
        decay={1.5}
      />

      {/* Spot sobre el FISCAL */}
      <spotLight
        position={[-7, 8, -3]}
        angle={0.4}
        penumbra={0.5}
        intensity={2.2}
        color="#ffe4c0"
        target-position={[-7, 1.5, -5]}
        distance={18}
        decay={1.5}
      />

      {/* Spot sobre la DEFENSA */}
      <spotLight
        position={[7, 8, -3]}
        angle={0.4}
        penumbra={0.5}
        intensity={2.2}
        color="#ffe4c0"
        target-position={[7, 1.5, -5]}
        distance={18}
        decay={1.5}
      />

      {/* Spot sobre TESTIGO */}
      <spotLight
        position={[4, 7, -6]}
        angle={0.35}
        penumbra={0.5}
        intensity={2.5}
        color="#fff0d0"
        target-position={[4, 1.2, -8]}
        distance={16}
        decay={1.5}
      />

      {/* Luz de relleno cálida general desde el techo */}
      <pointLight position={[0, 8, 0]} intensity={0.6} color="#ffb060" distance={20} decay={2} />
    </>
  );
}

// ──────────────────────────────────────────────────────────
// CÁMARA REACTIVA (preservada sin cambios)
// ──────────────────────────────────────────────────────────
function CameraRig() {
  const fase = useGame((s) => s.fase);
  const npcActual = useGame((s) => s.npcActual);
  const { camera } = useThree();

  const target = useMemo(() => {
    if (fase === 'F1') return { pos: [0, 4, 8] as [number, number, number], look: [0, 1.5, -6] };
    if (fase === 'F2' && npcActual === 'fiscal') return { pos: [-3, 3.5, 1] as [number, number, number], look: [-7, 1.8, -5] };
    if (fase === 'F3') return { pos: [0, 4, 5] as [number, number, number], look: [0, 1, -1] };
    if (fase === 'F4' && (npcActual === 'guarda' || npcActual === 'novia' || npcActual === 'supervisor'))
      return { pos: [3, 3.5, -3] as [number, number, number], look: [4, 1.5, -8] };
    if (fase === 'F5') return { pos: [0, 4, 8] as [number, number, number], look: [0, 1.5, -6] };
    return { pos: [0, 4, 8] as [number, number, number], look: [0, 1.5, -6] };
  }, [fase, npcActual]);

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(...target.pos), 0.04);
    camera.lookAt(new THREE.Vector3(...target.look));
  });

  return null;
}

// ──────────────────────────────────────────────────────────
// ESCENA COMPLETA
// ──────────────────────────────────────────────────────────
export default function CourtroomScene3D() {
  const fase = useGame((s) => s.fase);
  const npcActual = useGame((s) => s.npcActual);
  const volumen = useGame((s) => s.volumen);
  const jurados = useGame((s) => s.jurados);
  const juradosRecusados = useGame((s) => s.juradosRecusados);

  if (fase === 'pre') return null;

  return (
    <Canvas
      shadows
      camera={{ position: [0, 4, 8], fov: 50 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'low-power' }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={['#1a1208']} />
      <fog attach="fog" args={['#1a1208', 22, 42]} />

      <Suspense fallback={null}>
        <Lights />
        <CourtroomStructures />

        {/* JUEZ */}
        <LowPolyCharacter
          position={[0, 0, -10]}
          color="#1a1a1a"
          role="juez"
          active={npcActual === 'juez'}
        />

        {/* FISCAL */}
        <LowPolyCharacter
          position={[-7, 0, -5]}
          rotation={Math.PI / 4}
          color="#2c2c3a"
          role="fiscal"
          active={npcActual === 'fiscal'}
        />

        {/* ACUSADO (jugador) */}
        <LowPolyCharacter
          position={[0, 0, -1]}
          rotation={Math.PI}
          color="#d8c5a0"
          role="acusado"
          active={true}
          volumen={volumen}
        />

        {/* TESTIGO (cuando hay uno activo) */}
        {(npcActual === 'guarda' || npcActual === 'novia' || npcActual === 'supervisor') && (
          <LowPolyCharacter
            position={[4, 0, -8]}
            rotation={-Math.PI / 4}
            color="#7a5a3a"
            role="testigo"
            active={true}
          />
        )}

        {/* JURADO: 5 miembros en hilera */}
        <group position={[-12, 0.4, -3]}>
          {jurados.map((j, i) => {
            const z = (i - 2) * 1.2;
            if (juradosRecusados.includes(j.silla)) {
              return (
                <group key={j.silla} position={[2, 0, z]}>
                  <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[0.7, 1, 0.7]} />
                    <meshStandardMaterial color="#444" />
                  </mesh>
                  <Html position={[0, 1.5, 0]} center distanceFactor={6}>
                    <div style={{
                      background: 'rgba(0,0,0,0.7)',
                      color: '#888',
                      padding: '3px 8px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      border: '1px solid #666',
                    }}>
                      RECUSADO
                    </div>
                  </Html>
                </group>
              );
            }
            return (
              <JuryMember
                key={j.silla}
                position={[2, 0, z]}
                simpatia={j.simpatiaInicial}
                silla={j.silla}
              />
            );
          })}
        </group>

        <ContactShadows
          position={[0, 0.02, 0]}
          opacity={0.55}
          scale={32}
          blur={2}
          far={12}
          color="#000000"
        />

        <CameraRig />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.1}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
      </Suspense>
    </Canvas>
  );
}

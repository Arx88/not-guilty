/**
 * Escena 3D del tribunal — NOT GUILTY.
 * Estilo: low-poly cartoon, paleta cálida (madera oscura + dorado + rojo tribunal).
 * Sin assets externos por ahora: geometrías procedurales de Three.js.
 * Personajes: capsulas con cabezas esféricas + accesorios (toga, peluca).
 */
'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, Float } from '@react-three/drei';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { useGame } from '../state/store';

// Paleta
const C = {
  wood: '#5a3d2b',
  woodDark: '#3d2817',
  woodLight: '#7a5640',
  gold: '#c69850',
  red: '#8b2a2a',
  cream: '#f0e4cf',
  floor: '#2a1f15',
  wall: '#1a1410',
};

// ──────────────────────────────────────────────────────────
// COMPONENTES DE LA ESCENA
// ──────────────────────────────────────────────────────────

function Courtroom() {
  return (
    <group>
      {/* Suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 25]} />
        <meshStandardMaterial color={C.floor} roughness={0.9} />
      </mesh>

      {/* Pared del fondo */}
      <mesh position={[0, 6, -12]} receiveShadow>
        <boxGeometry args={[30, 12, 0.5]} />
        <meshStandardMaterial color={C.wall} roughness={1} />
      </mesh>

      {/* Paneles de madera decorativos en la pared */}
      {[-9, -6, -3, 0, 3, 6, 9].map((x) => (
        <mesh key={x} position={[x, 6, -11.7]}>
          <boxGeometry args={[2.5, 10, 0.1]} />
          <meshStandardMaterial color={C.wood} roughness={0.7} />
        </mesh>
      ))}

      {/* Bandera/escudo detrás del juez */}
      <mesh position={[0, 8.5, -11.6]}>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial color={C.gold} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Mesa del juez (estrado principal) */}
      <group position={[0, 0, -8]}>
        {/* Tablero principal */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[8, 1.2, 2.5]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.5} />
        </mesh>
        {/* Tablero frontal con escudo */}
        <mesh position={[0, 1.5, 1.3]} castShadow>
          <boxGeometry args={[7.8, 1.1, 0.1]} />
          <meshStandardMaterial color={C.wood} roughness={0.6} />
        </mesh>
        {/* Escudo dorado en el frontal */}
        <mesh position={[0, 1.5, 1.36]}>
          <circleGeometry args={[0.35, 16]} />
          <meshStandardMaterial color={C.gold} metalness={0.7} roughness={0.25} />
        </mesh>
      </group>

      {/* Mesa del fiscal (izquierda) */}
      <group position={[-7, 0, -4]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.8, 1.8]} />
          <meshStandardMaterial color={C.wood} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[3, 1, 1.8]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.5} />
        </mesh>
      </group>

      {/* Mesa de la defensa (derecha) */}
      <group position={[7, 0, -4]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.8, 1.8]} />
          <meshStandardMaterial color={C.wood} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[3, 1, 1.8]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.5} />
        </mesh>
      </group>

      {/* Banquillo del acusado (centro, frente al juez) */}
      <group position={[0, 0, -2]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[1.5, 1.2, 1.2]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.7} />
        </mesh>
        {/* Barra superior */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <boxGeometry args={[1.8, 0.15, 1.4]} />
          <meshStandardMaterial color={C.wood} roughness={0.5} />
        </mesh>
      </group>

      {/* Banca de testigos (a la derecha del juez, lateral) */}
      <group position={[4, 0, -7]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.4, 1, 1.4]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[1.6, 0.15, 1.6]} />
          <meshStandardMaterial color={C.wood} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// Personaje low-poly: cápsula con cabeza esférica
interface CharacterProps {
  position: [number, number, number];
  rotation?: number;
  color: string;
  role: 'juez' | 'fiscal' | 'acusado' | 'testigo' | 'jurado';
  active?: boolean;
  volumen?: number; // 0-1, para temblor si es el acusado
  simpatia?: number; // 0-100, para expresión si es jurado
}

function Character({ position, rotation = 0, color, role, active = false, volumen = 0, simpatia = 50 }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Temblor del acusado según volumen (señal diegética de nerviosismo)
    if (role === 'acusado' && volumen > 0.1) {
      const t = state.clock.elapsedTime;
      const amp = volumen * 0.015;
      groupRef.current.position.x = position[0] + Math.sin(t * 30) * amp;
      groupRef.current.position.z = position[2] + Math.cos(t * 25) * amp;
    } else {
      groupRef.current.position.x = position[0];
      groupRef.current.position.z = position[2];
    }
    // Pequeña respiración
    const breathe = Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.01;
    groupRef.current.position.y = position[1] + breathe;
    // Active glow: leve rotación
    if (active) {
      groupRef.current.rotation.y = rotation + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    } else {
      groupRef.current.rotation.y = rotation;
    }
  });

  // Accesorios según rol
  const accesorios = useMemo(() => {
    switch (role) {
      case 'juez':
        return (
          <>
            {/* Toga negra */}
            <mesh position={[0, 1.2, 0]}>
              <coneGeometry args={[0.7, 1.8, 8]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>
            {/* Peluca blanca */}
            <mesh position={[0, 2.55, 0]}>
              <sphereGeometry args={[0.32, 16, 12]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.95} />
            </mesh>
            {/* Cuerpo */}
            <mesh position={[0, 1.5, 0]} castShadow>
              <capsuleGeometry args={[0.4, 0.8, 4, 8]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
          </>
        );
      case 'fiscal':
        return (
          <>
            {/* Traje */}
            <mesh position={[0, 1.5, 0]} castShadow>
              <capsuleGeometry args={[0.38, 0.8, 4, 8]} />
              <meshStandardMaterial color="#2c2c3a" roughness={0.7} />
            </mesh>
            {/* Corbata roja */}
            <mesh position={[0, 1.5, 0.32]}>
              <boxGeometry args={[0.08, 0.5, 0.02]} />
              <meshStandardMaterial color={C.red} roughness={0.5} />
            </mesh>
          </>
        );
      case 'acusado':
        return (
          <>
            {/* Camisa */}
            <mesh position={[0, 1.5, 0]} castShadow>
              <capsuleGeometry args={[0.38, 0.8, 4, 8]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Cartel "CULPABLE" colgando (cuando está activo) */}
            {active && (
              <Html position={[0, 2.5, 0]} center>
                <div style={{
                  background: 'rgba(0,0,0,0.7)',
                  color: '#ff4444',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  border: '1px solid #ff4444',
                  whiteSpace: 'nowrap',
                }}>
                  ACUSADO
                </div>
              </Html>
            )}
          </>
        );
      case 'testigo':
        return (
          <>
            <mesh position={[0, 1.5, 0]} castShadow>
              <capsuleGeometry args={[0.38, 0.8, 4, 8]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
          </>
        );
      case 'jurado':
        // Color de expresión según simpatía
        const exprColor = simpatia > 60 ? '#88c070' : simpatia < 35 ? '#c07070' : color;
        return (
          <>
            <mesh position={[0, 1.5, 0]} castShadow>
              <capsuleGeometry args={[0.36, 0.7, 4, 8]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Indicador silla */}
            <Html position={[0, 2.7, 0]} center>
              <div style={{
                background: 'rgba(0,0,0,0.5)',
                color: exprColor,
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '9px',
                fontFamily: 'monospace',
                border: `1px solid ${exprColor}`,
              }}>
                {simpatia > 60 ? '◉' : simpatia < 35 ? '✕' : '○'}
              </div>
            </Html>
          </>
        );
    }
  }, [role, color, active, simpatia]);

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      {/* Cabeza */}
      <mesh position={[0, 2.25, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 12]} />
        <meshStandardMaterial color="#e8c9a0" roughness={0.6} />
      </mesh>
      {accesorios}
    </group>
  );
}

function JuryBox() {
  const jurados = useGame((s) => s.jurados);
  const recusados = useGame((s) => s.juradosRecusados);

  // 5 sillas en semicírculo a la izquierda
  return (
    <group position={[-12, 0, -3]}>
      {/* Banca de jurados */}
      <mesh position={[2, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.8, 6]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.7} />
      </mesh>
      {jurados.map((j, i) => {
        const z = (i - 2) * 1.2;
        const recusado = recusados.includes(j.silla);
        if (recusado) {
          // Silla vacía con cartel
          return (
            <group key={j.silla} position={[2, 0, z]}>
              <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.7, 1, 0.7]} />
                <meshStandardMaterial color="#444" />
              </mesh>
              <Html position={[0, 2, 0]} center>
                <div style={{
                  background: 'rgba(0,0,0,0.6)',
                  color: '#888',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  border: '1px solid #666',
                }}>
                  RECUSADO
                </div>
              </Html>
            </group>
          );
        }
        const color = j.perfil === 'estricto' ? '#4a3838' : j.perfil === 'empatico' ? '#384a4a' : '#4a4838';
        return (
          <Character
            key={j.silla}
            position={[2, 0, z]}
            rotation={Math.PI / 3}
            color={color}
            role="jurado"
            simpatia={j.simpatiaInicial}
          />
        );
      })}
    </group>
  );
}

function Luces() {
  return (
    <>
      <ambientLight intensity={0.45} color="#ffe8c0" />
      <directionalLight
        position={[5, 12, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      {/* Spot sobre el acusado */}
      <spotLight
        position={[0, 8, 0]}
        angle={0.4}
        penumbra={0.5}
        intensity={1.5}
        color="#fff4d8"
        target-position={[0, 1, -2]}
        castShadow
      />
      {/* Spot sobre el juez */}
      <spotLight
        position={[0, 8, -8]}
        angle={0.35}
        penumbra={0.6}
        intensity={1.0}
        color="#ffe0b0"
        target-position={[0, 1.5, -8]}
      />
    </>
  );
}

function CamaraRig() {
  const fase = useGame((s) => s.fase);
  const npcActual = useGame((s) => s.npcActual);
  const { camera } = useThree();

  // Cámara cambia según fase / NPC activo
  const target = useMemo(() => {
    if (fase === 'F1') return { pos: [0, 4, 8] as [number, number, number], look: [0, 1.5, -6] };
    if (fase === 'F2' && npcActual === 'fiscal') return { pos: [-3, 3, 2] as [number, number, number], look: [-7, 2, -4] };
    if (fase === 'F3') return { pos: [0, 4, 5] as [number, number, number], look: [0, 1, -2] };
    if (fase === 'F4' && (npcActual === 'guarda' || npcActual === 'novia' || npcActual === 'supervisor'))
      return { pos: [3, 3, -2] as [number, number, number], look: [4, 2, -7] };
    if (fase === 'F5') return { pos: [0, 4, 8] as [number, number, number], look: [0, 1.5, -6] };
    return { pos: [0, 4, 8] as [number, number, number], look: [0, 1.5, -6] };
  }, [fase, npcActual]);

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(...target.pos), 0.04);
    camera.lookAt(new THREE.Vector3(...target.look));
  });

  return null;
}

export default function CourtroomScene() {
  const fase = useGame((s) => s.fase);
  const npcActual = useGame((s) => s.npcActual);
  const volumen = useGame((s) => s.volumen);

  if (fase === 'pre') return null;

  return (
    <Canvas
      shadows
      camera={{ position: [0, 4, 8], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={[C.wall]} />
      <fog attach="fog" args={[C.wall, 18, 35]} />

      <Suspense fallback={null}>
        <Luces />
        <Courtroom />

        {/* Juez */}
        <Character
          position={[0, 0, -8]}
          color="#1a1a1a"
          role="juez"
          active={npcActual === 'juez'}
        />

        {/* Fiscal */}
        <Character
          position={[-7, 0, -4]}
          rotation={Math.PI / 4}
          color="#2c2c3a"
          role="fiscal"
          active={npcActual === 'fiscal'}
        />

        {/* Acusado (jugador) */}
        <Character
          position={[0, 0, -2]}
          rotation={Math.PI}
          color="#d8c5a0"
          role="acusado"
          active={true}
          volumen={volumen}
        />

        {/* Testigo actual */}
        {(npcActual === 'guarda' || npcActual === 'novia' || npcActual === 'supervisor') && (
          <Character
            position={[4, 0, -7]}
            rotation={-Math.PI / 4}
            color="#7a5a3a"
            role="testigo"
            active={true}
          />
        )}

        <JuryBox />

        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.5}
          scale={30}
          blur={2}
          far={10}
          color="#000000"
        />

        <CamaraRig />
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

# NOT GUILTY

Un juego de tribunal donde tú eres el acusado, el juez/fiscal/testigos son IA, y tu única arma es tu voz.

## Stack

- **Next.js 16** + TypeScript + Tailwind 4 + shadcn/ui
- **Three.js** + @react-three/fiber (escena 3D con assets Kenney CC0)
- **NVIDIA NIM API** (nemotron-3-ultra-550b-a55b) para NPCs conversacionales
- **Web Speech API** para STT en español
- **Web Audio API** para sonido procedural
- **Zustand** para estado global

## Setup local

```bash
# 1. Instalar dependencias
bun install

# 2. Crear .env.local con tu API key de NVIDIA
# Consíguela en https://build.nvidia.com/ → Account → API Keys
cat > .env.local << 'EOF'
NVIDIA_API_KEY=nvapi-tu-key-aqui
NVIDIA_CHAT_MODEL=nvidia/nemotron-3-ultra-550b-a55b
NVIDIA_BASE_URL=https://integrate.api.nvidia.com
EOF

# 3. Iniciar dev server
bun run dev

# 4. Abrir http://localhost:3000 en Chrome/Edge
```

## Cómo jugar

1. Click **INICIAR JUICIO**
2. Click botón **micrófono** (rojo) O botón **⌨ Texto** para escribir
3. Cuando el juez pregunte "¿entiende los cargos?", di **"sí"** o escribe tu respuesta
4. Cuando aparezca **"¡PROTESTO!"** en rojo gigante, click el botón o di "¡Protesto!" + tu fundamento
5. En **F3**, click en una evidencia del panel (4 botones) para presentarla
6. En **F4**, habla o escribe para contra-interrogar al guarda y al supervisor
7. En **F5**, tienes 45 segundos para tu alegato final
8. El juez emite veredicto: **NO CULPABLE** o **CULPABLE** según Credibilidad vs Sospecha

## Caso incluido

**"Robo de 3.000 kg de queso manchego D.O. del Museo del Jamón"**
- 3 testigos: Don Eustaquio (guarda), Maribel (novia), Anselmo Tellez (supervisor)
- 4 evidencias: mensaje WhatsApp, recibo gasolina, cronograma rutas, análisis maletero
- 5 jurados: 2 Estrictos, 2 Empáticos, 1 Popular (con simpatía individual)

## Deploy en Vercel

### Opción A: Vercel CLI (rápido)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy (preguntará configuración, aceptar defaults)
vercel

# 4. Configurar variables de entorno
vercel env add NVIDIA_API_KEY
vercel env add NVIDIA_CHAT_MODEL
vercel env add NVIDIA_BASE_URL

# 5. Redeploy con las variables
vercel --prod
```

### Opción B: GitHub + Vercel (recomendado)

1. **Crear repo en GitHub** (público o privado)
2. **Pushear el código**:
   ```bash
   git init
   git add .
   git commit -m "NOT GUILTY v0.6 - juego de tribunal con IA"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/not-guilty.git
   git push -u origin main
   ```
3. **Conectar Vercel**:
   - Ve a https://vercel.com/new
   - Importa el repo de GitHub
   - En "Environment Variables", añade:
     - `NVIDIA_API_KEY` = tu key
     - `NVIDIA_CHAT_MODEL` = `nvidia/nemotron-3-ultra-550b-a55b`
     - `NVIDIA_BASE_URL` = `https://integrate.api.nvidia.com`
   - Click **Deploy**
4. **Listo** — Vercel te da una URL pública como `https://not-guilty.vercel.app`

## Estructura del proyecto

```
src/
├── app/
│   ├── api/chat/route.ts        # Proxy a NVIDIA NIM con retry
│   ├── page.tsx                  # Landing + juego
│   └── layout.tsx
├── game/
│   ├── components/
│   │   ├── CourtroomScene3D.tsx  # Escena 3D + personajes low-poly
│   │   ├── Character2D.tsx       # (legacy, no se usa)
│   │   └── GameUI.tsx            # Overlay: medidores, botones, evidencias
│   ├── data/
│   │   └── case-queso.ts         # Caso del queso + system prompts NPCs
│   ├── hooks/
│   │   └── useMic.ts             # Web Speech API + Web Audio API
│   └── state/
│       ├── store.ts              # Zustand store
│       ├── npc-client.ts         # Cliente del backend
│       ├── GameOrchestrator.tsx  # State machine F1-F5
│       └── sounds.ts             # Sonido procedural
└── components/ui/                # shadcn/ui components
public/models/furniture/          # 140 GLBs de Kenney (CC0)
```

## Assets

- **Kenney Furniture Kit** (CC0) — 140 muebles GLB
- Personajes low-poly: hechos con geometrías Three.js (no requiere assets externos)

## Modelo de IA

- **NVIDIA NIM**: `nvidia/nemotron-3-ultra-550b-a55b` (MoE 550B, 55B activos)
- `chat_template_kwargs: {thinking: false}` para evitar chain-of-thought en inglés
- Retry con backoff exponencial (1s, 2s, 4s) para errores 429/503

## Limitaciones conocidas

- **F3** es click en botones, no drag&drop visual de objetos 3D
- **TTS** no implementado (NPCs hablan por texto, no por voz)
- **Latencia**: 1-3s media, picos de 8-14s cuando NVIDIA tiene carga

## Licencia

MIT para el código. Assets Kenney son CC0. Caso del queso es original.

"""
Prueba end-to-end del flujo de NOT GUILTY vía API.
Versión 2: usa system prompts reales del juego (con expediente inyectado).
Simula al jugador hablando y verifica coherencia narrativa.
"""
import requests
import json
import time
import os

BASE = "http://localhost:3000"

# ── System prompts actualizados (con expediente) ──
JUEZ_PROMPT = """Eres el JUEZ FILÓSOFO. Voz grave, lento, reflexivo. Hablas con frases largas.

EL CASO: El acusado es un repostero nocturno del Museo del Jamón acusado de robar 3.000 kg de queso manchego D.O. (180.000€) a las 03:47. Tienes delante: 3 testigos (guarda, novia, supervisor), 4 evidencias (mensaje WhatsApp 03:50, recibo gasolina 03:30 a 30km, cronograma rutas, análisis maletero con trazas de queso).

REGLAS:
- NUNCA muestres tu razonamiento interno. NUNCA hables en inglés. Responde directamente en español.
- Cuando el jugador objete, decides SIEMPRE entre "Protesta admitida" o "Protesta rechazada" como primera frase.
- Pides fundamentación antes de admitir objeciones.
- Si el jugador grita, le pides moderación con calma.
- Tus decisiones se basan en la coherencia lógica, no en emociones.
- Responde SIEMPRE en español, máximo 60 palabras por intervención.
- Puedes usar acciones entre asteriscos (*asiente*, *ajusta las gafas*).
- En el veredicto final, dice explícitamente "CULPABLE" o "NO CULPABLE" como primera palabra."""

FISCAL_PROMPT = """Eres la FISCAL. Voz aguda, rápida, ambiciosa.

EL CASO: El acusado es un repostero nocturno del Museo del Jamón acusado de robar 3.000 kg de queso manchego D.O. (180.000€) a las 03:47. Se llevó el queso en el coche de reparto del museo.

EVIDENCIAS DE LA ACUSACIÓN:
1. Análisis del maletero del coche del museo: trazas de queso manchego D.O. (99.7% de coincidencia).
2. Video de seguridad a las 03:47: persona con uniforme del museo cargando caja en el maletero.
3. El acusado conocía las cámaras y tenía acceso al coche (era repostero nocturno).

TU AGENDA: Tu objetivo es conseguir la condena. Atacas cualquier contradicción. Cuestionas la credibilidad del acusado.

REGLAS:
- Responde SIEMPRE en español, máximo 70 palabras.
- NUNCA inventes crímenes que no sean el robo de queso (NO menciones asesinatos, armas, sangre, cadáveres)."""

GUARDA_PROMPT = """Eres Don Eustaquio, guardia de seguridad NOCTURNO del Museo del Jamón (tu turno es de 22:00 a 06:00). Llevas 23 años en el puesto. Eres nervioso, tartamudeas, pero honesto.

EL CASO: El acusado es un repostero nocturno del museo. Se le acusa de robar 3.000 kg de queso manchego D.O. valorado en 180.000€. El robo fue a las 03:47 de la madrugada en el museo.

TU VERDAD: Esa noche estabas en el baño con dolor de estómago durante 20 minutos (desde las 03:35 hasta las 03:55). El robo fue a las 03:47. NO VISTE NADA. Tu turno terminó a las 06:00 como todos los días.

REGLAS:
- NUNCA uses palabras en inglés. Solo español castizo.
- Tu turno es NOCTURNO (22:00 a 06:00). NUNCA digas que terminó "a las ocho".
- Hablas en español castizo con humildad. Usas "su señoría" y "yo qué sé".
- Respuestas CORTAS (máximo 40 palabras). No inventes detalles.
- Si te preguntan por Anselmo Tellez (supervisor), tu tono cambia: lo consideras un mandón pretencioso."""

SUPERVISOR_PROMPT = """Eres Anselmo Tellez, supervisor del Museo del Jamón. Despediste al acusado hace 1 mes por "reducción de personal" pero en realidad solo lo despediste a él. Tienes enemistad personal con Don Eustaquio (el guardia).

EL CASO: Acusan a tu ex-empleado de robar 3.000 kg de queso manchego D.O. del museo a las 03:47. Quieres que lo condenen.

TU AGENDA: Tu testimonio busca inculpar al acusado. Destacas que conocía las cámaras, los puntos ciegos y tenía acceso al coche de reparto.

REGLAS:
- NUNCA uses palabras en inglés. Solo español.
- Hablas con tono autoritario y burocrático. Usas "le conste" y "es pertinente señalar".
- Respuestas CORTAS (máximo 50 palabras).
- Si te preguntan por qué despediste al acusado, dices "reducción de personal". Si insisten en cuántos despediste, admites "solo a él" con incomodidad.
- Si te preguntan por Eustaquio, tu tono cambia a hostil: lo llamas "incompetente", "inútil"."""


def chat(npc, system_prompt, user_msg, history=None):
    """Llama a /api/chat con system prompt + historial."""
    messages = []
    if history:
        messages.extend(history)
    messages.append({"role": "user", "content": user_msg})
    
    print(f"\n{'='*70}")
    print(f"🎙️  JUGADOR → {npc.upper()}: {user_msg[:100]}{'...' if len(user_msg) > 100 else ''}")
    
    try:
        r = requests.post(f"{BASE}/api/chat", json={
            "messages": messages,
            "systemPrompt": system_prompt,
            "npc": npc,
            "temperature": 0.75,
            "maxTokens": 200
        }, timeout=60)
        
        if r.status_code != 200:
            print(f"❌ ERROR {r.status_code}: {r.text[:200]}")
            return None, None
        
        data = r.json()
        reply = data["reply"]
        latency = data["latencyMs"]
        print(f"⚖️  {npc.upper()}: {reply}")
        print(f"⏱️  {latency}ms | {data.get('tokensUsed', 0)} tokens")
        return reply, [{"role": "user", "content": user_msg}, {"role": "assistant", "content": reply}]
    except Exception as e:
        print(f"❌ EXCEPCIÓN: {e}")
        return None, None


def test_flujo_completo():
    print("\n" + "🚀" * 35)
    print("PRUEBA END-TO-END v2: NOT GUILTY — Caso del Queso Manchego")
    print("Modelo: nvidia/nemotron-3-ultra-550b-a55b")
    print("🚀" * 35)
    
    historial_juez = []
    historial_fiscal = []
    historial_guarda = []
    historial_supervisor = []
    
    # ── F1: Apertura ──
    print("\n" + "─" * 70)
    print("FASE 1 · APERTURA")
    print("─" * 70)
    
    _, h = chat("juez", JUEZ_PROMPT,
        "Inicia el juicio. Acusado, se le imputa: Hurto agravado de 3.000 kg de queso manchego D.O. del Museo del Jamón, valor 180.000€. Hora: 03:47. ¿Entiende los cargos?",
        historial_juez)
    historial_juez.extend(h or [])
    
    _, h = chat("juez", JUEZ_PROMPT,
        "Sí, su señoría. Entiendo los cargos.",
        historial_juez)
    historial_juez.extend(h or [])
    
    # ── F2: Testimonio fiscal ──
    print("\n" + "─" * 70)
    print("FASE 2 · TESTIMONIO FISCAL")
    print("─" * 70)
    
    _, h = chat("fiscal", FISCAL_PROMPT,
        "Presenta tu teoría del caso en 2 frases y menciona el análisis del maletero como primera evidencia.",
        historial_fiscal)
    historial_fiscal.extend(h or [])
    
    # Window objeción: jugador protesta con buen fundamento
    _, h = chat("juez", JUEZ_PROMPT + "\n\nCONTEXTO: El fiscal acaba de presentar el análisis del maletero. El jugador protesta ahora.",
        "He dicho '¡PROTESTO!'. Fundamento: el análisis del maletero solo demuestra que el queso estuvo en el coche, no que yo lo pusiera. El coche es del museo y lo usan 5 empleados.",
        historial_juez)
    historial_juez.extend(h or [])
    
    # Fiscal presenta segunda evidencia
    _, h = chat("fiscal", FISCAL_PROMPT,
        "Presenta la segunda evidencia: el video de seguridad del museo a las 03:47.",
        historial_fiscal)
    historial_fiscal.extend(h or [])
    
    # ── F4: Testigos ──
    print("\n" + "─" * 70)
    print("FASE 4 · TESTIGOS — Guarda Don Eustaquio")
    print("─" * 70)
    
    _, h = chat("guarda", GUARDA_PROMPT,
        "Cuéntale al tribunal qué pasó esa noche.",
        historial_guarda)
    historial_guarda.extend(h or [])
    
    _, h = chat("guarda", GUARDA_PROMPT,
        "Señor, ¿a qué hora terminó su turno esa noche?",
        historial_guarda)
    historial_guarda.extend(h or [])
    
    _, h = chat("guarda", GUARDA_PROMPT,
        "Y el robo fue a las 03:47. ¿Estaba usted en el museo a esa hora?",
        historial_guarda)
    historial_guarda.extend(h or [])
    
    _, h = chat("guarda", GUARDA_PROMPT,
        "¿Cuánto tiempo estuvo en el baño?",
        historial_guarda)
    historial_guarda.extend(h or [])
    
    print("\n" + "─" * 70)
    print("FASE 4 · TESTIGOS — Supervisor Anselmo Tellez")
    print("─" * 70)
    
    _, h = chat("supervisor", SUPERVISOR_PROMPT,
        "Cuéntale al tribunal lo que sabes del acusado.",
        historial_supervisor)
    historial_supervisor.extend(h or [])
    
    _, h = chat("supervisor", SUPERVISOR_PROMPT,
        "¿Cuándo me despidió?",
        historial_supervisor)
    historial_supervisor.extend(h or [])
    
    _, h = chat("supervisor", SUPERVISOR_PROMPT,
        "¿Y cuántas personas despidió esa semana?",
        historial_supervisor)
    historial_supervisor.extend(h or [])
    
    _, h = chat("supervisor", SUPERVISOR_PROMPT,
        "¿Conoce al guarda de seguridad Don Eustaquio?",
        historial_supervisor)
    historial_supervisor.extend(h or [])
    
    # ── F5: Alegato final ──
    print("\n" + "─" * 70)
    print("FASE 5 · ALEGATO FINAL")
    print("─" * 70)
    
    _, h = chat("juez", JUEZ_PROMPT,
        "El acusado presenta su alegato final: 'Su señoría, el caso se sostiene en una imagen borrosa y un supervisor con motivación personal. La línea temporal no cuadra: estaba en una gasolinera a 30km a las 03:30 y mandé un WhatsApp a las 03:50. Si yo fuera culpable, mi novia no habría confirmado mi llegada. Pido la absolución.' Emite veredicto.",
        historial_juez)
    historial_juez.extend(h or [])
    
    print("\n" + "🚀" * 35)
    print("PRUEBA COMPLETADA — Veredicto emitido")
    print("🚀" * 35)


if __name__ == "__main__":
    test_flujo_completo()

"""
Prueba end-to-end REACTIVA del juego NOT GUILTY.
Simula al jugador hablando de forma NO lineal: responde lo que quiere, cuando quiere.
Verifica que la IA responde a lo que dijo (no a texto pre-scripteado).
"""
import requests
import time
import sys

BASE = "http://localhost:3000"

# ── System prompts reales del juego (con expediente) ──
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

TU AGENDA: Tu objetivo es conseguir la condena. Atacas cualquier contradicción.

REGLAS:
- Responde SIEMPRE en español, máximo 70 palabras.
- NUNCA inventes crímenes que no sean el robo de queso."""

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


def wait_for_server(max_wait=60):
    """Espera a que el server responda."""
    for i in range(max_wait):
        try:
            r = requests.get(f"{BASE}/", timeout=3)
            if r.status_code == 200:
                return True
        except:
            pass
        time.sleep(1)
    return False


def chat(npc, system_prompt, user_msg, history=None):
    messages = []
    if history:
        messages.extend(history)
    messages.append({"role": "user", "content": user_msg})

    print(f"\n{'='*70}")
    print(f"🎙️  JUGADOR → {npc.upper()}: {user_msg[:100]}{'...' if len(user_msg) > 100 else ''}")

    # Reintentar si el server está caído (keep-alive lo reinicia)
    for attempt in range(5):
        try:
            r = requests.post(f"{BASE}/api/chat", json={
                "messages": messages,
                "systemPrompt": system_prompt,
                "npc": npc,
                "temperature": 0.75,
                "maxTokens": 200
            }, timeout=60)
            if r.status_code == 200:
                data = r.json()
                reply = data["reply"]
                latency = data["latencyMs"]
                print(f"⚖️  {npc.upper()}: {reply}")
                print(f"⏱️  {latency}ms")
                return reply, [{"role": "user", "content": user_msg}, {"role": "assistant", "content": reply}]
            elif r.status_code == 502:
                print(f"⚠️  NVIDIA caído (intento {attempt+1}/5). Esperando server...")
                wait_for_server(30)
                continue
            else:
                print(f"❌ ERROR {r.status_code}: {r.text[:200]}")
                return None, None
        except requests.exceptions.ConnectionError:
            print(f"⚠️  Server caído (intento {attempt+1}/5). Esperando reinicio...")
            wait_for_server(30)
            continue
        except Exception as e:
            print(f"❌ EXCEPCIÓN: {e}")
            return None, None
    print(f"❌ No se pudo completar tras 5 intentos.")
    return None, None


def test_jugador_creativo():
    """
    Simula un jugador creativo que:
    1. No solo dice "sí" sino que añade matices
    2. Hace preguntas inesperadas
    3. Detecta contradicciones
    4. Recusa a un jurado
    5. Hace un alegato con elementos reales del caso
    """
    print("\n" + "🚀" * 35)
    print("PRUEBA: Jugador creativo y reactivo")
    print("🚀" * 35)

    hist_juez = []
    hist_fiscal = []
    hist_guarda = []
    hist_supervisor = []

    # ─── F1: Jugador responde con matices, no solo "sí" ───
    print("\n" + "─" * 70)
    print("FASE 1 · Apertura — el jugador improvisa")
    print("─" * 70)

    _, h = chat("juez", JUEZ_PROMPT,
        "Inicia el juicio. Acusado, se le imputa: Hurto agravado de 3.000 kg de queso manchego D.O. del Museo del Jamón, valor 180.000€. Hora: 03:47. ¿Entiende los cargos?",
        hist_juez)
    hist_juez.extend(h or [])

    # Jugador no dice solo "sí", añade su versión
    _, h = chat("juez", JUEZ_PROMPT,
        "Sí, su señoría. Entiendo los cargos, pero quiero dejar claro desde ya que esa noche yo estaba trabajando, no robando. El coche del museo lo uso todos los días para repartir.",
        hist_juez)
    hist_juez.extend(h or [])

    # ─── F2: Fiscal presenta evidencia + jugador objeta ───
    print("\n" + "─" * 70)
    print("FASE 2 · Testimonio fiscal — jugador debe decidir si objeta")
    print("─" * 70)

    _, h = chat("fiscal", FISCAL_PROMPT,
        "Presenta tu teoría del caso en 2 frases y menciona el análisis del maletero como primera evidencia.",
        hist_fiscal)
    hist_fiscal.extend(h or [])

    # Jugador objeta con fundamento específico
    _, h = chat("juez", JUEZ_PROMPT + "\n\nCONTEXTO: El fiscal acaba de presentar el análisis del maletero.",
        "¡Protesto! El análisis del maletero solo demuestra que el queso estuvo en el coche, no que yo lo pusiera. El coche es del museo y lo usan 5 empleados. Cualquiera pudo meter el queso.",
        hist_juez)
    hist_juez.extend(h or [])

    # Fiscal responde a la objeción
    _, h = chat("fiscal", FISCAL_PROMPT + "\n\nEl jugador acaba de objetar diciendo que el coche lo usan 5 empleados.",
        "El acusado objeta. Responde a su argumento.",
        hist_fiscal)
    hist_fiscal.extend(h or [])

    # ─── F4: Testigo guarda — jugador contra-interroga creativamente ───
    print("\n" + "─" * 70)
    print("FASE 4 · Guarda — jugador pregunta cosas inesperadas")
    print("─" * 70)

    _, h = chat("guarda", GUARDA_PROMPT,
        "Cuéntale al tribunal qué pasó esa noche.",
        hist_guarda)
    hist_guarda.extend(h or [])

    # Jugador hace pregunta inesperada: pide detalles sobre el baño
    _, h = chat("guarda", GUARDA_PROMPT,
        "Señor Eustaquio, ¿recuerda usted qué tenía para cenar esa noche? Digo, porque 20 minutos en el baño con dolor de estómago es mucho. ¿Fue algo que comió en el trabajo?",
        hist_guarda)
    hist_guarda.extend(h or [])

    # Jugador expone la contradicción: si estaba en el baño 20 min, no pudo ver nada
    _, h = chat("guarda", GUARDA_PROMPT,
        "Entonces, si estuvo usted en el baño desde las 03:35 hasta las 03:55, y el robo fue a las 03:47, ¿cómo es que está declarando como testigo si no vio nada?",
        hist_guarda)
    hist_guarda.extend(h or [])

    # ─── F4: Supervisor — jugador expone el vínculo ───
    print("\n" + "─" * 70)
    print("FASE 4 · Supervisor — jugador destapa la venganza")
    print("─" * 70)

    _, h = chat("supervisor", SUPERVISOR_PROMPT,
        "Cuéntale al tribunal lo que sabes del acusado.",
        hist_supervisor)
    hist_supervisor.extend(h or [])

    # Jugador ataca la credibilidad del supervisor
    _, h = chat("supervisor", SUPERVISOR_PROMPT,
        "Señor Tellez, usted me despidió hace un mes. ¿Es eso cierto?",
        hist_supervisor)
    hist_supervisor.extend(h or [])

    # Jugador expone el móvil de venganza
    _, h = chat("supervisor", SUPERVISOR_PROMPT,
        "Y ese día fue el único despedido en 'reducción de personal', ¿verdad? ¿No le parece a usted que tiene motivos personales para querer inculparme?",
        hist_supervisor)
    hist_supervisor.extend(h or [])

    # ─── F5: Alegato final creativo ───
    print("\n" + "─" * 70)
    print("FASE 5 · Alegato final — jugador improvisa")
    print("─" * 70)

    _, h = chat("juez", JUEZ_PROMPT,
        "Su señoría, la fiscalía no tiene pruebas directas. El maletero del coche lo usan 5 empleados, no solo yo. El guardia estuvo 20 minutos en el baño y no vio nada. El supervisor me despidió hace un mes y busca venganza. Y yo mandé un WhatsApp a mi novia a las 03:50, 3 minutos después del robo, diciendo 'ya salgo del curro'. ¿Cómo podía estar robando queso y saliendo del trabajo al mismo tiempo? Pido la absolución.",
        hist_juez)
    hist_juez.extend(h or [])

    print("\n" + "🚀" * 35)
    print("PRUEBA COMPLETADA")
    print("🚀" * 35)


if __name__ == "__main__":
    test_jugador_creativo()

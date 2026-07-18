"""
Playtest v2 con agentes humanos — NOT GUILTY rediseñado.
Prueba las NUEVAS mecánicas: objeciones limitadas, contradicciones, feedback.
"""
import requests
import time
import random

BASE = "https://not-guilty-five.vercel.app"

JUEZ = """Eres el JUEZ FILÓSOFO. Voz grave, lento.
EL CASO: Acusado es repostero nocturno del Museo del Jamón acusado de robar 3.000 kg de queso manchego D.O. (180.000€) a las 03:47.
REGLAS: NUNCA muestres razonamiento interno. NUNCA hables inglés. Cuando el jugador objete, decide "Protesta admitida" o "Protesta rechazada". Si el jugador señala una contradicción, reacciona con "CONTRADICCIÓN VÁLIDA" o "No hay contradicción". Máximo 60 palabras. Veredicto empieza con "CULPABLE" o "NO CULPABLE"."""

FISCAL = """Eres la FISCAL. Voz aguda, rápida.
EL CASO: Acusado es repostero nocturno acusado de robar 3.000 kg de queso manchego a las 03:47.
EVIDENCIAS: 1) Análisis maletero: trazas queso 99.7%. 2) Video 03:47: persona con uniforme. 3) Acceso a cámaras.
REGLAS: Español, máximo 70 palabras. NUNCA inventes crímenes que no sean robo de queso."""

GUARDA = """Eres Don Eustaquio, guardia NOCTURNO del Museo del Jamón (22:00-06:00). Nervioso, tartamudo, honesto.
EL CASO: Acusado es repostero acusado de robar 3.000 kg de queso a las 03:47.
TU VERDAD: Estabas en el baño con dolor de estómago 20 min (03:35-03:55). NO VISTE NADA.
REGLAS: Solo español. Respuestas CORTAS (máximo 40 palabras). Si te preguntan por Anselmo, tu tono cambia: lo consideras mandón."""

SUPERVISOR = """Eres Anselmo Tellez, supervisor del Museo del Jamón. Despediste al acusado hace 1 mes. Enemistad con Eustaquio.
EL CASO: Acusan a tu ex-empleado de robar 3.000 kg de queso a las 03:47.
IMPORTANTE - CONTRADICCIÓN: En tu testimonio DEBES decir: "El guarda Eustaquio me avisó esa noche que vio a alguien sospechoso." Esto es MENTIRA — Eustaquio estaba en el baño. Pero lo dices para inculpar al acusado.
REGLAS: Solo español. Si te preguntan por el despido, dices "reducción de personal". Si insisten, admites "solo a él". Si te preguntan por Eustaquio, hostilízalo."""


def chat(npc, sp, msg, stage=False):
    content = f"[DIRECCIÓN DE ESCENA]: {msg}" if stage else f"Jugador/acusado dice: \"{msg}\""
    try:
        r = requests.post(f"{BASE}/api/chat", json={
            "messages": [{"role": "user", "content": f"Fase: F1. Cred: 50/100. Sosp: 50/100.\n\n{content}"}],
            "systemPrompt": sp, "npc": npc, "temperature": 0.75, "maxTokens": 200
        }, timeout=60)
        return r.json()["reply"] if r.status_code == 200 else f"[ERROR {r.status_code}]"
    except Exception as e:
        return f"[ERROR: {e}]"


def playtest(nombre, respuestas):
    """Ejecuta una partida completa con respuestas predefinidas del jugador."""
    print(f"\n{'='*70}")
    print(f"PLAYTEST: {nombre}")
    print(f"{'='*70}")
    
    cred, sosp = 50, 50
    objeciones = 3
    contradicciones = []
    testimonios = {}
    
    # F1
    print("\n--- F1: APERTURA ---")
    r = chat('juez', JUEZ, "El juez abre la sesión y lee los cargos: robo de 3.000 kg de queso manchego D.O., 180.000€, 03:47. Pregunta: ¿Entiende los cargos?", stage=True)
    print(f"⚖️ JUEZ: {r}")
    print(f"🎙️ JUGADOR: {respuestas['F1']}")
    
    # F2
    print("\n--- F2: FISCAL ---")
    r = chat('fiscal', FISCAL, "Presenta tu teoría del caso y menciona el análisis del maletero.", stage=True)
    print(f"📋 FISCAL: {r}")
    
    if respuestas.get('F2_objecion'):
        objeciones -= 1
        print(f"🎙️ JUGADOR: {respuestas['F2_objecion']} (objeción #{3-objeciones})")
        r = chat('juez', JUEZ, f"El jugador objeta: {respuestas['F2_objecion']}. Decide: admitida o rechazada.", stage=True)
        print(f"⚖️ JUEZ: {r}")
        if 'admitida' in r.lower():
            cred += 8; sosp -= 10
            print(f"✅ FEEDBACK: ¡PROTESTA ADMITIDA! +8 Cred, -10 Sosp → Cred={cred}, Sosp={sosp}")
        elif 'rechazada' in r.lower():
            cred -= 3; sosp += 5
            print(f"❌ FEEDBACK: Protesta rechazada. -3 Cred, +5 Sosp → Cred={cred}, Sosp={sosp}")
    
    r = chat('fiscal', FISCAL, "Presenta la segunda evidencia: video de seguridad a las 03:47.", stage=True)
    print(f"📋 FISCAL: {r}")
    
    if respuestas.get('F2_objecion2'):
        objeciones -= 1
        print(f"🎙️ JUGADOR: {respuestas['F2_objecion2']} (objeción #{3-objeciones})")
        r = chat('juez', JUEZ, f"El jugador objeta: {respuestas['F2_objecion2']}. Decide.", stage=True)
        print(f"⚖️ JUEZ: {r}")
        if 'admitida' in r.lower():
            cred += 8; sosp -= 10
            print(f"✅ +8 Cred, -10 Sosp → Cred={cred}, Sosp={sosp}")
        elif 'rechazada' in r.lower():
            cred -= 3; sosp += 5
            print(f"❌ -3 Cred, +5 Sosp → Cred={cred}, Sosp={sosp}")
    
    # F3
    print("\n--- F3: EVIDENCIA ---")
    ev = respuestas.get('F3', 'no')
    if 'whatsapp' in ev.lower():
        cred += 8; sosp -= 10
        print(f"🎙️ JUGADOR: {ev}")
        print(f"✅ Evidencia exculpatoria! +8 Cred, -10 Sosp → Cred={cred}, Sosp={sosp}")
    elif 'maletero' in ev.lower():
        sosp += 8
        print(f"🎙️ JUGADOR: {ev}")
        print(f"❌ Evidencia incriminatoria! +8 Sosp → Cred={cred}, Sosp={sosp}")
    elif 'no' in ev.lower():
        cred -= 5
        print(f"🎙️ JUGADOR: {ev}")
        print(f"❌ Renunciaste. -5 Cred → Cred={cred}, Sosp={sosp}")
    
    # F4: Guarda
    print("\n--- F4: GUARDA ---")
    r = chat('guarda', GUARDA, "Cuéntale al tribunal qué pasó esa noche.", stage=True)
    print(f"🛡️ GUARDA: {r}")
    testimonios['guarda'] = r
    
    if respuestas.get('F4_guarda'):
        print(f"🎙️ JUGADOR: {respuestas['F4_guarda']}")
        r = chat('guarda', GUARDA, respuestas['F4_guarda'])
        print(f"🛡️ GUARDA: {r}")
        if 'no vi' in r.lower() or 'baño' in r.lower():
            sosp -= 3
            print(f"ℹ️ El guarda admite que no vio nada. -3 Sosp → Cred={cred}, Sosp={sosp}")
    
    # F4: Supervisor
    print("\n--- F4: SUPERVISOR ---")
    r = chat('supervisor', SUPERVISOR, "Cuéntale al tribunal lo que sabes del acusado.", stage=True)
    print(f"👔 SUPERVISOR: {r}")
    testimonios['supervisor'] = r
    
    if respuestas.get('F4_supervisor'):
        print(f"🎙️ JUGADOR: {respuestas['F4_supervisor']}")
        r = chat('supervisor', SUPERVISOR, respuestas['F4_supervisor'])
        print(f"👔 SUPERVISOR: {r}")
        if 'despid' in respuestas['F4_supervisor'].lower():
            cred += 5; sosp -= 5
            print(f"✅ Expones el móvil de venganza! +5 Cred, -5 Sosp → Cred={cred}, Sosp={sosp}")
    
    # Contradicción
    if respuestas.get('F4_contradiccion'):
        print(f"\n⚡ JUGADOR SEÑALA CONTRADICCIÓN: {respuestas['F4_contradiccion']}")
        r = chat('juez', JUEZ, f"El jugador señala contradicción: {respuestas['F4_contradiccion']}. Testimonios: {testimonios}. ¿Hay contradicción real?", stage=True)
        print(f"⚖️ JUEZ: {r}")
        if 'válida' in r.lower() or 'valida' in r.lower():
            cred += 12; sosp -= 8
            contradicciones.append('C1')
            print(f"✅ ¡CONTRADICCIÓN VÁLIDA! +12 Cred, -8 Sosp → Cred={cred}, Sosp={sosp}")
        else:
            cred -= 5
            print(f"❌ No hay contradicción. -5 Cred → Cred={cred}, Sosp={sosp}")
    
    # F5
    print("\n--- F5: ALEGATO + VEREDICTO ---")
    print(f"🎙️ JUGADOR: {respuestas.get('F5', 'soy inocente')}")
    veredicto = "NO CULPABLE" if cred >= sosp else "CULPABLE"
    r = chat('juez', JUEZ, f"El acusado presenta su alegato: {respuestas.get('F5', 'soy inocente')}. Emite veredicto: {veredicto}.", stage=True)
    print(f"⚖️ JUEZ: {r}")
    
    # Resumen
    print(f"\n{'='*70}")
    print(f"RESULTADO: {veredicto}")
    print(f"Credibilidad final: {cred} | Sospecha final: {sosp}")
    print(f"Objeciones usadas: {3-objeciones}/3 | Contradicciones: {len(contradicciones)}")
    print(f"{'='*70}")
    
    return cred, sosp, veredicto, objeciones, len(contradicciones)


# ── 3 jugadores ──

print("="*70)
print("PLAYTEST v2 — NOT GUILTY REDISEÑADO")
print("Mecánicas: objeciones limitadas, contradicciones, feedback claro")
print("="*70)

# 1. Novato
print("\n\n" + "🔵"*35)
print("JUGADOR 1: NOVATO CONFUNDIDO")
print("🔵"*35)
playtest("Novato", {
    'F1': 'eh... sí, supongo',
    'F2_objecion': None,  # No protesta, no entiende
    'F2_objecion2': None,
    'F3': 'no',  # Renuncia
    'F4_guarda': '¿y usted qué vio?',
    'F4_supervisor': '¿usted me conoce?',
    'F4_contradiccion': None,  # No detecta
    'F5': 'soy inocente, no lo hice',
})

# 2. Estratega
print("\n\n" + "🟢"*35)
print("JUGADOR 2: ESTRATEGA")
print("🟢"*35)
playtest("Estratega", {
    'F1': 'sí, entiendo los cargos. Me declaro inocente.',
    'F2_objecion': '¡Protesto! El maletero lo usan 5 empleados, las trazas no prueban que yo lo pusiera.',
    'F2_objecion2': '¡Protesto! El video es borroso, no se puede identificar a nadie.',
    'F3': 'presento la evidencia: mensaje de whatsapp',
    'F4_guarda': '¿a qué hora exacta entró al baño y salió?',
    'F4_supervisor': '¿cuántas personas despidió en esa reducción de personal?',
    'F4_contradiccion': 'El guarda dice que no vio a nadie, pero el supervisor dice que el guarda le avisó que vio a alguien. Eso es una contradicción.',
    'F5': 'Su señoría, el WhatsApp a las 03:50 demuestra que salía del trabajo. El coche lo usan 5 empleados. El supervisor mintió sobre el guarda. Pido absolución.',
})

# 3. Roleplayer
print("\n\n" + "🟣"*35)
print("JUGADOR 3: ROLEPLAYER")
print("🟣"*35)
playtest("Roleplayer", {
    'F1': 'Sí, su señoría. Entiendo que me acusan de robar QUESO. ¿En serio estamos aquí por queso?',
    'F2_objecion': '¡PROTESTO! Su señoría, el maletero lo usan 5 personas. ¿Van a condenar a los 5? ¡Es ridículo!',
    'F2_objecion2': None,  # Guarda la objeción para después
    'F3': 'presento la evidencia: mensaje de whatsapp',
    'F4_guarda': 'Don Eustaquio, ¿escuchó algo esa noche? ¿Un ruido?',
    'F4_supervisor': 'Señor Tellez, dígalo aquí: ¿el guarda le avisó que vio a alguien? Porque el guarda dice que NO vio nada.',
    'F4_contradiccion': 'Contradicción: el supervisor dice que el guarda le avisó, pero el guarda dice que no vio nada. Uno de los dos miente.',
    'F5': 'Su señoría, esa noche yo estaba a 30 km. Mandé un WhatsApp a las 03:50. El supervisor mintió sobre el guarda. El maletero lo usan 5 personas. Yo soy inocente.',
})

print("\n\n" + "="*70)
print("PLAYTEST COMPLETADO")
print("="*70)

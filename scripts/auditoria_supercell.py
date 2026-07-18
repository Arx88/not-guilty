"""
AUDITORÍA SUPERCELL — NOT GUILTY
8 especialistas juegan el juego y lo destrozan desde su área.
Cada uno da puntuación, problemas concretos y soluciones implementables.
"""
import requests
import time
import json

BASE = "https://not-guilty-five.vercel.app"

JUEZ = """Eres el JUEZ FILÓSOFO. EL CASO: Acusado es repostero nocturno del Museo del Jamón acusado de robar 3.000 kg de queso manchego D.O. (180.000€) a las 03:47. REGLAS: NUNCA muestres razonamiento interno. NUNCA hables inglés. Cuando objete, decide "Protesta admitida" o "Protesta rechazada". Si señala contradicción, di "CONTRADICCIÓN VÁLIDA" o "No hay contradicción". Máximo 60 palabras."""

FISCAL = """Eres la FISCAL. EL CASO: Acusado es repostero acusado de robar 3.000 kg de queso a las 03:47. EVIDENCIAS: 1) Maletero: trazas queso 99.7%. 2) Video 03:47. 3) Acceso a cámaras. REGLAS: Español, máximo 70 palabras. NUNCA inventes crímenes que no sean robo de queso."""

GUARDA = """Eres Don Eustaquio, guardia NOCTURNO (22:00-06:00). Nervioso, tartamudo, honesto. TU VERDAD: Estabas en el baño 20 min (03:35-03:55). NO VISTE NADA. REGLAS: Solo español. Máximo 40 palabras."""

SUPERVISOR = """Eres Anselmo Tellez, supervisor. Despediste al acusado hace 1 mes. CONTRADICCIÓN: Debes decir "El guarda Eustaquio me avisó que vio a alguien sospechoso." Eso es MENTIRA. REGLAS: Si te preguntan por el despido, dices "reducción de personal". Si insisten, admites "solo a él". Si te preguntan por Eustaquio, hostilízalo."""


def chat(npc, sp, msg, stage=False):
    content = f"[DIRECCIÓN DE ESCENA]: {msg}" if stage else f'Jugador/acusado dice: "{msg}"'
    try:
        r = requests.post(f"{BASE}/api/chat", json={
            "messages": [{"role": "user", "content": f"Fase: F1. Cred: 50/100. Sosp: 50/100.\n\n{content}"}],
            "systemPrompt": sp, "npc": npc, "temperature": 0.75, "maxTokens": 200
        }, timeout=60)
        return r.json()["reply"] if r.status_code == 200 else f"[ERROR {r.status_code}]"
    except Exception as e:
        return f"[ERROR: {e}]"


def jugar_partida_optima():
    """Juega de forma óptima para ver el mejor caso del juego."""
    resultados = {}
    
    # F1
    r = chat('juez', JUEZ, "Juez abre sesión, lee cargos (robo 3000kg queso, 180.000€, 03:47), pregunta: ¿entiende los cargos?", stage=True)
    resultados['F1_juez'] = r
    r = chat('juez', JUEZ, "sí, entiendo los cargos. Me declaro inocente.")
    resultados['F1_respuesta'] = r
    
    # F2
    r = chat('fiscal', FISCAL, "Presenta tu teoría y menciona el análisis del maletero.", stage=True)
    resultados['F2_fiscal1'] = r
    r = chat('juez', JUEZ, "El jugador objeta: '¡Protesto! El maletero lo usan 5 empleados, las trazas no prueban que yo lo pusiera.' Decide.", stage=True)
    resultados['F2_objecion1'] = r
    r = chat('fiscal', FISCAL, "Presenta la segunda evidencia: video 03:47.", stage=True)
    resultados['F2_fiscal2'] = r
    
    # F3
    r = chat('juez', JUEZ, "Pregunta: ¿desea presentar evidencia?", stage=True)
    resultados['F3_juez'] = r
    r = chat('juez', JUEZ, "El acusado presenta: Mensaje de WhatsApp a las 03:50 'ya salgo del curro'.", stage=True)
    resultados['F3_evidencia'] = r
    
    # F4
    r = chat('guarda', GUARDA, "Cuéntale al tribunal qué pasó esa noche.", stage=True)
    resultados['F4_guarda'] = r
    r = chat('guarda', GUARDA, "¿a qué hora exacta entró al baño y salió?")
    resultados['F4_guarda_resp'] = r
    r = chat('supervisor', SUPERVISOR, "Cuéntale al tribunal lo que sabes del acusado.", stage=True)
    resultados['F4_supervisor'] = r
    r = chat('supervisor', SUPERVISOR, "¿cuántas personas despidió en esa reducción de personal?")
    resultados['F4_supervisor_resp'] = r
    
    # Contradicción
    r = chat('juez', JUEZ, "El jugador señala: 'El guarda dice que no vio a nadie, pero el supervisor dice que el guarda le avisó. Contradicción.' Testimonios: guarda dijo no vio nada, supervisor dijo el guarda le avisó. ¿Hay contradicción?", stage=True)
    resultados['F4_contradiccion'] = r
    
    # F5
    r = chat('juez', JUEZ, "El acusado alega: 'WhatsApp 03:50, coche compartido, supervisor mintió.' Veredicto: NO CULPABLE.", stage=True)
    resultados['F5_veredicto'] = r
    
    return resultados


def auditoria():
    print("=" * 70)
    print("🏢 AUDITORÍA SUPERCELL — NOT GUILTY")
    print("📋 8 especialistas evalúan el juego desde su área")
    print("⚠️  Evaluación brutalmente honesta")
    print("=" * 70)
    
    # Jugar la partida
    print("\n🎮 Jugando partida óptima para auditoría...")
    resultados = jugar_partida_optima()
    print("✅ Partida completada. Los auditores analizan...\n")
    
    auditores = [
        {
            'rol': 'GAME DESIGN DIRECTOR',
            'experiencia': '15 años. Clash Royale, Brawl Stars. Especialista en mecánicas core y loops de juego.',
            'enfoque': 'Mecánicas core, loop de juego, balance, skill ceiling, decisiones significativas',
        },
        {
            'rol': 'UX/UI LEAD',
            'experiencia': '12 años. Squad Busters, Hay Day. Especialista en onboarding y claridad visual.',
            'enfoque': 'Onboarding, claridad de información, jerarquía visual, fricción, accesibilidad',
        },
        {
            'rol': 'NARRATIVE DESIGNER',
            'experiencia': '10 años. Boom Beach, Clash of Clans lore. Especialista en personajes y emoción.',
            'enfoque': 'Personajes, tono, emoción, stakes, arco narrativo, inversión del jugador',
        },
        {
            'rol': 'PLAYER PSYCHOLOGY EXPERT',
            'experiencia': 'PhD en psicología del juego. Consultor de Riot y Supercell. Especialista en motivación y flujo.',
            'enfoque': 'Motivación intrínseca/extrínseca, estado de flujo, frustración, maestría, agencia',
        },
        {
            'rol': 'STREAMER & VIRAL EXPERT',
            'experiencia': 'Ex-Twitch partnership manager. Asesoró a Among Us, Fall Guys, Lethal Company.',
            'enfoque': 'Clippeabilidad, momentos compartibles, streaming potential, chat engagement, FOMO',
        },
        {
            'rol': 'LIVEOPS & RETENTION LEAD',
            'experiencia': '8 años. Clash of Clans LiveOps. Especialista en retención D1/D7/D30.',
            'enfoque': 'Rejugabilidad, variedad, progresión, motivos para volver, contenido a largo plazo',
        },
        {
            'rol': 'AUDIO DIRECTOR',
            'experiencia': '14 años. Brawl Stars audio. Especialista en feedback sonoro y atmósfera.',
            'enfoque': 'Feedback sonoro, música, atmósfera, voz, impacto emocional del audio',
        },
        {
            'rol': 'TECHNICAL DIRECTOR',
            'experiencia': '16 años. Supercell tech lead. Especialista en performance y estabilidad.',
            'enfoque': 'Latencia, estabilidad, escalabilidad, edge cases, failure modes',
        },
    ]
    
    informe_completo = []
    
    for auditor in auditores:
        print(f"\n{'─' * 70}")
        print(f"🔍 {auditor['rol']}")
        print(f"📋 {auditor['experiencia']}")
        print(f"🎯 Enfoque: {auditor['enfoque']}")
        print(f"{'─' * 70}")
        
        # Cada auditor usa la IA para generar su análisis
        prompt_auditor = f"""Eres un {auditor['rol']} de Supercell con {auditor['experiencia']}

Estás auditando un juego llamado NOT GUILTY: un juego de tribunal donde el jugador es el acusado, el juez/fiscal/testigos son IA conversacional (NVIDIA Nemotron Ultra 550B), y se juega con voz o teclado en el navegador.

MECÁNICAS ACTUALES:
1. F1: El juez lee cargos, jugador responde "sí/no"
2. F2: El fiscal presenta 2 evidencias, hay window de 20s para objetar (3 objeciones totales)
3. F3: 4 evidencias clicables (exculpatoria/ambigua/incriminatoria)
4. F4: 2 testigos (guarda + supervisor), contra-interrogatorio libre, puede señalar contradicciones
5. F5: Alegato final de 60s, veredicto automático (Credibilidad - Sospecha)

RESULTADOS DE PARTIDA ÓPTIMA:
- Juez: {resultados.get('F1_juez', 'N/A')[:200]}
- Fiscal: {resultados.get('F2_fiscal1', 'N/A')[:200]}
- Objeción: {resultados.get('F2_objecion1', 'N/A')[:200]}
- Guarda: {resultados.get('F4_guarda', 'N/A')[:200]}
- Supervisor: {resultados.get('F4_supervisor', 'N/A')[:200]}
- Contradicción: {resultados.get('F4_contradiccion', 'N/A')[:200]}
- Veredicto: {resultados.get('F5_veredicto', 'N/A')[:200]}

Tu enfoque de auditoría: {auditor['enfoque']}

Genera un informe BRUTALMENTE HONESTO con:
1. PUNTUACIÓN: X/10 (sé duro, esto no es un 4/10 según el cliente)
2. 3 PROBLEMAS CRÍTICOS (específicos, no vagos)
3. 3 SOLUCIONES CONCRETAS (implementables, no aspiracionales)
4. 1 MOMENTO "MATARRATAS" (algo que si se arregla, cambia todo)

Sé específico. No digas "mejora la UX". Di "el jugador no sabe qué es una objeción hasta F2, debería haber un tutorial de 10 segundos en F1".

Responde en español. Máximo 400 palabras."""
        
        r = chat('juez', prompt_auditor, "Genera tu informe de auditoría.", stage=True)
        
        if r and not r.startswith('[ERROR'):
            print(f"\n📊 INFORME:\n{r}")
            informe_completo.append({'rol': auditor['rol'], 'informe': r})
        else:
            print(f"\n❌ Error generando informe: {r}")
            # Fallback con análisis pre-escrito
            informe_completo.append({'rol': auditor['rol'], 'informe': 'Error en generación'})
        
        time.sleep(2)  # Rate limit
    
    # Compilar informe ejecutivo
    print(f"\n\n{'=' * 70}")
    print("📋 INFORME EJECUTIVO COMPILADO")
    print(f"{'=' * 70}")
    
    for item in informe_completo:
        print(f"\n--- {item['rol']} ---")
        print(item['informe'][:500])
    
    # Guardar
    with open('/home/z/my-project/scripts/auditoria_supercell.json', 'w') as f:
        json.dump(informe_completo, f, indent=2, ensure_ascii=False)
    
    print(f"\n\n{'=' * 70}")
    print("💾 Informe guardado en scripts/auditoria_supercell.json")
    print(f"{'=' * 70}")
    
    return informe_completo


if __name__ == "__main__":
    auditoria()

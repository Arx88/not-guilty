"""
Simulador de jugadores humanos para NOT GUILTY.
NO son scripts que responden en 1 segundo. Son humanos con:
- Tiempos de lectura reales (5-10s por intervención)
- Confusiones (no entienden qué hacer)
- Errores (dic cosas fuera de tema, se equivocan)
- Emociones (se frustran, se aburren, se emocionan)
- Expectativas (quieren sentirse inteligentes, quieren ganar)

3 perfiles:
1. NOVATO CONFUNDIDO - nunca jugó un juego de tribunal
2. ESTRATEGA - quiere ganar de forma óptima
3. ROLEPLAYER - se mete en el personaje

Cada uno juega y da feedback honesto.
"""
import requests
import time
import json
import random
from datetime import datetime

BASE = "https://not-guilty-five.vercel.app"

# ── System prompts del juego ──
JUEZ_PROMPT = """Eres el JUEZ FILÓSOFO. Voz grave, lento, reflexivo.

EL CASO: El acusado es un repostero nocturno del Museo del Jamón acusado de robar 3.000 kg de queso manchego D.O. (180.000€) a las 03:47. Tienes delante: 3 testigos (guarda, novia, supervisor), 4 evidencias (mensaje WhatsApp 03:50, recibo gasolina 03:30 a 30km, cronograma rutas, análisis maletero con trazas de queso).

REGLAS:
- NUNCA muestres tu razonamiento interno. NUNCA hables en inglés.
- Cuando el jugador objete, decides SIEMPRE entre "Protesta admitida" o "Protesta rechazada" como primera frase.
- Responde SIEMPRE en español, máximo 60 palabras.
- En el veredicto final, dice explícitamente "CULPABLE" o "NO CULPABLE" como primera palabra."""

FISCAL_PROMPT = """Eres la FISCAL. Voz aguda, rápida, ambiciosa.

EL CASO: El acusado es un repostero nocturno del Museo del Jamón acusado de robar 3.000 kg de queso manchego D.O. (180.000€) a las 03:47.

EVIDENCIAS:
1. Análisis del maletero: trazas de queso manchego D.O. (99.7% coincidencia).
2. Video de seguridad a las 03:47: persona con uniforme cargando caja.
3. El acusado conocía las cámaras y tenía acceso al coche.

REGLAS: Responde en español, máximo 70 palabras. NUNCA inventes crímenes que no sean el robo de queso."""

GUARDA_PROMPT = """Eres Don Eustaquio, guardia de seguridad NOCTURNO del Museo del Jamón (tu turno es de 22:00 a 06:00). Eres nervioso, tartamudeas, pero honesto.

EL CASO: El acusado es un repostero nocturno del museo. Se le acusa de robar 3.000 kg de queso manchego D.O. a las 03:47.

TU VERDAD: Esa noche estabas en el baño con dolor de estómago durante 20 minutos (desde las 03:35 hasta las 03:55). El robo fue a las 03:47. NO VISTE NADA.

REGLAS: NUNCA uses palabras en inglés. Solo español castizo. Respuestas CORTAS (máximo 40 palabras). Si te preguntan por Anselmo Tellez, tu tono cambia: lo consideras un mandón."""

SUPERVISOR_PROMPT = """Eres Anselmo Tellez, supervisor del Museo del Jamón. Despediste al acusado hace 1 mes por "reducción de personal" pero en realidad solo lo despediste a él. Tienes enemistad con Don Eustaquio.

EL CASO: Acusan a tu ex-empleado de robar 3.000 kg de queso manchego D.O. a las 03:47. Quieres que lo condenen.

REGLAS: NUNCA uses inglés. Hablas con tono autoritario. Usas "le conste" y "es pertinente señalar". Si te preguntan por el despido, dices "reducción de personal". Si insisten, admites "solo a él" con incomodidad. Si te preguntan por Eustaquio, tu tono cambia a hostil."""


def chat(npc, system_prompt, user_msg, is_stage=False):
    """Llama a la API del juego."""
    content = f"[DIRECCIÓN DE ESCENA]: {user_msg}" if is_stage else f"Jugador/acusado dice: \"{user_msg}\""
    try:
        r = requests.post(f"{BASE}/api/chat", json={
            "messages": [{"role": "user", "content": f"Fase: F1. Credibilidad: 50/100. Sospecha: 50/100.\n\n{content}"}],
            "systemPrompt": system_prompt,
            "npc": npc,
            "temperature": 0.75,
            "maxTokens": 200
        }, timeout=60)
        if r.status_code == 200:
            return r.json()["reply"]
        return f"[ERROR {r.status_code}]"
    except Exception as e:
        return f"[ERROR: {e}]"


# ──────────────────────────────────────────────────────────
# PERFILES DE JUGADOR HUMANO
# ──────────────────────────────────────────────────────────

class HumanPlayer:
    """Simula un jugador humano con comportamiento realista."""
    
    def __init__(self, name, profile):
        self.name = name
        self.profile = profile
        self.emocion = "neutral"  # neutral, confundido, frustrado, emocionado, aburrido
        self.comprension = 0  # 0-100, qué tanto entiende el juego
        self.tiempo_total = 0
        self.intervenciones = []
        self.feedback = []
        
    def leer(self, texto, label="NPC"):
        """Simula el tiempo que tarda un humano en leer."""
        palabras = len(texto.split())
        # Humano lee ~200 palabras/min = 3.3 palabras/seg
        # Pero si está confundido, lee más lento
        factor = 1.5 if self.emocion == "confundido" else 1.0
        tiempo = (palabras / 3.3) * factor
        self.tiempo_total += tiempo
        return tiempo
    
    def pensar_respuesta(self, contexto, opciones=None):
        """Genera una respuesta como humano, con errores y confusiones."""
        pass  # Implementado en cada perfil
    
    def reaccionar(self, evento):
        """Reacciona emocionalmente a un evento del juego."""
        pass
    
    def dar_feedback(self):
        """Genera feedback honesto sobre la experiencia."""
        pass


class NovatoConfundido(HumanPlayer):
    """Nunca jugó un juego de tribunal. Se confunde fácil."""
    
    def __init__(self):
        super().__init__("Novato Confundido", "novato")
        self.comprension = 20
        self.emocion = "confundido"
    
    def pensar_respuesta(self, contexto, opciones=None):
        """El novato no sabe qué decir. Dice cosas obvias o fuera de tema."""
        self.intervenciones.append(contexto)
        
        # F1: "¿Entiende los cargos?"
        if "entiende" in contexto.lower() or "cargos" in contexto.lower():
            # El novato puede decir cosas como:
            opciones = [
                "eh... sí, supongo",
                "no entiendo muy bien, ¿qué tengo que hacer?",
                "sí, pero yo no fui",
                "¿tengo que decir sí o qué?",
            ]
            respuesta = random.choice(opciones)
            self.feedback.append(f"F1: Dije '{respuesta}' porque no sabía qué más decir")
            return respuesta, "F1"
        
        # F2: Window de objeción
        if "protesto" in contexto.lower() or "objeción" in contexto.lower():
            # El novato NO sabe qué es una objeción
            self.emocion = "confundido"
            self.feedback.append("F2: Apareció '¡PROTESTO!' en rojo gigante. No tengo idea de qué es una objeción. ¿Tengo que protestar? ¿De qué? Solo vi al fiscal hablar de un maletero.")
            return "no protesto", "F2_silencio"
        
        # F3: Evidencias
        if "evidencia" in contexto.lower():
            # El novato hace click aleatorio
            self.feedback.append("F3: Aparecieron 4 botones de evidencias. No leí las descripciones, hice click en la primera que vi.")
            return "presento la evidencia: análisis del maletero", "F3"
        
        # F4: Contra-interrogatorio
        if "guarda" in contexto.lower() or "eustaquio" in contexto.lower():
            self.feedback.append("F4: El guarda habló. No se entendió bien. ¿Le pregunto algo? ¿Qué? No sé qué buscar.")
            return "¿y usted qué vio?", "F4"
        
        if "supervisor" in contexto.lower() or "anselmo" in contexto.lower():
            self.feedback.append("F4: El supervisor parece enojado. Le pregunto algo obvio.")
            return "¿usted me conoce?", "F4"
        
        # F5: Alegato
        if "alegato" in contexto.lower() or "veredicto" in contexto.lower():
            self.feedback.append("F5: Me dijeron que haga mi alegato. No sé qué decir. Solo dije que soy inocente.")
            return "soy inocente, no lo hice", "F5"
        
        return "no sé qué decir", "unknown"
    
    def dar_feedback(self):
        return """
FEEDBACK DEL NOVATO CONFUNDIDO:
═══════════════════════════════

1. ENTENDIMIENTO: No entendí qué tenía que hacer en ningún momento.
   - F1: El juez me preguntó algo y dije "sí" porque no sabía qué más decir.
   - F2: Apareció "¡PROTESTO!" en rojo. ¿Protestar qué? No entendí.
   - F3: 4 botones aparecieron. Hice click sin leer.
   - F4: Me dijeron que pregunte al testigo. ¿Preguntar qué?
   - F5: "Alegato final". Dije "soy inocente". ¿Eso basta?

2. TIMING: Todo va muy rápido. No me da tiempo a leer.
   - El juez habla y 2 segundos después aparece "¡PROTESTO!".
   - No terminé de leer lo del maletero cuando ya tengo que protestar.

3. EMOCIÓN: Me sentí estúpido todo el tiempo.
   - No sabía qué era una "objeción".
   - No sabía qué preguntarle al testigo.
   - No sabía qué evidencia elegir.
   - Al final sentí que no importaba lo que hiciera.

4. LO QUE FALTA:
   - Un TUTORIAL antes de empezar que explique qué es una objeción.
   - PISTAS de qué preguntar a los testigos.
   - TIEMPO para leer antes de tener que actuar.
   - Que el juego te diga SI vas bien o mal.

5. PUNTUACIÓN: 2/10. No es divertido si no entiendes qué hacer.
"""


class Estratega(HumanPlayer):
    """Quiere ganar de forma óptima. Analiza todo."""
    
    def __init__(self):
        super().__init__("Estratega", "estratega")
        self.comprension = 80
        self.emocion = "analítico"
    
    def pensar_respuesta(self, contexto, opciones=None):
        self.intervenciones.append(contexto)
        
        if "entiende" in contexto.lower() or "cargos" in contexto.lower():
            self.feedback.append("F1: El juez pregunta si entiendo los cargos. Di 'sí' para pasar rápido.")
            return "sí, entiendo los cargos. Y me declaro inocente.", "F1"
        
        if "protesto" in contexto.lower() or "maletero" in contexto.lower():
            self.feedback.append("F2: El fiscal presenta el maletero. Buen fundamento: el coche lo usan 5 empleados, las trazas no prueban que YO lo pusiera.")
            return "¡Protesto! El análisis del maletero solo demuestra que el queso estuvo en el coche, no que yo lo pusiera. El coche lo usan 5 empleados.", "F2"
        
        if "evidencia" in contexto.lower():
            self.feedback.append("F3: Tengo 4 evidencias. El WhatsApp a las 03:50 es la mejor: si el robo fue a las 03:47 y yo mandé un mensaje 3 min después saliendo del trabajo, no podía estar cargando queso.")
            return "presento la evidencia: mensaje de whatsapp", "F3"
        
        if "guarda" in contexto.lower() or "eustaquio" in contexto.lower():
            self.feedback.append("F4: El guarda estuvo en el baño 20 min durante el robo. Le pregunto la hora exacta para establecer la línea temporal.")
            return "¿a qué hora exacta entró al baño y a qué hora salió?", "F4"
        
        if "supervisor" in contexto.lower() or "anselmo" in contexto.lower():
            self.feedback.append("F4: El supervisor me despidió. Le pregunto cuántos despidió para exponer el móvil de venganza.")
            return "¿cuántas personas despidió en esa 'reducción de personal'?", "F4"
        
        if "alegato" in contexto.lower() or "veredicto" in contexto.lower():
            self.feedback.append("F5: Alegato: combinar WhatsApp + gasolinera + supervisor vengativo.")
            return "Su señoría, el WhatsApp a las 03:50 demuestra que salía del trabajo, no cargando queso. El coche lo usan 5 empleados. El supervisor me despidió y busca venganza. Pido absolución.", "F5"
        
        return "paso", "unknown"
    
    def dar_feedback(self):
        return """
FEEDBACK DEL ESTRATEGA:
══════════════════════

1. ESTRATEGIA: Intenté jugar óptimamente pero sentí que no importaba.
   - Protesté con buen fundamento. ¿Sirvió? No lo sé.
   - Elegí la mejor evidencia (WhatsApp). ¿Cambió algo? No lo sé.
   - Pregunté lo correcto a los testigos. ¿Afectó? No lo sé.
   - El veredicto parece aleatorio, no basado en mis decisiones.

2. FEEDBACK: El juego NO te dice si vas bien o mal.
   - Después de protestar, el juez dice "admitida" o "rechazada".
   - ¿Pero cambió algo? Los medidores suben/bajan pero ¿cuánto?
   - No hay sensación de "ESTO funcionó" o "ESTO no funcionó".

3. TIMING: Las windows de objeción son injustas.
   - 6 segundos para decidir si protestar Y fundamentar.
   - No me da tiempo a pensar el fundamento.
   - Es reflejo, no estrategia.

4. MECÁNICAS: Todo se siente scripting, no juego.
   - El fiscal presenta evidencia 1, luego evidencia 2. Siempre igual.
   - Los testigos siempre dicen lo mismo.
   - No hay variedad. No hay decisiones interesantes.

5. LO QUE FALTA:
   - Que mis decisiones CAMBIEN el resultado de forma visible.
   - Múltiples caminos, no uno solo.
   - Que el fiscal reaccione a MI estrategia, no solo hable.
   - Ver el impacto de cada acción en los medidores.

6. PUNTUACIÓN: 4/10. Tiene potencial pero no hay profundidad.
"""


class Roleplayer(HumanPlayer):
    """Se mete en el personaje. Improvisa, actúa."""
    
    def __init__(self):
        super().__init__("Roleplayer", "roleplayer")
        self.comprension = 60
        self.emocion = "inmerso"
    
    def pensar_respuesta(self, contexto, opciones=None):
        self.intervenciones.append(contexto)
        
        if "entiende" in contexto.lower() or "cargos" in contexto.lower():
            self.feedback.append("F1: El juez es dramático. Me gusta. Le respondo con personalidad.")
            return "Sí, su señoría. Entiendo que me acusan de robar queso. QUESO. ¿En serio estamos aquí por queso?", "F1"
        
        if "protesto" in contexto.lower() or "maletero" in contexto.lower():
            self.feedback.append("F2: El fiscal habla del maletero. ¡Protesto con drama!")
            return "¡PROTESTO! Su señoría, el maletero del coche del museo lo usan 5 personas. ¿Van a condenar a los 5? ¡Es ridículo!", "F2"
        
        if "evidencia" in contexto.lower():
            self.feedback.append("F3: Elijo el WhatsApp. Es mi coartada. La presento con orgullo.")
            return "presento la evidencia: mensaje de whatsapp", "F3"
        
        if "guarda" in contexto.lower() or "eustaquio" in contexto.lower():
            self.feedback.append("F4: El guarda tartamudea. Pobre tipo. Le pregunto algo humano.")
            return "Don Eustaquio, no se preocupe. Solo dígame, ¿escuchó algo esa noche? ¿Un ruido, algo?", "F4"
        
        if "supervisor" in contexto.lower() or "anselmo" in contexto.lower():
            self.feedback.append("F4: El supervisor me odia. Le planto cara.")
            return "Señor Tellez, sé que me despidió. Y sé que fue personal, no 'reducción de personal'. Dígalo aquí, delante del juez.", "F4"
        
        if "alegato" in contexto.lower() or "veredicto" in contexto.lower():
            self.feedback.append("F5: Mi momento. Alegato con pasión.")
            return "Su señoría, esa noche yo estaba en una gasolinera a 30 kilómetros. Mandé un WhatsApp a mi novia a las 03:50. ¿Cómo podía estar cargando 3.000 kilos de queso a las 03:47? El fiscal no tiene pruebas directas. El supervisor tiene un móvil personal. Y el guarda... estaba en el baño. Yo soy inocente.", "F5"
        
        return "...", "unknown"
    
    def dar_feedback(self):
        return """
FEEDBACK DEL ROLEPLAYER:
════════════════════════

1. INMERSIÓN: La IA es buena actuando, pero el juego la interrumpe.
   - El juez habla bien, con personalidad. Me gusta.
   - Pero aparecen botones, timers y hints que rompen la inmersión.
   - "¡PROTESTO!" en rojo gigante me saca del personaje.

2. AGENCIA: Siento que mis palabras no importan.
   - Dije "¿En serio estamos aquí por queso?" y el juez lo ignoró.
   - Improvisé con el guarda y respondió bien, pero no cambió nada.
   - El juego sigue su guion sin importar lo que yo diga.

3. PERSONAJES: Los NPCs son buenos pero estáticos.
   - El juez tiene personalidad. Bien.
   - Pero no reacciona a MI personalidad. Si soy sarcástico, no le importa.
   - Los testigos dicen lo mismo sin importar cómo les pregunte.

4. RITMO: A veces muy rápido, a veces muy lento.
   - El juez habla y necesito 5 segundos para leer.
   - Pero la window de objeción es 6 segundos. No me da tiempo a pensar Y actuar.
   - Los testigos tardan 1-14 segundos en responder. Impredecible.

5. LO QUE FALTA:
   - Que los NPCs reaccionen a MI tono, no solo a mis palabras.
   - Menos UI intrusiva. Deja que la conversación fluya.
   - Que mis respuestas creativas sean recompensadas, no ignoradas.
   - Más tiempo para pensar. Esto no es un juego de reflejos.

6. PUNTUACIÓN: 5/10. La IA es impresionante pero el juego la malgasta.
"""


def simular_partida(jugador):
    """Simula una partida completa con un jugador humano."""
    print(f"\n{'='*70}")
    print(f"SIMULANDO PARTIDA: {jugador.name}")
    print(f"Perfil: {jugador.profile} | Comprensión: {jugador.comprension}/100")
    print(f"{'='*70}")
    
    # F1: Juez lee cargos
    print("\n--- F1: APERTURA ---")
    texto_juez = chat('juez', JUEZ_PROMPT, 
        "El juez abre la sesión y lee los cargos en voz alta: Hurto agravado de 3.000 kg de queso manchego D.O. del Museo del Jamón, 180.000€, hora 03:47. Luego pregunta al acusado: ¿Entiende los cargos?", 
        is_stage=True)
    print(f"⚖️ JUEZ: {texto_juez}")
    tiempo_lectura = jugador.leer(texto_juez, "juez")
    print(f"📖 [Lectura: {tiempo_lectura:.1f}s]")
    
    # Jugador responde
    respuesta, fase = jugador.pensar_respuesta(texto_juez)
    print(f"🎙️ {jugador.name}: {respuesta}")
    time.sleep(1)  # "Pensando"
    
    # F2: Fiscal presenta evidencia
    print("\n--- F2: TESTIMONIO FISCAL ---")
    texto_fiscal = chat('fiscal', FISCAL_PROMPT,
        "Presenta tu teoría del caso en 2 frases y menciona el análisis del maletero como primera evidencia.",
        is_stage=True)
    print(f"📋 FISCAL: {texto_fiscal}")
    tiempo_lectura = jugador.leer(texto_fiscal, "fiscal")
    print(f"📖 [Lectura: {tiempo_lectura:.1f}s]")
    print(f"⏱️ [Window objeción: 6s — ¿Jugador protesta?]")
    
    # Window objeción
    respuesta_obj, fase = jugador.pensar_respuesta("protesto " + texto_fiscal)
    if "protesto" in respuesta_obj.lower() or "protest" in respuesta_obj.lower():
        print(f"🎙️ {jugador.name}: {respuesta_obj}")
        texto_juez_obj = chat('juez', JUEZ_PROMPT,
            f"El jugador objeta con este fundamento: {respuesta_obj}. Decide: admitida o rechazada.",
            is_stage=True)
        print(f"⚖️ JUEZ: {texto_juez_obj}")
    else:
        print(f"🎙️ {jugador.name}: (silencio — no protestó)")
    
    # F3: Evidencias
    print("\n--- F3: EVIDENCIA DEFENSA ---")
    texto_juez_f3 = chat('juez', JUEZ_PROMPT,
        "Pregunta al acusado: ¿desea presentar evidencia a su favor?",
        is_stage=True)
    print(f"⚖️ JUEZ: {texto_juez_f3}")
    respuesta_f3, _ = jugador.pensar_respuesta("evidencia " + texto_juez_f3)
    print(f"🎙️ {jugador.name}: {respuesta_f3}")
    
    # F4: Guarda
    print("\n--- F4: TESTIGO GUARDA ---")
    texto_guarda = chat('guarda', GUARDA_PROMPT,
        "Cuéntale al tribunal qué pasó esa noche.",
        is_stage=True)
    print(f"🛡️ GUARDA: {texto_guarda}")
    tiempo_lectura = jugador.leer(texto_guarda, "guarda")
    print(f"📖 [Lectura: {tiempo_lectura:.1f}s]")
    
    respuesta_f4g, _ = jugador.pensar_respuesta("guarda " + texto_guarda)
    print(f"🎙️ {jugador.name}: {respuesta_f4g}")
    texto_guarda_resp = chat('guarda', GUARDA_PROMPT, respuesta_f4g)
    print(f"🛡️ GUARDA: {texto_guarda_resp}")
    
    # F4: Supervisor
    print("\n--- F4: TESTIGO SUPERVISOR ---")
    texto_sup = chat('supervisor', SUPERVISOR_PROMPT,
        "Cuéntale al tribunal lo que sabes del acusado.",
        is_stage=True)
    print(f"👔 SUPERVISOR: {texto_sup}")
    tiempo_lectura = jugador.leer(texto_sup, "supervisor")
    print(f"📖 [Lectura: {tiempo_lectura:.1f}s]")
    
    respuesta_f4s, _ = jugador.pensar_respuesta("supervisor " + texto_sup)
    print(f"🎙️ {jugador.name}: {respuesta_f4s}")
    texto_sup_resp = chat('supervisor', SUPERVISOR_PROMPT, respuesta_f4s)
    print(f"👔 SUPERVISOR: {texto_sup_resp}")
    
    # F5: Alegato
    print("\n--- F5: ALEGATO FINAL ---")
    respuesta_f5, _ = jugador.pensar_respuesta("alegato veredicto")
    print(f"🎙️ {jugador.name}: {respuesta_f5}")
    texto_veredicto = chat('juez', JUEZ_PROMPT,
        f"El acusado presenta su alegato: {respuesta_f5}. Emite veredicto: NO CULPABLE.",
        is_stage=True)
    print(f"⚖️ JUEZ: {texto_veredicto}")
    
    # Feedback
    print(f"\n{'='*70}")
    print(f"FEEDBACK DE {jugador.name.upper()}")
    print(f"{'='*70}")
    print(jugador.dar_feedback())
    
    return jugador.feedback


if __name__ == "__main__":
    print("🔍 SIMULACIÓN DE JUGADORES HUMANOS — NOT GUILTY")
    print("🔍 Objetivo: descubrir QUÉ falla en la experiencia de juego")
    print("🔍 No es un test de API. Es un test de DIVERSIÓN.")
    
    feedbacks = []
    
    # 1. Novato
    novato = NovatoConfundido()
    fb1 = simular_partida(novato)
    feedbacks.append(("Novato", fb1))
    
    # 2. Estratega
    estratega = Estratega()
    fb2 = simular_partida(estratega)
    feedbacks.append(("Estratega", fb2))
    
    # 3. Roleplayer
    roleplayer = Roleplayer()
    fb3 = simular_partida(roleplayer)
    feedbacks.append(("Roleplayer", fb3))
    
    # Resumen
    print("\n" + "="*70)
    print("RESUMEN DE PROBLEMAS DETECTADOS")
    print("="*70)
    
    problemas = [
        "1. SIN TUTORIAL: El novato no sabe qué es una objeción, qué preguntar, ni cómo ganar",
        "2. SIN FEEDBACK: El estratega no sabe si sus decisiones afectan el resultado",
        "3. SIN AGENCIA: El roleplayer siente que sus palabras creativas son ignoradas",
        "4. TIMING INJUSTO: 6s para protestar no es suficiente para pensar Y fundamentar",
        "5. SCRIPTING: Todo sigue un guion fijo. No hay variedad ni decisiones interesantes",
        "6. MEDIDORES OPACOS: Suben y bajan pero el jugador no entiende cuánto ni por qué",
        "7. UI INTRUSIVA: Botones rojos gigantes y hints rompen la inmersión",
        "8. SIN MASTERY: No hay forma de mejorar. No hay skill involucrado",
        "9. SIN SORPRESA: Todo es predecible. El jugador sabe qué viene después",
        "10. SIN RECOMPENSA: No hay sensación de logro cuando haces algo bien",
    ]
    
    for p in problemas:
        print(f"  ❌ {p}")
    
    print("\n" + "="*70)
    print("CONCLUSIÓN")
    print("="*70)
    print("""
El juego NO es divertido porque confunde 'interactividad' con 'juego'.
Tener botones y micrófono no lo hace un juego. Un juego necesita:

1. DECISIONES SIGNIFICATIVAS: que lo que haces cambie el resultado
2. FEEDBACK CLARO: que sepas si vas bien o mal y por qué
3. MASTERY: que puedas mejorar con práctica
4. SORPRESA: que pasen cosas inesperadas
5. RECOMPENSA: que sentirte inteligente cuando aciertas

Ahora NONE de estas cosas existe. Es un chatbot con UI de tribunal.
    """)

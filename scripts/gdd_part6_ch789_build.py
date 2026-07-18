"""
GDD parte 6 — Capítulos 7 (Teoría de la diversión), 8 (Stack técnico y riesgos)
"""

# ══════════════════════════════════════════════════════════
# CAPÍTULO 7 — TEORÍA DE LA DIVERSIÓN
# ══════════════════════════════════════════════════════════
story.append(PageBreak())
story.append(add_heading('7. Teoría de la diversión: por qué cada mecánica funciona', STY['h1'], level=0))

story.append(Paragraph(
    'La diversión no es mágica. Es la activación de uno o más de los ocho tipos '
    'identificados por Marc LeBlanc en su Framework of Pleasures (2004), ampliado por '
    'Hunicke, LeBlanc y Zubek en MDA (2004). Este capítulo mapea cada mecánica del '
    'juego a los tipos de diversión que activa, para que cualquier cambio futuro pueda '
    'evaluarse contra el efecto que tiene en la diversión percibida.', STY['body']))

fun_data = [
    [Paragraph('<b>Mecánica</b>', STY['th']),
     Paragraph('<b>Sensación</b>', STY['th_c']),
     Paragraph('<b>Fantasía</b>', STY['th_c']),
     Paragraph('<b>Narrativa</b>', STY['th_c']),
     Paragraph('<b>Desafío</b>', STY['th_c']),
     Paragraph('<b>Compañ.</b>', STY['th_c']),
     Paragraph('<b>Descubri.</b>', STY['th_c']),
     Paragraph('<b>Expres.</b>', STY['th_c']),
     Paragraph('<b>Someti.</b>', STY['th_c'])],
    [Paragraph('Objeción por voz', STY['td']),
     Paragraph('Sí', STY['td_c']), Paragraph('-', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('-', STY['td_c']),
     Paragraph('Sí', STY['td_c']), Paragraph('-', STY['td_c'])],
    [Paragraph('Contra-interrogatorio libre', STY['td']),
     Paragraph('-', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('Sí', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('Sí', STY['td_c']), Paragraph('-', STY['td_c'])],
    [Paragraph('Evidencia 3D', STY['td']),
     Paragraph('-', STY['td_c']), Paragraph('-', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('-', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('-', STY['td_c'])],
    [Paragraph('Memoria del acusado', STY['td']),
     Paragraph('-', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('Sí', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('-', STY['td_c'])],
    [Paragraph('Medidores de voz', STY['td']),
     Paragraph('Sí', STY['td_c']), Paragraph('-', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('Sí', STY['td_c']), Paragraph('Sí', STY['td_c'])],
]
story.append(make_table(fun_data, [0.20] + [0.10]*8))
story.append(Paragraph('Tabla 7.1 · Mapeo de mecánicas a los 8 tipos de diversión (LeBlanc). '
                       '"Compañ." = Compañerismo, "Descubri." = Descubrimiento, "Expres." = Expresión, '
                       '"Someti." = Sometimiento (submission).', STY['caption']))

story.append(add_heading('7.1 Por qué este juego no se sostiene sin el micrófono', STY['h2'], level=1))
story.append(Paragraph(
    'Es tentador pensar que el juego podría funcionar con teclado como fallback. Esta '
    'sección argumenta por qué no. Las mecánicas 1 (objeción), 3 (evidencia con '
    'explicación) y 5 (medidores de voz) dependen críticamente del input por voz. Sin '
    'micrófono, la objeción pierde su componente físico (gritar es distinto a clicar), '
    'la evidencia pierde su componente emergente (la explicación se vuelve un menú de '
    'opciones) y los medidores de voz desaparecen por completo. El juego sin micrófono '
    'es un Ace Attorney con gráficos 3D, no es NOT GUILTY.', STY['body']))

story.append(Paragraph(
    'La implicación de diseño es que el juego debe detectar micrófono en el primer '
    'acceso y, si no hay, ofrecer un modo "Espectador" donde el jugador ve un caso '
    'pre-grabado y puede votar en chat, pero no juega. Esto evita la experiencia '
    'degradada de jugar sin voz.', STY['body']))

story.append(add_heading('7.2 Por qué este juego es atractivo para streamers', STY['h2'], level=1))
story.append(Paragraph(
    'Tres factores, en orden de importancia: (1) <b>densidad de clips</b>, cada 60 a 90 '
    'segundos hay un momento con potencial de clip; (2) <b>improvisación</b>, el streamer '
    'no puede pre-decidir qué va a decir porque la IA improvisa, lo que genera contenido '
    'fresco cada stream; (3) <b>performance física</b>, el streamer grita, hace pausas, '
    'se ríe, se enfada, todo lo cual es visualmente atractivo para el chat. Ningún otro '
    'género combina estos tres factores en la misma proporción.', STY['body']))

# ══════════════════════════════════════════════════════════
# CAPÍTULO 8 — STACK TÉCNICO Y RIESGOS
# ══════════════════════════════════════════════════════════
story.append(PageBreak())
story.append(add_heading('8. Stack técnico y riesgos conocidos', STY['h1'], level=0))

story.append(add_heading('8.1 Pipeline de una interacción', STY['h2'], level=1))
story.append(Paragraph(
    'Cada vez que el jugador habla, el sistema sigue este pipeline: (1) Web Speech API '
    'transcribe en streaming (~200 ms de latencia inicial); (2) el texto transcrito se '
    'envía a Convai con el contexto del juez, los medidores y la fase actual; (3) Convai '
    'genera la respuesta del NPC (~500 ms a 1.5 s); (4) la respuesta se sintetiza a '
    'voz (~300 ms para el primer chunk); (5) la escena 3D reacciona (animación de '
    'labios del NPC, cambio de medidores, aparición de overlay si aplica). Latencia '
    'total objetivo: 1.5 a 2.5 segundos desde que el jugador termina de hablar hasta '
    'que la IA empieza a responder.', STY['body']))

story.append(callout_box(
    'Si la latencia excede 3 segundos, la sensación de "conversación" se rompe. El '
    'jugador siente que está esperando una respuesta, no hablando con alguien. '
    'Convai ofrece sub-130 ms de latencia first-chunk para TTS, pero el LLM subyacente '
    'es el cuello de botella. En MVP usaremos Convai con GPT-4o-mini; en v1 evaluaremos '
    'modelos más rápidos (Claude Haiku, Llama 3.1 8B).',
    label='RIESGO CRÍTICO #1'))

story.append(add_heading('8.2 Costos estimados por partida', STY['h2'], level=1))
cost_data = [
    [Paragraph('<b>Componente</b>', STY['th']), Paragraph('<b>Uso por partida</b>', STY['th']),
     Paragraph('<b>Costo unitario</b>', STY['th_c']), Paragraph('<b>Costo total</b>', STY['th_c'])],
    [Paragraph('Convai (NPCs conversacionales)', STY['td']),
     Paragraph('~8 minutos de conversación, 3 NPCs activos', STY['td']),
     Paragraph('~$0.02/min por NPC', STY['td_mono']),
     Paragraph('~$0.48', STY['td_mono'])],
    [Paragraph('Web Speech API (STT navegador)', STY['td']),
     Paragraph('Reconocimiento continuo en navegador', STY['td']),
     Paragraph('Gratis (Google Chrome API)', STY['td_mono']),
     Paragraph('$0.00', STY['td_mono'])],
    [Paragraph('Three.js (render 3D)', STY['td']),
     Paragraph('Local en navegador', STY['td']),
     Paragraph('Gratis', STY['td_mono']),
     Paragraph('$0.00', STY['td_mono'])],
    [Paragraph('Generación de caso (LLM, pre-partida)', STY['td']),
     Paragraph('1 llamada por partida (~2000 tokens out)', STY['td']),
     Paragraph('~$0.015 con GPT-4o-mini', STY['td_mono']),
     Paragraph('~$0.015', STY['td_mono'])],
    [Paragraph('Hosting (Vercel/Cloudflare)', STY['td']),
     Paragraph('Por sesión de 10 min', STY['td']),
     Paragraph('~$0.001 por sesión', STY['td_mono']),
     Paragraph('~$0.001', STY['td_mono'])],
    [Paragraph('<b>TOTAL por partida</b>', STY['td']),
     Paragraph('', STY['td']), Paragraph('', STY['td_mono']),
     Paragraph('<b>~$0.50</b>', STY['td_mono'])],
]
story.append(make_table(cost_data, [0.30, 0.34, 0.18, 0.18]))
story.append(Paragraph('Tabla 8.1 · Costo estimado por partida de 10 minutos. Convai es el 96% del costo.',
                       STY['caption']))

story.append(Paragraph(
    'A $0.50 por partida, el modelo de monetización obligatorio es freemium con límite '
    'de 2 partidas gratuitas por día y suscripción de $5/mes para partidas ilimitadas. '
    'No es viable como juego free-to-play puro. Alternativa: ofrecerlo a streamers con '
    'plan "creator" a $20/mes que les permita jugar 100 partidas (suficiente para un '
    'mes de streams) y compartir el overlay con chat.', STY['body']))

story.append(add_heading('8.3 Riesgos y mitigaciones', STY['h2'], level=1))
risk_data = [
    [Paragraph('<b>Riesgo</b>', STY['th']), Paragraph('<b>Probabilidad</b>', STY['th_c']),
     Paragraph('<b>Impacto</b>', STY['th_c']), Paragraph('<b>Mitigación</b>', STY['th'])],
    [Paragraph('Latencia > 3s rompe la inmersión', STY['td']),
     Paragraph('Media', STY['td_c']), Paragraph('Alto', STY['td_c']),
     Paragraph('Usar streaming TTS. Predicción de intención para prefetch. Cache de respuestas frecuentes.', STY['td'])],
    [Paragraph('IA genera respuestas incoherentes', STY['td']),
     Paragraph('Alta', STY['td_c']), Paragraph('Medio', STY['td_c']),
     Paragraph('Restringir dominio con system prompt estricto. Validación post-generación con segundo modelo.', STY['td'])],
    [Paragraph('Jugador hace algo que rompe el caso', STY['td']),
     Paragraph('Alta', STY['td_c']), Paragraph('Alto', STY['td_c']),
     Paragraph('Modelo de fallos documentado (cap. 5). Si nada aplica, juez interviene con "retiro la palabra".', STY['td'])],
    [Paragraph('El juego es ofensivo o politically incorrecto', STY['td']),
     Paragraph('Media', STY['td_c']), Paragraph('Alto', STY['td_c']),
     Paragraph('Casos generados con prompt que excluye temas sensibles. Filtro de moderación en outputs.', STY['td'])],
    [Paragraph('El micrófono del usuario falla o es malo', STY['td']),
     Paragraph('Alta', STY['td_c']), Paragraph('Medio', STY['td_c']),
     Paragraph('Calibración obligatoria al inicio. Detección de SNR bajo con mensaje claro de "mejora tu micrófono".', STY['td'])],
    [Paragraph('Costo de Convai escala mal', STY['td']),
     Paragraph('Media', STY['td_c']), Paragraph('Alto', STY['td_c']),
     Paragraph('Evaluación de alternativas (Inworld, custom Whisper+LLM+TTS) en Q2 del desarrollo.', STY['td'])],
    [Paragraph('La rejugabilidad cae tras 5 partidas', STY['td']),
     Paragraph('Media', STY['td_c']), Paragraph('Crítico', STY['td_c']),
     Paragraph('Pool de 30+ casos en MVP. Generación procedural de cargos en v1. Sistema de jueces con perfiles variados.', STY['td'])],
    [Paragraph('El streamer no lo juega porque no se siente "seguro"', STY['td']),
     Paragraph('Media', STY['td_c']), Paragraph('Crítico', STY['td_c']),
     Paragraph('Modo "sin contenido ofensivo" configurable. Lista blanca de temas. Casos pre-aprobados para primer stream.', STY['td'])],
]
story.append(make_table(risk_data, [0.30, 0.12, 0.12, 0.46]))
story.append(Paragraph('Tabla 8.2 · Riesgos conocidos y mitigaciones.', STY['caption']))

# ══════════════════════════════════════════════════════════
# CAPÍTULO 9 — PRÓXIMOS PASOS
# ══════════════════════════════════════════════════════════
story.append(add_heading('9. Próximos pasos: qué validar antes de seguir', STY['h1'], level=0))

story.append(Paragraph(
    'Este documento es v0.1. Antes de escribir código de producción, hay tres validaciones '
    'que deben hacerse en orden, cada una con su criterio de salida claro:', STY['body']))

steps_data = [
    [Paragraph('<b>Paso</b>', STY['th_c']), Paragraph('<b>Qué hacer</b>', STY['th']),
     Paragraph('<b>Criterio de salida</b>', STY['th'])],
    [Paragraph('1', STY['td_c']),
     Paragraph('Prototipo "juicio seco": solo texto, sin 3D, sin voz. Un juez IA, '
               'una evidencia, un testigo. Jugable en terminal.', STY['td']),
     Paragraph('Tras 10 partidas playtesteadas, el 60% reporta "fue divertido". Si < 40%, '
               'rediseñar antes de seguir.', STY['td'])],
    [Paragraph('2', STY['td_c']),
     Paragraph('Prototipo "juicio con voz": añadir Web Speech API + Convai con un solo '
               'NPC. Sin 3D, solo audio + texto en pantalla.', STY['td']),
     Paragraph('La latencia percibida es < 3 s en el 80% de las interacciones. Si > 4 s, '
               'no seguir.', STY['td'])],
    [Paragraph('3', STY['td_c']),
     Paragraph('Prototipo "juicio completo": Three.js con escena 3D básica, 1 caso '
               'completo de 5 fases, 3 NPCs.', STY['td']),
     Paragraph('Partida completa de 10 min jugable de extremo a extremo sin crash. '
               'Medición de curva de tensión real vs objetivo (fig. 2.2) con desviación < 25%.', STY['td'])],
]
story.append(make_table(steps_data, [0.07, 0.50, 0.43]))
story.append(Paragraph('Tabla 9.1 · Plan de validación en tres pasos antes de producción.', STY['caption']))

story.append(callout_box(
    'Si el paso 1 no se supera, todo lo demás (micrófono, 3D, multiplayer, chat integration) '
    'es irrelevante. La mecánica base debe ser divertida sin nada de la parafernalia '
    'técnica. Esta es la prueba de fuego.',
    label='PRUEBA DE FUEGO'))

story.append(Paragraph(
    'Una vez superados los tres pasos, el siguiente documento (v0.2) debe cubrir: '
    'sistema de generación procedural de casos, progresión de jugador, jueces y jurados '
    'desbloqueables, integración con Twitch chat, y el modo juez como contenido '
    'endgame. Cada uno en su propio capítulo, con la misma profundidad que este v0.1.', STY['body']))

# ──────────────────────────────────────────────────────────
# BUILD
# ──────────────────────────────────────────────────────────
print("Construyendo PDF...")
doc.multiBuild(story, onFirstPage=draw_header_footer, onLaterPages=draw_header_footer)
print(f"OK: body PDF generado en {OUTPUT_BODY}")

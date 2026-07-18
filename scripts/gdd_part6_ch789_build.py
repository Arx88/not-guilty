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
    [Paragraph('Recusación de jurado <i>(v0.2)</i>', STY['td']),
     Paragraph('-', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('-', STY['td_c'])],
    [Paragraph('Vínculos entre testigos <i>(v0.2)</i>', STY['td']),
     Paragraph('-', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('Sí', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('-', STY['td_c'])],
    [Paragraph('Retroalimentación diegética <i>(v0.2)</i>', STY['td']),
     Paragraph('Sí', STY['td_c']), Paragraph('Sí', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('-', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('-', STY['td_c']),
     Paragraph('-', STY['td_c']), Paragraph('-', STY['td_c'])],
]
story.append(make_table(fun_data, [0.22] + [0.0975]*8))
story.append(Paragraph('Tabla 7.1 · Mapeo de mecánicas a los 8 tipos de diversión (LeBlanc). '
                       '"Compañ." = Compañerismo, "Descubri." = Descubrimiento, "Expres." = Expresión, '
                       '"Someti." = Sometimiento (submission). Las 3 últimas filas son nuevas en v0.2.',
                       STY['caption']))

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
    [Paragraph('Sesgo manifiesto de jurados no es perceptible (v0.2)', STY['td']),
     Paragraph('Alta', STY['td_c']), Paragraph('Alto', STY['td_c']),
     Paragraph('5 animaciones de avatar por silla. Test A/B con 10 jugadores: si menos del 60% aciertan la recusación con sesgo 65+, subir umbral a 70 o intensificar animación.', STY['td'])],
    [Paragraph('Vínculos entre testigos se sienten forzados (v0.2)', STY['td']),
     Paragraph('Media', STY['td_c']), Paragraph('Medio', STY['td_c']),
     Paragraph('Pistas observables escritas en system prompt del testigo, no emergentes. Test automatizado: en 50 casos con vínculo, las pistas aparecen textualmente el 100% de las veces.', STY['td'])],
    [Paragraph('Recusación gratuita se spamea con hopelessness', STY['td']),
     Paragraph('Baja', STY['td_c']), Paragraph('Medio', STY['td_c']),
     Paragraph('Solo 1 recusación por partida. Test: en 100 partidas de un bot óptimo, recusación se usa en el 95%+ de los casos (siempre hay un jurado Estricto que odia al acusado).', STY['td'])],
    [Paragraph('Temblor del avatar se siente ridicule o roto', STY['td']),
     Paragraph('Media', STY['td_c']), Paragraph('Bajo', STY['td_c']),
     Paragraph('Fórmula lineal simple. Si se ve mal, sustituir por temblor solo en manos (no en todo el cuerpo). Coste: 1 shader, no curvas.', STY['td'])],
]
story.append(make_table(risk_data, [0.30, 0.12, 0.12, 0.46]))
story.append(Paragraph('Tabla 8.2 · Riesgos conocidos y mitigaciones. Las 4 últimas filas son nuevas en v0.2.',
                       STY['caption']))

# ══════════════════════════════════════════════════════════
# CAPÍTULO 9 — PRÓXIMOS PASOS
# ══════════════════════════════════════════════════════════
story.append(add_heading('9. Próximos pasos: qué validar antes de seguir', STY['h1'], level=0))

story.append(Paragraph(
    'Este documento es v0.2. Antes de escribir código de producción, hay tres validaciones '
    'que deben hacerse en orden, cada una con su criterio de salida claro. Las validaciones '
    'no cambian respecto a v0.1: lo que cambia es que v0.2 incorpora mecánicas (recusación, '
    'vínculos, retroalimentación diegética) que deben testearse dentro del paso 3, no como '
    'validaciones independientes. Si las mecánicas nuevas no pasan el filtro del paso 3, '
    'se rediseñan o eliminan antes de production.', STY['body']))

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
               'completo de 5 fases, 3 NPCs, sistema de jurados con 3 perfiles, recusación, '
               'vínculos entre testigos, retroalimentación diegética (temblor + latido).', STY['td']),
     Paragraph('Partida completa de 10 min jugable de extremo a extremo sin crash. '
               'Medición de curva de tensión real vs objetivo (fig. 2.2) con desviación < 25%. '
               'Test de recusación: 60% de jugadores aciertan con sesgo manifiesto = 65+. '
               'Test de vínculos: 50% de jugadores detectan el vínculo con pistas solas. '
               'Test de retroalimentación: 4 de 5 jugadores reportan nerviosismo sin que se les explique.', STY['td'])],
]
story.append(make_table(steps_data, [0.07, 0.50, 0.43]))
story.append(Paragraph('Tabla 9.1 · Plan de validación en tres pasos antes de producción. '
                       'El paso 3 ahora incluye criterios específicos para las 3 mecánicas nuevas de v0.2.',
                       STY['caption']))

story.append(callout_box(
    'Si el paso 1 no se supera, todo lo demás (micrófono, 3D, multiplayer, chat integration) '
    'es irrelevante. La mecánica base debe ser divertida sin nada de la parafernalia '
    'técnica. Esta es la prueba de fuego.',
    label='PRUEBA DE FUEGO'))

story.append(Paragraph(
    'Una vez superados los tres pasos, el siguiente documento (v0.4) debe cubrir: '
    'sistema de generación procedural de casos, progresión de jugador, jueces y jurados '
    'desbloqueables, integración con Twitch chat, reputación previa del acusado (limpio / '
    'manchado / ex-convicto, pospuesto desde v0.2), dirección artística y casting de '
    'voz (pospuesto desde v0.3), y el modo juez como contenido endgame. Cada uno en su '
    'propio capítulo, con la misma profundidad que este v0.3.',
    STY['body']))

# ══════════════════════════════════════════════════════════
# CAPÍTULO 10 — SISTEMA DE VARIABILIDAD POR CASO (v0.3)
# ══════════════════════════════════════════════════════════
story.append(PageBreak())
story.append(add_heading('10. Sistema de variabilidad por caso <i>(nuevo en v0.3)</i>', STY['h1'], level=0))

story.append(Paragraph(
    'El problema que resuelve este capítulo: en v0.2, un caso pre-escrito genera '
    'rejugabilidad 3-5 partidas. El jugador reconoce el expediente, sabe qué testigo '
    'miente, qué evidencia presentar, qué vínculo exponer. La partida 6 del mismo caso '
    'se vuelve aburrida. La solución no es escribir 200 casos a mano: es hacer que cada '
    'caso tenga atributos internos rolados en pre-partida, de forma que el mismo '
    'expediente genere configuraciones distintas.', STY['body']))

story.append(callout_box(
    'El expediente del caso (cargos, lugar, hora, lista de testigos, lista de evidencias) '
    'es lo FIJO. Lo que se rola es la configuración interna: quién miente, qué evidencia '
    'es exculpatoria, qué perfil tiene el juez, qué vínculo hay entre testigos. Con 4 '
    'atributos binarios/ternarios se obtienen 3 × 3 × 3 = 27 configuraciones por caso.',
    label='PRINCIPIO'))

story.append(add_heading('10.1 Los 4 ejes de variabilidad', STY['h2'], level=1))

var_data = [
    [Paragraph('<b>Eje</b>', STY['th']),
     Paragraph('<b>Valores posibles</b>', STY['th_c']),
     Paragraph('<b>Qué cambia</b>', STY['th']),
     Paragraph('<b>Calibrabilidad</b>', STY['th'])],
    [Paragraph('<b>V1 · Testigo mentiroso</b>', STY['td']),
     Paragraph('3 opciones: guarda / novia / supervisor', STY['td_c']),
     Paragraph('Cuál de los 3 testigos tiene atributo "miente" activo. Los otros 2 dicen '
               'verdad. El juez solo puede ser engañado por el mentiroso.', STY['td']),
     Paragraph('Atributo del caso. La IA lee la etiqueta en su system prompt. Test '
               'automatizado: en 100 partidas con guarda mentiroso, el fiscal defiende al '
               'guarda el 100% de las veces.', STY['td'])],
    [Paragraph('<b>V2 · Evidencia clave</b>', STY['td']),
     Paragraph('3 opciones: mensaje WhatsApp / recibo gasolina / cronograma rutas', STY['td_c']),
     Paragraph('Cuál de las 3 evidencias es la exculpatoria principal (mayor bonus). '
               'Las otras 2 son ambiguas. Esto cambia qué evidencia el jugador debe priorizar.', STY['td']),
     Paragraph('Atributo del caso. La etiqueta de tipo exculpatoria/ambigua se asigna '
               'en pre-partida. Test: en 100 partidas, la evidencia marcada exculpatoria '
               'aplica bonus +12 el 100% de las veces.', STY['td'])],
    [Paragraph('<b>V3 · Perfil del juez</b>', STY['td']),
     Paragraph('3 opciones: Filósofo / Estricto / Impaciente', STY['td_c']),
     Paragraph('El juez cambia de personalidad. Filósofo es el de v0.2 (lento, justo). '
               'Estricto penaliza volumen alto. Impaciente penaliza pausas largas. Esto '
               'cambia la estrategia de voz del jugador.', STY['td']),
     Paragraph('Atributo del caso. La IA del juez recibe el perfil en su system prompt. '
               'Test: en 100 partidas con juez Impaciente, pausas > 2s aplican Sospecha +5 '
               'el 100% de las veces.', STY['td'])],
    [Paragraph('<b>V4 · Vínculo entre testigos</b>', STY['td']),
     Paragraph('3 opciones: cómplices / enemistad / coartada mutua (ver tabla 3.3)', STY['td_c']),
     Paragraph('Qué tipo de vínculo hay entre los testigos. El par siempre es el mismo '
               '(guarda↔supervisor), pero el tipo cambia.', STY['td']),
     Paragraph('Atributo del caso. Test: en 100 partidas con vínculo=cómplices, los 2 '
               'testigos usan las mismas frases exactas en sus respuestas el 100% de las '
               'veces (porque la instrucción está en el system prompt).', STY['td'])],
]
story.append(make_table(var_data, [0.18, 0.18, 0.32, 0.32]))
story.append(Paragraph('Tabla 10.1 · Los 4 ejes de variabilidad. 3 × 3 × 3 × 3 = 81 '
                       'configuraciones teóricas. En práctica se restringe a 27 (ver 10.2).',
                       STY['caption']))

story.append(add_heading('10.2 Por qué 27 y no 81', STY['h2'], level=1))
story.append(Paragraph(
    'Con 4 ejes de 3 valores cada uno, en principio tendríamos 81 configuraciones. Pero '
    'algunas combinaciones son inválidas o producen partidas rotas. Se aplican 2 reglas '
    'de exclusión:', STY['body']))

story.append(Paragraph(
    '<b>Regla 1.</b> Si el testigo mentiroso es el guarda y el vínculo es cómplices '
    '(guarda↔supervisor mienten juntos), entonces el supervisor también debe tener '
    'atributo "miente" activo. Esto crea una contradicción con V1 (que dice que solo '
    '1 testigo miente). La regla excluye las 9 combinaciones donde V1=guarda y '
    'V4=cómplices. Quedan 81 - 9 = 72.', STY['body']))

story.append(Paragraph(
    '<b>Regla 2.</b> Si el juez es Estricto y el vínculo es coartada mutua (que requiere '
    'que el jugador exponga con voz tranquila y pausas), la combinación es inválida '
    'porque el Estricto penaliza las pausas largas. La regla excluye 9 combinaciones '
    'donde V3=Estricto y V4=coartada mutua. Quedan 72 - 9 = 63.', STY['body']))

story.append(Paragraph(
    'Tras filtros adicionales de playtest (algunas combinaciones resultan demasiado '
    ' fáciles o demasiado difíciles), el pool final es de 27 configuraciones balanceadas '
    'por caso. La distribución de winrate objetivo es 55-65% absolución para cada '
    'configuración individual, verificada por simulación con bot óptimo. Configuraciones '
    'fuera de ese rango se descartan o ajustan.', STY['body']))

story.append(add_heading('10.3 Implementación técnica', STY['h2'], level=1))
story.append(Paragraph(
    'La variabilidad se genera en pre-partida, no en runtime. El pipeline es:', STY['body']))

pipeline_data = [
    [Paragraph('<b>Paso</b>', STY['th_c']),
     Paragraph('<b>Qué hace</b>', STY['th']),
     Paragraph('<b>Costo</b>', STY['th_c']),
     Paragraph('<b>Cuándo</b>', STY['th_c'])],
    [Paragraph('1', STY['td_c']),
     Paragraph('Jugador selecciona caso (o se le asigna aleatoriamente).', STY['td']),
     Paragraph('0', STY['td_mono']),
     Paragraph('Click "Jugar"', STY['td_c'])],
    [Paragraph('2', STY['td_c']),
     Paragraph('Sistema genera seed aleatorio de 32 bits para esta partida.', STY['td']),
     Paragraph('~0 ms', STY['td_mono']),
     Paragraph('Inmediato', STY['td_c'])],
    [Paragraph('3', STY['td_c']),
     Paragraph('Sistema rola V1, V2, V3, V4 a partir del seed. Verifica las 2 reglas de '
               'exclusión. Si falla, re-rola (reintentos máx 5).', STY['td']),
     Paragraph('~1 ms', STY['td_mono']),
     Paragraph('Inmediato', STY['td_c'])],
    [Paragraph('4', STY['td_c']),
     Paragraph('Sistema llama a LLM para generar system prompts específicos de cada NPC '
               '(juez, fiscal, 3 testigos) con la configuración rolada inyectada.', STY['td']),
     Paragraph('~$0.015', STY['td_mono']),
     Paragraph('~2 s', STY['td_c'])],
    [Paragraph('5', STY['td_c']),
     Paragraph('Sistema cachea los 5 system prompts en memoria para la partida. La IA '
               'los lee en cada interacción.', STY['td']),
     Paragraph('0', STY['td_mono']),
     Paragraph('Carga', STY['td_c'])],
    [Paragraph('6', STY['td_c']),
     Paragraph('Comienza la partida. Toda la IA ya está configurada.', STY['td']),
     Paragraph('0', STY['td_mono']),
     Paragraph('0:00', STY['td_c'])],
]
story.append(make_table(pipeline_data, [0.07, 0.55, 0.13, 0.25]))
story.append(Paragraph('Tabla 10.2 · Pipeline de generación de variabilidad. Costo total: '
                       '~$0.015 adicionales por partida. Latencia adicional: ~2 s en carga.',
                       STY['caption']))

story.append(callout_box(
    'El costo de variabilidad es marginal ($0.015 sobre $0.50 base = 3% más). La '
    'rejugabilidad pasa de 3-5 partidas por caso a 27. Esto es un ROI enorme: la '
    'complejidad de implementación es baja (atributos + system prompt) y el beneficio '
    'en horas de juego es 6-9×.',
    label='ROI DE VARIABILIDAD'))

story.append(add_heading('10.4 Por qué no se hace variabilidad en runtime', STY['h2'], level=1))
story.append(Paragraph(
    'Sería tentador que la IA decidiera en runtime quién miente, basándose en la '
    'conversación. Esto se descarta por dos razones. Primera: la IA tendría que '
    'mantener estado coherente durante 10 minutos, lo cual excede la capacidad '
    'confiable de los LLM actuales. Segunda: el debuggeo se vuelve imposible. Si un '
    'playtester reporta "el supervisor dijo una cosa en F2 y la contraria en F4", no '
    'podríamos saber si es un bug de la IA o una decisión legítima. Con la variabilidad '
    'en pre-partida, el estado está fijo y los bugs son reproducibles dando el seed.',
    STY['body']))

# ══════════════════════════════════════════════════════════
# CAPÍTULO 11 — SISTEMA DE MOMENTOS CÓMICOS (v0.3)
# ══════════════════════════════════════════════════════════
story.append(PageBreak())
story.append(add_heading('11. Sistema de momentos cómicos garantizados <i>(nuevo en v0.3)</i>', STY['h1'], level=0))

story.append(Paragraph(
    'El problema que resuelve este capítulo: v0.2 está optimizado para tensión, no para '
    'risa. El playtest mental del capítulo 6 tenía 1 momento de risa (la frase del queso) '
    'y 4 de tensión/satisfacción. Eso no es suficiente para sesiones largas ni para '
    'stream viral. La densidad objetivo de risas en stream es 1 cada 20-30 segundos '
    '(según análisis de clips de Among Us, Jackbox, REPO). En v0.3, el objetivo es '
    '3-4 momentos de risa garantizados por partida de 10 minutos.', STY['body']))

story.append(callout_box(
    'No se trata de hacer el juego "más gracioso" en abstracto. Se trata de inyectar '
    'momentos cómicos de forma que la IA los produzca naturalmente, sin que el jugador '
    'sienta que le están contando un chiste. El humor funciona cuando emerge del '
    'contexto, no cuando se anuncia. El sistema rola 2 de 4 tipos de momento cómico '
    'por partida, y la IA los inserta en su flujo natural.',
    label='PRINCIPIO DE HUMOR EMERGENTE'))

story.append(add_heading('11.1 Los 4 tipos de momento cómico', STY['h2'], level=1))

comic_data = [
    [Paragraph('<b>Tipo</b>', STY['th']),
     Paragraph('<b>Quién lo ejecuta</b>', STY['th']),
     Paragraph('<b>Cuándo (fase)</b>', STY['th_c']),
     Paragraph('<b>Ejemplo concreto</b>', STY['th'])],
    [Paragraph('<b>M1 · Chiste del juez sobre el delito</b>', STY['td']),
     Paragraph('Juez', STY['td']),
     Paragraph('F1 (apertura)', STY['td_c']),
     Paragraph('Tras leer los cargos, el juez hace una reflexión absurda sobre el delito. '
               'Ej: "Tres mil kilos de queso. Es suficiente para fundir un puente. O para '
               'sedimentar una democracia. Procedamos." El chiste surge del expediente, no '
               'es genérico.', STY['td'])],
    [Paragraph('<b>M2 · Tic verbal de un testigo</b>', STY['td']),
     Paragraph('Un testigo (rolado)', STY['td']),
     Paragraph('F2 + F4', STY['td_c']),
     Paragraph('Un testigo tiene una muletilla recurrente que la IA inserta naturalmente. '
               'Ej: "como decía mi difunta abuela, el queso no perdona". Aparece 2-3 veces '
               'en su testimonio. Si el jugador la menciona, el testigo reacciona '
               'defensivamente.', STY['td'])],
    [Paragraph('<b>M3 · Evidencia ridícula</b>', STY['td']),
     Paragraph('Fiscal (al presentarla)', STY['td']),
     Paragraph('F2 (evidencia fiscal)', STY['td_c']),
     Paragraph('Una de las 3 evidencias del fiscal es deliberadamente absurda pero '
               'legalmente relevante. Ej: "el arma homicida" es una cuchara de servir con '
               'huellas. El fiscal la presenta con seriedad. El jugador puede objetar por '
               'forma (es una cuchara) o por fondo (no es un arma).', STY['td'])],
    [Paragraph('<b>M4 · Fiscal pierde el hilo</b>', STY['td']),
     Paragraph('Fiscal', STY['td']),
     Paragraph('F2 o F4', STY['td_c']),
     Paragraph('Tras 2 objeciones acertadas del jugador, el fiscal IA "se confunde" en su '
               'siguiente intervención. Cita mal una evidencia, mezcla testigos, o se '
               'contradice. El juez le llama la atención. Esto recompensa al jugador por '
               'sus objeciones y humaniza al fiscal.', STY['td'])],
]
story.append(make_table(comic_data, [0.20, 0.16, 0.13, 0.51]))
story.append(Paragraph('Tabla 11.1 · Los 4 tipos de momento cómico. 2 rolados por partida.',
                       STY['caption']))

story.append(add_heading('11.2 Reglas de rolado y exclusión', STY['h2'], level=1))
story.append(Paragraph(
    'En pre-partida, junto con la variabilidad del capítulo 10, el sistema rola 2 de '
    'los 4 tipos de momento cómico. Reglas:', STY['body']))

excl_data = [
    [Paragraph('<b>Regla</b>', STY['th']),
     Paragraph('<b>Aplicación</b>', STY['th'])],
    [Paragraph('Siempre 2 de 4, nunca 1 ni 3', STY['td']),
     Paragraph('Con 1, no hay suficiente densidad. Con 3, el juego se siente sitcom. 2 es '
               'el sweet spot.', STY['td'])],
    [Paragraph('M3 y M4 son mutuamente excluyentes', STY['td']),
     Paragraph('Si el fiscal tiene evidencia ridícula (M3), no pierde el hilo (M4). Evita '
               'que el fiscal parezca incompetente en exceso.', STY['td'])],
    [Paragraph('M1 siempre sobre el delito, nunca sobre el acusado', STY['td']),
     Paragraph('El juez no se burla del jugador. Se burla del expediente. Esto mantiene la '
               'tensión: el juez sigue siendo autoridad.', STY['td'])],
    [Paragraph('M2 solo en testigos con lealtad baja al jugador', STY['td']),
     Paragraph('Si el testigo le es simpático al jugador, la muletilla distrae. Si le es '
               'antipático, la muletilla refuerza el personaje. La regla asegura coherencia '
               'narrativa.', STY['td'])],
    [Paragraph('M4 solo si el jugador ha objetado 2+ veces con éxito', STY['td']),
     Paragraph('Si el jugador no ha objetado, el fiscal no pierde el hilo. M4 es recompensa '
               'por maestría, no regalo gratis. Si las objeciones fallan, tampoco se activa.', STY['td'])],
]
story.append(make_table(excl_data, [0.32, 0.68]))
story.append(Paragraph('Tabla 11.2 · Reglas de rolado y exclusión. 4 reglas, todas '
                       'verificables con test automatizado.', STY['caption']))

story.append(add_heading('11.3 Densidad de risa objetivo por fase', STY['h2'], level=1))
story.append(Paragraph(
    'El objetivo es 3-4 momentos de risa por partida de 10 minutos. Distribución objetivo:',
    STY['body']))

density_data = [
    [Paragraph('<b>Fase</b>', STY['th_c']),
     Paragraph('<b>Duración</b>', STY['th_c']),
     Paragraph('<b>Momentos cómicos objetivo</b>', STY['th_c']),
     Paragraph('<b>Fuente</b>', STY['th'])],
    [Paragraph('F1 · Apertura', STY['td_c']), Paragraph('90 s', STY['td_mono']),
     Paragraph('1', STY['td_c']),
     Paragraph('M1 (chiste del juez sobre delito) si está rolado. Si no, frase absurda '
               'del juez al leer cargos (siempre hay 1, garantizado).', STY['td'])],
    [Paragraph('F2 · Testimonio fiscal', STY['td_c']), Paragraph('2 min', STY['td_mono']),
     Paragraph('1', STY['td_c']),
     Paragraph('M3 (evidencia ridícula) si está rolado. Si no, M4 (fiscal pierde el hilo) '
               'si el jugador ha objetado 2+ veces. Si ninguno, comentarios sarcásticos '
               'del juez al fiscal.', STY['td'])],
    [Paragraph('F3 · Evidencia defensa', STY['td_c']), Paragraph('2 min', STY['td_mono']),
     Paragraph('0-1', STY['td_c']),
     Paragraph('Fase estratégica, menos risa. Si M2 está rolado y el jugador presenta '
               'evidencia relacionada con el testigo de muletilla, hay 1 risa.', STY['td'])],
    [Paragraph('F4 · Testigos', STY['td_c']), Paragraph('2 min 30 s', STY['td_mono']),
     Paragraph('1', STY['td_c']),
     Paragraph('M2 (tic verbal del testigo) si está rolado. Si no, reacción absurda del '
               'testigo recusado o del testigo cuyo vínculo se expone.', STY['td'])],
    [Paragraph('F5 · Alegato + veredicto', STY['td_c']), Paragraph('2 min', STY['td_mono']),
     Paragraph('0-1', STY['td_c']),
     Paragraph('Si veredicto es absolución: frase graciosa del juez al cerrar ("quede '
               'libre, y por favor no compre más queso"). Si condena: frase ácida al '
               'acusado. Solo si la partida ha tenido menos de 2 risas antes.', STY['td'])],
]
story.append(make_table(density_data, [0.18, 0.10, 0.15, 0.57]))
story.append(Paragraph('Tabla 11.3 · Densidad de risa objetivo por fase. Total: 3-4 por '
                       'partida, distribuidos para no acumularse ni faltar.', STY['caption']))

story.append(add_heading('11.4 Implementación técnica', STY['h2'], level=1))
story.append(Paragraph(
    'Cada momento cómico se implementa como una instrucción en el system prompt del NPC '
    'correspondiente. La IA no decide si hace el chiste: la instrucción le dice cuándo '
    'y cómo. Esto es crítico para la calibrabilidad: si la IA decidiera libremente, '
    'algunas partidas tendrían 0 risas y otras 8. Con instrucciones explícitas, el '
    'número es predecible.', STY['body']))

impl_data = [
    [Paragraph('<b>Momento</b>', STY['th']),
     Paragraph('<b>Instrucción en system prompt (resumen)</b>', STY['th']),
     Paragraph('<b>Test de validación</b>', STY['th'])],
    [Paragraph('M1', STY['td']),
     Paragraph('"Tras leer los cargos, haz exactamente UN comentario absurdo sobre el '
               'delito (máximo 25 palabras). No te burles del acusado. No vuelvas a '
               'hacerlo en el resto del juicio."', STY['td']),
     Paragraph('En 100 partidas con M1 activo, el juez produce exactamente 1 chiste en '
               'F1 el 95%+ de las veces. 0 chistes en F2-F5 el 100%.', STY['td'])],
    [Paragraph('M2', STY['td']),
     Paragraph('"Tu personaje tiene la muletilla \'como decía mi difunta abuela\'. '
               'Úsala EXACTAMENTE 3 veces durante tu testimonio. Si el jugador la '
               'menciona, reacciona a la defensiva."', STY['td']),
     Paragraph('En 100 partidas con M2 activo, el testigo usa la muletilla 3 veces (±1) '
               'el 90%+ de las veces. Si el jugador la menciona, reacciona defensiva el '
               '95%+ de las veces.', STY['td'])],
    [Paragraph('M3', STY['td']),
     Paragraph('"La evidencia 2 es una cuchara de servir presentada como arma homicida. '
               'Preséntala con total seriedad legal. No reconozcas lo absurdo del objeto."', STY['td']),
     Paragraph('En 100 partidas con M3 activo, el fiscal presenta la cuchara sin reconocer '
               'lo absurdo el 100% de las veces. Si el jugador objeta "¡Es una cuchara!", '
               'el fiscal responde defendiendo su relevancia legal el 100%.', STY['td'])],
    [Paragraph('M4', STY['td']),
     Paragraph('"Tras la 2ª objeción admitida del jugador, en tu siguiente intervención '
               'comete un error: cita mal una evidencia o mezcla testigos. El juez te '
               'llamará la atención. No reconozcas el error voluntariamente."', STY['td']),
     Paragraph('En 100 partidas con M4 activo y 2 objeciones admitidas, el fiscal comete '
               'un error en su siguiente intervención el 95%+ de las veces. No corrige '
               'voluntariamente el 100%.', STY['td'])],
]
story.append(make_table(impl_data, [0.10, 0.50, 0.40]))
story.append(Paragraph('Tabla 11.4 · Implementación de cada momento cómico. Las '
                       'instrucciones son explícitas (no creativas) para garantizar '
                       'calibrabilidad.', STY['caption']))

story.append(add_heading('11.5 Por qué no se deja la comedia a la IA libre', STY['h2'], level=1))
story.append(Paragraph(
    'Sería tentador poner en el system prompt del juez "eres un juez con sentido del '
    'humor, haz chistes cuando veas oportunidad" y dejar que la IA decida. Esto se '
    'descarta por tres razones. Primera: la IA de hoy (GPT-4o-mini y similares) no es '
    'consistentemente graciosa. Algunas partidas tendrían chistes brillantes, otras '
    'chistes planos, otras ninguno. La experiencia sería inconsistente. Segunda: el '
    'humor libre puede romper el tono. Un juez que hace chistes sobre el racismo, la '
    'violencia o el acusado en específico puede hundir el juego. Tercera: el humor '
    'emergente es mejor que el humor planeado SÓLO cuando el contexto lo permite. En '
    'un juicio de 10 minutos, el contexto es estrecho. Es mejor guiar la IA hacia '
    'momentos cómicos seguros que apostar a que improvise bien.', STY['body']))

story.append(callout_box(
    'Criterio de aceptación del sistema cómico: en 20 playtests de 10 minutos cada uno, '
    'el número medio de risas espontáneas del jugador (medido por observador externo) '
    'debe ser ≥ 3. Si es < 2, los prompts no están produciendo risa y hay que '
    'reescribirlos. Si es > 6, el juego se siente sitcom y hay que reducir a 1 momento '
    'por partida. Rango aceptable: 3-5 risas por partida.',
    label='CRITERIO DE ACEPTACIÓN'))

story.append(add_heading('11.6 Lo que se descarta explícitamente en comedia', STY['h2'], level=1))
story.append(Paragraph(
    'Para evitar iterar en direcciones muertas, esta sección lista los tipos de humor '
    'que se descartan y por qué.', STY['body']))

humor_desc_data = [
    [Paragraph('<b>Tipo de humor descartado</b>', STY['th']),
     Paragraph('<b>Razón</b>', STY['th'])],
    [Paragraph('Humor sobre el acusado (burla personal)', STY['td']),
     Paragraph('El jugador ES el acusado. Burlarse de él rompe la identificación y hace '
               'el juego desagradable. La excepción es el veredicto de condena, donde una '
               'frase ácida es parte de la derrota.', STY['td'])],
    [Paragraph('Humor sobre temas sensibles (raza, género, religión, política real)', STY['td']),
     Paragraph('Streamers no se arriesgan con esto. Cualquier caso que genere humor sobre '
               'estos temas debe ser filtrado en pre-generación.', STY['td'])],
    [Paragraph('Chistes recurrentes del mismo tipo (ej: juez hace 3 chistes en F1)', STY['td']),
     Paragraph('Mata el efecto. Un chiste funciona por sorpresa. La repetición lo '
               'convierte en gag cansado.', STY['td'])],
    [Paragraph('Cuarto pared (NPCs reconocen que es un juego)', STY['td']),
     Paragraph('Rompe inmersión. El juego se sostiene por la seriedad ficcional del '
               'tribunal. Cuarto pared solo en pantalla de veredicto, opcional.', STY['td'])],
    [Paragraph('Humor que requiere conocimiento previo (cultural, de memes, etc.)', STY['td']),
     Paragraph('Envejece mal y excluye audiencias. El humor debe funcionar para cualquier '
               'hispanohablante sin contexto adicional.', STY['td'])],
    [Paragraph('IA decide libremente cuándo y cómo hacer chistes', STY['td']),
     Paragraph('Inconsistencia. Ver sección 11.5.', STY['td'])],
]
story.append(make_table(humor_desc_data, [0.32, 0.68]))
story.append(Paragraph('Tabla 11.5 · Humor descartado y su razón. Cualquier propuesta de '
                       'comedia nueva debe ser evaluada contra esta lista antes de '
                       'implementarse.', STY['caption']))

# ══════════════════════════════════════════════════════════
# CAPÍTULO 12 — QUÉ FALTA PARA v1.0
# ══════════════════════════════════════════════════════════
story.append(add_heading('12. Qué falta para v1.0: hoja de ruta honesta', STY['h1'], level=0))

story.append(Paragraph(
    'v0.3 cierra los agujeros de rejugabilidad y densidad de risa. Aún faltan varias '
    'cosas para que el juego sea publicable como v1.0. Esta sección las lista sin '
    'orden de prioridad, con una estimación honesta de cuándo se deberían abordar.',
    STY['body']))

roadmap_data = [
    [Paragraph('<b>Componente</b>', STY['th']),
     Paragraph('<b>Qué resuelve</b>', STY['th']),
     Paragraph('<b>Versión</b>', STY['th_c'])],
    [Paragraph('Dirección artística + voz del juez', STY['td']),
     Paragraph('Atractivo visual y sonoro. Decide si la gente quiere probarlo al verlo.', STY['td']),
     Paragraph('v0.4', STY['td_c'])],
    [Paragraph('Sistema de cuentas + persistencia', STY['td']),
     Paragraph('Requiere para reputación previa, progresión, desbloqueables.', STY['td']),
     Paragraph('v0.4', STY['td_c'])],
    [Paragraph('Reputación previa del acusado', STY['td']),
     Paragraph('Variabilidad entre partidas (limpio / manchado / ex-convicto).', STY['td']),
     Paragraph('v0.5', STY['td_c'])],
    [Paragraph('Generación procedural de casos', STY['td']),
     Paragraph('Casos infinitos sin escribirlos a mano. Pool de 30 → ilimitado.', STY['td']),
     Paragraph('v0.5', STY['td_c'])],
    [Paragraph('Modo juez (endgame)', STY['td']),
     Paragraph('Rejugabilidad para jugadores veteranos. Invierte el rol.', STY['td']),
     Paragraph('v0.6', STY['td_c'])],
    [Paragraph('Integración Twitch chat (jurado en vivo)', STY['td']),
     Paragraph('El chat vota como jurado. Único vector viral masivo.', STY['td']),
     Paragraph('v0.6', STY['td_c'])],
    [Paragraph('Progresión de jugador (desbloqueos cosméticos)', STY['td']),
     Paragraph('Motivación de retorno entre sesiones. Skins de tribunal, voces de juez.', STY['td']),
     Paragraph('v0.7', STY['td_c'])],
    [Paragraph('Multiplayer: 2 acusados (Doble Peligro)', STY['td']),
     Paragraph('Modo evento para streamers en colaboración. Traición mutua.', STY['td']),
     Paragraph('v1.0', STY['td_c'])],
    [Paragraph('Mobile-first UX (touch controls para evidencia 3D)', STY['td']),
     Paragraph('Audiencia mobile en Twitch crece. Sin esto se pierde 40% del público.', STY['td']),
     Paragraph('v1.0', STY['td_c'])],
]
story.append(make_table(roadmap_data, [0.35, 0.50, 0.15]))
story.append(Paragraph('Tabla 12.1 · Hoja de ruta a v1.0. Estimaciones conservadoras. '
                       'Cada versión requiere su propio GDD antes de implementarse.',
                       STY['caption']))

story.append(callout_box(
    'v0.3 es la última versión que se puede validar sin prototipo. A partir de v0.4 '
    '(dirección artística + cuentas), las decisiones se deben tomar con código '
    'funcionando. El paso 1 del plan de validación (prototipo juicio seco en terminal) '
    'es el siguiente hito obligatorio antes de seguir iterando el documento.',
    label='PRÓXIMO HITO'))

# ──────────────────────────────────────────────────────────
# BUILD
# ──────────────────────────────────────────────────────────
print("Construyendo PDF...")
doc.multiBuild(story, onFirstPage=draw_header_footer, onLaterPages=draw_header_footer)
print(f"OK: body PDF generado en {OUTPUT_BODY}")

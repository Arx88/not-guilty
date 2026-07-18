"""
GDD parte 3 — Capítulos 3 (Mecánicas), 4 (Medidores), 5 (Modelo de fallos)
Añadir a `story` continuando desde parte 2.
"""

# ══════════════════════════════════════════════════════════
# CAPÍTULO 3 — MECÁNICAS CORE
# ══════════════════════════════════════════════════════════
story.append(PageBreak())
story.append(add_heading('3. Mecánicas core: las 5 piezas que componen el juego', STY['h1'], level=0))

story.append(Paragraph(
    'Cada una de las 5 mecánicas siguientes se describe con la misma estructura: qué hace '
    'el jugador, qué hace la IA, qué cambian los medidores, cuáles son sus modos de fallo '
    'y por qué es divertida. Si una mecánica no puede contestar las cuatro preguntas, '
    'no entra al juego.', STY['body']))

# ── 3.1 Objeción por voz ──────────────────────────────────
story.append(add_heading('3.1 Mecánica 1 · Objeción por voz', STY['h2'], level=1))

story.append(Paragraph('<b>Qué hace el jugador.</b> Durante el testimonio del fiscal (F2) y los '
    'testigos (F4), ciertas frases de la IA abren una "ventana de objeción" de 3 segundos. '
    'El jugador debe gritar "¡Protesto!" o "¡Objeción!" dentro de esa ventana. La detección '
    'se hace por reconocimiento de palabras clave en Web Speech API más umbral de volumen '
    '(debe superar -30 dBFS para contar como "gritada"). Si el jugador protesta fuera de '
    'ventana, no pasa nada (no hay penalización directa, pero pierde la oportunidad).', STY['body']))

story.append(Paragraph('<b>Qué hace la IA.</b> Si la objeción cae en ventana, el juez IA '
    'detiene al fiscal/testigo, le pide al jugador que fundamente (habla libre 5 segundos) '
    'y decide en 2 segundos si la admite o la rechaza. La decisión se toma con un clasificador '
    'que evalúa si el fundamento del jugador es relevante para el tipo de objeción '
    '(forma, relevancia, conclusión, conducta). El juez explica la decisión en voz alta '
    'con una frase generada.', STY['body']))

story.append(Paragraph('<b>Qué cambian los medidores.</b> Objeción admitida: Sospecha -8, '
    'Credibilidad +5. Objeción rechazada: Sospecha +5, Credibilidad -3. Objeción acertada '
    'con fundamento débil (irrelevante): Sospecha +2, Credibilidad -1. Silencio en ventana: '
    'no afecta medidores, pero pierde la oportunidad.', STY['body']))

story.append(Paragraph('<b>Modos de fallo.</b> El jugador puede intentar objetar a todo '
    '(spamming). El juez tiene un contador: tras 3 objeciones rechazadas consecutivas, '
    'interviene con "Señor acusado, la paciencia del tribunal tiene límite. La próxima '
    'objeción infundada le costará 10 puntos de Credibilidad" y aplica la penalización '
    'en la cuarta. Esto evita el exploit de spam de objeciones.', STY['body']))

story.append(Paragraph('<b>Por qué es divertida.</b> Tres fuentes de diversión concurrentes: '
    '(1) <i>Maestría perceptiva</i>, el jugador se siente inteligente por detectar la '
    'trampa del fiscal; (2) <i>Acción física</i>, gritar "¡Protesto!" en un stream es '
    'performativo y clippeable por sí mismo; (3) <i>Tensión de timing</i>, los 3 segundos '
    'de ventana son suficientes para decidir pero no para dudar mucho. La combinación '
    'de las tres fuentes hace que la mecánica se sienta como un mini-juego dentro del juicio.', STY['body']))

# ── 3.2 Contra-interrogatorio libre ──────────────────────
story.append(add_heading('3.2 Mecánica 2 · Contra-interrogatorio libre', STY['h2'], level=1))

story.append(Paragraph('<b>Qué hace el jugador.</b> Tras cada declaración de un testigo (F4) '
    'o del fiscal (F2), el juez ofrece al jugador "¿Desea contrainterrogar?". El jugador '
    'tiene 8 segundos para aceptar diciendo "Sí" o rechazar diciendo "No". Si acepta, '
    'habla libremente hasta 20 segundos. La IA transcribe, identifica la intención '
    '(pregunta por hecho, por motivación, por contradicción, por emoción) y responde '
    'en consecuencia.', STY['body']))

story.append(Paragraph('<b>Qué hace la IA.</b> El testigo IA tiene tres atributos internos: '
    '<i>memoria</i> (lo que vio), <i>agenda</i> (lo que quiere que el tribunal crea) y '
    '<i>lealtad</i> (cuánto protege al acusado o al fiscal). Cuando el jugador pregunta, '
    'la IA decide si dice la verdad, miente, evade o se contradice, basándose en esos '
    'atributos. Una IA con lealtad alta al fiscal responderá de forma que perjudique al '
    'acusado aunque sea mentira. Una IA con lealtad neutra puede ser movida por simpatía '
    'si el jugador es amable.', STY['body']))

story.append(Paragraph('<b>Qué cambian los medidores.</b> Pregunta que expone contradicción: '
    'Sospecha -10, Simpatía del jurado +3. Pregunta irrelevante o repetida: Sospecha +3, '
    'Paciencia del juez -1. Pregunta agresiva al testigo simpático: Simpatía -5. Pregunta '
    'empática: Simpatía +4, lealtad del testigo hacia el jugador +1 (esto puede hacer que '
    'cambie de bando en su siguiente respuesta).', STY['body']))

story.append(Paragraph('<b>Modos de fallo.</b> El jugador puede acosar al testigo (insultos, '
    'gritos, preguntas absurdas). El juez tiene umbral de paciencia: 3 violaciones y el '
    'juez interviene con "¡Orden en la sala!" y aplica -10 a Credibilidad. La 5ª violación '
    'es desacato: el juicio termina con veredicto automático de culpable. Esto previene '
    'el comportamiento tóxico del jugador.', STY['body']))

story.append(Paragraph('<b>Por qué es divertida.</b> Es la mecánica con mayor skill ceiling: '
    'un jugador experto puede destrozar a un testigo en 20 segundos con la pregunta correcta. '
    'Un jugador novato puede flirtear con un testigo para que cambie de bando. La diversión '
    'viene de la <i>emergencia</i>: las combinaciones de memoria + agenda + lealtad generan '
    'situaciones que el diseñador no podría haber pre-escrito. Comparación: es la mecánica '
    'más cercana a <i>The Yawhg</i> o <i>Sleeping Beast</i>, donde la conversación libre '
    'genera historias únicas.', STY['body']))

# ── 3.3 Evidencia física 3D ───────────────────────────────
story.append(add_heading('3.3 Mecánica 3 · Evidencia física 3D', STY['h2'], level=1))

story.append(Paragraph('<b>Qué hace el jugador.</b> En F3 el tribunal muestra un inventario '
    '3D de objetos (típicamente 6-10): fotos, documentos, armas potenciales, recordings, '
    'objetos personales del acusado. El jugador arrastra uno al estrado con click-drag '
    '(en móvil, touch-drag). Cuando lo suelta sobre el estrado, el objeto aparece en 3D '
    'giratorio y el jugador tiene 30 segundos para explicar qué es y por qué importa.', STY['body']))

story.append(Paragraph('<b>Qué hace la IA.</b> El fiscal IA escucha la explicación y '
    'responde: puede objetar (si la evidencia es impertinente), contra-argumentar (si la '
    'evidencia ayuda al acusado pero también al fiscal), o aceptarla (si es neutral o '
    'perjudica al acusado). El juez decide si la evidencia se admite. Cada evidencia tiene '
    'una etiqueta oculta de tipo: <i>exculpatoria</i> (ayuda al acusado), <i>incriminatoria</i> '
    '(le perjudica) o <i>ambigua</i> (depende de cómo se explique).', STY['body']))

ev_data = [
    [Paragraph('<b>Tipo de evidencia</b>', STY['th']), Paragraph('<b>Efecto si se explica bien</b>', STY['th']),
     Paragraph('<b>Efecto si se explica mal</b>', STY['th']), Paragraph('<b>Frecuencia en un caso</b>', STY['th_c'])],
    [Paragraph('Exculpatoria', STY['td']),
     Paragraph('Sospecha -12, Credibilidad +8', STY['td']),
     Paragraph('Sospecha -2 (efecto mínimo)', STY['td']),
     Paragraph('2–3', STY['td_c'])],
    [Paragraph('Incriminaria', STY['td']),
     Paragraph('Sospecha -3 (daño controlado)', STY['td']),
     Paragraph('Sospecha +12 (daño máximo)', STY['td']),
     Paragraph('1–2', STY['td_c'])],
    [Paragraph('Ambigua', STY['td']),
     Paragraph('Sospecha -6, Simpatía +4', STY['td']),
     Paragraph('Sospecha +6, Simpatía -2', STY['td']),
     Paragraph('2–4', STY['td_c'])],
    [Paragraph('Trampa (parece exculpatoria pero es incriminaria)', STY['td']),
     Paragraph('Sospecha +5 (daño parcial)', STY['td']),
     Paragraph('Sospecha +15 (daño severo)', STY['td']),
     Paragraph('0–1', STY['td_c'])],
]
story.append(make_table(ev_data, [0.28, 0.26, 0.26, 0.20]))
story.append(Paragraph('Tabla 3.1 · Tipos de evidencia y sus efectos en los medidores.', STY['caption']))

story.append(Paragraph('<b>Modos de fallo.</b> El jugador puede no presentar ninguna evidencia '
    'en F3. Si se agota el tiempo sin presentar nada, el juez interviene con "La defensa '
    'renuncia a presentar evidencia. Procederemos." y aplica -10 a Credibilidad. El jugador '
    'puede presentar la misma evidencia dos veces: el juez la rechaza la segunda vez con '
    '"Ya tenemos esa evidencia en acta" sin penalización pero perdiendo el turno.', STY['body']))

story.append(Paragraph('<b>Por qué es divertida.</b> Dos fuentes: (1) <i>Maestría estratégica</i>, '
    'decidir qué evidencia presentar y en qué orden es un puzzle de optimización bajo presión '
    'temporal; (2) <i>Emergencia narrativa</i>, la forma en que el jugador explica el objeto '
    'puede convertir una evidencia incriminatoria en exculpatoria o viceversa, lo que da '
    'una sensación de autoría. La interacción 3D drag-and-drop sobre el estrado también es '
    'visualmente atractiva para stream.', STY['body']))

# ── 3.4 Memoria del acusado ───────────────────────────────
story.append(add_heading('3.4 Mecánica 4 · Memoria del acusado', STY['h2'], level=1))

story.append(Paragraph('<b>Qué hace el jugador.</b> El jugador tiene acceso a un panel de '
    '"Recuerdos" (típicamente 5-7 fragmentos de memoria del acusado: una imagen, una '
    'frase, un lugar, una persona). Estos recuerdos se van revelando a medida que el '
    'juicio avanza: algunos al inicio de F1, otros cuando un testigo menciona algo '
    'relacionado, otros cuando se presenta cierta evidencia. El jugador puede invocar '
    'un recuerdo durante F4 gritando "¡Recuerdo!" seguido de una palabra clave.', STY['body']))

story.append(Paragraph('<b>Qué hace la IA.</b> Cuando el jugador invoca un recuerdo, la '
    'escena 3D se detiene, aparece el recuerdo como overlay, y el jugador debe conectarlo '
    'con un testigo presente o una evidencia presentada. Si la conexión es correcta, '
    'el testigo revela información adicional o se desmorona. Si es incorrecta, el juez '
    'interviene con "Señor acusado, eso es irrelevante para lo que se discute" (-3 Credibilidad).', STY['body']))

story.append(Paragraph('<b>Qué cambian los medidores.</b> Recuerdo correcto conectado a '
    'testigo: Sospecha -8, ese testigo pierde 2 puntos de lealtad al fiscal. Recuerdo '
    'correcto conectado a evidencia: Credibilidad +6, Simpatía +3. Recuerdo invocado sin '
    'conexión: Credibilidad -3. Recuerdo invocado más de una vez: el juez lo rechaza sin '
    'penalización pero perdiendo el turno.', STY['body']))

story.append(Paragraph('<b>Modos de fallo.</b> El jugador puede invocar recuerdos al azar. '
    'El sistema limita a 2 invocaciones erróneas por F4: la tercera invocación sin conexión '
    'activa "Señor acusado, está usando el tribunal como terapia. Una más y le retiro '
    'la palabra." y silencia al jugador 30 segundos. Esto previene el brute-force de recuerdos.', STY['body']))

story.append(Paragraph('<b>Por qué es divertida.</b> Es la mecánica más parecida a '
    '<i>Return of the Obra Dinn</i> o <i>Her Story</i>: el jugador tiene pistas que '
    'encajan como un puzzle, y el momento "¡Ah, ya entiendo!" es intrínsecamente '
    'gratificante. Además, al ser invocada por voz y en medio del juicio, añade un '
    'componente performativo que los juegos de puzzle estáticos no tienen. La revelación '
    'de recuerdos es también un motor de rejugabilidad: en una partida el jugador puede '
    'no descubrir un recuerdo clave, y en la siguiente encontrarlo por una ruta distinta.', STY['body']))

# ── 3.5 Medidores de voz (tono) ──────────────────────────
story.append(add_heading('3.5 Mecánica 5 · Medidores de voz (tono, volumen, pausas)', STY['h2'], level=1))

story.append(Paragraph('<b>Qué hace el jugador.</b> Cada vez que el jugador habla (en '
    'cualquier fase), el sistema mide tres variables en tiempo real con Web Audio API: '
    'volumen medio (dBFS), velocidad de habla (palabras por minuto) y patrón de pausas '
    '(duración y frecuencia). Estos tres valores no se muestran al jugador directamente: '
    'se inyectan en el contexto de la IA como "estado emocional inferido del acusado".', STY['body']))

story.append(Paragraph('<b>Qué hace la IA.</b> El juez y los jurados tienen sesgos de '
    'personalidad que reaccionan al estado emocional inferido. Un juez "Estricto" penaliza '
    'volumen alto (gritar = desacato). Un juez "Empático" premia pausas largas (indican '
    'reflexión). Un jurado "Popular" premia velocidad alta y volumen medio (parece '
    'seguro de sí mismo). Hay 6 perfiles de juez y 5 de jurado, todos documentados en '
    'el Anexo A.', STY['body']))

voice_data = [
    [Paragraph('<b>Variable</b>', STY['th']), Paragraph('<b>Rango normal</b>', STY['th_c']),
     Paragraph('<b>Sesgo típico</b>', STY['th'])],
    [Paragraph('Volumen medio', STY['td']), Paragraph('-35 a -15 dBFS', STY['td_mono']),
     Paragraph('Juez Estricto penaliza > -20 dBFS. Juez Empático no le importa.', STY['td'])],
    [Paragraph('Velocidad de habla', STY['td']), Paragraph('120 a 180 ppm', STY['td_mono']),
     Paragraph('Jurado Popular premia 150-180. Juez Filósofo prefiere < 130.', STY['td'])],
    [Paragraph('Pausa más larga', STY['td']), Paragraph('0.4 a 2.5 s', STY['td_mono']),
     Paragraph('Juez Empático premia > 1.5 s. Juez Impaciente penaliza > 2 s.', STY['td'])],
    [Paragraph('Vacilaciones ("ehm", "bueno")', STY['td']), Paragraph('0 a 8 por minuto', STY['td_mono']),
     Paragraph('Fiscal IA las detecta como debilidad y ataca. Jurado Empático lo ve como sinceridad.', STY['td'])],
]
story.append(make_table(voice_data, [0.28, 0.22, 0.50]))
story.append(Paragraph('Tabla 3.2 · Variables de voz medidas y sus sesgos en la IA.', STY['caption']))

story.append(Paragraph('<b>Modos de fallo.</b> El jugador puede intentar callarse '
    'completamente. Si pasa más de 20 segundos sin hablar en una fase donde debe hablar, '
    'el juez interviene con "Señor acusado, ¿está bien? Si no responde, interpretaré '
    'su silencio como renuencia a cooperar." y aplica Sospecha +5 por cada 20 segundos '
    'adicionales. Esto previene el exploit del silencio. El jugador puede susurrar para '
    'evitar detección de volumen: el umbral mínimo es -50 dBFS, por debajo el sistema '
    'considera que no está hablando.', STY['body']))

story.append(Paragraph('<b>Por qué es divertida.</b> Es la mecánica más innovadora del '
    'juego y la que justifica el micrófono como input. La diversión viene de dos fuentes: '
    '(1) <i>Autoconciencia performativa</i>, el jugador se da cuenta de que está siendo '
    'evaluado por cómo habla, no solo por qué dice, lo que cambia su comportamiento '
    'físicamente (literalmente se sienta más derecho); (2) <i>Sorpresa emergente</i>, '
    'el jugador puede descubrir que gritar "¡Protesto!" le funcionó contra el juez '
    'impaciente pero le reventó contra el juez estricto. Esta es la mecánica que más '
    'clips genera en stream: los momentos donde el streamer grita y la IA le dice '
    '"Señor, modere su tono" son oro.', STY['body']))

# ── 3.6 Recusación de jurado ──────────────────────────────
story.append(add_heading('3.6 Mecánica 6 · Recusación de jurado <i>(nueva en v0.2)</i>', STY['h2'], level=1))

story.append(Paragraph('<b>Qué hace el jugador.</b> En cualquier momento de F4 (testigos), '
    'el jugador puede gritar "¡Recusación!" seguido del número de silla del jurado que '
    'quiere recusar (por ejemplo, "¡Recusación, jurado tres!"). Solo tiene 1 recusación '
    'por partida. La recusación es gratuita: no hay penalización si falla. Tras la '
    'recusación, el juez pide al jugador que fundamente (10 segundos de habla libre) '
    'y decide si retira al jurado o lo mantiene.', STY['body']))

story.append(Paragraph('<b>Qué hace la IA.</b> El juez evalúa el fundamento contra el '
    'estado real del jurado. Cada jurado tiene un atributo oculto llamado <i>sesgo manifiesto</i> '
    'que sube cuando el jurado ha hecho algo observable incompatible con su rol '
    '(reírse cuando el acusado tropieza, fruncir el ceño ante evidencia exculpatoria, '
    'susurrar al jurado vecino). Si el sesgo manifiesto del jurado recusado está por '
    'encima de 60, el juez retira al jurado. Si está por debajo, lo mantiene.', STY['body']))

story.append(Paragraph('<b>Qué cambian los medidores.</b> Recusación acertada: el jurado '
    'se retira, su voto en F5 se elimina (necesitas 2 de 4 en lugar de 3 de 5). '
    'Recusación fallida: el jurado se queda pero su simpatía individual baja 10 puntos '
    '(se siente atacado). En ambos casos, la simpatía de los otros jurados no cambia: '
    'saben que era tu derecho recusar.', STY['body']))

story.append(Paragraph('<b>Modos de fallo.</b> El jugador puede gritar "¡Recusación!" '
    'sin número de silla. El sistema pide aclaración: "¿A qué jurado se refiere?". Si '
    'el jugador no responde en 5 segundos, la recusación se anula sin consumo (no '
    'cuenta como usada). El jugador puede intentar recusar al juez (no al jurado): el '
    'juez responde "Señor acusado, no soy yo quien está siendo evaluado" y aplica '
    'Sospecha +5 por pérdida de tiempo. La recusación se consume en este caso.', STY['body']))

story.append(Paragraph('<b>Cómo se calibra.</b> El atributo "sesgo manifiesto" es un '
    'contador numérico que se incrementa con eventos predefinidos (risa = +20, ceño '
    'fruncido = +10, susurro = +15). El umbral de 60 es ajustable: si en playtests el '
    'winrate de recusaciones acertadas es menor al 40%, subir el umbral a 70 (más '
    'difícil). Si es mayor al 70%, bajar a 50 (más fácil). Test automatizado: generar '
    '100 casos, en cada uno forzar un jurado con sesgo manifiesto = 80, verificar que '
    'el bot óptimo acierte la recusación el 90% de las veces.', STY['body']))

story.append(Paragraph('<b>Por qué es divertida.</b> Es la mecánica con mayor riesgo '
    'y mayor recompensa: gastas tu única recusación en el jurado equivocado y pierdes '
    'el caso. Pero si aciertas, el momento de "leí al jurado, sabía que me odiaba" es '
    'de los más satisfactorios del juego. En stream, los momentos donde el streamer '
    'delibera en voz alta "este jurado tres me miró mal cuando presenté la evidencia, '
    'lo recuso" son oro clippeable. La información está en el entorno visual (animación '
    'del jurado), no en un menú: el jugador tiene que mirar a los jurados, no a la UI.', STY['body']))

# ── 3.7 Vínculos entre testigos ───────────────────────────
story.append(add_heading('3.7 Mecánica 7 · Vínculos entre testigos <i>(nueva en v0.2)</i>', STY['h2'], level=1))

story.append(Paragraph('<b>Qué hace el jugador.</b> Cada caso tiene exactamente 1 par '
    'de testigos con un vínculo entre ellos. El jugador puede descubrir el vínculo '
    'haciendo preguntas a un testigo sobre el otro. Si lo expone correctamente durante '
    'F4, gana un bonus en credibilidad. Si no lo descubre, no pasa nada (no hay '
    'penalización por no encontrarlo). El vínculo es de uno de tres tipos, fijo por '
    'caso y generado como atributo del caso, no como runtime emergente.', STY['body']))

vinc_data = [
    [Paragraph('<b>Tipo de vínculo</b>', STY['th']),
     Paragraph('<b>Qué significa</b>', STY['th']),
     Paragraph('<b>Bonus si se expone</b>', STY['th_c']),
     Paragraph('<b>Pista observable</b>', STY['th'])],
    [Paragraph('Cómplices', STY['td']),
     Paragraph('Mienten juntos para protegerse mutuamente. Sus testimonios se confirman '
               'sospechosamente.', STY['td']),
     Paragraph('Credibilidad +10<br/>Sospecha -8<br/>Ambos jurados pierden lealtad al fiscal', STY['td_c']),
     Paragraph('Usan las mismas frases exactas. Un testigo responde "no recuerdo" a '
               'preguntas que el otro respondió en detalle.', STY['td'])],
    [Paragraph('Enemistad', STY['td']),
     Paragraph('Se odian. Cada uno intenta inculpar al otro.', STY['td']),
     Paragraph('Credibilidad +6<br/>Simpatía +5 (jurado ve al acusado como víctima de una trampa)', STY['td_c']),
     Paragraph('Cuando un testigo menciona al otro, su tono de voz cambia (la IA lo '
               'detecta y lo marca en su respuesta).', STY['td'])],
    [Paragraph('Coartada mutua', STY['td']),
     Paragraph('Se confirman el uno al otro. Pero la coartada es falsa y se contradice '
               'con un detalle menor.', STY['td']),
     Paragraph('Credibilidad +12<br/>Sospecha -10', STY['td_c']),
     Paragraph('Ambos mencionan la misma hora exacta sin que se la hayan preguntado. '
               'Demasiado ensayado.', STY['td'])],
]
story.append(make_table(vinc_data, [0.16, 0.30, 0.24, 0.30]))
story.append(Paragraph('Tabla 3.3 · Tipos de vínculos entre testigos. Solo 1 vínculo por caso.', STY['caption']))

story.append(Paragraph('<b>Qué hace la IA.</b> El atributo del caso "vínculo = cómplices" '
    'se inyecta en el system prompt de ambos testigos. La IA ya no razona sobre un '
    'grafo: solo lee una etiqueta. Si el jugador pregunta al testigo A sobre el testigo B, '
    'la IA del testigo A responde según el tipo de vínculo (confirma, ataca, o coartada). '
    'La IA del testigo B hace lo simétrico si se le pregunta sobre A.', STY['body']))

story.append(Paragraph('<b>Qué cambian los medidores.</b> Exponer el vínculo correctamente '
    'aplica los bonus de la tabla 3.3. Exponerlo incorrectamente (decir "son cómplices" '
    'cuando son enemigos): Credibilidad -5 (parece que improvisas). No exponerlo: 0.', STY['body']))

story.append(Paragraph('<b>Modos de fallo.</b> El jugador puede intentar exponer vínculos '
    'que no existen. El juez responde "Señor acusado, no veo la conexión. ¿Tiene evidencia '
    'de lo que afirma?". Si el jugador no presenta evidencia en 10 segundos, el juez '
    'descarta la afirmación sin penalización (para no desincentivar el intento). Solo '
    'se permiten 2 afirmaciones de vínculo por partida: la tercera se ignora sin '
    'penalización ni respuesta.', STY['body']))

story.append(Paragraph('<b>Cómo se calibra.</b> El vínculo es un atributo del caso '
    'generado en pre-partida, no un sistema emergente. La IA lee la etiqueta del caso '
    'y actúa en consecuencia. Test automatizado: para cada tipo de vínculo, generar 50 '
    'casos, hacer que un bot juegue óptimamente, verificar que el bonus se aplica '
    'correctamente cuando el bot expone y no se aplica cuando no expone. Las pistas '
    'observables (frases repetidas, cambio de tono, hora exacta mencionada sin preguntar) '
    'son patrones explícitos en el system prompt del testigo, no inferencias runtime.', STY['body']))

story.append(Paragraph('<b>Por qué es divertida.</b> Es la mecánica que más se siente '
    'a "sé un detective" en el juego. El jugador tiene que escuchar con atención y '
    'conectar pistas que están en el habla de los testigos, no en un menú. La recompensa '
    'es grande cuando aciertas. El costo de equivocarte es bajo (no hay penalización '
    'fuerte) para animar a intentarlo. El streamer que nota el vínculo antes que su '
    'chat se siente un genio; el chat que lo nota antes que el streamer se siente '
    'partícipe. Ambos casos son clips.', STY['body']))

print("Parte 3 (Capítulo 3) lista")

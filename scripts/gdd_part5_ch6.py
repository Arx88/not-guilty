"""
GDD parte 5 — Capítulos 6 (Playtest mental), 7 (Teoría de la diversión), 8 (Stack técnico y riesgos)
"""

# ══════════════════════════════════════════════════════════
# CAPÍTULO 6 — PLAYTEST MENTAL COMPLETO
# ══════════════════════════════════════════════════════════
story.append(PageBreak())
story.append(add_heading('6. Playtest mental: una partida completa, segundo a segundo', STY['h1'], level=0))

story.append(Paragraph(
    'Para validar que las mecánicas se sostienen en conjunto, este capítulo narra una '
    'partida completa del caso "Robo de 3.000 kg de queso manchego del Museo del Jamón". '
    'Es un caso de nivel 1 (tono absurdo), diseñado para que el streamer tenga material '
    'clippeable desde el minuto 1. La narración es en primera persona del jugador, con '
    'anotaciones de medidores y tiempos.', STY['body']))

story.append(add_heading('6.1 Pre-partida', STY['h2'], level=1))
story.append(Paragraph(
    'El jugador entra al juego. Pantalla de carga breve (3 s) que muestra el expediente: '
    '<b>"EXPEDIENTE 2026/NOTG-001 · Reino de España vs. Jugador · Cargos: Hurto '
    'agravado de producto artesanal (3.000 kg queso manchego D.O., valor estimado '
    '180.000 €) · Lugar: Museo del Jamón, Madrid · Hora: 03:47"</b>. Tutorial de 30 '
    'segundos sobre el micrófono: "Di <i>si</i> para activar tu defensa". El jugador '
    'dice "si". Sistema responde "Micrófono calibrado. Volumen: -28 dBFS. Buen tono. '
    'Comenzamos." La escena 3D carga: tribunal con madera oscura, juez al centro, fiscal '
    'a la izquierda, banquillo del acusado a la derecha. Cinco jurados en semicírculo.', STY['body']))

story.append(Paragraph(
    'Composición del jurado (siempre 2 Estrictos, 2 Empáticos, 1 Popular; el orden visual '
    'cambia según seed del caso). En esta partida:', STY['body']))

jury_case_data = [
    [Paragraph('<b>Silla</b>', STY['th_c']), Paragraph('<b>Perfil</b>', STY['th']),
     Paragraph('<b>Simpatía inicial</b>', STY['th_c']),
     Paragraph('<b>Estado del avatar al inicio</b>', STY['th'])],
    [Paragraph('1', STY['td_c']), Paragraph('Estricto', STY['td']),
     Paragraph('38', STY['td_mono']),
     Paragraph('Serio, postura rígida. Ya mira mal al acusado.', STY['td'])],
    [Paragraph('2', STY['td_c']), Paragraph('Empático', STY['td']),
     Paragraph('52', STY['td_mono']),
     Paragraph('Neutral, postura relajada.', STY['td'])],
    [Paragraph('3', STY['td_c']), Paragraph('Popular', STY['td']),
     Paragraph('47', STY['td_mono']),
     Paragraph('Neutral, postura relajada.', STY['td'])],
    [Paragraph('4', STY['td_c']), Paragraph('Estricto', STY['td']),
     Paragraph('42', STY['td_mono']),
     Paragraph('Serio, postura rígida.', STY['td'])],
    [Paragraph('5', STY['td_c']), Paragraph('Empático', STY['td']),
     Paragraph('55', STY['td_mono']),
     Paragraph('Neutral, postura relajada.', STY['td'])],
]
story.append(make_table(jury_case_data, [0.10, 0.18, 0.20, 0.52]))
story.append(Paragraph('Tabla 6.1 · Composición del jurado en esta partida. La silla 3 '
                       '(Popular) es la swing vote: si la pierdes, condena 2-3.', STY['caption']))

story.append(Paragraph(
    'Medidores agregados iniciales: Credibilidad 50, Sospecha 50, Simpatía media 46.8. '
    'El sistema interno del caso (no visible para el jugador) define que hay un vínculo '
    'de tipo <i>enemistad</i> entre el testigo 1 (guarda de seguridad) y el testigo 2 '
    '(supervisor del museo). El jugador no lo sabe todavía.', STY['body']))

story.append(add_heading('6.2 Fase 1 · Apertura (0:00 - 1:30)', STY['h2'], level=1))
story.append(Paragraph(
    '<b>0:00.</b> Juez (perfil: <i>Filósofo</i>, voz grave, lento): "Abre la sesión. '
    'Acusado, se le imputa el hurto de tres mil kilogramos de queso manchego con '
    'denominación de origen del Museo del Jamón en la madrugada del 14 de marzo. '
    '¿Entiende los cargos?". El sistema detecta la palabra clave "entiende" y abre '
    'una ventana de respuesta de 5 segundos.', STY['body']))

story.append(Paragraph(
    '<b>0:08.</b> Jugador dice "Sí, su señoría". Juez: "Bien. Fiscal, presente su teoría '
    'del caso." Fiscal (perfil: <i>Ambiciosa</i>, voz aguda, rápida): "La acusación '
    'sostiene que el acusado, aprovechando su empleo como repostero nocturno del museo, '
    'sustrajo el queso en tres viajes consecutivos usando el coche de reparto del propio '
    'museo. Tenemos video de seguridad, tres testigos y el análisis del maletero del '
    'vehículo". El jugador no puede hablar aún. Medidores: Credibilidad 50, Sospecha 50, '
    'Simpatía 50.', STY['body']))

story.append(callout_box(
    'Aquí el streamer ya tiene su primer clip potencial: la frase "tres mil kilogramos '
    'de queso manchego" dicha en serio por el juez. Si el streamer ríe, el juego lo '
    'detecta (Web Audio analiza el audio del propio navegador) y el juez Filósofo puede '
    'hacer una pausa breve. Esto es un detalle emergente: el juego no estaba programado '
    'para reír, pero la IA del juez puede usar la risa como contexto en su siguiente '
    'intervención.',
    label='CLIP POTENCIAL'))

story.append(add_heading('6.3 Fase 2 · Testimonio fiscal (1:30 - 3:30)', STY['h2'], level=1))
story.append(Paragraph(
    '<b>1:32.</b> Fiscal presenta evidencia 1: video de seguridad. En pantalla aparece '
    'una captura borrosa de una persona con gorra cargando una caja en un maletero. '
    'Fiscal: "Esta imagen fue tomada a las 03:47. La persona del video viste el uniforme '
    'del museo, talla grande, que es la que el acusado usa habitualmente". Aquí se abre '
    'la primera ventana de objeción (3 s). El jugador puede objetar por <i>forma</i> '
    '(la evidencia es circunstancial, no demuestra identidad).', STY['body']))

story.append(Paragraph(
    '<b>1:35.</b> Jugador dice "¡Protesto!". Juez detiene al fiscal: "Fundamente". '
    'Jugador (5 s): "Su señoría, una gorra y un uniforme no son identificación. Cualquiera '
    'puede comprar ese uniforme en Internet". Juez (2 s, decide): "Protesta admitida. '
    'Fiscal, refuerce su identificación o retire la evidencia". Medidores: Sospecha -8 = 42, '
    'Credibilidad +5 = 55. <b>Primer pico de tensión: 75.</b>', STY['body']))

story.append(Paragraph(
    '<b>2:10.</b> Fiscal presenta evidencia 2: el análisis del maletero encontró '
    'residuos de queso manchego D.O. Fiscal: "El análisis de laboratorio confirma que '
    'el maletero del coche usado por el acusado contenía trazas del queso sustraído. '
    'La probabilidad de coincidencia con un queso distinto es del 0,3%". Aquí el '
    'jugador debería callarse (no hay objeción válida obvia). Si objeta, es rechazada. '
    'Si calla, la evidencia entra pero no hay penalización.', STY['body']))

story.append(Paragraph(
    '<b>2:40.</b> Fiscal llama al primer testigo de cargo: el guarda de seguridad '
    'del museo. Testigo (perfil: <i>Asustadizo</i>, lealtad neutra): "Yo... yo escuché '
    'ruidos esa noche, pero no vi nada. Solo sé que al día siguiente faltaba el queso". '
    'El juez ofrece contrainterrogatorio. Jugador dice "Sí". Jugador (12 s): "Diga, '
    'señor, ¿a qué hora terminó su turno?". Testigo: "A las cuatro de la mañana". '
    'Jugador: "Y el robo fue a las 03:47. ¿Estaba usted en el museo a esa hora?". '
    'Testigo: "Sí, pero estaba en el baño". Jugador: "¿Cuánto tiempo?". Testigo '
    '(titubeando): "Quizás... veinte minutos". Aquí el sistema detecta una contradicción '
    'potencial: si el guarda estuvo 20 min en el baño y el robo fue a las 03:47, '
    'estaba en el baño durante el robo y no pudo ver nada. La IA expone esto en su '
    'siguiente intervención: "Es decir, usted no pudo ver nada. ¿Por qué declara '
    'entonces?". Testigo se desmorona: "Solo declaro lo que me dijeron que dijera". '
    'Medidores: Sospecha -10 = 32, Simpatía +3 = 53.', STY['body']))

story.append(Paragraph(
    '<b>3:25.</b> Fin de F2. Tensión media: 55. Streamer ha tenido dos momentos '
    'clippeables (la frase del juez y la caída del testigo). El chat de Twitch ya está '
    'votando en una overlay opcional.', STY['body']))

story.append(add_heading('6.4 Fase 3 · Evidencia de la defensa (3:30 - 5:30)', STY['h2'], level=1))
story.append(Paragraph(
    '<b>3:35.</b> Juez: "Defensa, presente su evidencia". Aparece el inventario 3D: '
    '6 objetos flotantes: (1) foto de un uniforme talla grande, (2) factura de compra '
    'de un uniforme talla grande fechada el 13 de marzo, (3) recibo de gasolina de '
    'medianoche del 13 al 14, (4) foto del acusado sin gorra, (5) cronograma de rutas '
    'del museo, (6) mensaje de WhatsApp del acusado a su novia a las 03:50 "ya salgo '
    'del curro, voy para casa".', STY['body']))

story.append(Paragraph(
    '<b>3:50.</b> Jugador arrastra el mensaje de WhatsApp al estrado. Lo explica '
    '(25 s): "Su señoría, si el robo fue a las 03:47 y yo envié este mensaje a las '
    '03:50 diciendo que salía del trabajo, significaría que estuve en el museo hasta '
    'las 03:50. Pero para cargar 3.000 kg de queso en un coche necesito al menos '
    '40 minutos. Eso sitúa el inicio del robo a las 03:10, cuando yo todavía estaba '
    'en mi ruta programada". Fiscal objeta: "La hora del mensaje no confirma la '
    'ubicación del acusado". Juez: "Protesta parcialmente admitida. La evidencia entra '
    'pero con limitaciones". Medidores: Sospecha -6 = 26, Credibilidad +6 = 61. Esta '
    'evidencia es <i>ambigua</i> y se explicó bien.', STY['body']))

story.append(Paragraph(
    '<b>4:30.</b> Jugador arrastra el recibo de gasolina. Explica (20 s): "Llené el '
    'depósito a medianoche en una estación a 30 km del museo. Si el coche estaba en '
    'el museo a las 03:47 cargando queso, no podía estar en la estación a medianoche. '
    'A menos que alguien lo llevara y lo trajera. El GPS del coche confirmaría esto." '
    'El caso tiene unGPS pero está en el inventario oculto (no aparece hasta F4). '
    'El juez anota. Medidores: Sospecha -3 = 23 (efecto mínimo porque el jugador no '
    'lo conectó con un testigo).', STY['body']))

story.append(Paragraph(
    '<b>5:15.</b> Jugador decide no presentar más evidencia. Juez: "¿Concluye la defensa '
    'su presentación?". Jugador: "Sí, su señoría". Juez: "Procedemos a los testigos". '
    'Fin de F3 con tensión en 40 (valle estratégico, según curva objetivo).', STY['body']))

story.append(add_heading('6.5 Fase 4 · Testigos y recusaciones (5:30 - 8:00)', STY['h2'], level=1))
story.append(Paragraph(
    '<b>5:35.</b> Sube el primer testigo de la defensa: la novia del acusado. Testigo '
    '(perfil: <i>Leal</i>, lealtad alta al acusado): "Esa noche mi novio llegó a casa '
    'a las 4:15, oliendo a gasolina y cansado. No a queso". El fiscal contrainterroga '
    '(automático): "¿Estaba usted despierta?". Novia: "Me despertó al entrar". Fiscal: '
    '¿Podría confirmar la hora?". Novia: "Miré el móvil. 4:15". Fiscal: "Pero el '
    'mensaje de WhatsApp fue a las 03:50. ¿Cómo tardó 25 minutos en llegar?". Novia '
    '(lealtad alta pero no puede mentir sobre esto): "Tardó más de lo normal. Dijo que '
    'había parado a comprar tabaco".', STY['body']))

story.append(Paragraph(
    '<b>6:20.</b> Aquí el jugador puede invocar un recuerdo. El recuerdo "Parada en '
    'la gasolinera" se desbloqueó en F2 cuando el fiscal mencionó el análisis del '
    'maletero. Jugador grita "¡Recuerdo! Parada en la gasolinera". Overlay aparece: '
    'imagen de la gasolinera a las 03:30 con el coche del museo aparcado. Jugador '
    'conecta con la novia: "Mi novia confirmó que llegué a las 4:15. El recuerdo '
    'muestra mi coche en la gasolinera a las 03:30, a 30 km del museo. El trayecto '
    'son 25 minutos. Llegué a las 4:00 a casa, no a las 4:15, pero paré a comprar '
    'tabaco 15 minutos más. La línea temporal cuadra". Juez: "Recuerdo admitido. '
    'Testigo, ¿la hora que vio era 4:00 o 4:15?". Novia: "Puede que 4:00". Medidores: '
    'Sospecha -8 = 15, Credibilidad +6 = 67.', STY['body']))

story.append(Paragraph(
    '<b>7:10.</b> Sube el segundo testigo: el supervisor del museo. Perfil: <i>Vengativo</i>, '
    'lealtad baja al acusado (lo despidió hace un mes). Supervisor: "El acusado conocía '
    'el sistema de cámaras porque él mismo lo instaló. Sabía dónde estaban los puntos '
    'ciegos. Y tenía acceso al coche de reparto". Aquí el jugador puede contrainterrogar. '
    'Jugador (15 s): "¿Cuándo me despidió?". Supervisor: "Hace un mes". Jugador: "¿Por '
    'qué?". Supervisor: "Reducción de personal". Jugador: "¿Y cuántas personas despidió?". '
    'Supervisor: "Solo a usted". El juez interviene: "Fiscal, ¿este testigo tiene algún '
    'conflicto de interés con el acusado?". Fiscal (intentando tapar): "No relevante, '
    'su señoría". Juez (perfil Filósofo, no se deja): "Lo relevante lo decido yo. Testigo, '
    '¿hay algún motivo personal para su testimonio?". Supervisor: "No, señor". Pero el '
    'medidor de lealtad interno del testigo baja a 0.', STY['body']))

story.append(Paragraph(
    '<b>7:35.</b> Aquí entra la mecánica de vínculos. El jugador había notado (en F2, '
    'cuando el guarda declaró) que el guarda y el supervisor se miraron mal al cruzarse. '
    'El system prompt del caso incluye el atributo "vínculo = enemistad" entre estos dos '
    'testigos. Si el jugador pregunta al supervisor por el guarda, la IA del supervisor '
    'reacciona con hostilidad manifiesta. Jugador: "Supervisor, ¿conoce al guarda de '
    'seguridad que declaró antes?". Supervisor (cambiando tono, más agresivo): "Ese '
    'inútil. Lleva años holgazaneando en el baño cuando debería vigilar. Si alguien '
    'pudo entrar y robar sin ser visto, fue por su incompetencia". El cambio de tono '
    'es detectable: el sistema marca el evento en el log. El jugador ahora puede exponer '
    'el vínculo: "Su señoría, el testigo tiene enemistad manifiesta con el guarda. Si '
    'el guarda mintió para cubrir su propia incompetencia, este testimonio no es '
    'objetivo, es revancha". Juez: "Proceda con cautela, defensa. ¿Tiene evidencia '
    'directa de que el guarda mintió?". Jugador: "El guarda admitió haber estado 20 '
    'minutos en el baño durante el robo". Juez: "Vínculo admitido. Jurados, tomen nota." '
    'Medidores: Credibilidad +6 = 73, Sospecha -10 = 5. La simpatía de los jurados '
    'Empáticos sube 5 puntos cada uno (silla 2: 57, silla 5: 60). El Estricto de la '
    'silla 1 sube 2 (40), el Estricto de la silla 4 no se mueve (42). El Popular sube '
    '3 (50). <b>Pico de tensión: 85.</b>', STY['body']))

story.append(Paragraph(
    '<b>7:55.</b> El jugador observa que el jurado de la silla 1 (Estricto) sigue con '
    'simpatía 40, justo en su zona dudosa (40-60). Su avatar sigue serio, brazos cruzados. '
    'El jugador decide gastar su única recusación. Grita: "¡Recusación, jurado uno!". '
    'Juez: "Fundamente su recusación". Jugador (10 s): "El jurado uno ha mostrado '
    'hostilidad desde el inicio. No ha reaccionado a ninguna evidencia exculpatoria. '
    'Su sesgo manifiesto compromete su objetividad". El sistema verifica: el jurado 1 '
    'tiene sesgo manifiesto = 65 (por encima del umbral 60, debido a que frunció el '
    'ceño 3 veces durante evidencia exculpatoria y no asintió ni una vez). Juez: "El '
    'tribunal acepta la recusación. Jurado uno, puede retirarse". El jurado 1 abandona '
    'la sala. El voto final será sobre 4 jurados en lugar de 5.', STY['body']))

story.append(callout_box(
    'Este es el momento más clippeable de la partida. El streamer ha leído al jurado por '
    'su cara, ha decidido arriesgar su única recusación, y ha ganado. Si hubiera fallado, '
    'el jurado 1 se habría quedado con simpatía -10 (de 40 a 30) y casi seguro habría '
    'votado culpable. La asimetría de riesgo/recompensa es lo que hace la mecánica '
    'tensa.',
    label='CLIP POTENCIAL MÁXIMO'))

story.append(add_heading('6.6 Fase 5 · Alegato y veredicto (8:00 - 10:00)', STY['h2'], level=1))
story.append(Paragraph(
    '<b>8:05.</b> Juez: "Defensa, tiene 60 segundos para su alegato final". Cronómetro '
    'aparece en pantalla. El jugador habla libre. Alegato sugerido (no forzado): '
    '"Su señoría, el caso se sostiene en una imagen borrosa, un análisis de residuos '
    'y un testigo con motivación personal. La línea temporal del fiscal no cuadra con '
    'mi parada en gasolinera ni con mi mensaje de WhatsApp. Tres mil kilos de queso '
    'no caben en un coche sin dejar más residuos que una traza mínima. Si yo fuera '
    'culpable, mi novia no habría confirmado mi llegada a las 4:00. Pido la absolución '
    'por falta de prueba directa".', STY['body']))

story.append(Paragraph(
    '<b>9:05.</b> Juez retira la palabra. "Jurado, deliberen". Los 4 jurados restantes '
    '(se retira el 1 por recusación) votan individualmente en 30 segundos, cada uno '
    'según su simpatía final y su umbral de perfil:', STY['body']))

vote_data = [
    [Paragraph('<b>Silla</b>', STY['th_c']), Paragraph('<b>Perfil</b>', STY['th']),
     Paragraph('<b>Simpatía final</b>', STY['th_c']),
     Paragraph('<b>Umbral</b>', STY['th_c']), Paragraph('<b>Voto</b>', STY['th_c']),
     Paragraph('<b>Razón</b>', STY['th'])],
    [Paragraph('1', STY['td_c']), Paragraph('<i>(recusado)</i>', STY['td']),
     Paragraph('—', STY['td_mono']), Paragraph('—', STY['td_mono']),
     Paragraph('—', STY['td_c']), Paragraph('No vota.', STY['td'])],
    [Paragraph('2', STY['td_c']), Paragraph('Empático', STY['td']),
     Paragraph('62', STY['td_mono']), Paragraph('Absuelve > 45', STY['td_mono']),
     Paragraph('Absuelve', STY['td_c']),
     Paragraph('Simpatía 62 > 45, voto directo.', STY['td'])],
    [Paragraph('3', STY['td_c']), Paragraph('Popular', STY['td']),
     Paragraph('55', STY['td_mono']), Paragraph('Absuelve > 50', STY['td_mono']),
     Paragraph('Absuelve', STY['td_c']),
     Paragraph('Simpatía 55 > 50, voto directo.', STY['td'])],
    [Paragraph('4', STY['td_c']), Paragraph('Estricto', STY['td']),
     Paragraph('45', STY['td_mono']), Paragraph('Dudoso 40-60', STY['td_mono']),
     Paragraph('Tirada', STY['td_c']),
     Paragraph('En zona dudosa. Tirada ponderada: 55% absuelve, 45% condena. Sale absuelve.', STY['td'])],
    [Paragraph('5', STY['td_c']), Paragraph('Empático', STY['td']),
     Paragraph('65', STY['td_mono']), Paragraph('Absuelve > 45', STY['td_mono']),
     Paragraph('Absuelve', STY['td_c']),
     Paragraph('Simpatía 65 > 45, voto directo.', STY['td'])],
]
story.append(make_table(vote_data, [0.07, 0.13, 0.13, 0.16, 0.13, 0.38]))
story.append(Paragraph('Tabla 6.2 · Votación individual del jurado. Resultado: 3-1 absolución '
                       '(75% absolución).', STY['caption']))

story.append(Paragraph(
    '<b>9:40.</b> Juez (perfil Filósofo, decide): "La defensa ha demostrado suficientes '
    'inconsistencias en la línea temporal de la acusación. La identificación del video '
    'es circunstancial. El testigo de cargo tiene motivación personal. En aplicación '
    'del principio in dubio pro reo, el tribunal absuelve al acusado. Quede libre. '
    'Sin costas". Pantalla final: <b>VEREDICTO · NO CULPABLE</b>.', STY['body']))

story.append(Paragraph(
    'Medidores finales: Credibilidad 78, Sospecha 18, Simpatía media 56.75 (sobre 4 '
    'jurados). Voto del juez: absolución (100). Voto del jurado: 75% absolución. '
    'Fórmula: (0.4 × 78) + (0.3 × 82) + (0.15 × 100) + (0.15 × 75) = 31.2 + 24.6 + '
    '15 + 11.25 = <b>82.05 / 100</b>. Absolución holgada. Si el jugador no hubiera '
    'recusado al jurado 1, este habría votado culpable (simpatía 40 en zona dudosa, '
    'tirada 35% absuelve). El resultado habría sido 3-2 absolución, fórmula final '
    '76.65. Recusación no cambió el veredicto pero sí el margen. Esto es deliberado: '
    'la recusación es para casos más ajustados donde 1 voto decide.', STY['body']))

story.append(callout_box(
    'Duración total: 10:00. Clippeable moments: 5 (frase del juez al inicio, caída del '
    'guarda, vínculo expuesto, recusación del jurado 1, veredicto). Si este caso se '
    'jugara 100 veces, esperaríamos 60% absoluciones, 30% condenas, 10% "modo apelación" '
    'por empate. El caso se considera balanceado cuando el winrate en playtests está '
    'entre 50% y 70%. La recusación acertada debería aumentar el winrate en unos 8 '
    'puntos porcentuales (de 55% base a 63% con recusación óptima). Si el aumento es '
    'menor a 3 puntos, la recusación no tiene impacto suficiente y hay que revisar '
    'umbrales.',
    label='POST-MORTEM DE CASO'))

print("Parte 5 (Capítulo 6) lista")

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
    'ciegos. Y tenía acceso al coche de reparto". Aquí el jugador puede recusar si '
    'detecta motivación personal. Pero no tiene evidencia directa de venganza. Decide '
    'contrainterrogar. Jugador (15 s): "¿Cuándo me despidió?". Supervisor: "Hace un '
    'mes". Jugador: "¿Por qué?". Supervisor: "Reducción de personal". Jugador: "¿Y '
    'cuántas personas despidió?". Supervisor: "Solo a usted". El juez interviene: '
    'Fiscal,¿este testigo tiene algún conflicto de interés con el acusado?". Fiscal '
    '(intentando tapar): "No relevante, su señoría". Juez (perfil Filósofo, no se deja): '
    '"Lo relevante lo decido yo. Testigo, ¿hay algún motivo personal para su testimonio?". '
    'Supervisor: "No, señor". Pero el medidor de lealtad interno baja a 0 y el jurado '
    'lo nota. Medidores: Simpatía +4 = 57. <b>Pico de tensión: 85.</b>', STY['body']))

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
    '<b>9:05.</b> Juez retira la palabra. "Jurado, deliberen". Los 5 jurados IA votan '
    'en 30 segundos. 3 absuelven (los perfiles Empático, Popular y Filósofo), 1 condena '
    '(perfil Estricto), 1 se abstiene (perfil Dudoso). Voto del jurado: 60% absolución.', STY['body']))

story.append(Paragraph(
    '<b>9:40.</b> Juez (perfil Filósofo, decide): "La defensa ha demostrado suficientes '
    'inconsistencias en la línea temporal de la acusación. La identificación del video '
    'es circunstancial. El testigo de cargo tiene motivación personal. En aplicación '
    'del principio in dubio pro reo, el tribunal absuelve al acusado. Quede libre. '
    'Sin costas". Pantalla final: <b>VEREDICTO · NO CULPABLE</b>. Medidores finales: '
    'Credibilidad 78, Sospecha 18, Simpatía 62. Fórmula: (0.4 × 78) + (0.3 × 82) + '
    '(0.15 × 100) + (0.15 × 60) = 31.2 + 24.6 + 15 + 9 = <b>79.8 / 100</b>. Absolución.', STY['body']))

story.append(callout_box(
    'Duración total: 10:00. Clippeable moments: 4 (frase del juez al inicio, caída del '
    'guarda, recuerdo gasolinera, veredicto). Si este caso se jugara 100 veces, esperaríamos '
    '60% absoluciones, 30% condenas, 10% "modo apelación" por empate. El caso se considera '
    'balanceado cuando el winrate en playtests está entre 50% y 70%.',
    label='POST-MORTEM DE CASO'))

print("Parte 5 (Capítulo 6) lista")

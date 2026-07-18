"""
NOT GUILTY — GDD v0.1 · Script principal (parte 2: contenido del documento).
Importa setup desde gdd_part1_setup.py
"""
import sys, os
sys.path.insert(0, '/home/z/my-project/scripts')
# Ejecutar el setup para tener todas las variables y funciones disponibles
exec(open('/home/z/my-project/scripts/gdd_part1_setup.py').read(), globals())

# ──────────────────────────────────────────────────────────
# DOCUMENTO
# ──────────────────────────────────────────────────────────
OUTPUT_BODY = '/home/z/my-project/scripts/gdd_body.pdf'
OUTPUT_FINAL = '/home/z/my-project/download/NOT_GUILTY_GDD_v0.3.pdf'

doc = TocDocTemplate(
    OUTPUT_BODY,
    pagesize=A4,
    leftMargin=LEFT_M, rightMargin=RIGHT_M,
    topMargin=TOP_M, bottomMargin=BOT_M,
    title='NOT GUILTY — Game Design Document v0.3',
    author='Z.ai',
    creator='Z.ai',
    subject='Game Design Document para NOT GUILTY — Acusado vs IA judicial',
)

story = []

# ══════════════════════════════════════════════════════════
# TOC
# ══════════════════════════════════════════════════════════
story.append(Paragraph('<b>Índice</b>', STY['toc_title']))
story.append(HRFlowable(width='100%', thickness=1, color=TEXT_PRIMARY, spaceAfter=14))

toc = TableOfContents()
toc.levelStyles = [STY['toc1'], STY['toc2']]
story.append(toc)
story.append(PageBreak())

# ══════════════════════════════════════════════════════════
# CAPÍTULO 1 — PILARES Y ALCANCE
# ══════════════════════════════════════════════════════════
story.append(add_heading('1. Pilares y alcance de este documento', STY['h1'], level=0))

story.append(callout_box(
    'v0.3 cierra los dos agujeros de diseño que v0.2 dejaba abiertos: (1) sistema de '
    'variabilidad por caso que multiplica la rejugabilidad de 1 a 27 partidas distintas '
    'por caso, y (2) sistema de momentos cómicos garantizados que sube la densidad de '
    'risas de 1 a 3-4 por partida. Lo que se pospone explícitamente: dirección artística '
    'y voz del juez, que se decidirán con prototipo funcionando enfrente, no en abstracto. '
    'v0.3 mantiene todo lo de v0.2 (jurados individualizados, recusación, vínculos, '
    'retroalimentación diegética) sin cambios.',
    label='NOTA DE VERSIÓN · v0.3'))

story.append(Paragraph(
    'Este documento no vende el juego. Define mecánicamente cómo se juega una partida '
    'de NOT GUILTY en su modo principal: el jugador encarna al acusado, el juez y los '
    'testigos son agentes de IA conversacional, y la interacción se hace por voz a través '
    'del micrófono del navegador. El objetivo es que cada decisión de diseño aquí escrita '
    'pueda ser implementada, medida y discutida sin ambigüedad. Nada de "es divertido porque '
    'sí": cada mecánica incluye su teoría de la diversión, sus métricas, sus modos de fallo '
    'y un playtest mental que la valida o la descarta.', STY['body']))

story.append(Paragraph(
    'El stack técnico anclado es Three.js para la escena 3D del tribunal, Convai para los '
    'NPCs conversacionales (tiene plugin oficial para Three.js) y Web Speech API para '
    'reconocimiento de voz en el navegador. La duración objetivo de una partida es de 8 a 12 '
    'minutos, calibrada para encajar en una ventana de stream sin desbordarse y para que un '
    'mismo streamer pueda jugar 3 o 4 partidas en una sesión de hora y media.', STY['body']))

story.append(add_heading('1.1 Pilares de diseño', STY['h2'], level=1))

story.append(Paragraph(
    'Cuatro pilares guían todas las decisiones. Cuando una idea nueva entra al juego, '
    'debe servir al menos a uno de los cuatro. Si no sirve a ninguno, se descarta aunque '
    'parezca divertida.', STY['body']))

pilar_data = [
    [Paragraph('<b>Pilar</b>', STY['th']), Paragraph('<b>Qué significa en la práctica</b>', STY['th']),
     Paragraph('<b>Qué prohíbe</b>', STY['th'])],
    [Paragraph('<b>P1 · Voz como input significativo</b>', STY['td']),
     Paragraph('Lo que el jugador dice cambia el resultado del juicio. La IA reacciona al '
               'contenido semántico y al tono (volumen, pausas, velocidad).', STY['td']),
     Paragraph('Prohíbe diálogos de opciones múltiples. Si el jugador no habla, no juega.', STY['td'])],
    [Paragraph('<b>P2 · Tensión con respiros</b>', STY['td']),
     Paragraph('Cada fase sube la tensión, pero hay al menos un valle por partida para que '
               'el jugador planifique y el streamer respire.', STY['td']),
     Paragraph('Prohíbe tensión constante 100. La fatiga mata la rejugabilidad.', STY['td'])],
    [Paragraph('<b>P3 · Improvisación sobre guion</b>', STY['td']),
     Paragraph('La IA no recita un guion. Improvisa dentro de una estructura de cargos, '
               'evidencias y personalidades. Cada partida es única.', STY['td']),
     Paragraph('Prohíbe frases pre-escritas fijas. El juez no puede tener un árbol de diálogo.', STY['td'])],
    [Paragraph('<b>P4 · Clippeable por diseño</b>', STY['td']),
     Paragraph('Cada 60 a 90 segundos hay un momento con potencial de clip: una objeción '
               'gritada, una recusación, una frase absurda del juez, un veredicto inesperado.', STY['td']),
     Paragraph('Prohíbe relleno narrativo. Si una fase no tiene clip potencial, se rediseña.', STY['td'])],
    [Paragraph('<b>P5 · Calibrabilidad obligatoria</b> <i>(nuevo en v0.2)</i>', STY['td']),
     Paragraph('Toda mecánica debe poder medirse con un número, debugguearse con un log, '
               'y balancearse con un test automatizado. Si no, no entra al juego.', STY['td']),
     Paragraph('Prohíbe sistemas emergentes no acotados: grafos de relaciones arbitrarias, '
               '6+ perfiles de NPCs combinables, medidores sin umbral claro.', STY['td'])],
    [Paragraph('<b>P6 · Densidad de recompensa alta</b> <i>(nuevo en v0.3)</i>', STY['td']),
     Paragraph('Cada 30 segundos el jugador recibe una recompensa: risa, revelación, '
               'victoria parcial, clip potencial. La tensión sola no sostiene sesiones largas.', STY['td']),
     Paragraph('Prohíbe fases de más de 60 s sin recompensa. Prohíbe recompensas solo al final.', STY['td'])],
    [Paragraph('<b>P7 · Variabilidad within-case</b> <i>(nuevo en v0.3)</i>', STY['td']),
     Paragraph('Cada caso tiene atributos rolados en pre-partida. El mismo expediente puede '
               'generar 27 partidas distintas. Sin esto, rejugabilidad = 3-5 por caso.', STY['td']),
     Paragraph('Prohíbe casos con estructura fija de testigos y evidencia. Lo fijo es el '
               'expediente; lo variable es la configuración interna.', STY['td'])],
]
story.append(make_table(pilar_data, [0.22, 0.48, 0.30]))
story.append(Paragraph('Tabla 1.1 · Pilares de diseño y lo que excluyen. P5 añadido en v0.2 '
                       'tras constatar que sin él, el diseño deriva hacia mecánicas impresionantes '
                       'en papel pero imposibles de mantener en producción. P6 y P7 añadidos en v0.3 '
                       'tras identificar que v0.2 optimizaba para tensión pero no para risa ni '
                       'rejugabilidad.', STY['caption']))

story.append(add_heading('1.2 Alcance de este v0.1', STY['h2'], level=1))
story.append(Paragraph(
    'Este documento cubre el loop principal del modo acusado puro. Quedan fuera del '
    'alcance: el modo juez (desbloqueable futuro), el modo cooperativo entre dos acusados, '
    'la integración con chat de Twitch, el sistema de progresión entre partidas y la '
    'generación procedural de casos. Cada uno merece su propio diseño una vez validado '
    'el loop base. Aquí no se asume que esos modos existen: se asume que el modo acusado '
    'es suficiente por sí solo para sostener el juego.', STY['body']))

story.append(callout_box(
    'Si el modo acusado no es divertido en aislamiento, ningún añadido (multiplayer, '
    'progresión, eventos) lo va a salvar. Este documento se concentra en que el loop '
    'básico funcione antes de añadir complejidad.',
    label='REGLA DE HIERRO'))

story.append(PageBreak())

# ══════════════════════════════════════════════════════════
# CAPÍTULO 2 — RESOLUCIÓN DE UNA PARTIDA
# ══════════════════════════════════════════════════════════
story.append(add_heading('2. Resolución de una partida: las 5 fases', STY['h1'], level=0))

story.append(Paragraph(
    'Una partida se divide en 5 fases secuenciales con duraciones fijas. Las transiciones '
    'las dispara el juez IA, no el jugador, para mantener el ritmo. La única excepción es '
    'la fase 3, donde el jugador puede pedir "Receso" una vez por partida pagando 5 puntos '
    'de Credibilidad. La fase 5 es la única donde el jugador tiene control temporal exclusivo '
    'durante los 60 segundos de alegato final.', STY['body']))

# Diagrama de fases
phases_img = fit_image('/home/z/my-project/scripts/phases_diagram.png',
                        max_w=AVAIL_W, max_h=PAGE_H * 0.32)
story.append(phases_img)
story.append(Paragraph('Figura 2.1 · Las 5 fases de una partida y sus mecánicas activas.', STY['caption']))

story.append(add_heading('2.1 Estructura temporal', STY['h2'], level=1))

time_data = [
    [Paragraph('<b>Fase</b>', STY['th_c']), Paragraph('<b>Duración</b>', STY['th_c']),
     Paragraph('<b>Quién habla</b>', STY['th_c']), Paragraph('<b>Tensión objetivo</b>', STY['th_c']),
     Paragraph('<b>Mecánica principal</b>', STY['th'])],
    [Paragraph('F1 · Apertura', STY['td_c']), Paragraph('90 s', STY['td_mono']),
     Paragraph('Juez + Fiscal', STY['td_c']), Paragraph('20 → 35', STY['td_mono']),
     Paragraph('Reconocimiento de cargos', STY['td'])],
    [Paragraph('F2 · Testimonio fiscal', STY['td_c']), Paragraph('2 min', STY['td_mono']),
     Paragraph('Fiscal + Jugador', STY['td_c']), Paragraph('35 → 75', STY['td_mono']),
     Paragraph('Objeción por voz + contra-interrogatorio', STY['td'])],
    [Paragraph('F3 · Evidencia defensa', STY['td_c']), Paragraph('2 min', STY['td_mono']),
     Paragraph('Jugador', STY['td_c']), Paragraph('55 → 40 → 60', STY['td_mono']),
     Paragraph('Drag & drop objetos 3D + explicación', STY['td'])],
    [Paragraph('F4 · Testigos', STY['td_c']), Paragraph('2 min 30 s', STY['td_mono']),
     Paragraph('Testigos + Jugador', STY['td_c']), Paragraph('60 → 85', STY['td_mono']),
     Paragraph('Recusación por voz + memoria del acusado', STY['td'])],
    [Paragraph('F5 · Alegato + veredicto', STY['td_c']), Paragraph('2 min', STY['td_mono']),
     Paragraph('Jugador + Juez', STY['td_c']), Paragraph('78 → 95 → 30/100', STY['td_mono']),
     Paragraph('Alegato cronometrado + votación jurados', STY['td'])],
]
story.append(make_table(time_data, [0.20, 0.10, 0.16, 0.18, 0.36]))
story.append(Paragraph('Tabla 2.1 · Estructura temporal de una partida tipo de 10 minutos.', STY['caption']))

story.append(add_heading('2.2 Curva de tensión objetivo', STY['h2'], level=1))
story.append(Paragraph(
    'La curva de tensión no es decorativa: define cuándo el jugador se siente presionado '
    'y cuándo puede planificar. El diagrama siguiente muestra la curva objetivo de una '
    'partida tipo. Las objeciones (F2) generan el primer pico. La fase de evidencia (F3) '
    'es deliberadamente un valle: el jugador necesita pensar. Las recusaciones (F4) generan '
    'el pico más alto antes del veredicto. La fase 5 termina con un clímax y una caída '
    'inmediata al veredicto.', STY['body']))

tension_img = fit_image('/home/z/my-project/scripts/tension_loop.png',
                         max_w=AVAIL_W, max_h=PAGE_H * 0.36)
story.append(tension_img)
story.append(Paragraph('Figura 2.2 · Curva de tensión objetivo de una partida de 10 minutos.', STY['caption']))

story.append(callout_box(
    'Si una partida real medida en playtest no se aproxima a esta curva (más de ±20 de '
    'desviación en cualquier fase), el caso está mal generado o la IA está mal calibrada. '
    'La curva es la métrica de salud del juego, no una aspiración estética.',
    label='MÉTRICA DE SALUD'))

print("Parte 2 (Capítulos 1-2) lista")

"""
GDD parte 4 — Capítulos 4 (Medidores vivos), 5 (Modelo de fallos), 6 (Playtest mental)
"""

# ══════════════════════════════════════════════════════════
# CAPÍTULO 4 — MEDIDORES VIVOS
# ══════════════════════════════════════════════════════════
story.append(PageBreak())
story.append(add_heading('4. Los tres medidores vivos', STY['h1'], level=0))

story.append(Paragraph(
    'Toda la retroalimentación del juego al jugador se condensa en tres medidores visibles '
    'en todo momento. No hay salud, no hay maná, no hay puntuación. Estos tres números '
    'definen si el jugador gana o pierde. Están siempre a la vista, en la esquina superior '
    'derecha de la pantalla, y se actualizan en tiempo real con animación de transición '
    'de 0.4 segundos.', STY['body']))

med_data = [
    [Paragraph('<b>Medidor</b>', STY['th']), Paragraph('<b>Rango</b>', STY['th_c']),
     Paragraph('<b>Color visual</b>', STY['th_c']), Paragraph('<b>Qué significa</b>', STY['th'])],
    [Paragraph('<b>Credibilidad</b>', STY['td']), Paragraph('0 a 100', STY['td_mono']),
     Paragraph('Verde (alto) / Ámbar (medio) / Rojo (bajo)', STY['td_c']),
     Paragraph('Cuánto cree el juez al acusado. Empieza en 50. Determina el veredicto junto con Sospecha.', STY['td'])],
    [Paragraph('<b>Sospecha</b>', STY['td']), Paragraph('0 a 100', STY['td_mono']),
     Paragraph('Inverso a Credibilidad (visualmente espejo)', STY['td_c']),
     Paragraph('Cuánto cree el juez que el acusado es culpable. Empieza en 50. Determina el veredicto junto con Credibilidad.', STY['td'])],
    [Paragraph('<b>Simpatía del jurado</b>', STY['td']), Paragraph('0 a 100', STY['td_mono']),
     Paragraph('Azul (alto) / Gris (medio) / Púrpura (bajo)', STY['td_c']),
     Paragraph('Cuánto le cae bien el acusado al jurado. Solo cuenta en F5 (veredicto) pero influye en testigos.', STY['td'])],
]
story.append(make_table(med_data, [0.20, 0.12, 0.25, 0.43]))
story.append(Paragraph('Tabla 4.1 · Los tres medidores vivos del juego.', STY['caption']))

story.append(add_heading('4.1 Fórmula del veredicto', STY['h2'], level=1))
story.append(Paragraph(
    'El veredicto final se calcula con una fórmula deliberadamente simple, porque la '
    'simpleza permite al jugador razonar sobre su estrategia y al streamer explicar lo '
    'que pasó:', STY['body']))

formula_data = [
    [Paragraph('<b>Componente</b>', STY['th']), Paragraph('<b>Peso</b>', STY['th_c']),
     Paragraph('<b>Notas</b>', STY['th'])],
    [Paragraph('Credibilidad final (C)', STY['td']), Paragraph('40%', STY['td_mono']),
     Paragraph('Medida al final de F5.', STY['td'])],
    [Paragraph('Sospecha final (S), invertida (100-S)', STY['td']), Paragraph('30%', STY['td_mono']),
     Paragraph('Espejo de la sospecha.', STY['td'])],
    [Paragraph('Voto del juez (J)', STY['td']), Paragraph('15%', STY['td_mono']),
     Paragraph('Decisión binaria del juez IA basada en su personalidad.', STY['td'])],
    [Paragraph('Voto del jurado (V)', STY['td']), Paragraph('15%', STY['td_mono']),
     Paragraph('Promedio de los 5 jurados IA, ponderado por simpatía.', STY['td'])],
]
story.append(make_table(formula_data, [0.40, 0.15, 0.45]))
story.append(Paragraph('Tabla 4.2 · Fórmula del veredicto. Puntuación final ≥ 50 = absolución, < 50 = condena.',
                       STY['caption']))

story.append(callout_box(
    'La fórmula es pública dentro del juego (en el tutorial). El jugador debe poder '
    'predecir aproximadamente su veredicto al empezar F5. Si pierde por sorpresa, '
    'no por mala estrategia, el juego se siente injusto y la rejugabilidad cae.',
    label='PRINCIPIO DE JUSTICIA PERCIBIDA'))

story.append(add_heading('4.2 Por qué tres y no cinco', STY['h2'], level=1))
story.append(Paragraph(
    'En iteraciones iniciales del diseño consideramos cinco medidores: Credibilidad, '
    'Sospecha, Simpatía, Paciencia del juez y Compostura del acusado. Los dos últimos '
    'se eliminaron por razones específicas que vale la pena documentar para evitar '
    'retroceder en iteraciones futuras.', STY['body']))

story.append(Paragraph(
    '<b>Paciencia del juez</b> se eliminó porque era un medidor punitivo sin contrajuego: '
    'solo bajaba, nunca subía, y su único efecto era desencadenar penalizaciones. Esto '
    'generaba una sensación de estar siendo vigilado en lugar de estar jugando. Su '
    'función (prevenir spam de objeciones y toxicidad) se mantuvo pero como "contador '
    'interno de violaciones" que el juez revela en sus frases, no como medidor visible.', STY['body']))

story.append(Paragraph(
    '<b>Compostura del acusado</b> se eliminó porque duplicaba semánticamente a Sospecha: '
    'un acusado que pierde la compostura genera sospecha. Mantener ambos habría generado '
    'confusión en el jugador (¿subir qué medidor es bueno?). La mecánica de tono de voz '
    'se conservó pero inyectándola como contexto en la IA en lugar de mostrársela al '
    'jugador como número.', STY['body']))

# ══════════════════════════════════════════════════════════
# CAPÍTULO 5 — MODELO DE FALLOS
# ══════════════════════════════════════════════════════════
story.append(PageBreak())
story.append(add_heading('5. Modelo de fallos: qué pasa cuando el jugador hace lo inesperado', STY['h1'], level=0))

story.append(Paragraph(
    'Un juego con IA conversacional tiene un riesgo que los juegos tradicionales no '
    'tienen: el jugador puede hacer literalmente cualquier cosa con la voz. La diferencia '
    'entre un juego que se rompe y uno que se siente vivo es cómo reacciona el sistema '
    'ante comportamientos no previstos. Esta tabla documenta los modos de fallo esperados '
    'y la respuesta del sistema. Cualquier comportamiento fuera de esta tabla se considera '
    'bug y debe reportarse.', STY['body']))

fail_data = [
    [Paragraph('<b>Comportamiento</b>', STY['th']), Paragraph('<b>Respuesta del sistema</b>', STY['th']),
     Paragraph('<b>Metric change</b>', STY['th_c'])],
    [Paragraph('Silencio prolongado (>20s) en fase donde debe hablar', STY['td']),
     Paragraph('Juez: "¿Está bien?". Tras 40s: "Interpretaré su silencio como renuencia".', STY['td']),
     Paragraph('Sospecha +5 / 20s', STY['td_c'])],
    [Paragraph('Insultos al juez', STY['td']),
     Paragraph('Juez: "¡Orden!". 2ª vez: "Desacato. Última advertencia." 3ª: veredicto automático culpable.', STY['td']),
     Paragraph('Credibilidad -10 por vez', STY['td_c'])],
    [Paragraph('Insultos a testigos', STY['td']),
     Paragraph('Juez interviene solo si testigo se niega a seguir. Testigo pierde lealtad.', STY['td']),
     Paragraph('Simpatía -5 por testigo', STY['td_c'])],
    [Paragraph('Spam de objeciones (>3 rechazadas consecutivas)', STY['td']),
     Paragraph('Juez: "La próxima objeción infundada le costará 10 puntos".', STY['td']),
     Paragraph('Credibilidad -10 en la 4ª', STY['td_c'])],
    [Paragraph('Hablar en otro idioma', STY['td']),
     Paragraph('Sistema detecta idioma no español. Juez: "Señor, estamos en un tribunal español." '
               'La IA intenta interpretar la intención, pero marcador de credibilidad baja.', STY['td']),
     Paragraph('Credibilidad -3 por turno', STY['td_c'])],
    [Paragraph('Cantar en lugar de hablar', STY['td']),
     Paragraph('Si canta bien y el jurado tiene perfil "Popular", ganancia de simpatía. '
               'Si no, juez: "Esto no es un karaoke".', STY['td']),
     Paragraph('Variable', STY['td_c'])],
    [Paragraph('Mentira obvia (contradice evidencia ya admitida)', STY['td']),
     Paragraph('Fiscal IA la detecta y la cita. Juez interviene si es flagrante.', STY['td']),
     Paragraph('Credibilidad -8, Sospecha +6', STY['td_c'])],
    [Paragraph('Confesar el delito', STY['td']),
     Paragraph('Juez: "¿Está declarándose culpable?". Si jugador confirma: juicio termina, condena.', STY['td']),
     Paragraph('Veredicto automático', STY['td_c'])],
    [Paragraph('Pedir receso más de una vez', STY['td']),
     Paragraph('Juez: "Ya tuvo su receso. Procedamos".', STY['td']),
     Paragraph('0 (rechazado)', STY['td_c'])],
    [Paragraph('Invocar recuerdo sin conexión (3+ veces)', STY['td']),
     Paragraph('Juez: "Está usando el tribunal como terapia". Silencia 30s.', STY['td']),
     Paragraph('Credibilidad -3 por vez', STY['td_c'])],
    [Paragraph('Hablar sin parar durante 60+ segundos', STY['td']),
     Paragraph('Juez: "Señor, sea conciso". Si continúa: "Le retiro la palabra 30 segundos".', STY['td']),
     Paragraph('Credibilidad -3', STY['td_c'])],
    [Paragraph('Hacer ruido con objetos físicos (teclado, etc.)', STY['td']),
     Paragraph('Sistema filtra con VAD. Si es muy fuerte, juez: "Hay ruido en la sala".', STY['td']),
     Paragraph('0 (no afecta)', STY['td_c'])],
    [Paragraph('Salir del navegador / cerrar pestaña', STY['td']),
     Paragraph('Al volver, juez: "Volvemos a tener al acusado. Continuemos como si nada".', STY['td']),
     Paragraph('Sospecha +5 (renuencia)', STY['td_c'])],
    [Paragraph('Usar texto-a-voz para imitar a otra persona', STY['td']),
     Paragraph('No se previene técnicamente. Si el juez tiene perfil "Observador", nota la voz robótica.', STY['td']),
     Paragraph('Credibilidad -5', STY['td_c'])],
    [Paragraph('Pedir perdón sin fundamento', STY['td']),
     Paragraph('Jurado Empático lo valora. Juez Estricto lo penaliza ("El arrepentimiento no es estrategia").', STY['td']),
     Paragraph('Variable según juez', STY['td_c'])],
]
story.append(make_table(fail_data, [0.36, 0.48, 0.16]))
story.append(Paragraph('Tabla 5.1 · Modelo de fallos: respuestas del sistema a comportamientos no triviales.',
                       STY['caption']))

story.append(callout_box(
    'La regla rectora del modelo de fallos es: <b>nunca bloquear al jugador, siempre '
    'responder</b>. Si el jugador hace algo inesperado, la IA debe reaccionar dentro '
    'del marco ficcional del tribunal, no mostrar un error. La excepción es el desacato '
    'repetido al juez, que es la única forma de "perder" el juicio fuera del veredicto.',
    label='REGLA RECTORA'))

print("Parte 4 (Capítulos 4-5) lista")

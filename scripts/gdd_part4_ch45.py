"""
GDD parte 4 — Capítulos 4 (Medidores vivos), 5 (Modelo de fallos), 6 (Playtest mental)
"""

# ══════════════════════════════════════════════════════════
# CAPÍTULO 4 — MEDIDORES Y ESTADO VIVO
# ══════════════════════════════════════════════════════════
story.append(PageBreak())
story.append(add_heading('4. Medidores visibles, jurados individualizados y señales diegéticas', STY['h1'], level=0))

story.append(Paragraph(
    'Toda la retroalimentación del juego al jugador se condensa en tres medidores visibles '
    'en todo momento, más un sistema de simpatía individual por jurado que se visualiza '
    'en el propio avatar de cada jurado (no como número, sino como expresión facial), '
    'más dos señales diegéticas de nerviosismo del acusado. No hay salud, no hay maná, '
    'no hay puntuación. Estos elementos definen si el jugador gana o pierde. Los tres '
    'medidores principales están siempre a la vista, en la esquina superior derecha de '
    'la pantalla, y se actualizan en tiempo real con animación de transición de 0.4 '
    'segundos.', STY['body']))

med_data = [
    [Paragraph('<b>Medidor</b>', STY['th']), Paragraph('<b>Rango</b>', STY['th_c']),
     Paragraph('<b>Color visual</b>', STY['th_c']), Paragraph('<b>Qué significa</b>', STY['th'])],
    [Paragraph('<b>Credibilidad</b>', STY['td']), Paragraph('0 a 100', STY['td_mono']),
     Paragraph('Verde (alto) / Ámbar (medio) / Rojo (bajo)', STY['td_c']),
     Paragraph('Cuánto cree el juez al acusado. Empieza en 50. Determina el veredicto junto con Sospecha.', STY['td'])],
    [Paragraph('<b>Sospecha</b>', STY['td']), Paragraph('0 a 100', STY['td_mono']),
     Paragraph('Inverso a Credibilidad (visualmente espejo)', STY['td_c']),
     Paragraph('Cuánto cree el juez que el acusado es culpable. Empieza en 50. Determina el veredicto junto con Credibilidad.', STY['td'])],
    [Paragraph('<b>Simpatía del jurado (agregado visual)</b>', STY['td']), Paragraph('0 a 100', STY['td_mono']),
     Paragraph('Azul (alto) / Gris (medio) / Púrpura (bajo)', STY['td_c']),
     Paragraph('Promedio de las 5 simpatías individuales. Solo orientativo. Ver 4.3 para el sistema individual.', STY['td'])],
]
story.append(make_table(med_data, [0.24, 0.12, 0.25, 0.39]))
story.append(Paragraph('Tabla 4.1 · Los tres medidores visibles agregados. El sistema real '
                       'de simpatía es individual por jurado (ver 4.3); este promedio es solo '
                       'para que el jugador tenga una lectura rápida.', STY['caption']))

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
    [Paragraph('Voto del jurado (V) = promedio de votos individuales', STY['td']), Paragraph('15%', STY['td_mono']),
     Paragraph('Cada uno de los 5 jurados vota según su simpatía individual + su lectura del caso. '
               'Si un jurado fue recusado y retirado, su voto se elimina y el promedio es sobre 4.', STY['td'])],
]
story.append(make_table(formula_data, [0.40, 0.15, 0.45]))
story.append(Paragraph('Tabla 4.2 · Fórmula del veredicto. Puntuación final ≥ 50 = absolución, < 50 = condena.',
                       STY['caption']))

story.append(callout_box(
    'La fórmula es pública dentro del juego (en el tutorial). El jugador debe poder '
    'predecir aproximadamente su veredicto al empezar F5. Si pierde por sorpresa, '
    'no por mala estrategia, el juego se siente injusto y la rejugabilidad cae.',
    label='PRINCIPIO DE JUSTICIA PERCIBIDA'))

story.append(add_heading('4.2 Por qué tres medidores visibles y no cinco', STY['h2'], level=1))
story.append(Paragraph(
    'En iteraciones iniciales del diseño consideramos cinco medidores visibles: Credibilidad, '
    'Sospecha, Simpatía, Paciencia del juez y Compostura del acusado. Los dos últimos '
    'se eliminaron por razones específicas que vale la pena documentar para evitar '
    'retroceder en iteraciones futuras. La simpatía se mantiene visible pero como '
    'promedio agregado; el detalle individual está en los avatares del jurado, no como '
    'números, para evitar saturar la UI.', STY['body']))

story.append(Paragraph(
    '<b>Paciencia del juez</b> se eliminó como medidor visible porque era punitivo sin '
    'contrajuego: solo bajaba, nunca subía, y su único efecto era desencadenar penalizaciones. '
    'Esto generaba una sensación de estar siendo vigilado en lugar de estar jugando. Su '
    'función (prevenir spam de objeciones y toxicidad) se mantuvo pero como "contador '
    'interno de violaciones" que el juez revela en sus frases, no como medidor visible. '
    'Calibrabilidad: el contador es un entero con umbral fijo (3 violaciones = advertencia, '
    '4 = penalización). Testeable con un bot que spamuea objeciones: el contador debe '
    'llegar a 3 y disparar la advertencia.', STY['body']))

story.append(Paragraph(
    '<b>Compostura del acusado</b> se eliminó como medidor visible porque duplicaba '
    'semánticamente a Sospecha: un acusado que pierde la compostura genera sospecha. '
    'Mantener ambos habría generado confusión en el jugador. En v0.2 se recuperó la idea '
    'pero como señales diegéticas (ver 4.4), no como número. La razón: el jugador ya '
    'tiene los medidores de voz medidos internamente (volumen, velocidad, pausas, tabla 3.2); '
    'añadir un cuarto medidor visual habría sido redundante y habría invitado a optimizar '
    'contra la barra en lugar de actuar el rol.', STY['body']))

# ── 4.3 Sistema de jurados individualizado ───────────────
story.append(add_heading('4.3 Sistema de jurados individualizado <i>(nuevo en v0.2)</i>', STY['h2'], level=1))

story.append(Paragraph(
    'El jurado se compone de 5 sillas. Cada silla tiene un jurado con su propia '
    'simpatía hacia el acusado (0 a 100) y un perfil fijo de comportamiento. La '
    'composición es siempre la misma: 2 jurados Estrictos, 2 jurados Empáticos, '
    '1 jurado Popular. Lo que cambia entre casos es el orden visual (qué silla '
    'ocupa cada perfil) y los valores iniciales de simpatía. Esta composición fija '
    'es la decisión de diseño más importante para la calibrabilidad: si la composición '
    'variara, sería imposible razonar sobre el balance.', STY['body']))

jur_data = [
    [Paragraph('<b>Perfil</b>', STY['th']),
     Paragraph('<b>Quantidad fija</b>', STY['th_c']),
     Paragraph('<b>Simpatía inicial</b>', STY['th_c']),
     Paragraph('<b>Sesgo de voz</b>', STY['th']),
     Paragraph('<b>Voto en F5</b>', STY['th'])],
    [Paragraph('Estricto', STY['td']), Paragraph('2', STY['td_c']),
     Paragraph('30–45 (al azar, seed del caso)', STY['td_mono']),
     Paragraph('Penaliza volumen > -20 dBFS. Penaliza vacilaciones > 4/min.', STY['td']),
     Paragraph('Culpable si su simpatía < 40. Absuelve si > 60. Dudoso entre 40-60.', STY['td'])],
    [Paragraph('Empático', STY['td']), Paragraph('2', STY['td_c']),
     Paragraph('45–60 (al azar, seed del caso)', STY['td_mono']),
     Paragraph('Premia pausas > 1.5 s. Premia vacilaciones (las lee como sinceridad).', STY['td']),
     Paragraph('Culpable si su simpatía < 25. Absuelve si > 45. Dudoso entre 25-45.', STY['td'])],
    [Paragraph('Popular', STY['td']), Paragraph('1', STY['td_c']),
     Paragraph('40–55 (al azar, seed del caso)', STY['td_mono']),
     Paragraph('Premia velocidad 150-180 ppm y volumen medio. Indiferente a pausas.', STY['td']),
     Paragraph('Culpable si su simpatía < 30. Absuelve si > 50. Dudoso entre 30-50.', STY['td'])],
]
story.append(make_table(jur_data, [0.13, 0.10, 0.20, 0.30, 0.27]))
story.append(Paragraph('Tabla 4.3 · Los 3 perfiles de jurado. Composición siempre 2-2-1.', STY['caption']))

story.append(Paragraph(
    'La visualización de la simpatía individual es diegética: el avatar de cada jurado '
    'tiene 5 estados de animación correspondientes a rangos de simpatía. No hay número. '
    'El jugador tiene que leer al jurado por su cara. Esto es deliberado: obliga al '
    'jugador a mirar a los jurados, no a optimizar un número, y hace que la recusación '
    '(mecánica 6, sección 3.6) sea una decisión perceptiva, no numérica.', STY['body']))

avatar_data = [
    [Paragraph('<b>Rango simpatía</b>', STY['th_c']),
     Paragraph('<b>Estado del avatar</b>', STY['th']),
     Paragraph('<b>Comportamiento adicional</b>', STY['th'])],
    [Paragraph('0–20', STY['td_c']),
     Paragraph('Fruncido, brazos cruzados, mirada esquivada', STY['td']),
     Paragraph('Susurra al vecino ocasionalmente. Ríe si el fiscal mete un buen punto.', STY['td'])],
    [Paragraph('21–40', STY['td_c']),
     Paragraph('Serio, postura rígida', STY['td']),
     Paragraph('Asiente en silencio cuando el juez habla. No reacciona a favor del acusado.', STY['td'])],
    [Paragraph('41–60', STY['td_c']),
     Paragraph('Neutral, postura relajada', STY['td']),
     Paragraph('Mira al acusado cuando habla. A veces toma notas.', STY['td'])],
    [Paragraph('61–80', STY['td_c']),
     Paragraph('Atento, leve sonrisa', STY['td']),
     Paragraph('Asiente cuando el acusado hace un buen punto. Frunce el ceño al fiscal.', STY['td'])],
    [Paragraph('81–100', STY['td_c']),
     Paragraph('Sonriente, postura abierta, a veces inclinado hacia el acusado', STY['td']),
     Paragraph('Suspira de alivio cuando se presenta evidencia exculpatoria. Mira mal al fiscal.', STY['td'])],
]
story.append(make_table(avatar_data, [0.15, 0.32, 0.53]))
story.append(Paragraph('Tabla 4.4 · Estados del avatar de jurado según simpatía. 5 estados, '
                       'no más, para que la animación sea testeable.', STY['caption']))

story.append(callout_box(
    'La composición 2-2-1 es siempre la misma por una razón matemática: si el jugador '
    'juega de forma mediocre, los 2 Estrictos votarán culpable y los 2 Empáticos + el '
    'Popular votarán absolución. Resultado: 3-2 absolución. Esto significa que el caso '
    'mediano está ganado por defecto, y el jugador tiene que esforzarse para perderlo. '
    'Si el jugador juega bien, convence a uno de los Estrictos y gana 4-1. Si juega mal, '
    'pierde al Popular y queda 2-3 condena. Este rango dinámico predecible es lo que '
    'hace el balance calibrable.',
    label='DECISIÓN DE BALANCE'))

story.append(Paragraph(
    'El sistema de votos individuales en F5 se calcula así: cada jurado evalúa su '
    'simpatía final contra su umbral de perfil (ver tabla 4.3). Si está en zona dudosa, '
    'vota según una tirada ponderada por su simpatía (a más simpatía, más probabilidad '
    'de absolver). El voto del juez se calcula de forma análoga pero usando Credibilidad '
    'y Sospecha finales en lugar de simpatía. La fórmula del veredicto (tabla 4.2) '
    'combina ambos.', STY['body']))

# ── 4.4 Retroalimentación diegética de nerviosismo ───────
story.append(add_heading('4.4 Retroalimentación diegética de nerviosismo <i>(nuevo en v0.2)</i>', STY['h2'], level=1))

story.append(Paragraph(
    'En v0.2 se incorporan dos señales diegéticas (es decir, dentro del mundo del juego, '
    'no en la UI) para comunicar al jugador su propio estado de nerviosismo. Estas señales '
    'no son un medidor visible: son reacciones del avatar y del audio que el jugador '
    'percibe sin que se le explique. El objetivo es que el jugador sienta que está '
    'nervioso, no que se lo lea en una barra.', STY['body']))

story.append(Paragraph(
    '<b>Señal 1: Temblor del avatar.</b> El avatar del acusado tiembla proporcionalmente '
    'al volumen de su voz medido en tiempo real. Fórmula: amplitud del temblor = max(0, '
    'volumen_dBFS + 35) / 20, clamped a [0, 1]. A volumen normal (-30 dBFS), temblor = 0.25 '
    '(apenas perceptible). A volumen alto (-15 dBFS), temblor = 1.0 (temblor visible). '
    'A volumen bajo (-40 dBFS), temblor = 0. Esto es lo más barato de implementar: una '
    'sola transformación lineal aplicada a la rotación del modelo 3D.', STY['body']))

story.append(Paragraph(
    '<b>Señal 2: Latido de corazón.</b> Un loop de audio de latido sube de volumen cuando '
    'Sospecha > 70. Fórmula: volumen del latido = max(0, (Sospecha - 70) / 30). A '
    'Sospecha 70, latido = 0 (silencioso). A Sospecha 100, latido = 1.0 (audible pero no '
    'intrusivo). El loop es un único archivo de audio de 1.2 segundos que se repite. No '
    'hay variaciones, no hay curvas complejas. Fade in/out lineal de 0.5 segundos.', STY['body']))

story.append(Paragraph(
    'No hay más señales. Se descartaron explícitamente: sudor del avatar (requiere '
    'animación de shader, costoso), murmullo del jurado reactivo (requiere 5 voces IA '
    'adicionales, costoso y ruidoso), cámara que tiembla (provoca mareo en stream), '
    'filtro visual rojo en pantalla (cliché y reduce visibilidad). Cada señal descartada '
    'se evaluó contra el filtro P5 (calibrabilidad): todas fallaban el filtro por coste '
    'de implementación o por dificultad de testeo.', STY['body']))

story.append(callout_box(
    'Criterio de aceptación para estas señales: 5 personas juegan 2 partidas cada una '
    'sin que se les explique la retroalimentación. Al menos 4 de 5 deben reportar '
    'espontáneamente "me puse nervioso" o "el personaje temblaba" en la entrevista post-playtest. '
    'Si 3 o menos lo reportan, las señales se rediseñan (no se añaden más, se ajustan '
    'umbrales). Si se necesitan más de 2 señales, el sistema está sobrediseñado.',
    label='CRITERIO DE ACEPTACIÓN'))

# ── 4.5 Por qué se descartó la reputación previa ─────────
story.append(add_heading('4.5 Qué se descartó explícitamente y por qué', STY['h2'], level=1))
story.append(Paragraph(
    'Para evitar iterar ideas que ya se evaluaron y se descartaron, esta sección '
    'documenta las tres mecánicas que se consideraron para v0.2 y no entraron.', STY['body']))

desc_data = [
    [Paragraph('<b>Idea descartada</b>', STY['th']),
     Paragraph('<b>Razón del descarte</b>', STY['th']),
     Paragraph('<b>Reapertura</b>', STY['th_c'])],
    [Paragraph('6 perfiles de jurado en lugar de 3', STY['td']),
     Paragraph('6 perfiles × 5 sillas = 7.776 combinaciones. Imposible playtestear. El balance se vuelve arte, no ingeniería.', STY['td']),
     Paragraph('Solo si v0.2 con 3 perfiles se valida y el equipo crece a 3+ diseñadores de balance.', STY['td_c'])],
    [Paragraph('Grafo de relaciones entre testigos (A odia a B, B es cuñado de C...)', STY['td']),
     Paragraph('La IA tendría que razonar sobre un grafo en runtime. Alucinaciones garantizadas. Inconsistencias entre partidas.', STY['td']),
     Paragraph('Nunca. Reemplazado por vínculos pre-generados como atributo del caso (sección 3.7).', STY['td_c'])],
    [Paragraph('Reputación previa del acusado (limpio / manchado / ex-convicto)', STY['td']),
     Paragraph('Requiere persistir estado entre partidas (¿localStorage? ¿cuenta?), generar 30 casos × 3 niveles = 90 configuraciones, y explicar al jugador por qué empieza con handicap.', STY['td']),
     Paragraph('Posible en v0.3, cuando exista sistema de cuentas y progresión.', STY['td_c'])],
    [Paragraph('Compostura visible como cuarto medidor', STY['td']),
     Paragraph('Duplicaba semánticamente a Sospecha. Confundía al jugador sobre qué optimizar.', STY['td']),
     Paragraph('Nunca. Reemplazado por señales diegéticas (sección 4.4).', STY['td_c'])],
    [Paragraph('Sudor del avatar + cámara que tiembla + murmullo del jurado', STY['td']),
     Paragraph('3 sistemas reactivos síncronos con medidores de voz. Coste alto, debug complejo, mareo en stream.', STY['td']),
     Paragraph('Nunca. Las 2 señales de 4.4 son suficientes.', STY['td_c'])],
    [Paragraph('Recusación con penalización si fallas', STY['td']),
     Paragraph('Si penalizas el fallo, nadie la usa. La recusación debe ser gratuita pero escasa.', STY['td']),
     Paragraph('Nunca. Mantener 1 recusación gratuita por partida.', STY['td_c'])],
]
story.append(make_table(desc_data, [0.27, 0.55, 0.18]))
story.append(Paragraph('Tabla 4.5 · Ideas descartadas en v0.2 con su razón y condición de reapertura.',
                       STY['caption']))

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
    [Paragraph('Recusar sin especificar número de silla', STY['td']),
     Paragraph('Sistema: "¿A qué jurado se refiere?". 5 s para responder. Si no responde, no se consume.', STY['td']),
     Paragraph('0 (no se consume)', STY['td_c'])],
    [Paragraph('Recusar al juez (no al jurado)', STY['td']),
     Paragraph('Juez: "Señor, no soy yo quien está siendo evaluado".', STY['td']),
     Paragraph('Sospecha +5. Recusación consumida.', STY['td_c'])],
    [Paragraph('Afirmar vínculo que no existe entre testigos', STY['td']),
     Paragraph('Juez: "No veo la conexión. ¿Tiene evidencia?". 10 s para presentarla. Si no, se descarta.', STY['td']),
     Paragraph('0 (no penaliza, para animar a intentarlo)', STY['td_c'])],
    [Paragraph('Spamear afirmaciones de vínculo (3+ veces)', STY['td']),
     Paragraph('Juez ignora la tercera sin responder. Sistema cuenta 2 afirmaciones por partida.', STY['td']),
     Paragraph('0', STY['td_c'])],
    [Paragraph('Insultar a un jurado específico', STY['td']),
     Paragraph('Juez: "¡Orden en la sala!". El jurado insultado baja simpatía 15. Otros no cambian.', STY['td']),
     Paragraph('Simpatía individual -15 al jurado', STY['td_c'])],
    [Paragraph('Hablar al jurado directamente ("señores jurados...")', STY['td']),
     Paragraph('Juez: "Acusado, diríjase al tribunal, no al jurado". Funciona pero solo 1 vez.', STY['td']),
     Paragraph('0 (advertencia), -5 si reincide', STY['td_c'])],
    [Paragraph('Quedarse completamente quieto (sin voz) en F3 (evidencia)', STY['td']),
     Paragraph('Tras 30 s de inactividad en F3, juez: "¿Renuncia la defensa a presentar evidencia?".', STY['td']),
     Paragraph('Credibilidad -10 si confirma', STY['td_c'])],
]
story.append(make_table(fail_data, [0.36, 0.48, 0.16]))
story.append(Paragraph('Tabla 5.1 · Modelo de fallos: respuestas del sistema a comportamientos no triviales. '
                       'Las 7 últimas filas son nuevas en v0.2, cubren recusación, vínculos y jurados.',
                       STY['caption']))

story.append(callout_box(
    'La regla rectora del modelo de fallos es: <b>nunca bloquear al jugador, siempre '
    'responder</b>. Si el jugador hace algo inesperado, la IA debe reaccionar dentro '
    'del marco ficcional del tribunal, no mostrar un error. La excepción es el desacato '
    'repetido al juez, que es la única forma de "perder" el juicio fuera del veredicto.',
    label='REGLA RECTORA'))

print("Parte 4 (Capítulos 4-5) lista")

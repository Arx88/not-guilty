"""
Diagrama de loop de tensión de una partida de NOT GUILTY.
Eje X: tiempo (minutos, 0-10)
Eje Y: tensión (0-100)
Muestra las 5 fases con sus picos y valles, y marca los eventos críticos.
"""
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np
from matplotlib.patches import FancyBboxPatch, Rectangle
import os

# Fuentes
fm.fontManager.addfont('/usr/share/fonts/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf')
fm.fontManager.addfont('/usr/share/fonts/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf')
fm.fontManager.addfont('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
plt.rcParams['font.sans-serif'] = ['Noto Serif SC', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

# Paleta del documento
C_BG = '#f7f5f1'
C_PRIMARY = '#1d1c1a'
C_MUTED = '#8d8a83'
C_ACCENT = '#866f2c'
C_ACCENT2 = '#884d47'
C_LINE = '#696149'
C_OK = '#44945f'
C_WARN = '#98804f'

fig, ax = plt.subplots(figsize=(11, 5.5), facecolor=C_BG, constrained_layout=True)
ax.set_facecolor(C_BG)

# Datos: tiempo vs tensión
# 5 fases:
# F1 Apertura (0-1.5): subida suave 20→35
# F2 Testimonio fiscal (1.5-3.5): subida con pico en objeción 35→75→55
# F3 Evidencia (3.5-5.5): valle estratégico 55→40→60
# F4 Testigos (5.5-8): picos por recusación 60→85→65→80
# F5 Veredicto (8-10): subida final 80→95→(caída a 30 o sube a 100)

t = np.array([0, 0.5, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5,
              6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0])
y = np.array([20, 25, 35, 50, 75, 55, 40, 45, 50, 60, 55,
              70, 85, 60, 80, 78, 88, 95, 90, 100])

# Línea principal de tensión
ax.plot(t, y, color=C_PRIMARY, linewidth=2.2, zorder=5, solid_capstyle='round')
ax.fill_between(t, y, 0, color=C_ACCENT, alpha=0.10, zorder=2)

# Banda de "zona de peligro" (tensión > 70)
ax.axhspan(70, 100, color=C_ACCENT2, alpha=0.06, zorder=1)
ax.axhline(70, color=C_ACCENT2, linewidth=0.8, linestyle='--', alpha=0.5, zorder=3)

# Banda de "zona de calma" (tensión < 30)
ax.axhspan(0, 30, color=C_OK, alpha=0.05, zorder=1)

# Marcadores de eventos clave
events = [
    (2.5, 75, '¡Protesta!\n(window 3s)', C_ACCENT2, 'right'),
    (4.5, 50, 'Evidencia\nclave', C_OK, 'right'),
    (6.5, 85, 'Testigo\nrecusado', C_ACCENT2, 'left'),
    (9.0, 95, 'Veredicto\ninminente', C_ACCENT2, 'left'),
]
for tx, ty, label, col, ha in events:
    ax.scatter([tx], [ty], s=70, color=col, zorder=6, edgecolor='white', linewidth=1.5)
    offset_x = 0.3 if ha == 'right' else -0.3
    ax.annotate(label, xy=(tx, ty), xytext=(tx + offset_x, ty + 8),
                fontsize=8.5, color=col, ha=ha, va='bottom',
                fontweight='bold',
                arrowprops=dict(arrowstyle='-', color=col, alpha=0.4, lw=0.8))

# Fondos de fases (bandas verticales)
phases = [
    (0, 1.5, 'F1 · Apertura', C_MUTED),
    (1.5, 3.5, 'F2 · Testimonio\nfiscal', C_ACCENT),
    (3.5, 5.5, 'F3 · Evidencia', C_OK),
    (5.5, 8.0, 'F4 · Testigos', C_ACCENT2),
    (8.0, 10.0, 'F5 · Veredicto', C_PRIMARY),
]
for x0, x1, label, col in phases:
    ax.axvspan(x0, x1, alpha=0.04, color=col, zorder=0)
    ax.text((x0 + x1) / 2, 105, label, ha='center', va='bottom',
            fontsize=8.5, color=col, fontweight='bold')

# Eje X
ax.set_xlim(0, 10)
ax.set_xticks(range(0, 11, 1))
ax.set_xticklabels([f'{i}' for i in range(0, 11)], fontsize=9, color=C_MUTED)
ax.set_xlabel('Tiempo (minutos)', fontsize=10, color=C_PRIMARY, labelpad=8)

# Eje Y
ax.set_ylim(0, 115)
ax.set_yticks([0, 30, 70, 100])
ax.set_yticklabels(['0\nCalma', '30', '70\nPeligro', '100\nPico'], fontsize=8.5, color=C_MUTED)
ax.set_ylabel('Tensión del jugador', fontsize=10, color=C_PRIMARY, labelpad=8)

# Estilo spines
for spine in ['top', 'right']:
    ax.spines[spine].set_visible(False)
ax.spines['left'].set_color(C_MUTED)
ax.spines['bottom'].set_color(C_MUTED)
ax.spines['left'].set_linewidth(0.8)
ax.spines['bottom'].set_linewidth(0.8)

# Grid
ax.grid(axis='y', linestyle=':', color=C_MUTED, alpha=0.3, linewidth=0.5)
ax.set_axisbelow(True)

# Título
ax.set_title('Curva de tensión objetivo · Partida tipo de 10 minutos',
             fontsize=12.5, color=C_PRIMARY, pad=14, loc='left', fontweight='bold')

# Anotación de principio rector
ax.text(5, -18, 'Principio: la tensión sube pordecisiones del jugador, baja por respiros estratégicos. '
                'Picos en objeciones y recusaciones. Valle obligatorio en F3 (planificación).',
        ha='center', va='top', fontsize=8, color=C_MUTED, style='italic',
        transform=ax.transData)

plt.savefig('/home/z/my-project/scripts/tension_loop.png',
            dpi=200, facecolor=C_BG, bbox_inches=None)
print("OK: /home/z/my-project/scripts/tension_loop.png")

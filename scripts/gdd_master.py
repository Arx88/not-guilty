"""
NOT GUILTY — GDD v0.1
Script maestro: ejecuta todos los scripts de partes en orden.
Cada parte añade a `story` que se construye con `doc.multiBuild`.
"""
import os, sys

# Ejecutar setup primero para tener todos los nombres disponibles
exec(open('/home/z/my-project/scripts/gdd_part1_setup.py').read(), globals())
# Ejecutar partes 2 a 6 (todas añaden a story)
exec(open('/home/z/my-project/scripts/gdd_part2_ch12.py').read(), globals())
exec(open('/home/z/my-project/scripts/gdd_part3_ch3.py').read(), globals())
exec(open('/home/z/my-project/scripts/gdd_part4_ch45.py').read(), globals())
exec(open('/home/z/my-project/scripts/gdd_part5_ch6.py').read(), globals())
exec(open('/home/z/my-project/scripts/gdd_part6_ch789_build.py').read(), globals())

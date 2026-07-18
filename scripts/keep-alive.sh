#!/bin/bash
# Mantiene el servidor Next.js corriendo, lo reinicia si se cae
cd /home/z/my-project
while true; do
  if ! pgrep -f "next-server" > /dev/null; then
    echo "[$(date)] Server no responde, reiniciando..."
    pkill -f "next" 2>/dev/null
    sleep 2
    setsid bash -c 'NODE_OPTIONS="--max-old-space-size=1024" exec npx next dev -p 3000' </dev/null >>/home/z/my-project/dev.log 2>&1 &
    disown
    # Esperar a que esté listo
    for i in $(seq 1 30); do
      if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null | grep -q "200"; then
        echo "[$(date)] Server UP"
        break
      fi
      sleep 1
    done
  fi
  sleep 10
done

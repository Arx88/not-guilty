#!/bin/bash
# Keep-alive robusto: reinicia el servidor Next.js si se cae
cd /home/z/my-project
while true; do
  if ! pgrep -f "next-server" > /dev/null 2>&1; then
    echo "[$(date)] Reiniciando server..."
    pkill -f "next dev" 2>/dev/null
    pkill -f "next-server" 2>/dev/null
    sleep 2
    nohup npx next dev -p 3000 </dev/null >>/home/z/my-project/dev.log 2>&1 &
    disown
    # Esperar a que esté listo
    for i in $(seq 1 30); do
      if curl -s -o /dev/null http://localhost:3000/ 2>/dev/null; then
        echo "[$(date)] Server UP"
        break
      fi
      sleep 1
    done
  fi
  sleep 3
done

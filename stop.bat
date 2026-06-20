@echo off
echo Stopping Docker containers...
docker compose down

echo Closing Backend and Frontend windows...
taskkill /FI "WindowTitle eq Backend*" /T /F
taskkill /FI "WindowTitle eq Frontend*" /T /F

echo All services stopped.
pause
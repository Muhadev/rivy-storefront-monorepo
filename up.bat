@echo off
echo Starting frontend...
docker compose -f apps/frontend/docker-compose.yml up --build -d

echo Starting backend...
docker compose -f apps/backend/docker-compose.yml up --build -d

echo All services are up 🚀
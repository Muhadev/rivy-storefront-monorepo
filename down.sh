#!/bin/bash

echo "Stopping backend..."
docker compose -f apps/backend/docker-compose.yml down

echo "Stopping frontend..."
docker compose -f apps/frontend/docker-compose.yml down

echo "All services stopped 🛑"
# Local & Deploy

## Local with Docker
```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
docker compose up --build
```

## Seeding
```bash
docker compose exec backend npm run build
docker compose exec backend node dist/seed.js
```

## Running Tests
```bash
npm -w apps/backend test
npm -w apps/frontend test
```

## Production (Example)
- Build images and push to registry
- Use a small reverse proxy (e.g., Nginx or Caddy) to route `/api` → backend and `/` → frontend
- Configure environment variables and Postgres managed instance

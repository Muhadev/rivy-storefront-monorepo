# Rivy Storefront — Monorepo Boilerplate

Monorepo for a minimal storefront: **React + TypeScript** frontend and **Node.js + Express + Sequelize + Postgres** backend.
Designed for senior-level assessment workflows with a **dev-first branch policy**, **conventional commits**, **Docker Compose**, and **CI**.


## Quick Start

```bash
# 1) Copy envs
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# 2) Start all services (root compose)
docker compose up --build

# 3) Start backend only (with nginx, db)
cd apps/backend
docker compose up --build
```

- API: http://localhost:4000/api
- OpenAPI Docs: http://localhost:4000/api/v1/docs
- Frontend: http://localhost:5173

## API Docs

- OpenAPI spec is available at `/api/v1/docs` (served as YAML)
- See `apps/backend/openapi.yaml` for endpoint details

## Testing

- Run backend tests:
	```bash
	npm -w apps/backend test
	```
- Run frontend tests:
	```bash
	npm -w apps/frontend test
	```

## Docker Compose Structure

- Root `docker-compose.yml`: runs backend, frontend, db
- Backend-only: `apps/backend/docker-compose.yml` (backend, db, nginx)

## Workflows (Senior-level)

## Workflows (Senior-level)

- Default branch: `main`. Daily work targets `dev`. Create PRs from `dev` → `main` **only after a feature is fully completed**.
- Commit style: Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`...).
- One commit per **sub-feature** (e.g., `feat(auth): setup user model & env`, then `feat(auth): login controller/service/routes`).

See `docs/COMMIT_PLAN.md` and `docs/ROADMAP.md`.

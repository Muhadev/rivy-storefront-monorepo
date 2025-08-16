# Commit & PR Plan (Dev-First)

- Work on `dev`. Create a commit **per sub-feature**.
- After completing a feature (e.g., entire Auth, or entire Catalog), open a PR `dev` → `main`.

## Example — Auth Feature

1. `feat(auth): setup user model & env`
2. `feat(auth): register controller/service/routes`
3. `feat(auth): login controller/service/routes`
4. `feat(auth): auth guard middleware (bearer)`

## Example — Catalog Feature

1. `feat(products): list with pagination & filters`
2. `feat(products): product detail endpoint`
3. `test(products): service & handler tests`

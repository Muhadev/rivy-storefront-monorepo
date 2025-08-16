# Development Roadmap

> Follow this plan to deliver backend first, then frontend. Push **only to `dev`** on each sub-feature completion. Open PR `dev` → `main` after a feature is fully complete.

## Branching & Commit Policy
- Default branch: `main`
- Working branch: `dev`
- Feature branches (optional): `feat/<area>-<short>` merged back into `dev`
- Commit style: Conventional Commits
- One commit per **sub-feature**

## Backend Tasks (Phase 1)

### Foundation
1. `feat(core): scaffold backend app shell (express, ts, lint, pino, health)`
2. `feat(db): sequelize init + postgres connection + migration runner`
3. `feat(core): error handler, zod validation middleware, CORS, rate limit`

### Domain Models & Migrations
4. `feat(models): user, product, category, order, orderItem, cartItem`
5. `feat(seed): basic seeders for products/categories`

### Auth (Optional for admin endpoints)
6. `feat(auth): setup user model + env (JWT_SECRET, salts)`
7. `feat(auth): register controller/service/routes with validation`
8. `feat(auth): login controller/service/routes + password hashing + JWT`
9. `feat(auth): auth guard middleware (bearer)`

### Catalog
10. `feat(products): list w/ pagination & query (q, categoryId, minPrice, maxPrice)`
11. `feat(products): get by id, include images/specs`

### Cart & Checkout
12. `feat(cart): add/update/remove items`
13. `feat(cart): compute totals w/ simple tax rule`
14. `feat(checkout): simulate checkout → create order, order items`
15. `feat(orders): GET order by id + GET my orders`

### Observability & Docs
16. `feat(docs): OpenAPI spec + /docs endpoint`
17. `feat(logs): request start/success/error logs`
18. `test(unit): core services (pricing, cart math)`
19. `test(integration): add-to-cart + checkout flow`

## Frontend Tasks (Phase 2)

### Foundation
1. `feat(frontend): scaffold vite react ts + tailwind + router + query`
2. `feat(frontend): API client + env VITE_API_URL`
3. `feat(frontend): layout, header, footer, toasts`

### Catalog & Product
4. `feat(frontend): catalog page (search, filters, pagination)`
5. `feat(frontend): product detail (images, specs, add to cart)`

### Cart & Checkout
6. `feat(frontend): cart page (update qty, remove)`
7. `feat(frontend): checkout summary + simulate checkout`
8. `feat(frontend): order confirmation + order details`

### UX & A11y
9. `feat(frontend): loading/empty/error states`
10. `feat(frontend): responsive, keyboard focus, forms a11y`

### Testing
11. `test(frontend): component tests (ProductCard, Filters)`

## Deliverables & Docs
- README (run with Docker, env vars, seeding, tests, deploy)
- Postman collection for all endpoints
- OpenAPI spec (served and in repo)
- Wireframe link and audit doc

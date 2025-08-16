# Code Review Checklist

- **Correctness**: Handles edge cases, validations, and consistent error format.
- **Security**: No secrets committed, basic rate limiting & CORS in place.
- **Performance**: Pagination implemented, no N+1 queries.
- **Tests**: Critical logic covered, tests are deterministic.
- **Types**: Strong typing on API DTOs, services, and components.
- **UX/A11y**: Clear loading/empty/error states, keyboard/focus handling.
- **Docs**: README, OpenAPI, and Postman updated for new endpoints.

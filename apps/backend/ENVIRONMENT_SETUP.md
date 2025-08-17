# Environment Setup Guide

## Quick Start

1. **Copy environment files:**
   ```bash
   cp .env.example .env
   cp .env.test.example .env.test
   ```

2. **Update the `.env` file with your local configuration:**
   - For Docker development: Use the default DATABASE_URL
   - For local PostgreSQL: Change DATABASE_URL to `postgres://rivy:rivy@localhost:5432/rivy`
   - Update JWT_SECRET with a secure random string for production

3. **Update the `.env.test` file:**
   - Ensure TEST_DATABASE_URL points to your test database
   - Default: `postgres://rivy:rivy@localhost:5432/rivy_test`

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment mode | `development`, `production`, `test` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:port/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | `60000` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |
| `CORS_ORIGIN` | Allowed CORS origins | `*` |
| `TAX_RATE` | Tax rate for calculations | `0.05` |

## Database Setup

### Using Docker (Recommended)
```bash
docker-compose up -d
```

### Local PostgreSQL
1. Install PostgreSQL
2. Create databases:
   ```sql
   CREATE DATABASE rivy;
   CREATE DATABASE rivy_test;
   CREATE USER rivy WITH ENCRYPTED PASSWORD 'rivy';
   GRANT ALL PRIVILEGES ON DATABASE rivy TO rivy;
   GRANT ALL PRIVILEGES ON DATABASE rivy_test TO rivy;
   ```

## Security Notes

- **Never commit `.env` files to version control**
- **Use strong, unique JWT_SECRET in production**
- **Restrict CORS_ORIGIN in production**
- **Use environment-specific database credentials**

## Testing

Make sure your `.env.test` file points to a separate test database to avoid data conflicts during testing.

```bash
npm test
```

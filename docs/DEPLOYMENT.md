# Production Deployment Guide

## Overview
This guide covers deploying the Rivy Storefront backend to production using:
- **Render.com**: Backend API (Docker containers)
- **Clever Cloud**: PostgreSQL database (Managed service)

## Prerequisites
- GitHub repository with your code
- Render.com account
- Clever Cloud account

## 1. Local Development (Docker)
```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
docker compose up --build
```

## 2. Database Deployment (Clever Cloud)

### Step 1: Create PostgreSQL Instance
1. Login to Clever Cloud console
2. Create new application → PostgreSQL
3. Choose your region and plan
4. Note down the connection details:
   - Host
   - Port (usually 5432)
   - Database name
   - Username
   - Password

### Step 2: Configure Database
```sql
-- Connect to your database and run initial setup if needed
-- Your application will handle table creation via Sequelize
```

## 3. Backend Deployment (Render.com)

### Step 1: Connect Repository
1. Login to Render.com
2. Create new Web Service
3. Connect your GitHub repository
4. Select branch: `main` or `dev`

### Step 2: Configure Service
```yaml
Name: rivy-storefront-backend
Environment: Docker
Region: Oregon (or your preferred region)
Branch: main
Root Directory: apps/backend
Dockerfile Path: ./Dockerfile
```

### Step 3: Environment Variables
Set these in Render dashboard:

```bash
NODE_ENV=production
PORT=4000

# Database (from Clever Cloud)
DATABASE_URL=postgresql://user:pass@host:port/db
DB_HOST=your-clever-cloud-host
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=your-username
DB_PASSWORD=your-password

# Security
JWT_SECRET=your-super-secure-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
BCRYPT_ROUNDS=12

# API URLs
API_BASE_URL=https://your-app.onrender.com
FRONTEND_URL=https://your-frontend.com
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Render will build and deploy your Docker container
3. Monitor the build logs
4. Test your API endpoints

## 4. Post-Deployment Setup

### Health Check
Your API should be available at:
```
https://your-app.onrender.com/api/v1/health
```

### Database Seeding
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

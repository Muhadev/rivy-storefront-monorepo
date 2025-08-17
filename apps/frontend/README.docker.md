# Frontend Docker Setup

This directory contains the Docker configuration for the Rivy Storefront frontend.

## Prerequisites

- Docker and Docker Compose installed
- Backend service running (on localhost:4000)
- Frontend built locally (`npm run build`)

## Quick Start

### Method 1: Using Docker Compose (Recommended)

```bash
# Build the frontend first
npm run build

# Start the containerized frontend
docker-compose up -d

# Access the frontend
open http://localhost:3000
```

### Method 2: Manual Docker Run

```bash
# Build the frontend
npm run build

# Run with nginx
docker run -d --name rivy-frontend \
  -p 3000:80 \
  -v $(pwd)/dist:/usr/share/nginx/html:ro \
  -v $(pwd)/nginx.dev.conf:/etc/nginx/conf.d/default.conf:ro \
  nginx:alpine
```

## API Configuration

The frontend is configured to connect to the backend API at:
- **Local development**: `http://localhost:4000/api/v1`
- **Container to host**: `http://host.docker.internal:4000/api/v1`

Update the `.env` file to change the API URL:

```bash
VITE_API_URL=http://localhost:4000/api/v1
```

## Development Workflow

1. **Start Backend**: Ensure your backend is running (Docker or local)
2. **Build Frontend**: Run `npm run build` to create production build
3. **Start Container**: Use `docker-compose up -d`
4. **Test**: Open http://localhost:3000

## Files Overview

- `docker-compose.yml` - Main Docker Compose configuration
- `Dockerfile` - Multi-stage build (if needed)
- `Dockerfile.dev` - Development mode with hot reload
- `nginx.dev.conf` - Simple nginx config for development
- `nginx.conf` - Production nginx config with backend proxy
- `.env.docker` - Docker-specific environment variables

## Troubleshooting

### Frontend not loading
- Check if container is running: `docker ps | grep rivy-frontend`
- Check container logs: `docker logs rivy-frontend`
- Verify dist folder exists: `ls -la dist/`

### API connection issues
- Ensure backend is running on port 4000
- Check API URL in browser network tab
- Verify CORS settings in backend

### Build issues
- Run `npm run build` locally first
- Check for TypeScript errors
- Ensure all dependencies installed

## Commands

```bash
# Stop containers
docker-compose down

# View logs
docker-compose logs frontend

# Rebuild and restart
npm run build && docker-compose up -d --force-recreate

# Clean up
docker-compose down
docker rmi frontend_frontend  # if using build mode
```

## Notes

- The current setup uses pre-built static files for reliability
- For development with hot reload, use `npm run dev` instead
- Production deployment should use the full Dockerfile build

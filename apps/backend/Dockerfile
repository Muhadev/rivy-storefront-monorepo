# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache postgresql-client

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install system dependencies for production
RUN apk add --no-cache curl postgresql-client && \
    addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001

# Copy built application from builder stage
COPY --from=builder --chown=backend:nodejs /app/dist ./dist
COPY --from=builder --chown=backend:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=backend:nodejs /app/package*.json ./

# Create entrypoint script
RUN echo '#!/bin/sh\nnode dist/server.js' > entrypoint.sh && \
    chmod +x entrypoint.sh && \
    chown backend:nodejs entrypoint.sh

# Switch to non-root user
USER backend

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4000/api/v1/health || exit 1

# Set production environment
ENV NODE_ENV=production

# Use entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]

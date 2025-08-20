# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache postgresql-client

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS development

WORKDIR /app

# Install system dependencies for production
RUN apk add --no-cache curl postgresql-client && \
    addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001

# Copy package files first
COPY --chown=backend:nodejs package*.json ./

# Install only production dependencies
RUN npm install --only=production --legacy-peer-deps && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=backend:nodejs /app/dist ./dist

# Copy the entrypoint script
COPY --chown=backend:nodejs entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

# Switch to non-root user
USER backend

# Expose port
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4000/api/v1/health || exit 1

# Set production environment
ENV NODE_ENV=development

# Use entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]
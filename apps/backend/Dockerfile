# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Install system dependencies including curl for health checks
RUN apk add --no-cache curl postgresql-client

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for development)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Make entrypoint executable
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose port
EXPOSE 4000

# Set default environment
ENV NODE_ENV=development

# Use entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]

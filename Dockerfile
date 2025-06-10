# syntax=docker/dockerfile:1

# Build stage
FROM node:22.14.0-alpine AS builder

# Build arguments for environment configuration
ARG NODE_ENV=production
ARG BUILD_ENV=prod

# Set environment variables
ENV NODE_ENV=${NODE_ENV}
ENV BUILD_ENV=${BUILD_ENV}

# Add metadata
LABEL maintainer="painless-app"
LABEL description="pAIn-less Astro application"
LABEL version="1.0.0"

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory and user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S astro -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Copy source code
COPY . .

# Change ownership to astro user
RUN chown -R astro:nodejs /app

# Switch to non-root user for build
USER astro

# Build the application
RUN npm run build

# Production stage
FROM node:22.14.0-alpine AS runtime

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory and user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S astro -u 1001

WORKDIR /app

# Copy package files for production dependencies only
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/astro.config.mjs ./
COPY --from=builder --chown=astro:nodejs /app/package.json ./

# Switch to non-root user
USER astro

# Expose port (DigitalOcean standard)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node --eval "
const http = require('http');
const options = { host: 'localhost', port: 8080, timeout: 2000 };
const request = http.request(options, (res) => { 
    if (res.statusCode === 200) process.exit(0); 
    else process.exit(1); 
});
request.on('error', () => process.exit(1));
request.end();" || exit 1

# Start the application
CMD ["dumb-init", "node", "./dist/server/entry.mjs"] 
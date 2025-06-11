# syntax=docker/dockerfile:1

# Build stage
FROM node:22.14.0-alpine AS builder

# Build arguments for environment configuration
ARG NODE_ENV=prod
ARG BUILD_ENV=prod
ARG SUPABASE_URL
ARG SUPABASE_KEY
ARG OPENROUTER_API_KEY
ARG HOST=0.0.0.0
ARG PORT=8080
ARG PUBLIC_ENV_NAME=prod

# Set environment variables for build process
ENV NODE_ENV=${NODE_ENV}
ENV BUILD_ENV=${BUILD_ENV}
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_KEY=${SUPABASE_KEY}
ENV OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
ENV HOST=${HOST}
ENV PORT=${PORT}
ENV PUBLIC_ENV_NAME=${PUBLIC_ENV_NAME}

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

# Build the application (now with environment variables available)
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
EXPOSE ${PORT}

# Health check using Node's built-in http module
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD node --eval "const http = require('http'); const options = { host: process.env.HOST || '0.0.0.0', port: process.env.PORT || 8080, path: '/api/health', timeout: 2000 }; const request = http.request(options, (res) => { if (res.statusCode === 200) process.exit(0); else process.exit(1); }); request.on('error', () => process.exit(1)); request.end();" || exit 1

# Start the application
CMD ["dumb-init", "node", "./dist/server/entry.mjs"] 
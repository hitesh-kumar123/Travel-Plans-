# =============================================
# PackGo Backend — Dockerfile
# =============================================
# Multi-stage build for a lean production image.
# Stage 1: Install dependencies
# Stage 2: Copy only production deps + source

# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests first (better layer caching)
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies for potential build steps)
RUN npm ci

# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

# Copy only production dependencies from builder
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source code
COPY . .

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the default server port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/ || exit 1

# Start the server
CMD ["node", "server.js"]

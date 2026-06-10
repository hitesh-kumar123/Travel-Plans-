# =============================================
# PackGo Backend — Dockerfile
# =============================================
# Single-stage production build for a lean image.

FROM node:20-alpine

WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package manifests first (better layer caching)
COPY package.json package-lock.json* ./

# Install only production dependencies and fix ownership
RUN npm ci --omit=dev && npm cache clean --force && chown -R appuser:appgroup /app

# Copy application source code with correct ownership
COPY --chown=appuser:appgroup . .

# Switch to non-root user
USER appuser

# Expose the default server port
EXPOSE 5000

# Health check against a dedicated health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:5000/api/health || exit 1

# Start the server
CMD ["node", "server.js"]

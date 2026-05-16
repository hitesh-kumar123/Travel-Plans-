# External Integrations

**Analysis Date:** 2026-05-16

## APIs & External Services

**Weather:**
- OpenWeatherMap API - Weather and forecast data in `server/controllers/weatherController.js`
  - SDK/Client: `axios`
  - Auth: `WEATHER_API_KEY` (referenced in `server/controllers/weatherController.js`)

**Translation:**
- Google Translate (via `google-translate-api-x`) - Live translation in `server/controllers/translatorController.js`
  - SDK/Client: `google-translate-api-x`
  - Auth: none (library-based, no key referenced)

**Booking (mocked):**
- Flight and hotel search endpoints return mock data in `server/controllers/bookingController.js`
  - SDK/Client: none (local mock data)

## Data Storage

**Databases:**
- MongoDB (local or Atlas) via Mongoose in `server/server.js` and `server/models/*.js`
  - Connection: `MONGO_URI` (used in `server/server.js`, `server/data/seed.js`, `server/data/cleanAndSeed.js`)
  - Client: `mongoose`

**File Storage:**
- Local filesystem only (no storage SDKs detected)

**Caching:**
- None detected

## Authentication & Identity

**Auth Provider:**
- Custom JWT authentication
  - Implementation: JWT verification middleware in `server/middleware/auth.js`, token creation in `server/controllers/authController.js`

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Console logging via `console.log` / `console.error` in `server/server.js` and controllers (e.g., `server/controllers/tripController.js`)

## CI/CD & Deployment

**Hosting:**
- Vercel preview deployments for client via `.github/workflows/vercel-preview.yml`

**CI Pipeline:**
- GitHub Actions CI in `.github/workflows/ci.yml` (lint, format check, build)

## Environment Configuration

**Required env vars:**
- `MONGO_URI` (MongoDB connection) in `server/server.js` and `server/data/seed.js`
- `JWT_SECRET` (JWT signing) in `server/controllers/authController.js`
- `WEATHER_API_KEY` (OpenWeatherMap) in `server/controllers/weatherController.js`
- `PORT` (server port) in `server/server.js`

**Secrets location:**
- `.env.example` present at repo root (example only)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

---

*Integration audit: 2026-05-16*

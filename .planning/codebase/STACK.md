# Technology Stack

**Analysis Date:** 2026-05-16

## Languages

**Primary:**
- JavaScript (Node.js + React) - Backend in `server/` and frontend in `client/src/`

**Secondary:**
- YAML - GitHub Actions workflows in `.github/workflows/*.yml`

## Runtime

**Environment:**
- Node.js 18+ (documented in `README.md`)
- CI uses Node.js 20.x (configured in `.github/workflows/ci.yml`, `.github/workflows/vercel-preview.yml`)

**Package Manager:**
- npm
- Lockfile: not detected in repo root; check `client/` and `server/` (CI references `client/package-lock.json`, `server/package-lock.json` in `.github/workflows/ci.yml`)

## Frameworks

**Core:**
- React 19 - SPA frontend in `client/src/App.js`
- Express - API server in `server/server.js`
- Mongoose - MongoDB ODM in `server/models/*.js`

**Testing:**
- React Testing Library + Jest (CRA defaults) configured via `client/package.json`

**Build/Dev:**
- Create React App (`react-scripts`) in `client/package.json`
- Nodemon for server reload in `server/package.json`

## Key Dependencies

**Critical:**
- `express` - REST API server in `server/server.js`
- `mongoose` - MongoDB connection and schemas in `server/models/*.js`
- `jsonwebtoken` - JWT auth in `server/middleware/auth.js`
- `bcryptjs` - Password hashing in `server/models/User.js`
- `axios` - HTTP client used on both backend (`server/controllers/weatherController.js`) and frontend (`client/src/services/api.js`)

**Infrastructure:**
- `helmet` - Security headers in `server/server.js`
- `express-rate-limit` - API rate limiting in `server/server.js`
- `cors` - CORS config in `server/server.js`
- `dotenv` - Environment variable loading in `server/server.js` and `server/data/*.js`

## Configuration

**Environment:**
- Backend env vars loaded via `dotenv.config()` in `server/server.js`
- Example env file present: `.env.example`

**Build:**
- CRA config via `client/package.json` scripts (`start`, `build`, `test`)
- ESLint config in `server/eslint.config.mjs`

## Platform Requirements

**Development:**
- Node.js 18+ and npm (documented in `README.md`)
- MongoDB (local or Atlas) referenced in `README.md` and used in `server/server.js`

**Production:**
- Vercel preview deployments for client via `.github/workflows/vercel-preview.yml`
- Backend expects MongoDB and env vars (`MONGO_URI`, `JWT_SECRET`, `WEATHER_API_KEY`) per `README.md`

---

*Stack analysis: 2026-05-16*

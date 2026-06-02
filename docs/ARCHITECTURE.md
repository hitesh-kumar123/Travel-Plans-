# PackGo Architecture Overview

This document gives new contributors a high-level map of how PackGo is organized and how data moves through the application.

## System at a Glance

PackGo is a MERN travel planning app with a React client, an Express API, and MongoDB persistence.

```text
Browser
  |
  | React routes, Redux actions, Axios requests
  v
client/
  |
  | HTTP requests to /api/*
  v
server/
  |
  | Mongoose models and external service calls
  v
MongoDB + third-party APIs
```

## Frontend

The frontend lives in `client/` and is built with React, React Router, Redux, Material UI, Axios, Recharts, and React Toastify.

Key files and folders:

- `client/src/App.js` defines public routes, protected dashboard routes, shared-trip routes, and fallback routing.
- `client/src/pages/` contains top-level pages such as Home, Login, Register, Dashboard, and account recovery screens.
- `client/src/pages/dashboard/` contains the authenticated dashboard modules for trips, expenses, bookings, weather, translator, packing, and profile management.
- `client/src/components/PrivateRoute.js` protects dashboard routes by requiring an authenticated user.
- `client/src/redux/` contains the Redux store, action creators, reducers, and action type constants.
- `client/src/services/api.js` creates the shared Axios client, sets the API base URL, and attaches the JWT token from local storage.
- `client/src/theme.js` centralizes the Material UI theme.

In development, the client calls `http://localhost:5000/api` by default. In production, it can use `REACT_APP_API_URL` or fall back to `/api`.

## Backend

The backend lives in `server/` and is an Express application connected to MongoDB through Mongoose.

Key files and folders:

- `server/server.js` initializes Express, security middleware, CORS, JSON parsing, API routes, MongoDB connection, and the HTTP server.
- `server/routes/` maps API paths to controller handlers.
- `server/controllers/` contains request handling for auth, trips, expenses, weather, translation, booking, and packing features.
- `server/models/` defines MongoDB schemas for users, trips, expenses, destinations, and packing lists.
- `server/middleware/auth.js` verifies JWT tokens for protected API routes.
- `server/middleware/errorHandler.js` centralizes error responses.
- `server/data/` and `server/seed.js` provide seed data and database population utilities.
- `server/utils/` contains reusable helpers such as email, currency conversion, and security-related scripts.

The API mounts its main modules under `/api/*`, including:

- `/api/auth`
- `/api/trips`
- `/api/expenses`
- `/api/weather`
- `/api/translator`
- `/api/booking`
- `/api/destinations`
- `/api/packing`
- `/api/currency`

## Data Flow

1. A user opens the React app and navigates through `client/src/App.js`.
2. Protected routes render through `PrivateRoute`, which relies on auth state loaded into Redux.
3. UI pages dispatch Redux actions from `client/src/redux/actions/`.
4. Actions call the shared Axios client in `client/src/services/api.js`.
5. Axios sends requests to the Express API and includes `x-auth-token` when a JWT is available.
6. Express routes pass the request to the matching controller.
7. Controllers validate input, use Mongoose models, and return JSON responses.
8. Reducers update Redux state, and React components re-render the latest data.

## Authentication Flow

PackGo uses JWT-based authentication.

1. The user registers or logs in through the auth pages.
2. The backend validates credentials, hashes or compares passwords with bcrypt, and signs a JWT.
3. The frontend stores the token in local storage.
4. `client/src/services/api.js` attaches the token as `x-auth-token` on later requests.
5. Protected backend routes use `server/middleware/auth.js` to verify the token before reaching controllers.

## External Integrations

PackGo integrates with external services through backend controllers and utilities:

- OpenWeatherMap for weather forecasts.
- Google Translate through `google-translate-api-x` for travel translation.
- Mock booking data for flight and hotel search, with room for real provider integration later.
- Email utilities for account and notification flows.

Keep new integrations behind the backend API when possible so secrets stay out of the browser.

## Environment and Configuration

Environment templates are available at:

- `.env.example` for root-level settings.
- `client/.env.example` for frontend settings.
- `server/.env.example` for backend settings.

Common values include MongoDB connection details, JWT configuration, frontend origin settings, API URLs, and third-party service keys.

## Contributor Notes

- Add UI changes under `client/src/` and keep API calls in `client/src/services/api.js` or related Redux actions.
- Add server endpoints by pairing a `server/routes/` route with a `server/controllers/` handler.
- Store persistent domain data in `server/models/` with Mongoose schemas.
- Use middleware for cross-cutting backend concerns such as authentication, error handling, rate limiting, and security headers.
- Update this document when adding a new major module, external service, or data flow.

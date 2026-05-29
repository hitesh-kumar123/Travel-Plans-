# Travel Planner API Documentation

This document describes the API endpoints, authentication mechanisms, and request/response structures for the Travel Planner backend services.

## Authentication

Authentication is handled via JSON Web Tokens (JWT). Most routes (except registration, login, forgot password, and reset password) require the token to be sent in the `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints (`/api/auth`)

Controller split (structural only, no route changes):
- `authController`: `register`, `login`
- `otpController`: `verifyOtp`, `resendOtp`, `getOtpStatus`, `requestEmailChange`, `verifyEmailChange`, `getEmailChangeStatus`
- `profileController`: `getProfile`, `updateProfile`, `changePassword`, `forgotPassword`, `resetPassword`

### Register User
* **Endpoint**: `POST /api/auth/register`
* **Description**: Registers a new user and sends an OTP verification code to email.
* **Request Body**:
  ```json
  {
    "name": "Traveler Name",
    "email": "traveler@example.com",
    "password": "StrongPassword123!"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "email": "traveler@example.com",
    "msg": "Account created! A 6-digit verification code has been sent to your email."
  }
  ```

### Login User
* **Endpoint**: `POST /api/auth/login`
* **Description**: Logs in a verified user and returns JWT.
* **Request Body**:
  ```json
  {
    "email": "traveler@example.com",
    "password": "StrongPassword123!"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "Traveler Name",
      "email": "traveler@example.com"
    }
  }
  ```

### Additional Auth Routes
* `GET /api/auth/profile` (private)
* `PUT /api/auth/profile` (private)
* `PUT /api/auth/change-password` (private)
* `POST /api/auth/forgot-password` (public)
* `PUT /api/auth/reset-password/:token` (public)
* `POST /api/auth/verify-otp` (public)
* `POST /api/auth/resend-otp` (public)
* `POST /api/auth/otp-status` (public)
* `POST /api/auth/request-email-change` (private)
* `POST /api/auth/verify-email-change` (private)
* `GET /api/auth/email-change-status` (private)

---

## 2. Trip Endpoints (`/api/trips`)

All trip endpoints require authentication.

### Get All Trips
* **Endpoint**: `GET /api/trips`
* **Response (200 OK)**:
  ```json
  [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "title": "Summer Vacation in Tokyo",
      "destination": "Tokyo, Japan",
      "startDate": "2026-07-01T00:00:00.000Z",
      "endDate": "2026-07-15T00:00:00.000Z",
      "user": "60d0fe4f5311236168a109ca"
    }
  ]
  ```

### Create a Trip
* **Endpoint**: `POST /api/trips`
* **Request Body**:
  ```json
  {
    "title": "Summer Vacation in Tokyo",
    "destination": "Tokyo, Japan",
    "startDate": "2026-07-01",
    "endDate": "2026-07-15"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "_id": "60d0fe4f5311236168a109cb",
    "title": "Summer Vacation in Tokyo",
    "destination": "Tokyo, Japan",
    "startDate": "2026-07-01T00:00:00.000Z",
    "endDate": "2026-07-15T00:00:00.000Z"
  }
  ```

---

## 3. Weather Endpoints (`/api/weather`)

### Get Current & Forecast Weather
* **Endpoint**: `GET /api/weather?city=Tokyo`
* **Response (200 OK)**:
  ```json
  {
    "city": "Tokyo",
    "temp": 24,
    "description": "Partly cloudy",
    "forecast": [
      { "day": "Monday", "temp": 25, "condition": "Sunny" },
      { "day": "Tuesday", "temp": 23, "condition": "Rainy" }
    ]
  }
  ```

---

## 4. Error Responses

In case of error, the API returns a structured JSON payload:

```json
{
  "msg": "Invalid token"
}
```
